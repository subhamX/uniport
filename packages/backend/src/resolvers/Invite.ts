import { ForbiddenError, UserInputError } from "apollo-server-core";
import { authenticatedUsersOnly } from "../config/auth/authCheckers";
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import * as Yup from 'yup'
import { InviteNewUsersToOrgInput } from "@uniport/common";
import { ObjectId } from "mongodb";
import { UUID } from "bson";
import { InvitedUserModelType } from "src/models/InvitedUser";


export const inviteResolvers = {
	Mutation: {
		/**
		 * Method to invite new users to organization
		 *
		 * Only authenticated users with ADMIN access role can access this method
		 * ADMIN can invite users as admin, or as a STUDENT
		 */
		inviteNewUsersToOrg: async (_: any, { payload }: { payload: InviteNewUsersToOrgInput }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			// check if user is "ADMIN"
			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only admins can perform this action");
			}

			if (payload.user_emails.length === 0) {
				throw new UserInputError("user_emails array cannot be empty")
			}

			// validate the input mails
			for (let email of payload.user_emails) {
				let res = await Yup.string().email().isValid(email);
				if (!res) {
					throw new UserInputError(`Bad email ${email}`)
				}
			}

			// finding a user who is already registered on the platform
			// there can be many conflicting docs, but we will only give one
			const _conflictingDoc = await dbClient.collection('user').findOne({
				email_address: {
					"$in": payload.user_emails
				}
			})
			if (_conflictingDoc) {
				throw new UserInputError(`User already exists: ${_conflictingDoc.email_address}`)
			}

			let org_id = ctx.req.user.org_id;
			let total_invite_cnt = payload.user_emails.length;

			let docs = [];
			for (let email of payload.user_emails) {
				const tmp: InvitedUserModelType = {
					_id: new ObjectId(),
					email,
					org_id,
					access_role: payload.access_role,
					unique_token: new UUID().toString()
				}
				docs.push(tmp)
			}
			await dbClient.collection('invited_user').insertMany(docs);

			// update org stats
			await dbClient.collection('organization').updateOne({
				_id: new ObjectId(org_id),
			}, {
				$inc: {
					number_of_invited_users: total_invite_cnt
				}
			})

			return true;
		}
	}
}
