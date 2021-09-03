import { gql } from "apollo-server-core";


export const studentProfileDefinitionSchema = gql`
	type StudentProfileDefinition{
		org_id: String!
		attribute_id: ID!
		attribute_type: String
		is_array: Boolean!
		label: String!
		is_blocked: Boolean!
		required: Boolean!
		options: [String]!
		requiresProof: Boolean!
	}

	type Query{
		# any authenticated user can get the profile definitions
		getStudentProfileDefinitions: [StudentProfileDefinition]!
	}

`
