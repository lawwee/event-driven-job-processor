import { JobType } from "src/interfaces/Ijob";
import { RootService } from "./_root";

import { Job } from "src/model/job";
import { createJobSchema } from "src/validations/job.validation";

export class JobService extends RootService {
    constructor() {
        super();
    };

    async createJob(
        name: string, 
        type: JobType, 
        payload: any
    ) {
        try {
            const { error } = createJobSchema.validate({ name, type, payload });
            if (error) {
                return this.handle_validation_errors(error);
            };

            const existingJob = await Job.findOne({ name });
            if (existingJob) {
                return this.process_failed_response("A job with the same name already exists", name, 409);
            };

            const job = await Job.create({ name, type, payload });

            return this.process_successful_response(job);

        } catch (error) {
            console.error("Error creating job:", error);
            return this.process_failed_response(error);
        };
    };
};