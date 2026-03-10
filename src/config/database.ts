import mongoose from 'mongoose';

import { Environment } from './env';

export async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect(Environment.DB_HOST);

        console.log("Connected to MongoDB");

        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once("open", () => {
            console.log("MongoDB connection is open");
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
    }
}