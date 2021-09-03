import { gql } from "apollo-server-core";


export const schema=gql`
    type Query{
        secret_message: String!
    }
`

export const resolvers={
    Query: {
        secret_message: () => 'hello'
    }
}