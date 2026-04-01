import express from 'express';

const router = express.Router();

import { JobService } from 'src/services/job.service';
import { CreateJobSchema } from 'src/validations/job.validation';
import { JobStatus } from 'src/interfaces/Ijob';

const jobService = new JobService();

export default router
    .post('/', async (request, response, next) => {
        try {
            const { error } = CreateJobSchema.validate(request.body);

            if (error) {
                return response.status(400).json({ error: error.details[0].message });
            };

            const body = request.body;

            const result = await jobService.createJob(body);

            return response.status(result.statusCode).json(result);
            
        } catch (error) {
            console.error("Error in job creation route:", error);
            next(error);
        };
    })

    .get('/', async (request, response, next) => {
        try {
            const query = request.query;

            const result = await jobService.allJobs(query?.status as JobStatus);

            return response.status(result.statusCode).json(result);

        } catch (error) {
            console.error("Error in job retrieval route:", error);
            next(error);
        };
    })

    .get('/:id', async (request, response, next) => {
        try {
            const { id } = request.params;

            const result = await jobService.getJobById(id);

            return response.status(result.statusCode).json(result);

        } catch (error) {
            console.error("Error in job retrieval route:", error);
            next(error);
        };
    });
