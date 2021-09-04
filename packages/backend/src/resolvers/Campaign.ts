import { Campaign } from "@uniport/common";
import { authenticatedUsersOnly } from "../config/auth/authCheckers"
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";


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
			}else{
				// if student
				let data = await dbClient.execute(`
					SELECT campaign_name, org_id
					FROM campaign_by_user
					WHERE user_id=?`, [ctx.req.user?.user_id]);

				campaigns = data.rows as unknown as Campaign[];
			}

			return campaigns;
		}
	},
	Mutation: {
		// TODO:
		// Should we make the campaign first and then maybe ask what all rules you want to add?
		createANewCampaign: async () => {
			// User needs to be authenticated

			// user needs to be an admin

			// rules needs to be validated
			// also ensure that the fields which we are specifying are
			// actually present in student profile


			// Now push it. :)
			// in campaign_by_org
			// in campaign_stats_by_org
		}
	}
}
