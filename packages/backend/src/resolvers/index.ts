import { ArrayScalar } from "../scalers/ArrayScalar";
import { FieldValueScalar } from "../scalers/FieldValueScalar";
import { campaignResolvers } from "./Campaign";
import { companyResolvers } from "./Company";
import { inviteResolvers } from "./Invite";
import { studentProfileResolvers } from "./StudentProfile";
import { studentProfileDefinitionResolver } from "./StudentProfileDefinition";
import { UserResolver } from "./User";

/**
 * Merged Resolvers Object
 */
export const mergedResolvers = {
	// scalar field resolvers
	FieldValueScalar: FieldValueScalar,
	ArrayScalar: ArrayScalar,
	// query resolvers
	Query: {
		...UserResolver.Query,
		...studentProfileDefinitionResolver.Query,
		...campaignResolvers.Query,
		...studentProfileResolvers.Query,
		...companyResolvers.Query
	},
	// mutation resolvers
	Mutation: {
		...UserResolver.Mutation,
		...campaignResolvers.Mutation,
		...studentProfileDefinitionResolver.Mutation,
		...inviteResolvers.Mutation,
		...studentProfileResolvers.Mutation,
		...companyResolvers.Mutation
	},
}
