import gql from "graphql-tag";


export const CREATE_A_NEW_CAMPAIGN=gql`
	# we need camp_id to redirect the user to the manage page
	mutation createANewCampaign($campaign_name: String!){
		createANewCampaign(campaign_name: $campaign_name){
			_id
		}
	}
`;

