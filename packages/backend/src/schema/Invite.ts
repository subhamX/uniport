import { gql } from "apollo-server-core";


export const inviteUsersSchema = gql`
	input InviteNewUsersToOrgInput{
		user_emails: [String!]!
		access_role: AccessRoleEnum!
	}


	type Mutation{
		# 1. for now we can only invite people either for
		# ADMIN role or for STUDENT role
		# 2. also for now you cannot invite an existing user
		# like someone who is ADMIN. and you want to make them student
		# or someone is user and you want to make them admin. (FOR NOW)
		# 3. A user cannot change their organization
		inviteNewUsersToOrg(payload: InviteNewUsersToOrgInput!): Boolean!
	}

	enum AccessRoleEnum{
		ADMIN
		STUDENT
	}
`
