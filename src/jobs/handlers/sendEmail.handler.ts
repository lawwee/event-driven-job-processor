import { JobHandler } from "src/interfaces/Ijob";

export class SendEmailHandler implements JobHandler {
    async execute(jobId: string, payload: any): Promise<void> {
        console.log(`Executing SendEmailHandler for jobId: ${jobId} with payload:`, payload);

        // Simulate email sending logic
        const { to, subject, body } = payload;
        if (!to || !subject || !body) {
            console.error("Invalid payload for SendEmailHandler. Missing 'to', 'subject', or 'body'.");
            return;
        };

        // Here you would integrate with an actual email service provider
        console.log(`Email sent to ${to} with subject "${subject}" and body "${body}"`);
    };
};