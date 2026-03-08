import { JobType } from "src/interfaces/Ijob";

export type CreateJobSchemaType = {
    name: string;
    scheduledAt: string;
    type: JobType;
    payload: any;
};