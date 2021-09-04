import { gql } from "apollo-server-core";


export const campaignSchema = gql`
	type Campaign{
		campaign_id: ID!
		campaign_name: String!
	}

	type Query{
		# for students we will check the [campaign_by_user] table to get the campaigns
		# for admin we will directly fetch all the campaigns registered for the org
		getMyCampaigns: [Campaign]!
	}

	input FilteringRule{
		attribute_id: String!
		operator: String!
		threshold_value: Int!
		prefix_multiplier: Int!
		multi_select_threshold: [String]!
	}

	input CreateANewCampaignInput{
		campaign_name: String!
		# a campaign can have 0 rules.
		# but we need to have this array. (that's why it's imp)
		rules: [FilteringRule]!
	}


	type inviteNewUsersToCampaign{
		user_email: String!
	}


	type Mutation{
		# TODO:
		# for admin to create a new campaign
		createANewCampaign(campaign_details: CreateANewCampaignInput!): Campaign!

		# for now we can only invite people either for
		# ADMIN role or for STUDENT role
		# also ensure that you cannot invite an exisiting user for now!
		# like someone who is admin. and you want to make them student
		# or someone is user and you want to make them admin. (FOR NOW)
		# In future we shall add multiple roles like PLACEMENT_ADMIN, COORDINATOR etc which will make this possible
		# invite new students to the new campaign
		# TODO:
		# inviteNewUsersToCampaign(users: ): Boolean

	}
`


