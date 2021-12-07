import bcrypt from 'bcrypt';
import { GENERIC_ORG_LOGO_URL, PWD_HASH_ROUNDS } from "../config/constants";
import { RegisterWithValidInviteInput, RegisterAdminInput, registerAdminInputValidationSchema, registerWithValidInviteInputValidationSchema } from '@uniport/common';
import { dbClient } from '../db/index';
import { CustomApolloContext } from 'src/types/CustomApolloContext';
import { UserInputError } from 'apollo-server-core';
import { UserModelType } from 'src/models/User';
import * as yup from 'yup';
import { authenticatedUsersOnly, nonAuthenticatedUsersOnly } from '../config/auth/authCheckers';
import { setAuthCookieAndLogIn } from '../config/auth/setAuthCookieAndLogIn';
import { ObjectId } from 'mongodb';
import { InvitedUserModelType } from 'src/models/InvitedUser';
import { StudentProfileModelType } from 'src/models/StudentProfile';
import { OrganizationModelType } from 'src/models/Organization';



export const UserResolver = {
	Query: {
		/**
		 * Method to resolve the query to check the auth status
		 * It's a test route for debugging purposes
		 */
		checkAuthStatus: (_: any, __: any, ctx: CustomApolloContext) => {
			if (ctx.req.isAuthenticated()) {
				return "AUTHENTICATED";
			} else {
				return "NOT_AUTHENTICATED";
			}
		},

		/**
		 * Method to resolve the query to get the user details
		 *
		 * Only authenticated users can perform this operation
		 */
		getUserDetails: async (_: any, __: any, ctx: CustomApolloContext) => {
			// only for authenticated users
			authenticatedUsersOnly(ctx.req);
			let user = ctx.req.user;
			return user;
		}
	},

	Mutation: {
		/**
		 * Method to resolve the mutation to register a new ADMIN
		 *
		 * Route is only for non authenticated users
		 */
		registerAdmin: async (_: any, { payload }: { payload: RegisterAdminInput }, ctx: CustomApolloContext) => {
			try {
				// route only for non authenticated users
				nonAuthenticatedUsersOnly(ctx.req);

				// validate the inputs
				await registerAdminInputValidationSchema.validate(payload);

				// push the email
				let org_id = new ObjectId();
				let userUid = new ObjectId();

				let hashed_password = await bcrypt.hash(payload.password, PWD_HASH_ROUNDS);
				// insert into users table

				// ! Overwrite fix
				let res = await dbClient.collection('user').insertOne({
					_id: userUid,
					first_name: payload.first_name,
					last_name: payload.last_name,
					email_address: payload.email_address,
					org_id,
					"access_role": "ADMIN",
					hashed_password
				})

				// create a new org
				res = await dbClient.collection('organization').insertOne({
					_id: org_id,
					name: payload.org_name,
					// TODO: Org URL
					logo: GENERIC_ORG_LOGO_URL,
					// it's a bit weird to consider that the newly registered ADMIn is also an invited user! But we wish to make the following in sync:
					// number_of_invited_users-(number_of_joined_users)=users with pending invite
					number_of_invited_users: 1,
					number_of_joined_users: 1, // 1 for the admin itself
					number_of_joined_students: 0,
				} as OrganizationModelType);

				if (!res.acknowledged) {
					// race condition. :(
					// We got the user registered but we couldn't create a new org
					// we should technically remove user. But it's a rare event!
					throw Error("Something went wrong while creating org!");
				}

				let userData: UserModelType = {
					_id: userUid,
					first_name: payload.first_name,
					last_name: payload.last_name,
					email_address: payload.email_address,
					org_id: org_id,
					access_role: "ADMIN",
					hashed_password,
				}

				await setAuthCookieAndLogIn(ctx.req, userData);
				return userData;

			} catch (err) {
				console.log("Error:", err.message)
				throw new UserInputError(err.message);
			}
		},

		/**
		 * Method to resolve the mutation to register a user join the organization with a valid invite
		 */
		registerWithValidInvite: async (_: any, { payload }: { payload: RegisterWithValidInviteInput }, ctx: CustomApolloContext) => {
			// route only for non authenticated users
			nonAuthenticatedUsersOnly(ctx.req);

			await registerWithValidInviteInputValidationSchema.validate(payload);

			// check if the email is actually invited or not
			const _doc = (await dbClient.collection('invited_user').findOne({
				email: payload.email_address,
				unique_token: payload.unique_token
			})) as unknown as InvitedUserModelType

			if (!_doc) {
				throw new UserInputError("Invalid email or token. Please use the same email which you received in invite.")
			}

			let hashedPassword = await bcrypt.hash(payload.password, PWD_HASH_ROUNDS);
			let userUid = new ObjectId();

			let newUser: UserModelType = {
				_id: userUid,
				first_name: payload.first_name,
				last_name: payload.last_name,
				email_address: payload.email_address,
				org_id: _doc.org_id,
				access_role: _doc.access_role,
				hashed_password: hashedPassword,
			}
			// If the user is already there then we shall have error raised by Mongodb because of unique email index
			await dbClient.collection('user').insertOne(newUser)

			if (_doc.access_role === 'STUDENT') {
				// create student_profile
				const profile: StudentProfileModelType = {
					_id: userUid,
					campaigns: [],
					email_address: _doc.email,
					first_name: payload.first_name,
					last_name: payload.last_name,
					org_id: _doc.org_id,
					blocks_data: [],
				};
				await dbClient.collection('student_profile').insertOne(profile);
			}

			// delete the invite
			await dbClient.collection('invited_user').deleteOne({
				_id: _doc._id
			})

			// update the [org stats]
			await dbClient.collection('organization').updateOne({
				_id: _doc.org_id
			}, {
				$inc: {
					number_of_joined_users: 1,
					number_of_joined_students: (_doc.access_role === 'STUDENT' ? 1 : 0)
				}
				// we aren't decreasing
			})

			// logIn the user
			await setAuthCookieAndLogIn(ctx.req, newUser);

			return newUser;
		},
		/**
		 * Method to resolve the mutation to login an existing user
		 */
		loginExistingUser: async (_: any, { email, password }: { email: string, password: string }, ctx: CustomApolloContext) => {
			// route only for non authenticated users
			nonAuthenticatedUsersOnly(ctx.req);

			// Validate
			let a = await yup.string().email().isValid(email);
			let b = await yup.string().min(6).isValid(password);

			if (!a || !b) {
				throw new UserInputError("Bad email or password")
			}

			let userInstance = await dbClient.collection('user').findOne({
				email_address: email
			});

			if (!userInstance) {
				throw new UserInputError("Invalid email");
			}

			let user = userInstance as unknown as UserModelType;

			let res = await bcrypt.compare(password, user.hashed_password);
			if (!res) {
				throw new UserInputError("Passwords didn't match")
			}

			await setAuthCookieAndLogIn(ctx.req, user);
			return user;
		}

	},
}






