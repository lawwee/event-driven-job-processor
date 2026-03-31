export interface IJob {
    name: string;
    scheduledAt: number;
    scheduledAtISO: string; 
    jobType: JobType;
    payload: any;
    status: JobStatus;
    retryCount: number;
    createdAt: Date;
    updatedAt: Date;
    _id?: string;
    lastError?: string;
};

export enum JobType {
    DEFAULT = "DEFAULT",
    SEND_EMAIL = "SEND_EMAIL",
};

export enum JobStatus {
    PENDING = "PENDING",
    SCHEDULED = "SCHEDULED",
    QUEUED = "QUEUED",
    PROCESSING = "PROCESSING",
    "SUCCESS" = "SUCCESS",
    FAILED = "FAILED",
    "DEAD" = "DEAD"
};

export interface JobHandler {
    execute: (jobId: string, payload: any) => Promise<void>;
};