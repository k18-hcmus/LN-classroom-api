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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const user_schema_1 = __importDefault(require("@schemas/user.schema"));
passport_1.default.use(new passport_local_1.default.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findOne({ username: username, provider: 'local' }).exec();
        if (!user) {
            return done(null, false);
        }
        const isPasswordValid = user.comparePassword(password);
        if (isPasswordValid) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (err) {
        console.error(err);
        return done(err);
    }
})));
exports.default = passport_1.default.authenticate('local', { session: false });
