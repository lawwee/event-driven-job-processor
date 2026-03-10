import { JobQueue } from "./job.queue";
import { IJob, JobStatus } from "src/interfaces/Ijob";
import { Job } from "src/model/job.model";

export const EnqueueJob = async (job: IJob) => {
    const { _id, scheduledAt } = job;

    const jobId = String(_id);

    const now = Date.now()
    const scheduledTime = new Date(scheduledAt).getTime();
    const delay = Math.max(scheduledTime - now, 0);
    
    await JobQueue.add(
        jobId, 
        { jobId },
        {
            jobId,
            delay,
            attempts: 5, // Number of retry attempts
            backoff: {
                type: "exponential",
                delay: 2000, // Initial delay of 2 seconds
            },
            removeOnComplete: false,
            removeOnFail: false,
        }
    );

    // Update job status to 'queued'
    await Job.findByIdAndUpdate(job._id, {  status: JobStatus.QUEUED });
};