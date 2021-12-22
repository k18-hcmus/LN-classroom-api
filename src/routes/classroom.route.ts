import { Router } from "express";
import {
  addGradeStructure,
  appendListStudent,
  createClassroom,
  getAllClassroomByUserId,
  getClassroom,
  getGradeBoard,
  getGradeStructure,
  getInviteLink,
  getRole,
  getStudentGradeBoard,
  inviteToClassromByEmail,
  joinClassByLink,
  joinClassroomByClassCode,
  removeFromClassroom,
  removeGradeStructureDetail,
  resetClassCode,
  updateGradeList,
  updateGradeStructure,
  updateGradeStructureDetail,
  updateStudentPoint,
} from "@controllers/classroom.controller";
import authenticateJWT from "@middlewares/jwt-auth.mdw";
import checkPermission from "@middlewares/role-base.mdw";
import { Role } from "@services/role.service";

// User-route
const router = Router();
router.use(authenticateJWT);

router.get("/", getAllClassroomByUserId);
router.post("/", createClassroom);
router.post("/invitation", joinClassByLink);
router.post("/join-by-classcode", joinClassroomByClassCode);
router.get("/:classId/invitation", checkPermission(Role.ANY), getInviteLink);
router.post(
  "/:classId/reset-classcode",
  checkPermission(Role.UPPER_ROLE),
  resetClassCode
);
router.post(
  "/:classId/send-invitation",
  checkPermission(Role.UPPER_ROLE),
  inviteToClassromByEmail
);
router.delete(
  "/:classId/users/:userId",
  checkPermission(Role.UPPER_ROLE),
  removeFromClassroom
);
router.get(
  "/:classId/grade-structure",
  checkPermission(Role.ANY),
  getGradeStructure
);
router.post(
  "/:classId/grade-structure",
  checkPermission(Role.UPPER_ROLE),
  addGradeStructure
);
router.delete(
  "/:classId/grade-structure/:gradeDetailId",
  checkPermission(Role.UPPER_ROLE),
  removeGradeStructureDetail
);
router.put(
  "/:classId/grade-structure/:gradeDetailId",
  checkPermission(Role.UPPER_ROLE),
  updateGradeStructureDetail
);
router.put(
  "/:classId/grade-structure",
  checkPermission(Role.UPPER_ROLE),
  updateGradeStructure
);
router.get("/:classId/role", checkPermission(Role.ANY), getRole);
router.post(
  "/:classId/grade-board/append-list",
  checkPermission(Role.OWNER),
  appendListStudent
);
router.post(
  "/:classId/grade-board/:gradeDetailId",
  checkPermission(Role.UPPER_ROLE),
  updateGradeList
);
router.patch(
  "/:classId/grade-board/:gradeDetailId",
  checkPermission(Role.UPPER_ROLE),
  updateStudentPoint
);
router.get(
  "/:classId/grade-board/:studentId",
  checkPermission(Role.ANY),
  getStudentGradeBoard
);
router.get(
  "/:classId/grade-board",
  checkPermission(Role.UPPER_ROLE),
  getGradeBoard
);
router.get("/:classId", checkPermission(Role.ANY), getClassroom);

export default router;
