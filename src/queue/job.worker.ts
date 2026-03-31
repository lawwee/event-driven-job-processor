import { Worker } from "bullmq";

import { RedisConnection } from "./job.queue";
import { executeJob } from "./job.executor";

import { Job } from "../model/job.model";
import { JobStatus } from "../interfaces/Ijob";

export const JobWorker = new Worker(
    "event-driven-jobs-queue",
    async (job) => {
        console.log(`Processing job ${job.id}`);

        try {
            const jobRecord = await Job.findById(job.id);
            if (!jobRecord) {
                console.error(`Job record not found for job ID: ${job.id}`);
                throw new Error(`Job record not found for job ID: ${job.id}`);
            };

            const { _id, jobType } = jobRecord;

            try {
                const updatedJob = await Job.findByIdAndUpdate(_id, { status: JobStatus.PROCESSING });
                console.log(`Job ${_id} status updated to PROCESSING.`);

                const payload = updatedJob.payload;

                await executeJob(_id, jobType, payload);

            } catch (error) {
                console.error(`Error processing job ${_id} of type ${jobType}:`, error);
                throw error;
            };

        } catch (error) {
            console.error(`Error processing job ${job.id}:`, error);
            throw error;
        };

    },
    {
        connection: RedisConnection,
        concurrency: 5, // Number of concurrent workers
    }
);