import { Queue } from "bullmq";

export const RedisConnection = {
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
};

export const JobQueue = new Queue("event-driven-jobs-queue", {
    connection: RedisConnection
});