import gql from "graphql-tag";


export const ADD_STUDENTS_TO_CAMPAIGN_MUTATION = gql`
	mutation addStudentsToCampaign($payload: AddStudentsToCampaignInput!){
		addStudentsToCampaign(payload: $payload)
	}
`
