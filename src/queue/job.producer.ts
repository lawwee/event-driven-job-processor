import { JobQueue } from "./job.queue";
import { IJob, JobStatus } from "src/interfaces/Ijob";
import { Job } from "src/model/job.model";

export const EnqueueJob = async (job: IJob) => {
    await JobQueue.add(
        job._id, 
        job,
        {
            jobId
            : job._id, 
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