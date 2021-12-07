import { gql } from "apollo-server-express"


export const UserSchema = gql`
	type User {
		_id: ID!
		first_name: String!
		last_name: String!
		email_address: String!
		org_id: String!
		access_role: AccessRoleEnum! # for now we have "ADMIN" and "STUDENT"
	}

	input RegisterAdminInput {
		first_name: String!
		last_name: String!
		email_address: String!
		password: String!
		org_name: String!
	}

	input RegisterWithValidInviteInput {
		first_name: String!
		last_name: String!
		email_address: String!
		password: String!
		unique_token: String!
	}


	type Query {
		# returns the user details
		getUserDetails: User
		# returns the auth status
		checkAuthStatus: String!
	}


	type Mutation {
		# Note: all three mutations here will set the [uid] cookie
		# Mutation to allow the client register a new user with "Email and Password approach"
		registerAdmin(payload: RegisterAdminInput!): User!
		# Mutation to allow the client login  a user with "Email and Password approach"
		loginExistingUser(email: String!, password: String!): User!
		# registration for users with valid invite
		registerWithValidInvite(payload: RegisterWithValidInviteInput): User!
	}
`;
