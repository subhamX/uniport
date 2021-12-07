import { gql } from "apollo-server-core";



export const studentProfileDefinitionSchema = gql`
  scalar FieldValueScalar
	scalar ArrayScalar

	type StudentProfileDefinition {
		_id: ID!
		org_id: String! @deprecated(reason: "We don't need this info to pass to client!")
		position: Int!
		is_array: Boolean!
		block_name: String!
		is_freezed: String!
		is_required: Boolean!
		requires_proof: Boolean!
		# at least one block is required
		field_defs: [StudentProfileDefinitionField!]!
	}


	type StudentProfileDefinitionField{
		_id: ID!
		field_name: String!
		type: FieldsTypeEnum!
		options: ArrayScalar!
		required: Boolean!
		position: Int!
		multi_type: Int!
	}

	# keep it in sync with actual blocks
	enum FieldsTypeEnum{
		text
		date
		email
		integer
		float
		markdown
	}

	input StudentProfileDefinitionBlockInput{
		field_name: String!
		type: FieldsTypeEnum!
		options: ArrayScalar!
		required: Boolean!
		# this position is required as it's hard to define things without it
		position: Int!
		multi_type: Int!
	}


	input AddStudentProfileDefinitionInput {
		# if no position is provided we shall use 0
		position: Int
		is_array: Boolean!
		block_name: String!
		is_freezed: Boolean!
		is_required: Boolean!
		requires_proof: Boolean!
		field_defs: [StudentProfileDefinitionBlockInput!]!
	}


	type Query{
		# any authenticated user can get the profile definitions
		getStudentProfileDefinitions: [StudentProfileDefinition]!
	}

	type Mutation{
		# Only admin can add fields
		# editing isn't allowed for now
		addStudentProfileDefinition(payload: AddStudentProfileDefinitionInput!): StudentProfileDefinition!
	}

`



