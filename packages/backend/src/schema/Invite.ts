import { gql } from "apollo-server-core";


export const inviteUsersSchema = gql`
	input InviteNewUsersToOrgInput{
		user_emails: [String!]!
		access_role: AccessRoleEnum!
		campaign_id: String # campaign id is optional
	}


	type Mutation{
		# for now we can only invite people either for
		# ADMIN role or for STUDENT role
		# also ensure that you cannot invite an exisiting user for now!
		# like someone who is admin. and you want to make them student
		# or someone is user and you want to make them admin. (FOR NOW)
		# In future we shall add multiple roles like PLACEMENT_ADMIN, COORDINATOR etc which will make this possible
		# invite new students to the new campaign
		inviteNewUsersToOrg(payload: InviteNewUsersToOrgInput): Boolean!
	}

	enum AccessRoleEnum{
		ADMIN
		STUDENT
	}
`
