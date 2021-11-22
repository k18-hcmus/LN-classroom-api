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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.changePassword = exports.updateProfile = void 0;
const userService = __importStar(require("@services/user.service"));
const constants_1 = require("@shared/constants");
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, studentId } = req.body;
    const user = req.user;
    const isStudentIdInvalid = yield userService.isStudentIdInvalid(user._id, studentId);
    if (isStudentIdInvalid) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.STUDENT_ID_EXISTED_ERROR });
    }
    const result = yield userService.updateUser(user._id, { firstName, lastName, studentId });
    if (result) {
        const _a = result.toObject(), { password } = _a, response = __rest(_a, ["password"]);
        return res.json(response);
    }
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.UPDATE_USER_FAILED });
});
exports.updateProfile = updateProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = req.body;
    const user = req.user;
    const isPasswordValid = userService.comparePassword(user, oldPassword);
    if (isPasswordValid) {
        const encryptPassword = userService.encryptPassword(newPassword);
        const result = yield userService.updateUser(user._id, { password: encryptPassword });
        return res.json(result);
    }
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.UPDATE_USER_FAILED });
});
exports.changePassword = changePassword;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, lodash_1.get)(req.params, "id");
    const user = yield userService.getUserById(id);
    if (user) {
        const objectUser = user.toObject();
        const { _id, firstName, lastName, studentId, email, username } = objectUser;
        return res.json({ _id, firstName, lastName, studentId, email, username });
    }
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: constants_1.UPDATE_USER_FAILED });
});
exports.getUserById = getUserById;
