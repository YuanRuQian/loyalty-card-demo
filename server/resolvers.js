import Customer from "./models/Customer.js";
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

export const resolvers = {
    Query: {
        customers: () => Customer.find(),
        customer: (_, { id }) => Customer.findById(id)
    },
    Mutation: {
        addPoints: async (_, { id, amount }) => {
            const customer = await Customer.findById(id)
            customer.points += amount
            await customer.save()

            pubsub.publish("POINTS_UPDATED", { pointsUpdated: customer })
            return customer
        }
    },
    Subscription: {
        pointsUpdated: {
            subscribe: (_, { id }) => { pubsub.asyncIterableIterator(["POINTS_UPDATED"]) }
        }
    }
}