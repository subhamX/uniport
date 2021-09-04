import { allSupportedLEGOs } from "@uniport/common";
import { gql } from "apollo-server-core";

// ! @NOT USING THIS: inputUnion isn't supported.
// Because of lack of time constraints moving to REST for this part.

let allSupportedLEGOsEnum = allSupportedLEGOs.map((e, indx) => `${e}`).join(' | ')

// all supported legos with input in suffix
let allSupportedLEGOsEnumWithInputSuffix = allSupportedLEGOs.map((e, indx) => `${e}_input`).join(' | ')


// console.log(allSupportedLEGOsEnum);

export const studentProfileSchema = gql`
	# taking union of all supported legos
	union StudentProfileBlock = ${allSupportedLEGOsEnum}

	type Query{
		# query to get all the student profile block
		getStudentProfileBlocks: [StudentProfileBlock]!
	}


	input AddOrUpdateStudentProfileBlockInput = ${allSupportedLEGOsEnumWithInputSuffix}


	type Mutation{
		# query to update [a single] student profile block
		addOrUpdateStudentProfileBlock(payload: AddOrUpdateStudentProfileBlockInput): Boolean!
		# only admin can do it
		# verifyStudentProfileBlock(dummy_arg: String!): String!
	}




	type VerificationInfoType{
		is_verified: Boolean!,
		verified_by: String!,
		verify_action_timestamp: String!
	}

	# ! IMPORTANT::::: [file_url] is required only when the admin has asked to submit proofs field (ADD VALIDATION IN RESOLVER)
	# notice that [verify_action_timestamp] cannot be null: So in resolver ensure that you place [is_verified=false] whenever you add a new entry
	# defining all the legos types

	# Date type
	type date_type_1{
		value: String!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input date_type_1_input{
		value: String!
		file_url: String
	}

	# Number
	type number_type_2{
		value: Int!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input number_type_2_input{
		value: Int!
		file_url: String
	}


	type single_select_type_3{
		value: String!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input single_select_type_3_input{
		value: String!
		file_url: String
	}

	type phone_number_type_4{
		country_code: String!
		ph_number: String!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input phone_number_type_4_input{
		country_code: String!
		ph_number: String!
		file_url: String
	}

	# address
	type address_type_5{
		country: String!
		pincode: String!
		state: String!
		district: String!
		city: String!
		address_line: String!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input address_type_5_input{
		country: String!
		pincode: String!
		state: String!
		district: String!
		city: String!
		address_line: String!
		file_url: String
	}


	type email_type_6{
		value: String!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input email_type_6_input{
		value: String!
		file_url: String
	}

	type current_course_type_7{
		program: String!
		specialization: String!
		course_start_date: String!
		course_end_date: String!
		percent_score: Float!
		institute_roll: String!
		description: String!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input current_course_type_7_input{
		program: String!
		specialization: String!
		course_start_date: String!
		course_end_date: String!
		percent_score: Float!
		institute_roll: String!
		description: String!
		file_url: String
	}

	type education_type_8{
		school: String!
		program: String!
		board: String!
		education_type: String!
		percent_score: String!
		course_start_date: String!
		course_end_date: String!
		file_url: String
		verification_info: VerificationInfoType!

	}


	input education_type_8_input{
		school: String!
		program: String!
		board: String!
		education_type: String!
		percent_score: String!
		course_start_date: String!
		course_end_date: String!
		file_url: String
	}


	type work_experience_type_9{
		company_name: String!
		job_title: String!
		location: String!
		position_type: String!
		job_start_date: String!
		job_end_date: String!
		details: String!
		file_url: String
		verification_info: VerificationInfoType!
	}
	input work_experience_type_9_input{
		company_name: String!
		job_title: String!
		location: String!
		position_type: String!
		job_start_date: String!
		job_end_date: String!
		details: String!
		file_url: String
	}

	type project_type_10{
		project_name: String!
		start_date: String!
		end_date: String!
		project_url: String!
		description: String!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input project_type_10_input{
		project_name: String!
		start_date: String!
		end_date: String!
		project_url: String!
		description: String!
		file_url: String
	}


	type resume_type_11{
		file_name: String!
		file_url: String
		verification_info: VerificationInfoType!

	}

	input resume_type_11_input{
		file_name: String!
		file_url: String
	}


	type multi_select_type_12{
		value: [String!]!
		file_url: String
		verification_info: VerificationInfoType!
	}

	input multi_select_type_12_input{
		value: [String!]!
		file_url: String
	}




`;
