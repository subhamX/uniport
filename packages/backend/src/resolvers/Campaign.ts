import { Campaign, CampaignDetails, AddStudentsToCampaignInput } from "@uniport/common";
import { ForbiddenError, UserInputError } from "apollo-server-errors";
import { authenticatedUsersOnly } from "../config/auth/authCheckers"
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import * as Yup from 'yup';
import { ObjectId } from "mongodb";
import { CampaignModelType } from "src/models/Campaign";

export const campaignResolvers = {
	Query: {
		/**
		 * Method to get all the registered campaigns of the logged in user
		 * Access to the method without authentication shall lead to Error
		 *
		 * Note: Here we are just giving basic data that includes campaign_name and _id
		 * All other info should be fetched from other methods!
		 */
		getMyCampaigns: async (_: any, args: any, ctx: CustomApolloContext) => {
			// check the auth status
			authenticatedUsersOnly(ctx.req);

			const accessRole = ctx.req.user?.access_role;
			// get the org Id
			const orgId = ctx.req.user?.org_id;

			let campaigns: Campaign[] = []; // container to store the campaigns
			if (accessRole === 'ADMIN') {
				// if the user is an admin then we shall get all the campaigns for the organization
				// since admin access is org scoped (and not campaign scoped)
				let data = dbClient.collection('campaign').find({
					"org_id": orgId,
				});
				campaigns = (await data.toArray()) as any;
			} else {
				// if the user is a student then we shall get all campaigns in which the student is enrolled
				let data = await dbClient.collection('student_profile').findOne({
					_id: ctx.req.user?._id
				});

				campaigns = data?.campaigns;
			}

			return campaigns;
		},


		/**
		 * Method to get the campaign details by campaign _id
		 *
		 * The user must be authenticated!
		 * Note: if the campaign isn't part of the user org then it will throw an error!
		 * TODO: Although we are allowing users to get the campaign details, we might not need it! Considering removing access from STUDENT role users!
		 */
		getCampaignDetailsById: async (_: any, { _id }: { _id: string }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			let org_id = new ObjectId(ctx.req.user?.org_id);

			if (ctx.req.user?.access_role === 'STUDENT') {
				// check if they are enrolled in that
				const _doc = await dbClient.collection('student_profile').findOne({
					_id: ctx.req.user?._id,
					'campaigns._id': _id
				})
				if (!_doc) {
					throw new ForbiddenError("You don't have access to it");
				}
			}

			// get the campaign details
			const doc: CampaignModelType = await dbClient.collection('campaign').findOne({
				org_id,
				_id: new ObjectId(_id)
			}) as any

			if (!doc) {
				throw new ForbiddenError("Invalid campaign id or you don't have access to it");
			}

			return {
				_id: doc._id.toString(),
				campaign_name: doc.campaign_name,
				number_of_students: doc.number_of_students,
				rules: doc.rules ?? [],
				number_of_job_profiles: doc.number_of_job_profiles,
				number_of_offers: doc.number_of_offers,
				number_of_placed_students: doc.number_of_placed_students
			};

		}
	},
	Mutation: {
		/**
		 * Mutation to create a new campaign
		 * Only authenticated users with ADMIN scope can create a new campaign
		 */
		createANewCampaign: async (_: any, { campaign_name }: { campaign_name: string }, ctx: CustomApolloContext) => {
			// User needs to be authenticated
			authenticatedUsersOnly(ctx.req);

			// user needs to be an admin
			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only admin can perform this action of creating new campaigns");
			}

			const _id = new ObjectId();
			const org_id = ctx.req.user.org_id;
			const newCamp: CampaignModelType = {
				_id,
				org_id,
				campaign_name,
				number_of_students: 0,
				number_of_placed_students: 0,
				number_of_job_profiles: 0,
				number_of_offers: 0,
				rules: []
			};

			// create a new campaign
			await dbClient.collection('campaign').insertOne(newCamp);

			return {
				_id,
				campaign_name
			};

		},

		/**
		 * Method to add students to campaign
		 *
		 * Only authenticated users with ADMIN scope can perform this operation
		 */
		addStudentsToCampaign: async (_: any, { payload }: { payload: AddStudentsToCampaignInput }, ctx: CustomApolloContext) => {
			// User needs to be authenticated
			authenticatedUsersOnly(ctx.req);
			// user needs to be an admin
			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only admin can perform this action of adding students to campaigns");
			}
			if (payload.student_emails.length === 0) {
				throw new UserInputError("student_emails array cannot be empty")
			}

			// validate the input mails
			for (let email of payload.student_emails) {
				let res = await Yup.string().email().isValid(email);
				if (!res) {
					throw new UserInputError(`ValidationError: Bad email ${email}`)
				}
			}

			const campaignId = new ObjectId(payload._id);
			const orgId = new ObjectId(ctx.req.user.org_id);

			// checking if the campaign belongs to the same org as admin
			const campaign = (await dbClient.collection('campaign').findOne({
				_id: campaignId,
				org_id: orgId,
			})) as unknown as CampaignModelType

			if (!campaign) {
				throw new ForbiddenError("Access Denied or Invalid Campaign Id")
			}

			// each email should be a registered user and access_role should be student
			// and shouldn't be a past user of that campaign

			const cursor = dbClient.collection('student_profile').find({
				email_address: {
					"$in": payload.student_emails
				},
				"campaigns._id": {
					"$ne": campaignId
				},
				org_id: new ObjectId(ctx.req.user.org_id)
			});

			const numberOfValidRecords = await cursor.count();
			if (numberOfValidRecords !== payload.student_emails.length) {
				// TODO: Make the error message better; maybe include one of the conflicting email;
				throw new UserInputError("Invalid Request; Either some users haven't joined yet. Or some users are already part of the campaign. Or there are attempts to add ADMIN to campaign (which is not allowed)")
			}

			// add the campaign data to students
			await dbClient.collection('student_profile').updateMany({
				email_address: {
					"$in": payload.student_emails
				}
			}, {
				$push: {
					campaigns: {
						_id: campaignId,
						campaign_name: campaign.campaign_name
					}
				} as any
			});

			// update campaign stats
			await dbClient.collection('campaign').updateOne({
				_id: campaignId
			}, {
				"$inc": {
					number_of_students: payload.student_emails.length
				}
			})


			return true;
		}

	}
}
