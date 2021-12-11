import { gql } from "apollo-server-core";


export const jobProfileSchema = gql`

	type FilteringCondition{
		block_def_id: String!
		field_id: String!
		compare_value: FieldValueScalar
		operator: SupportedFilteringOperator!
	}

	type JobProfileRuleGroup{
		_id: String!
		conditions: [FilteringCondition!]!
	}

	type JobProfileArrayBlocksConfig{
		_id: String!
		min_blocks: Int!
		max_blocks: Int!
		help_text: String!
	}

	type JobProfile{
		_id: String!
		# note that in actual model we don't have Company. But it's the task of resolver to get it
		company: Company!
		camp_id: String!
		org_id: String!
		title: String!
		stipend_low: Int!
		stipend_high: Int!
		description: String!
		deadline: String! # ISO string
		# note creator cannot be null. Unlike verified by in student profile
		creator_uid: String!
		creator_name: String!
		created_at: String!
		rule_groups: [JobProfileRuleGroup!]!
		additional_questions: [FieldSchema!]!
		is_complete: Boolean!
		is_published: Boolean!
		current_stage: Int!
		array_blocks_config: [JobProfileArrayBlocksConfig!]!
	}


	type Query{
		# get all job profiles in the org
		# only those profiles will be listed which are published (for STUDENT)
		# and all profiles will be listed (for ADMIN)
		getAllJobProfiles(pageSize: Int!, offset: Int!): [JobProfile!]!

		getJobProfileById(_id: String!): JobProfile!
	}


	input JobProfileAdvancedDetailsInput{
		job_profile_id: String!
		# we are keeping all three optional; which shall enable the user to update a subset of them easily
		rule_groups: [FilteringConditionGroup!]
		additional_questions: [FieldSchemaInput!]
		array_blocks_config: [JobProfileArrayBlocksConfigInput!]
	}

	input JobProfileArrayBlocksConfigInput{
		_id: String!
		min_blocks: Int!
		max_blocks: Int!
		help_text: String!
	}

	input NewJobProfileInput{
		# Note: the user is only sending company_id and getting the Company on query
		company_id: String!
		camp_id: String!
	}

	input JobProfileBasicDetailsInput{
		job_profile_id: String!
		title: String!
		stipend_low: Int!
		stipend_high: Int!
		description: String!
	}

	type Mutation{
		# returns the Id of the newly created JobProfile
		createNewJobProfile(payload: NewJobProfileInput!): JobProfile!

		updateJobProfileBasicDetails(payload: JobProfileBasicDetailsInput!): JobProfile!

		# FOR NOW, adding additional questions/rules after the job is published isn't allowed!
		# Reason: There could be users could have already applied! And we need to give serious thoughts on wether we should delete all of those records.
		# but deleting those records shall cause confusion among students (as they did apply earlier)!
		updateJobProfileAdvancedDetails(payload: JobProfileAdvancedDetailsInput!): JobProfile!

		# mutation to allow ADMIN to publish the Job Profile to students
		# once published for now there is no way to unpublish it.
		# this operation must be done once
		publishJobProfile(_id: String!): Boolean!

		# deadline must be in future!
		updateDeadlineOfJobProfile(_id: String!, new_deadline: String!): Boolean!
	}


`
