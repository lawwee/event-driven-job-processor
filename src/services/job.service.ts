import { IJob, JobStatus, JobType } from "src/interfaces/Ijob";
import { RootService } from "./_root";

import { EnqueueJob } from "src/queue/job.producer";

import { Job } from "src/model/job.model";

import { CreateJobSchemaType } from "src/types/create-job.type";

export class JobService extends RootService {
    constructor() {
        super();
    };

    async createJob(body: CreateJobSchemaType) {
        try {
            const { name, scheduledAt } = body;
            
            const existingJob = await Job.findOne({ name });
            if (existingJob) {
                return this.process_failed_response("A job with the same name already exists", name, 409);
            };

            // Convert to timestamp
            const scheduledAtTimestamp = typeof scheduledAt === 'number' 
                ? scheduledAt 
                : new Date(scheduledAt).getTime();
            
            if (isNaN(scheduledAtTimestamp)) {
                return this.process_failed_response("Invalid date format", scheduledAt, 400);
            };
            
            const now = Date.now();
            
            if (scheduledAtTimestamp <= now) {
                return this.process_failed_response("scheduledAt must be a future date", scheduledAt, 400);
            };

            const job: IJob = await Job.create({
                ...body,
                scheduledAt: scheduledAtTimestamp,
                scheduledAtISO: scheduledAt,
                status: JobStatus.SCHEDULED
            });

            if (!job._id) {
                return this.process_failed_response("Failed to create job", body, 500);
            };

            await EnqueueJob(job);

            return this.process_successful_response(job);

        } catch (error) {
            console.error("Error creating job:", error);
            return this.process_failed_response(error);
        };
    };

    async getJobById(id: string) {
        try {
            const job = await Job.findById(id);
            if (!job) {
                return this.process_failed_response("Job not found", id, 404);
            };

            return this.process_successful_response(job);
            
        } catch (error) {
            console.error("Error fetching job by ID:", error);
            return this.process_failed_response(error);
        };
    };

    async allJobs(status?: JobStatus) {
        try {
            const jobs = await Job.find({ status }).select("-__v");

            return this.process_successful_response(jobs);

        } catch (error) {
            console.error("Error fetching all jobs:", error);
            return this.process_failed_response(error);
        };
    };
};