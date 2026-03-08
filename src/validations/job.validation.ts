import Joi from 'joi';

export const CreateJobSchema = Joi.object({
    name: Joi.string().required(),
    scheduledAt: Joi.date().required(),
    type: Joi.string().valid('DEFAULT').required(),
    payload: Joi.any().required()
});