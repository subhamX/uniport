import { gql } from "@apollo/client";


export const MUTATE_STUDENT_PROFILE_BLOCK_DATA = gql`
mutation ($payload:MutateStudentProfileBlockDataInput!){
  mutateStudentProfileBlockData(
    payload: $payload
  ) {
		# we don't need any data. just selecting _id for confirmation purpose
    _id
  }
}

`
