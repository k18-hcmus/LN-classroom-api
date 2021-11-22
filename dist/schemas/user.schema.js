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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const isLength_1 = __importDefault(require("validator/lib/isLength"));
const isInt_1 = __importDefault(require("validator/lib/isInt"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passwordValidation = (password) => {
    return (0, isLength_1.default)(password, { min: 6 });
};
const usernameValidation = (username) => {
    return (0, isLength_1.default)(username, { min: 6 });
};
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, index: { unique: true }, validate: [isEmail_1.default, 'Invalid email!'] },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true }, validate: [usernameValidation, 'Username must have at least 6 characters!'] },
    password: { type: String, required: true, validate: [passwordValidation, 'Password must have at least 6 characters!'] },
    isActive: { type: Boolean, default: false },
    provider: { type: String, default: 'local' },
    studentId: { type: String, validate: [isInt_1.default, 'Student Id can only contain digits!'] }
}, {
    timestamps: true
});
UserSchema.methods.comparePassword = function (password) {
    return bcryptjs_1.default.compareSync(password, this.password);
};
exports.default = mongoose_1.default.model('users', UserSchema);
