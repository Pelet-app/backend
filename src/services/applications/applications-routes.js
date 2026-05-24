import { Router } from 'express';
// import { getApplications, createApplication, deleteApplication, getApplicationsByUserId, getApplicationsByJobId, getApplicationsById, updateApplication } from './applications-controller.js';
import { authenticateToken, hrdOnly } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createApplicationSchema, updateStatusApplicationSchema } from './applications-schema.js';
import { createApplication, getAllApplicationByJobId, getAllMyApplication, getApplicationById, getMyApplicationsById, updateStatusApplicationById } from './applications-controller.js';

const router = Router();

router.post('/jobs/:id/applications', authenticateToken, validate(createApplicationSchema), createApplication);
router.get('/applications/mine', authenticateToken, getAllMyApplication);
router.get('/applications/:id', authenticateToken, getMyApplicationsById);

// Sisi Hrd
router.get('/jobs/:id/applications', authenticateToken, hrdOnly, getAllApplicationByJobId);
router.get('/jobs/:jobId/applications/:applicationId', authenticateToken, hrdOnly, getApplicationById);
router.put('/applications/:id', authenticateToken, hrdOnly, validate(updateStatusApplicationSchema), updateStatusApplicationById);


export default router;
