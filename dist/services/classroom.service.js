"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserOwner = exports.isUserTeacher = exports.isUserStudent = exports.isUserInClassrom = exports.addNewUserToClassroom = exports.resetClasscode = exports.getClassroomByClassCode = exports.getClassroomById = exports.verifyInviteToken = exports.createInviteLink = exports.inviteToClassromByEmail = exports.updateClassroom = exports.createClassroom = exports.removeFromClassroom = exports.getClassroomByUserId = exports.getAll = void 0;
const classroom_schema_1 = __importDefault(require("@schemas/classroom.schema"));
const constants_1 = require("@shared/constants");
const functions_1 = require("@shared/functions");
const mailer_1 = require("@utils/mailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const randomstring_1 = __importDefault(require("randomstring"));
const secretOrKey = process.env.JWT_SECRET_KEY || constants_1.JWT_SECRET;
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield classroom_schema_1.default.find().exec();
});
exports.getAll = getAll;
const getClassroomByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, functions_1.stringToObjectId)(userId);
    const enrolledClassrooms = yield classroom_schema_1.default.find({ studentsId: id }).exec();
    const teachingClassrooms = yield classroom_schema_1.default.find({ teachersId: id }).exec();
    return {
        enrolledClassrooms,
        teachingClassrooms
    };
});
exports.getClassroomByUserId = getClassroomByUserId;
const removeFromClassroom = (classId, userId, isStudent) => __awaiter(void 0, void 0, void 0, function* () {
    const classroom = yield (0, exports.getClassroomById)(classId);
    if (classroom) {
        if ((0, exports.isUserOwner)(userId, classroom)) {
            return null;
        }
        if (isStudent) {
            classroom.studentsId = classroom.studentsId.filter(ids => ids.toString() !== userId);
        }
        else {
            classroom.teachersId = classroom.teachersId.filter(ids => ids.toString() !== userId);
        }
        return yield classroom.save();
    }
    return null;
});
exports.removeFromClassroom = removeFromClassroom;
const createClassCode = () => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    let classCode;
    do {
        classCode = randomstring_1.default.generate(8);
        result = yield classroom_schema_1.default.findOne({ classCode });
    } while (result);
    return classCode;
});
const createClassroom = (classroom) => __awaiter(void 0, void 0, void 0, function* () {
    classroom.classCode = yield createClassCode();
    return yield new classroom_schema_1.default(classroom).save();
});
exports.createClassroom = createClassroom;
const updateClassroom = (classroom) => __awaiter(void 0, void 0, void 0, function* () {
    return yield classroom_schema_1.default.findByIdAndUpdate(classroom._id, classroom);
});
exports.updateClassroom = updateClassroom;
const inviteToClassromByEmail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isStudent, classId, classroomName, email } = payload;
        const inviteLink = (0, exports.createInviteLink)(classId, isStudent);
        const data = {
            classroomName,
            role: isStudent ? 'Student' : 'Teacher',
            inviteLink
        };
        const html = (0, mailer_1.prepareHtmlContent)(constants_1.VIEWS.INVITATION, data);
        yield (0, mailer_1.sendMailWithHtml)(constants_1.INVITATION_EMAIL_SUBJECT, email, html);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.inviteToClassromByEmail = inviteToClassromByEmail;
const createInviteLink = (classId, isStudent) => {
    const token = jsonwebtoken_1.default.sign({ classId, isStudent }, secretOrKey, {
        expiresIn: constants_1.INVITATION_EMAIL_EXPIRED
    });
    const { CLIENT_HOST, CLIENT_PORT } = process.env;
    return `${CLIENT_HOST}:${CLIENT_PORT}/invite/${token}`;
};
exports.createInviteLink = createInviteLink;
const verifyInviteToken = (token) => {
    try {
        const decodeData = jsonwebtoken_1.default.verify(token, secretOrKey);
        const classId = (0, lodash_1.get)(decodeData, "classId");
        const isStudent = (0, lodash_1.get)(decodeData, "isStudent");
        return { classId, isStudent };
    }
    catch (err) {
        console.error(err);
        return null;
    }
};
exports.verifyInviteToken = verifyInviteToken;
const getClassroomById = (classId) => __awaiter(void 0, void 0, void 0, function* () {
    return classroom_schema_1.default.findById(classId).exec();
});
exports.getClassroomById = getClassroomById;
const getClassroomByClassCode = (classCode) => __awaiter(void 0, void 0, void 0, function* () {
    return classroom_schema_1.default.findOne({ classCode }).exec();
});
exports.getClassroomByClassCode = getClassroomByClassCode;
const resetClasscode = (classId) => __awaiter(void 0, void 0, void 0, function* () {
    const classroom = yield (0, exports.getClassroomById)(classId);
    const classCode = yield createClassCode();
    if (classroom) {
        classroom.classCode = classCode;
        return yield classroom.save();
    }
    return null;
});
exports.resetClasscode = resetClasscode;
const addNewUserToClassroom = (userId, classId, isStudent) => __awaiter(void 0, void 0, void 0, function* () {
    const classroom = yield (0, exports.getClassroomById)(classId);
    if (classroom) {
        if ((0, exports.isUserInClassrom)(userId, classroom)) {
            return null;
        }
        const id = (0, functions_1.stringToObjectId)(userId);
        if (isStudent) {
            classroom.studentsId.push(id);
        }
        else {
            classroom.teachersId.push(id);
        }
        return yield classroom.save();
    }
    return null;
});
exports.addNewUserToClassroom = addNewUserToClassroom;
const isUserInClassrom = (userId, classroom) => {
    return (0, exports.isUserOwner)(userId, classroom) || (0, exports.isUserStudent)(userId, classroom) || (0, exports.isUserTeacher)(userId, classroom);
};
exports.isUserInClassrom = isUserInClassrom;
const isUserStudent = (userId, classroom) => {
    return classroom.studentsId.some((studentId) => studentId.toString() === userId.toString());
};
exports.isUserStudent = isUserStudent;
const isUserTeacher = (userId, classroom) => {
    return classroom.teachersId.some((teacherId) => teacherId.toString() === userId.toString());
};
exports.isUserTeacher = isUserTeacher;
const isUserOwner = (userId, classroom) => {
    return classroom.ownerId.toString() === userId.toString();
};
exports.isUserOwner = isUserOwner;
