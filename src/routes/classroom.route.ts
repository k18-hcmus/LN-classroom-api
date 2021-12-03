import { Router } from 'express';
import { createClassroom, getAllClassroomByUserId, getGradeStructure, getInviteLink, inviteToClassromByEmail, joinClassByLink, joinClassroomByClassCode, removeFromClassroom, resetClassCode } from '@controllers/classroom.controller';
import authenticateJWT from '@middlewares/jwt-auth.mdw';
import checkPermission from '@middlewares/role-base.mdw';
import { Role } from '@services/role.service';

// User-route
const router = Router();
router.use(authenticateJWT)

router.get('/', getAllClassroomByUserId);
router.post('/', createClassroom);
router.post('/invitation', joinClassByLink);
router.post('/join-by-classcode', joinClassroomByClassCode);
router.get('/:classId/invitation', checkPermission(Role.ANY), getInviteLink);
router.post('/:classId/reset-classcode', checkPermission(Role.UPPER_ROLE), resetClassCode);
router.post('/:classId/send-invitation', checkPermission(Role.UPPER_ROLE), inviteToClassromByEmail);
router.get('/:classId/grade-structure', checkPermission(Role.ANY), getGradeStructure);
router.delete('/:classId/:userId', checkPermission(Role.UPPER_ROLE), removeFromClassroom);

export default router;