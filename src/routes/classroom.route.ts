import { Router } from 'express';
import { addGradeStructure, createClassroom, getAllClassroomByUserId, getGradeStructure, getInviteLink, inviteToClassromByEmail, joinClassByLink, joinClassroomByClassCode, removeFromClassroom, removeGradeStructure, resetClassCode, updateGradeStructure } from '@controllers/classroom.controller';
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
router.get('/:classId/invitation', checkPermission(Role.ANY), getInviteLink);
router.post('/:classId/reset-classcode', checkPermission(Role.UPPER_ROLE), resetClassCode);
router.post('/:classId/send-invitation', checkPermission(Role.UPPER_ROLE), inviteToClassromByEmail);
router.delete('/:classId/users/:userId', checkPermission(Role.UPPER_ROLE), removeFromClassroom);
router.get('/:classId/grade-structure', checkPermission(Role.ANY), getGradeStructure);
router.post('/:classId/grade-structure', checkPermission(Role.UPPER_ROLE), addGradeStructure);
router.delete('/:classId/grade-structure', checkPermission(Role.UPPER_ROLE), removeGradeStructure);
router.put('/:classId/grade-structure', checkPermission(Role.UPPER_ROLE), updateGradeStructure);

export default router;