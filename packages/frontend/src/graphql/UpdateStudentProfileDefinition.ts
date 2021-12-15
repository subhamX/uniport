import gql from "graphql-tag";


export const UPDATE_STUDENT_PROFILE_DEFINITION = gql`
	mutation updateStudentProfileDefinition($payload: UpdateStudentProfileDefinitionInput!) {
		updateStudentProfileDefinition(
			payload: $payload
		) {
			org_id
			_id
			position
			is_array
			block_name
			is_freezed
			is_required
			requires_proof
			field_defs {
				_id
				field_name
				type
				options
				required
				position
				multi_type
			}
		}
	}
`
