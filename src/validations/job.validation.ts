import Joi from 'joi';

import { JobType } from '../interfaces/Ijob';

export const SendEmailPayloadSchema = Joi.object({
    to: Joi.string().email().required(),
    subject: Joi.string().required(),
    body: Joi.string().required()
});

export const CreateJobSchema = Joi.object({
    name: Joi.string().required(),
    scheduledAt: Joi.date().required(),
    jobType: Joi.string().valid(...Object.values(JobType)).required(),
    payload: Joi.alternatives().conditional('jobType', {
        switch: [
            {
                is: JobType.SEND_EMAIL,
                then: SendEmailPayloadSchema.required()
            }
        ],
        otherwise: Joi.forbidden()
    })
});