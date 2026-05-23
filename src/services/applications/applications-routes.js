// import { Router } from 'express';
// import { getApplications, createApplication, deleteApplication, getApplicationsByUserId, getApplicationsByJobId, getApplicationsById, updateApplication } from './applications-controller.js';
// import authenticateToken from '../../middlewares/auth.js';
// import { validate } from '../../middlewares/validate.js';
// import { createApplicationSchema, updateApplicationSchema } from './applications-schema.js';

// const router = Router();

// router.post('/applications', authenticateToken, validate(createApplicationSchema), createApplication);
// router.get('/applications', authenticateToken, getApplications);
// router.get('/applications/:id', authenticateToken, getApplicationsById);
// router.get('/applications/user/:userId', authenticateToken, getApplicationsByUserId);
// router.get('/applications/job/:jobId', authenticateToken, getApplicationsByJobId);

// router.put('/applications/:id', authenticateToken, validate(updateApplicationSchema), updateApplication);
// router.delete('/applications/:id', authenticateToken, deleteApplication);

// export default router;
