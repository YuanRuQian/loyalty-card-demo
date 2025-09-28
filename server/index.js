import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import Customer from './models/Customer.js';
import dotenv from "dotenv";

dotenv.config({ path: ".env.config" }); // make sure this file exists

const mongoUri = process.env.ATLAS_API;

if (!mongoUri) {
    throw new Error("❌ Missing ATLAS_API in environment variables");
}

const app = express();

// Example REST endpoint
app.get('/api/customer/:id', async (req, res) => {
    try {
        const consumer = await Customer.findById(req.params.id);
        if (!consumer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(consumer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function start() {
    try {
        // Connect to MongoDB via Mongoose
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB Atlas via Mongoose");

        // Create Apollo Server
        const server = new ApolloServer({ typeDefs, resolvers });
        await server.start();
        server.applyMiddleware({ app });

        // Start Express server
        app.listen(4000, () => {
            console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
        });
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
}

start();
