import mongoose from 'mongoose';

import { Environment } from './env';

export function connectToDatabase() {
    mongoose.connect(Environment.DB_HOST);

    console.log("Connected to MongoDB");

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once("open", () => {
        console.log("MongoDB connection is open");
    });
};