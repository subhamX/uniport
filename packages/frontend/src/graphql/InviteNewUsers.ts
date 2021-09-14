import gql from "graphql-tag";


export const INVITE_NEW_USERS_MUTATION = gql`
	mutation inviteNewUsersToCampaign($payload: InviteNewUsersToOrgInput!){
		inviteNewUsersToOrg(payload: $payload)
	}
`
