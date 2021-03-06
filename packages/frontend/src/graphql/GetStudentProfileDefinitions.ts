import gql from "graphql-tag";


export const GET_STUDENT_PROFILE_DEFINITIONS = gql`
	query getStudentProfileDefinitions{
    getStudentProfileDefinitions{
			org_id
			_id
			position
			is_array
			block_name
			is_freezed
			is_required
			requires_proof
			field_defs{
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
