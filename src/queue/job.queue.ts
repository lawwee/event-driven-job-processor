import { Queue } from "bullmq";

import { Environment } from "../config/env";

export const RedisConnection = {
    host: Environment.REDIS_HOST,
    port: Environment.REDIS_PORT,
    maxRetriesPerRequest: null,
};

export const JobQueue = new Queue("event-driven-jobs-queue", {
    connection: RedisConnection
});