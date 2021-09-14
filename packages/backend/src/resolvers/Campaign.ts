import { Campaign, CampaignDetails } from "@uniport/common";
import { ForbiddenError, UserInputError } from "apollo-server-errors";
import { types } from "cassandra-driver";
import { authenticatedUsersOnly } from "../config/auth/authCheckers"
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import * as Yup from 'yup';

export const campaignResolvers = {
	Query: {
		getMyCampaigns: async (_: any, args: any, ctx: CustomApolloContext) => {
			// check the auth status
			authenticatedUsersOnly(ctx.req);

			const accessRole = ctx.req.user?.access_role;
			const orgId = ctx.req.user?.org_id;

			let campaigns: Campaign[];

			if (accessRole === 'ADMIN') {
				// if admin then
				let data = await dbClient.execute(`
					SELECT campaign_name, campaign_id
					FROM campaign_by_org
					WHERE org_id=?`,
					[orgId]
				);
				// I am sure
				campaigns = data.rows as unknown as Campaign[];
			} else {
				// if student
				let data = await dbClient.execute(`
					SELECT campaign_name, campaign_id
					FROM campaign_by_user
					WHERE user_id=?`, [ctx.req.user?.user_id]);

				campaigns = data.rows as unknown as Campaign[];
			}

			return campaigns;
		},

		getCampaignDetailsById: async (_: any, { campaign_id }: { campaign_id: string }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			let haveAccess = false;
			let org_id = ctx.req.user?.org_id;

			if (ctx.req.user?.access_role === 'ADMIN') {
				haveAccess = true;
			} else {
				// check if they are enrolled in that
				let res = await dbClient.execute(`
					SELECT campaign_id
					FROM campaign_by_user
					WHERE org_id=? AND campaign_id=?`, [org_id, campaign_id]);
				if (res.rowLength === 0) {
					throw new ForbiddenError("You don't have access to it");
				}
			}

			let res = await dbClient.execute(`SELECT campaign_name, rules
			FROM campaign_by_org
			WHERE org_id=? AND campaign_id=?`, [org_id, campaign_id]);

			if (res.rowLength !== 1) {
				throw new ForbiddenError("Invalid campaign id or you don't have access to it");
			}

			let data: CampaignDetails = {
				rules: res.rows[0].rules ?? [],
				campaign_id,
				campaign_name: res.rows[0].campaign_name
			};

			return data;
		}
	},
	Mutation: {
		// TODO:
		// Should we make the campaign first and then maybe ask what all rules you want to add?
		createANewCampaign: async (_: any, { campaign_name }: { campaign_name: string }, ctx: CustomApolloContext) => {
			// User needs to be authenticated
			authenticatedUsersOnly(ctx.req);

			// user needs to be an admin
			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only admin can perform this action of creating new campaigns");
			}
			// Now push it. :)
			// in campaign_by_org
			// in campaign_stats_by_org

			const campaign_id = types.Uuid.random();
			const org_id = ctx.req.user.org_id;

			const res = await dbClient.execute(`
				INSERT INTO campaign_by_org(
					campaign_id,
					org_id,
					campaign_name)
					VALUES(?,?,?)
				`, [campaign_id, org_id, campaign_name]);


			const res1 = await dbClient.execute(`
				UPDATE campaign_stats_by_org
				SET number_of_invited_student = number_of_invited_student+0,
				number_of_registered_student = number_of_registered_student + 0,
				number_of_placed_student = number_of_placed_student + 0
				WHERE org_id=? AND campaign_id=?`, [org_id, campaign_id])

			return {
				campaign_id,
				campaign_name
			};

			// rules needs to be validated
			// also ensure that the fields which we are specifying are
			// actually present in student profile
		},

	}
}
