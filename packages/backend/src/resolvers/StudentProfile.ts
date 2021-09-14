// the following options shall be used only by admin

import { ForbiddenError } from "apollo-server-core";
import { authenticatedUsersOnly } from "../config/auth/authCheckers";
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import { FilteringConditionInput } from '@uniport/common'
export const studentProfileResolvers = {
	Query: {
		getStudentBasicDataByQuery: async (_: any, { conditions }: { conditions: FilteringConditionInput[] }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);
			// user needs to be an admin
			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only admin can perform this action of creating new campaigns");
			}

			let res = await dbClient.execute(`
				SELECT *
				FROM student_profile
				WHERE org_id=?
				ALLOW FILTERING`,
				[ctx.req.user?.org_id]);

			const results: any[] = [];

			// perform filtering
			res.rows.forEach(e => {
				if (doesStudentSatisfyConditions(e, conditions)) results.push(e);
			})


			return results;
		}
	}

}

// TODO:
// 0 if doesn't satify
// 1 if satisfy
// Note: handle errors in parent funx
const doesStudentSatisfyConditions = (student_data: any, conditions: FilteringConditionInput[]) => {
	for (let i = 0; i < conditions.length; i++) {
		const key_id = conditions[i].key;
		// for now all LEGOs can have atmax 1 subattribute
		const attribute_id = key_id.split('.')[0]
		const sub_attribute_id = key_id.split('.')[1]
		// fetch the [student_profile_definitions] data

		// match the lego_type provided and given

		// if [sub_attribute_id]
		// check if the [sub_attribute_id] is defined for the lego_type

		// check if the operator is valid

		// perform comparision



	}
	return 1;
}

