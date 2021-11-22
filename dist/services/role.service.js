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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRoleToClassrooms = exports.getUserRoleInClass = exports.isRoleSastified = exports.Role = void 0;
const classroomService = __importStar(require("@services/classroom.service"));
var Role;
(function (Role) {
    Role["OWNER"] = "owner";
    Role["STUDENT"] = "student";
    Role["TEACHER"] = "teacher";
    Role["ANY"] = "any";
    Role["UPPER_ROLE"] = "upper_role";
})(Role = exports.Role || (exports.Role = {}));
const isRoleSastified = (role, userId, classroom) => {
    switch (role) {
        case Role.ANY:
            return classroomService.isUserInClassrom(userId, classroom);
        case Role.UPPER_ROLE:
            return (classroomService.isUserTeacher(userId, classroom) || classroomService.isUserOwner(userId, classroom));
        case Role.OWNER:
            return classroomService.isUserOwner(userId, classroom);
        case Role.TEACHER:
            return classroomService.isUserTeacher(userId, classroom);
        case Role.STUDENT:
            return classroomService.isUserStudent(userId, classroom);
    }
};
exports.isRoleSastified = isRoleSastified;
const getUserRoleInClass = (userId, classroom) => {
    if (classroomService.isUserOwner(userId, classroom))
        return Role.OWNER;
    if (classroomService.isUserTeacher(userId, classroom))
        return Role.TEACHER;
    if (classroomService.isUserStudent(userId, classroom))
        return Role.STUDENT;
};
exports.getUserRoleInClass = getUserRoleInClass;
const mapRoleToClassrooms = (userId, classrooms) => {
    const result = classrooms.map(classroom => {
        return Object.assign(Object.assign({}, classroom.toObject()), { role: (0, exports.getUserRoleInClass)(userId, classroom) });
    });
    return result;
};
exports.mapRoleToClassrooms = mapRoleToClassrooms;
