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
		is_freezed: Boolean!
		is_required: Boolean!
		requires_proof: Boolean!
		# at least one block is required
		field_defs: [FieldSchema!]!
	}


	type FieldSchema{
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

	input FieldSchemaInput{
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
		field_defs: [FieldSchemaInput!]!
	}

	input UpdateStudentProfileDefinitionInput {
		_id: String!
		position: Int!
		block_name: String!
		is_freezed: Boolean!
		is_required: Boolean!
		requires_proof: Boolean!
	}


	type Query{
		# any authenticated user can get the profile definitions
		getStudentProfileDefinitions: [StudentProfileDefinition]!
	}

	type Mutation{
		# Only admin can add fields
		addStudentProfileDefinition(payload: AddStudentProfileDefinitionInput!): StudentProfileDefinition!

		# editing is allowed for very basic fields for now. Since changing the datatype etc will cause errors
		# campaign rules also depends on this, and any breaking changes here, will cause whole thing to break
		# hence updating things like is_array and any attribute of field is restricted for now!
		updateStudentProfileDefinition(payload: UpdateStudentProfileDefinitionInput!): StudentProfileDefinition!
	}

`



