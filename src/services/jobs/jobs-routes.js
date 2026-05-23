import { Router } from 'express';
import { createJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob } from './jobs-controller.js';
import { validate } from '../../middlewares/validate.js';
import { authenticateToken, hrdOnly } from '../../middlewares/auth.js';
import { createJobSchema, updateJobSchema, listJobsQuerySchema } from './jobs-schema.js';

const router = Router();

router.get('/jobs/mine', authenticateToken, hrdOnly, getMyJobs);
router.post('/jobs', authenticateToken, hrdOnly, validate(createJobSchema), createJob);
router.put('/jobs/:id', authenticateToken, hrdOnly, validate(updateJobSchema), updateJob);
router.delete('/jobs/:id', authenticateToken, hrdOnly, deleteJob);

router.get('/jobs', validate(listJobsQuerySchema, 'query'), getJobs);
router.get('/jobs/:id', getJobById);

export default router;