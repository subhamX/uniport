import gql from "graphql-tag";


export const FETCH_SIDE_BAR_ITEMS=gql`
	query fetchMyCampaigns{
		getMyCampaigns{
			_id
			campaign_name
		}
	}
`;
