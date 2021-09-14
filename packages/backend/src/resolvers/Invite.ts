import { ForbiddenError, UserInputError } from "apollo-server-core";
import { authenticatedUsersOnly } from "../config/auth/authCheckers";
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import * as Yup from 'yup'
import { InviteNewUsersToOrgInput } from "@uniport/common";


export const inviteResolvers = {
	Mutation: {
		inviteNewUsersToOrg: async (_: any, { payload }: { payload: InviteNewUsersToOrgInput }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			// check if user is "ADMIN"
			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only admins can perform this action");
			}

			// validate the input mails
			for (let email of payload.user_emails) {
				let res = await Yup.string().email().isValid(email);
				if (!res) {
					throw new UserInputError(`Bad email ${email}`)
				}
			}

			let org_id = ctx.req.user.org_id

			if (payload.campaign_id) {
				// check if the admin owns the campaign and campaign id is valid
				const res = await dbClient.execute(`SELECT campaign_id
				FROM campaign_by_org
				WHERE org_id=? AND campaign_id=?`, [org_id, payload.campaign_id]);

				if (res.rowLength !== 1) {
					throw new ForbiddenError("Invalid campaign id or access to the campaign is restricted");
				}
			}

			let total_invite_cnt = payload.user_emails.length;

			const query = `
			INSERT INTO invited_user(
				email,
				org_id,
				campaign_id,
				access_role)
			VALUES(?,?,?,?)`

			let queries = [];

			for (let email of payload.user_emails) {
				queries.push({
					query,
					params: [
						email,
						org_id,
						payload.campaign_id,
						payload.access_role
					]
				})
			}




			await dbClient.batch(queries);


			if (payload.campaign_id) {
				// Unfortunately we cannot batch it with top: (ERROR) [Cannot include a counter statement in a logged batch]
				// updating the stats
				// It was giving error when I placed total_invite_cnt in params array
				// thus have put it inside
				const updateStatsQuery = `UPDATE campaign_stats_by_org
				SET number_of_invited_student = number_of_invited_student + ${total_invite_cnt}
				WHERE org_id=? AND campaign_id=?`;


				await dbClient.execute(updateStatsQuery,
					[org_id, payload.campaign_id]
				)
			}

			// update org stats
			const updateStatsQuery = `UPDATE org_stats
			SET number_of_invited_student = number_of_invited_student + ${total_invite_cnt}
			WHERE org_id=?`;


			await dbClient.execute(updateStatsQuery,
				[org_id]
			)

			return true;
		}
	}
}
