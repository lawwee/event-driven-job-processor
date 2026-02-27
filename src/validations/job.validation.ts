import Joi from 'joi';

export const createJobSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('DEFAULT').required(),
    payload: Joi.any().required()
});