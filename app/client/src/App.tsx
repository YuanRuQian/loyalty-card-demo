import React from 'react';
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { ApolloProvider, useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { ADD_POINTS, POINTS_UPDATED, GET_CUSTOMERS } from './ApolloOps'
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";


type Customer = {
  id: String,
  name: String,
  points: Number
}

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: { reconnect: true },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

type PointsUpdatedData = {
  pointsUpdated: {
    id: string;
    name: string;
    points: number;
  };
};

const PointsWatcher = ({ id }: { id: string }) => {
  const { data } = useSubscription<PointsUpdatedData>(POINTS_UPDATED, {
    variables: { id },
  });

  if (!data) return null;

  return <p>🔄 Live Update: {data.pointsUpdated.points} points</p>;
};

const Dashboard = () => {
  const { loading, data } = useQuery(GET_CUSTOMERS)
  const [addPoints] = useMutation(ADD_POINTS)

  if (loading) {
    return <h1>Loading...</h1>
  }

  const customers = (data as { customers: Customer[] } || {}).customers || [];

  return (
    <>
      <h1>Loyalty Card Dashboard</h1>
      {customers.map((c: Customer) => (
        <div key={c.id as React.Key}>
          {c.name} - {c.points.toString()} points
          <button
            onClick={() =>
              addPoints({ variables: { id: c.id, amount: 50 } })
            }
          >
            Add 50 Points
          </button>
          <PointsWatcher id={c.id.toString()} />
        </div>
      ))}
    </>
  );
}

const App = () => {
  return <ApolloProvider client={client}>
    <Dashboard />
  </ApolloProvider>
}

export default App
