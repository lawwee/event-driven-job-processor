import { Job } from "../../model/job.model";
import { JobHandler, JobStatus } from "../../interfaces/Ijob";
import { ISendEmailPayload } from "../../interfaces/IPayload";

export class SendEmailHandler implements JobHandler {
    async execute(jobId: string, payload: ISendEmailPayload): Promise<void> {

        const { to, subject, body } = payload;

        console.log(`Email sent to ${to} with subject "${subject}" and body "${body}"`);
    };
};