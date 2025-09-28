import {gql} from 'apollo-server-express'

export const typeDefs = gql`
    type Customer {
        id: ID!
        name: String!
        points: Int!
    }

    type Query {
        customers: [Customer!]!
        customer(id: ID!): Customer
    }

    type Mutation {
        addPoints(id: ID!, amount: Int!): Customer
    }

    type Subscription {
        pointsUpdated(id: ID!): Customer
    }
`