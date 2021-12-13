import gql from "graphql-tag";

export const registerAdminMutation = gql`
 # since we are not using any data hence only asking for _id
	mutation ($registerAdminPayload: RegisterAdminInput!) {
		registerAdmin(payload: $registerAdminPayload){
			_id
		}
	}
`;
