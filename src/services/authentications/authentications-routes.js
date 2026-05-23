import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { loginSchema, refreshTokenSchema } from './authentications-schema.js';
import { login, refreshToken, logout } from './authentications-controller.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

router.post('/authentications', validate(loginSchema), login);
router.put('/authentications', validate(refreshTokenSchema), refreshToken);
router.delete('/authentications', authenticateToken, validate(refreshTokenSchema), logout);

export default router;