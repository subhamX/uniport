import { gql } from "apollo-server-core";


export const companySchema = gql`
	type BaseCompany{
		name: String!
		logo_url: String!
	}

	type Company{
		_id: String!
		org_id: String!
		name: String!
		logo_url: String!
	}

	type Query{
		queryBaseCompanies(query: String!): [BaseCompany!]!
		# a route only for ADMIN of org
		getCompaniesInOrg(pageSize: Int!, offset: Int!): [Company!]!
	}

	input MutateCompanyToOrgInput{
		# _id must be mentioned in edit mode
		_id: String
		name: String!
		logo_url: String
	}

	type Mutation{
		# add company to org
		mutateCompanyToOrg(companyDetails: MutateCompanyToOrgInput!): Company!
	}
`
