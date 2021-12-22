import { gql } from "@apollo/client";


export const GET_STUDENT_PROFILE_BY_ID = gql`
query($_id:String!){
  getStudentProfileById(_id:$_id){
    _id
    org_id
    first_name
    last_name
    email_address
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
			verification_info{
        timestamp
        verifier_name
      }
    }
  }
}
`
