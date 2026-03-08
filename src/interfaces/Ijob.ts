export interface IJob {
    name: string;
    scheduledAt: number;
    scheduledAtISO: string; 
    type: JobType;
    payload: any;
    status: JobStatus;
    retryCount: number;
    createdAt: Date;
    updatedAt: Date;
    _id?: string;
};

export enum JobType {
    DEFAULT = "DEFAULT",
};

export enum JobStatus {
    PENDING = "PENDING",
    SCHEDULED = "SCHEDULED",
    QUEUED = "QUEUED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
};