import Customer from "./models/Customer.js";
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

export const resolvers = {
    Query: {
        customers: async () => {
            const docs = await Customer.find(); // ✅ works too
            return docs;
        }
    },
    Mutation: {
        addPoints: async (_, { id, amount }) => {
            const customer = await Customer.findById(id);
            if (!customer) throw new Error("Customer not found");
            customer.points += amount;
            await customer.save();
            return customer;
        },
    },
    Subscription: {
        pointsUpdated: {
            subscribe: (_, { id }, { pubsub }) =>
                pubsub.asyncIterator(`POINTS_UPDATED_${id}`),
        },
    },
};
