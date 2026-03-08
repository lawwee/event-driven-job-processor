import { Worker } from "bullmq";

import { RedisConnection } from "./job.queue";

export const JobWorker = new Worker(
    "event-driven-jobs-queue",
    async (job) => {
        console.log(`Processing job ${job.id} of type ${job.name} with payload:`, job.data);

    },
    {
        connection: RedisConnection,
        concurrency: 5, // Number of concurrent workers
    }
);