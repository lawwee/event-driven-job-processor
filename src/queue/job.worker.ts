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
            const { jobId } = job.data;
            const jobRecord = await Job.findById(jobId);
            if (!jobRecord) {
                console.error(`Job record not found for job ID: ${jobId}`);
                throw new Error(`Job record not found for job ID: ${jobId}`);
            };

            if ([JobStatus.SUCCESS, JobStatus.DEAD].includes(jobRecord.status)) {
                return;
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

JobWorker.on("completed", async (job) => {
    console.log(`Job ${job.data.jobId} completed successfully`);
    await Job.findByIdAndUpdate(job.data.jobId, {
        status: JobStatus.SUCCESS
    })
});

JobWorker.on("failed", async (job, err) => {
    const { jobId } = job.data;
    const jobDetails = await Job.findById(job.data.jobId);
    if (!jobDetails) {
        console.error(`Job record not found for failed job ID: ${jobId}`);
        return;
    };

    const isFinal = jobDetails.retryCount >= 5;

    await Job.findByIdAndUpdate(jobId, {
        status: isFinal ? JobStatus.DEAD: JobStatus.FAILED,
        lastError: err.message
    });
});

JobWorker.on("stalled", async (jobId) => {
    console.warn(`Job ${jobId} stalled and will be retried`);
    await Job.findByIdAndUpdate(jobId, {
        $inc: { retryCount: 1 },
        status: JobStatus.FAILED
    });
});

JobWorker.on("error", (error) => {
    console.error("Worker error: ", error);
});