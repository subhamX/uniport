import gql from "graphql-tag";


export const FETCH_CAMPAIGN_DETAILS_BY_ID = gql`
	query getCampaignDetailsById($campaign_id: String!){
		getCampaignDetailsById(_id: $campaign_id){
			_id
			campaign_name
			number_of_students
			number_of_placed_students
			number_of_job_profiles
			number_of_offers
		}
	}
`
