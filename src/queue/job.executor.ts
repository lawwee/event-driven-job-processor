import { JobRegistry } from "../jobs/job.registry";
import { JobType } from "../interfaces/Ijob";

export async function executeJob(
    jobId: string, 
    jobType: JobType, 
    payload: any
): Promise<void> {
    const handler = JobRegistry[jobType as keyof typeof JobRegistry];

    if (!handler) {
        console.error(`No handler found for job type: ${jobType}`);
        throw new Error(`No handler found for job type: ${jobType}`);
    };

    try {
        await handler.execute(jobId, payload);
    } catch (error) {
        console.error(`Error executing job ${jobId} of type ${jobType}:`, error);
        throw error;
    };
};