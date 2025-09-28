import { gql } from "@apollo/client";

export const GET_CUSTOMERS = gql`
  query {
    customers {
      id
      name
      points
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      name
      points
    }
  }
`;

export const ADD_POINTS = gql`
  mutation AddPoints($id: ID!, $amount: Int!) {
    addPoints(id: $id, amount: $amount) {
      id
      name
      points
    }
  }
`;

export const POINTS_UPDATED = gql`
  subscription OnPointsUpdated($id: ID!) {
    pointsUpdated(id: $id) {
      id
      name
      points
    }
  }
`;
