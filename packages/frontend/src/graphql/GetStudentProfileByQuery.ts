import { gql } from "@apollo/client";


export const GET_STUDENT_PROFILE_BY_QUERY = gql`
query ($payload: GetStudentProfileByQueryInput!){
  getStudentProfileByQuery(
    payload: $payload
  ) {
    _id
    org_id
    first_name
		email_address
    last_name
    campaigns {
      _id
      campaign_name
    }
    blocks_data {
      _id
      block_def_id
      field_data {
        _id
        value
      }
    }
    matched_groups
  }
}

`
