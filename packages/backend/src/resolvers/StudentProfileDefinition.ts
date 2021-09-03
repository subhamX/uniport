import { authenticatedUsersOnly } from "../config/auth/authCheckers"
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";


export const studentProfileDefinitionResolver = {
	Query: {
		getStudentProfileDefinitions: async (_: any, args: any, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			let res = await dbClient.execute('SELECT * FROM student_profile_definition WHERE org_id=?', [ctx.req.user?.org_id])
			return res.rows;
		}

	}
}
