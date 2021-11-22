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
const constants_1 = require("@shared/constants");
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const classroomService = __importStar(require("@services/classroom.service"));
const roleService = __importStar(require("@services/role.service"));
const checkPermission = (role) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classId = (0, lodash_1.get)(req.body, 'classId') || (0, lodash_1.get)(req.query, 'classId');
        if (classId) {
            const classroom = yield classroomService.getClassroomById(classId);
            if (classroom) {
                const user = req.user;
                const isPermissionValid = roleService.isRoleSastified(role, user._id, classroom);
                if (isPermissionValid) {
                    return next();
                }
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(constants_1.UNAUTHORIZE_MESSAGE);
            }
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(constants_1.UNAUTHORIZE_MESSAGE);
        }
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(constants_1.UNAUTHORIZE_MESSAGE);
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(constants_1.UNAUTHORIZE_MESSAGE);
    }
});
exports.default = checkPermission;
