import { Queue } from "bullmq";

export const jobQueue = new Queue("event-driven-jobs-queue", {
    connection: {
        host: "127.0.0.1",
        port: 6379,
        maxRetriesPerRequest: null,
    },
});