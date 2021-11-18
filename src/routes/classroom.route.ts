import { Router } from 'express';
import { createClassroom, getAllClassroom, getInviteLink, inviteToClassromByEmail, joinClassByLink } from '@controllers/classroom.controller';
import authenticateJWT from '@middlewares/jwt-auth.mdw';

// User-route
const router = Router();
router.use(authenticateJWT)

router.get('/', getAllClassroom);
router.post('/', createClassroom);
router.get('/invitation', getInviteLink);
router.post('/invitation', joinClassByLink);
router.post('/send-invitation', inviteToClassromByEmail);

export default router;