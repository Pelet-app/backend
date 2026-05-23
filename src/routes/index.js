import { Router } from 'express';
import users from '../services/users/users-routes.js';
import authentications from '../services/authentications/authentications-routes.js';
import jobs from '../services/jobs/jobs-routes.js';
// import applications from '../services/applications/applications-routes.js';
import profiles from '../services/profiles/profiles-routes.js';
import resumes from '../services/resumes/resumes-routes.js';


const router = Router();

router.use('/', users);
router.use('/', profiles);
router.use('/', authentications);
router.use('/', jobs);
// router.use('/', applications);
router.use('/', resumes);

export default router;