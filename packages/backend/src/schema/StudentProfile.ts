import { gql } from "apollo-server-core";

// all these shall be exclusively available for admins only

export const studentProfileSchema = gql`
  # returns basic data
	type StudentProfile{
		user_id: ID!
		org_id: ID!
		first_name: String!
		last_name: String!
		email_address: String!
		# this is only to get basic data
		# additional data the person shall get via REST
	}


	input CompareValue{
		modifier: String! # only for numeric values (for now)
		modifier_operator: String! # only for numeric values (for now)
		value: String! # JSON stringified for arrays and composite obj
	}


	input FilteringConditionInput {
		key: String!
		lego_type: String! # just an additional input we are taking from user for debug, and ensure correctness
		operator: String!
		compare_value: CompareValue!
	}

	type Query{
		getStudentBasicDataByQuery(conditions: [FilteringConditionInput]!): [StudentProfile]!
	}

	# ---DEPRECATED---
	# type verification_info_type{
	# 	is_verified: Boolean
	# 	verified_by: String
	# 	# TODO: add the id too. Since there can be two person with same name
	# 	verify_action_timestamp: String
	# }

	# type date_type_1{
	# 	value: String!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type!
	# }

	# type number_type_2{
	# 	value: Int!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type!
	# }

	# type single_select_type_3{
	# 	value: String!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# type phone_number_type_4{
	# 	country_code: String!
	# 	ph_number: String!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# type address_type_5{
	# 	country: String!
	# 	pincode: String!
	# 	state: String!
	# 	district: String!
	# 	city: String!
	# 	address_line: String!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# type email_type_6{
	# 	value: String!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# type current_course_type_7{
	# 	program: String!
	# 	specialization: String!
	# 	course_start_date: String!
	# 	course_end_date: String!
	# 	percent_score: Float!
	# 	institute_roll: String!
	# 	description: String!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# type education_type_8{
	# 	school: String!
	# 	program: String!
	# 	board: String!
	# 	education_type: String!
	# 	percent_score: Float!
	# 	course_start_date: String!
	# 	course_end_date: String!
	# 	proof_file_url: String!
	# 	description: String!
	# 	verification_info: verification_info_type
	# }

	# type work_experience_type_9{
	# 	company_name: String!
	# 	job_title: String!
	# 	location: String!
	# 	position_type: String!
	# 	job_start_date: String!
	# 	job_end_date: String!
	# 	details: String!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# type project_type_10{
	# 	project_name: String!
	# 	start_date: String!
	# 	end_date: String!
	# 	project_url: String!
	# 	description: String!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# type resume_type_11{
	# 	file_name: String!
	# 	resume_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# type multi_select_type_12{
	# 	value: [String]!
	# 	proof_file_url: String!
	# 	verification_info: verification_info_type
	# }

	# union ProfileBlock =
	# 	date_type_1 |
	# 	number_type_2 |
	# 	single_select_type_3 |
	# 	phone_number_type_4 |
	# 	address_type_5 |
	# 	email_type_6 |
	# 	current_course_type_7 |
	# 	education_type_8 |
	# 	work_experience_type_9 |
	# 	project_type_10 |
	# 	resume_type_11 |
	# 	multi_select_type_12


`;
