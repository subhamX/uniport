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
		# to be used while querying data;
		# getStudentProfileById shall get NULL value
		matched_groups: [String!]
	}

	type BlockData {
		_id: ID!
		block_def_id: String!
		field_data: [FieldData!]!
		verification_info: VerificationInfo
	}

	type VerificationInfo {
		# TODO: Check if we need this _id, since we are embedding it?
		_id: ID!
		timestamp: String!
		verfier_id: String!
		verifier_name: String!
	}

	type FieldData {
		_id: ID! # field_id
		value: FieldValueScalar!
	}


	input GetStudentProfileByQueryInput{
		offset: Int!
		page_size: Int!
		filter_groups: [FilteringConditionGroup!]!
	}

	type Query{
		# although we are giving full data. Use it cautiously and fetch the required fields only
		getStudentProfileByQuery(payload: GetStudentProfileByQueryInput!): [StudentProfile]!
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
