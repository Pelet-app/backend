import { Router } from 'express';

import { authenticateToken } from '../../middlewares/auth.js';

import { getRecommendedJobs, getSavedRecommendations, getRecommendationsByDocumentId } from './ai-controller.js';

const router = Router();

router.get('/recommendations/jobs', authenticateToken, getRecommendedJobs);
router.get('/recommendations', authenticateToken, getSavedRecommendations);
router.get('/recommendations/:documentId', authenticateToken, getRecommendationsByDocumentId);

export default router;