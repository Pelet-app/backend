import { Router } from 'express';
import { createUser, getMe } from './users-controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema } from './users-schema.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

router.post('/users', validate(registerSchema), createUser);
router.get('/users/me', authenticateToken, getMe);

export default router;