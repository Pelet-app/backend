import { Router } from 'express';
import { getMyProfile, updateMyProfile } from './profiles-controller.js';
// import { validate } from '../../middlewares/validate.js';
import { validateProfile } from './profiles-schema.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

router.get('/profiles/me', authenticateToken, getMyProfile);
router.put('/profiles/me', authenticateToken, validateProfile, updateMyProfile);

export default router;