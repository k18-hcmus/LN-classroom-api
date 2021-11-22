"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromClassroom = exports.joinClassroomByClassCode = exports.resetClassCode = exports.joinClassByLink = exports.getInviteLink = exports.inviteToClassromByEmail = exports.createClassroom = exports.getAllClassroomByUserId = void 0;
const classroomService = __importStar(require("@services/classroom.service"));
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("@shared/constants");
const functions_1 = require("@shared/functions");
const role_service_1 = require("@services/role.service");
const getAllClassroomByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const classrooms = yield classroomService.getClassroomByUserId(_id);
    const result = {};
    result.enrolledClassrooms = (0, role_service_1.mapRoleToClassrooms)(_id, classrooms.enrolledClassrooms);
    result.teachingClassrooms = (0, role_service_1.mapRoleToClassrooms)(_id, classrooms.teachingClassrooms);
    res.json(result);
});
exports.getAllClassroomByUserId = getAllClassroomByUserId;
const createClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classroom = req.body;
    const result = yield classroomService.createClassroom({
        name: classroom.name,
        ownerId: classroom.ownerId,
        schoolYear: classroom.schoolYear,
        teachersId: [classroom.ownerId],
        studentsId: [],
        description: classroom.description
    });
    res.json(Object.assign(Object.assign({}, result), { role: role_service_1.Role.OWNER }));
});
exports.createClassroom = createClassroom;
const inviteToClassromByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield classroomService.inviteToClassromByEmail(payload);
    res.json({ isSent: result });
});
exports.inviteToClassromByEmail = inviteToClassromByEmail;
const getInviteLink = (req, res) => {
    const { classId, isStudent } = req.query;
    const inviteLink = classroomService.createInviteLink(classId, (0, functions_1.stringToBoolean)(isStudent));
    res.json(inviteLink);
};
exports.getInviteLink = getInviteLink;
const joinClassByLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const result = classroomService.verifyInviteToken(token);
    if (result) {
        const user = req.user;
        const { classId, isStudent } = result;
        const newClass = yield classroomService.addNewUserToClassroom(user._id, classId, isStudent);
        if (newClass) {
            return res.json({ id: newClass._id });
        }
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.INVITATION_EMAIL_ERROR });
    }
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.INVITATION_EMAIL_ERROR });
});
exports.joinClassByLink = joinClassByLink;
const resetClassCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classId } = req.body;
    const result = yield classroomService.resetClasscode(classId);
    if (result) {
        return res.json(result);
    }
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.UNEXPECTED_ERROR });
});
exports.resetClassCode = resetClassCode;
const joinClassroomByClassCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classCode } = req.body;
    const user = req.user;
    const classroom = yield classroomService.getClassroomByClassCode(classCode);
    if (classroom) {
        const isUserInClassrom = classroomService.isUserInClassrom(user._id, classroom);
        if (!isUserInClassrom) {
            const result = yield classroomService.addNewUserToClassroom(user._id, classroom._id, true);
            return res.json(Object.assign(Object.assign({}, result), { role: role_service_1.Role.STUDENT }));
        }
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.UNEXPECTED_ERROR });
    }
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.UNEXPECTED_ERROR });
});
exports.joinClassroomByClassCode = joinClassroomByClassCode;
const removeFromClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classId, isStudent, userId } = req.body;
    const classroom = yield classroomService.removeFromClassroom(classId, userId, isStudent);
    if (classroom) {
        return res.json({ studentsId: classroom.studentsId, teachersId: classroom.teachersId });
    }
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.UNEXPECTED_ERROR });
});
exports.removeFromClassroom = removeFromClassroom;
