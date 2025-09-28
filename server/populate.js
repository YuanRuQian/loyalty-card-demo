import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from './models/Customer.js';

dotenv.config({ path: ".env.config" });

const mongoUri = process.env.ATLAS_API;

const sampleCustomers = [
    { name: "Alice", points: 120 },
    { name: "Bob", points: 75 },
    { name: "Charlie", points: 200 },
    { name: "Diana", points: 50 },
    { name: "Eve", points: 300 }
];

async function populate() {
    try {
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB Atlas");

        await Customer.deleteMany({});
        console.log("🗑 Cleared existing customers");

        const result = await Customer.insertMany(sampleCustomers);
        console.log(`✅ Inserted ${result.length} customers`);

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

populate();
