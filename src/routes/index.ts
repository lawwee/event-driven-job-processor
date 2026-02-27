import express from 'express';

const router = express.Router();

import jobRoutes from './job.route';

router.use('/jobs', jobRoutes);

export default router;