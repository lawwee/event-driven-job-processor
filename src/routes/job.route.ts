import express from 'express';

const router = express.Router();

import { JobService } from 'src/services/job.service';
import { createJobSchema } from 'src/validations/job.validation';

const jobService = new JobService();

export default router
    .post('/', async (request, response, next) => {
        try {
            const { error } = createJobSchema.validate(request.body);

            if (error) {
                return response.status(400).json({ error: error.details[0].message });
            };

            const { name, type, payload } = request.body;

            const result = await jobService.createJob(name, type, payload);

            return response.status(result.statusCode).json(result);
            
        } catch (error) {
            console.error("Error in job creation route:", error);
            next(error);
        };
    });
