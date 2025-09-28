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

  return (
    <p className="text-sm text-blue-600 mt-1">
      🔄 Live Update:{" "}
      <span className="font-bold">{data.pointsUpdated.points}</span> points
    </p>
  );
};

const Dashboard = () => {
  const { loading, data } = useQuery(GET_CUSTOMERS);
  const [addPoints] = useMutation(ADD_POINTS);

  if (loading) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  const customers = (data as { customers: Customer[] } || {}).customers || [];

  console.log('data: ', data, 'customers: ', customers)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Loyalty Card Dashboard
      </h1>
      <div className="grid gap-4 w-full max-w-3xl">
        {customers.map((c: Customer) => (
          <div
            key={c.id as React.Key}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
          >
            <div>
              <p className="text-xl font-semibold text-gray-800">{c.name}</p>
              <p className="text-gray-500">{c.points.toString()} points</p>
              <PointsWatcher id={c.id as string} />
            </div>
            <button
              onClick={() => addPoints({ variables: { id: c.id, amount: 50 } })}
              className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
            >
              ➕ Add 50 Points
            </button>
          </div>

        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Dashboard />
    </ApolloProvider>
  );
};

export default App;
