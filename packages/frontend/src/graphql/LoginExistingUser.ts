import gql from "graphql-tag";


export const loginExistingUser = gql`
	# Just like register admin we are fetching minimal data as we aren't storing these!
	mutation($email_address: String!, $password: String!){
		loginExistingUser(email: $email_address, password: $password){
			_id
		}
	}
`
