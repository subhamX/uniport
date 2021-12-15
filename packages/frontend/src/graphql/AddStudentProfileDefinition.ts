import gql from "graphql-tag";


export const ADD_STUDENT_PROFILE_DEFINITION = gql`
	mutation addStudentProfileDefinition($payload: AddStudentProfileDefinitionInput!){
		addStudentProfileDefinition(payload:$payload){
			_id
		}
	}
`
