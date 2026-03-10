import mongoose from "mongoose";

import { IJob, JobStatus, JobType } from "../interfaces/Ijob";

const JobSchema = new mongoose.Schema<IJob>({
    name: { 
        type: String, 
        required: true 
    },
    scheduledAt: {
        type: Number, // Store as timestamp (milliseconds)
        required: true
    },
    scheduledAtISO: {
        type: String, 
        required: true
    },
    jobType: {
        type: String,
        enum: Object.values(JobType),
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(JobStatus),
        default: JobStatus.PENDING,
        required: true
    },
    retryCount: {
        type: Number,
        default: 0,
        required: true
    },
}, { timestamps: true });

export const Job = mongoose.model<IJob>("Job", JobSchema);
