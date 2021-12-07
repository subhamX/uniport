import { gql } from "apollo-server-core";

// all these shall be exclusively available for admins only

export const studentProfileSchema = gql`
	type StudentProfile{
		_id: ID!
		campaigns: [Campaign]!
		first_name: String!
		last_name: String!
		email_address: String!
		org_id: ID! @deprecated (reason: "Don't need this data at client")
		blocks_data: [BlockData]!
		verification_info: [VerificationInfo!]!
	}

	type FieldData {
		_id: ID! # field_id
		value: FieldValueScalar!
	}

	type BlockData {
		_id: ID!
		block_def_id: String!
		field_data: [FieldData!]!
	}

	type VerificationInfo {
		_id: ID!
		timestamp: String!
		verfier_id: String!
		verifier_name: String!
	}


	# input CompareValue{
	# 	# modifier: String! # only for numeric values (for now)
	# 	# modifier_operator: String! # only for numeric values (for now)
	# 	value: String! # JSON stringified for arrays and composite obj
	# }


	input FilteringConditionInput {
		# key: String!
		# lego_type: FieldsTypeEnum! # just an additional input we are taking from user for debug, and ensure correctness
		block_def_id: String!
		field_id: String!
		# using generic JSON encoding
		compare_value: FieldValueScalar
		operator: SupportedFilteringOperator!
	}

	enum SupportedFilteringOperator {
		# base
		EQUALS
		DOES_NOT_EQUAL
		IS_EMPTY
		IS_NOT_EMPTY

		# text/email/markdown based
		STARTS_WITH
		ENDS_WITH
		CONTAINS
		DOES_NOT_CONTAIN

		# int/number
		GREATER_THAN
		LESS_THAN
		GREATER_THAN_OR_EQUAL
		LESS_THAN_OR_EQUAL
		IS_BETWEEN # inclusive

		# date
		# dates must be sent in ISO format (as strings)
		DATE_IS_BEFORE
		DATE_IS_AFTER
		DATE_IS_BETWEEN # inclusive

		# for array
		CONTAINS_ALL_OF
		CONTAINS_ANY_OF
		CONTAINS_NONE_OF
	}

	input GetStudentProfileByQueryInput{
		offset: Int!
		page_size: Int!
		# base query shall search in first_name and last_name
		# TODO: In future, when we bring priority_fields (like institute roll etc) they will be searched too.
		base_query: String
		conditions: [FilteringConditionInput!]!
	}

	type Query{
		# although we are giving full data. Use it cautiously and fetch the required fields only
		getStudentProfileByQuery(payload: GetStudentProfileByQueryInput): [StudentProfile]!
		# get Student Profile by ID
		getStudentProfileById(_id: String!): StudentProfile!
	}

	input MutateStudentProfileFieldInput{
		# field_id of the block
		_id: ID!
		# should be in proper encoded form
		value: FieldValueScalar!
	}

	# we have deliberately made it in such a way that
	# we cannot
	input MutateStudentProfileBlockDataInput{
		_id: String
		block_def_id: String!
		user_id: String!
		fields: [MutateStudentProfileFieldInput!]!
	}


	type Mutation{
		# add/edit student profile block
		# note: basic data cannot be changed for now.
		mutateStudentProfileBlockData(payload: MutateStudentProfileBlockDataInput!): BlockData!
	}

`;