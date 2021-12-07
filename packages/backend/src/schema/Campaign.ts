import { gql } from "apollo-server-core";


export const campaignSchema = gql`
	type Campaign{
		_id: ID!
		campaign_name: String!
	}

	type CampaignDetails{
		_id: ID!
		campaign_name: String!
		number_of_students: Int!
		rules: [FilteringRule]!
	}


	type Query{
		# for students we will check the [campaign_by_user] table to get the campaigns
		# for admin we will directly fetch all the campaigns registered for the org
		getMyCampaigns: [Campaign]!

		# only authenticated users can access it. (and they need to enrolled in that campaign or must be an admin)
		getCampaignDetailsById(_id: String!): CampaignDetails!
	}

	type FilteringRule{
		attribute_id: String!
		operator: String!
		threshold_value: Int!
		prefix_multiplier: Int!
		multi_select_threshold: [String]!
	}

	# input FilteringRuleInput{
	# 	attribute_id: String!
	# 	operator: String!
	# 	threshold_value: Int!
	# 	prefix_multiplier: Int!
	# 	multi_select_threshold: [String]!
	# }

	# input CreateANewCampaignInput{
	# 	# Campaign rules should be set afterwards. Anyhow we have a mutation to add/edit rules
	# 	# rules: [FilteringRule]!
	# }

	input AddStudentsToCampaignInput{
		_id: String!
		student_emails: [String!]!
	}



	type Mutation{
		# for admin to create a new campaign
		createANewCampaign(campaign_name: String!): Campaign!
		# add students to campaign
		addStudentsToCampaign(payload: AddStudentsToCampaignInput!): Boolean!
	}
`


