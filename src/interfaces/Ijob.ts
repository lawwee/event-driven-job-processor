export interface IJob {
    name: string;
    type: JobType;
    payload: any;
    status: JobStatus;
    retryCount: number;
    createdAt: Date;
    updatedAt: Date;
};

export enum JobType {
    DEFAULT = "DEFAULT",
};

export enum JobStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
};