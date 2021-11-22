import { Router } from 'express';
import { createClassroom, getAllClassroomByUserId, getInviteLink, inviteToClassromByEmail, joinClassByLink, joinClassroomByClassCode, removeFromClassroom, resetClassCode } from '@controllers/classroom.controller';
import authenticateJWT from '@middlewares/jwt-auth.mdw';
import checkPermission from '@middlewares/role-base.mdw';
import { Role } from '@services/role.service';

// User-route
const router = Router();
router.use(authenticateJWT)

router.get('/', getAllClassroomByUserId);
router.post('/', createClassroom);
router.get('/invitation', checkPermission(Role.ANY), getInviteLink);
router.post('/invitation', joinClassByLink);
router.post('/send-invitation', checkPermission(Role.UPPER_ROLE), inviteToClassromByEmail);
router.post('/reset-classcode', checkPermission(Role.UPPER_ROLE), resetClassCode);
router.post('/join-by-classcode', joinClassroomByClassCode);
router.delete('/remove', checkPermission(Role.UPPER_ROLE), removeFromClassroom);

export default router;