"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classroom_controller_1 = require("@controllers/classroom.controller");
const jwt_auth_mdw_1 = __importDefault(require("@middlewares/jwt-auth.mdw"));
const role_base_mdw_1 = __importDefault(require("@middlewares/role-base.mdw"));
const role_service_1 = require("@services/role.service");
// User-route
const router = (0, express_1.Router)();
router.use(jwt_auth_mdw_1.default);
router.get('/', classroom_controller_1.getAllClassroomByUserId);
router.post('/', classroom_controller_1.createClassroom);
router.get('/invitation', (0, role_base_mdw_1.default)(role_service_1.Role.ANY), classroom_controller_1.getInviteLink);
router.post('/invitation', classroom_controller_1.joinClassByLink);
router.post('/send-invitation', (0, role_base_mdw_1.default)(role_service_1.Role.UPPER_ROLE), classroom_controller_1.inviteToClassromByEmail);
router.post('/reset-classcode', (0, role_base_mdw_1.default)(role_service_1.Role.UPPER_ROLE), classroom_controller_1.resetClassCode);
router.post('/join-by-classcode', classroom_controller_1.joinClassroomByClassCode);
router.delete('/remove', (0, role_base_mdw_1.default)(role_service_1.Role.UPPER_ROLE), classroom_controller_1.removeFromClassroom);
exports.default = router;
