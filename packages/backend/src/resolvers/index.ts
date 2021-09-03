import { navMenuResolvers } from "./NavMenu";
import { studentProfileDefinitionResolver } from "./StudentProfileDefinition";
import { UserResolver } from "./User";


export const mergedResolvers = {
	Query: {
		...UserResolver.Query,
		...navMenuResolvers.Query,
		...studentProfileDefinitionResolver.Query
	},
	Mutation: {
		...UserResolver.Mutation
	},
}
