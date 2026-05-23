import { Router } from 'express';
import { authenticateToken, } from '../../middlewares/auth.js';
import upload from './upload.js';
import { deleteResume, getResumeById, getResumes, getResumesByUserId, uploadResume } from './resumes-controller.js';

const router = Router();

router.post('/resumes', authenticateToken,
  (req, res, next) => {
    // Skip multer if Content-Type is JSON (testing / dummy URL mode)
    if (req.is('application/json')) return next();
    return upload.single('resume')(req, res, next);
  }, uploadResume
);
router.get('/resumes/mine', authenticateToken, getResumesByUserId);
router.get('/resumes', authenticateToken, getResumes);
router.get('/resumes/:id', authenticateToken, getResumeById);
router.delete('/resumes/:id', authenticateToken, deleteResume);

export default router;