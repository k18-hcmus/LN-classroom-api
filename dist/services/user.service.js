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
exports.comparePassword = exports.isStudentIdInvalid = exports.validateNewUser = exports.updateUser = exports.createUser = exports.encryptPassword = exports.getUserById = exports.getAll = void 0;
const user_schema_1 = __importDefault(require("@schemas/user.schema"));
const constants_1 = require("@shared/constants");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_schema_1.default.find().exec();
});
exports.getAll = getAll;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_schema_1.default.findById(id).exec();
});
exports.getUserById = getUserById;
const encryptPassword = (password) => {
    return bcryptjs_1.default.hashSync(password);
};
exports.encryptPassword = encryptPassword;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.password = (0, exports.encryptPassword)(user.password);
    return yield new user_schema_1.default(user).save();
});
exports.createUser = createUser;
const updateUser = (userId, opts) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_schema_1.default.findByIdAndUpdate(userId, opts, {
        new: true
    }).exec();
});
exports.updateUser = updateUser;
const validateNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = { email: "", username: "" };
    const email = yield user_schema_1.default.findOne({ email: user.email }).exec();
    const username = yield user_schema_1.default.findOne({ username: user.username }).exec();
    if (email || username) {
        email && (result.email = constants_1.EMAIL_EXISTED_ERROR);
        username && (result.username = constants_1.USERNAME_EXISTED_ERROR);
        return result;
    }
    return null;
});
exports.validateNewUser = validateNewUser;
const isStudentIdInvalid = (userId, studentId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findOne({ studentId: studentId }).exec();
    if (result) {
        return result._id.toString() === userId;
    }
    return null;
});
exports.isStudentIdInvalid = isStudentIdInvalid;
const comparePassword = (user, password) => {
    return bcryptjs_1.default.compareSync(password, user.password);
};
exports.comparePassword = comparePassword;
