import { campaignResolvers } from "./Campaign";
import { inviteResolvers } from "./Invite";
import { navMenuResolvers } from "./NavMenu";
import { studentProfileResolvers } from "./StudentProfile";
import { studentProfileDefinitionResolver } from "./StudentProfileDefinition";
import { UserResolver } from "./User";


export const mergedResolvers = {
	Query: {
		...UserResolver.Query,
		...navMenuResolvers.Query,
		...studentProfileDefinitionResolver.Query,
		...campaignResolvers.Query,
		...studentProfileResolvers.Query
	},
	Mutation: {
		...UserResolver.Mutation,
		...campaignResolvers.Mutation,
		...studentProfileDefinitionResolver.Mutation,
		...inviteResolvers.Mutation
	},
}
