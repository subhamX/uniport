import { navMenuResolvers } from "./NavMenu";
import { UserResolver } from "./User";


export const mergedResolvers = {
	Query: {
		...UserResolver.Query,
		...navMenuResolvers.Query
	},
	Mutation: {
		...UserResolver.Mutation
	},
}
