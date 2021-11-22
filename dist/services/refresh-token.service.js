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
exports.prepareCookiesPayload = exports.parseToken = exports.createNewAccessToken = exports.createNewRefreshToken = exports.verifyRefreshToken = exports.performRefreshToken = void 0;
const refresh_token_schema_1 = __importDefault(require("@schemas/refresh-token.schema"));
const constants_1 = require("@shared/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const secretOrKey = process.env.JWT_SECRET_KEY || constants_1.JWT_SECRET;
const performRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const storedToken = yield (0, exports.verifyRefreshToken)(refreshToken);
    if (storedToken) {
        yield refresh_token_schema_1.default.deleteOne({ _id: storedToken._id });
        const refreshToken = yield (0, exports.createNewRefreshToken)(storedToken.userId.toString());
        const accessToken = yield (0, exports.createNewAccessToken)(storedToken.userId.toString());
        return {
            [constants_1.ACCESS_TOKEN]: accessToken,
            [constants_1.REFRESH_TOKEN]: refreshToken
        };
    }
    return null;
});
exports.performRefreshToken = performRefreshToken;
const verifyRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (refreshToken) {
        const { userId, token } = jsonwebtoken_1.default.verify(refreshToken, secretOrKey);
        const result = yield refresh_token_schema_1.default.findOne({ token, userId }).exec();
        if (result) {
            return result;
        }
        return null;
    }
    return null;
});
exports.verifyRefreshToken = verifyRefreshToken;
const createNewRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, uuid_1.v4)();
    const payload = { token, userId };
    const refreshToken = jsonwebtoken_1.default.sign(payload, secretOrKey, {
        expiresIn: constants_1.REFRESH_TOKEN_EXPIRE_TIME
    });
    yield new refresh_token_schema_1.default(payload).save();
    return refreshToken;
});
exports.createNewRefreshToken = createNewRefreshToken;
const createNewAccessToken = (userId) => {
    const payload = { id: userId };
    const accessToken = jsonwebtoken_1.default.sign(payload, secretOrKey, {
        expiresIn: constants_1.ACCESS_TOKEN_EXPIRE_TIME
    });
    return accessToken;
};
exports.createNewAccessToken = createNewAccessToken;
const parseToken = (jwtPayload) => {
    const accessToken = (0, lodash_1.get)(JSON.parse(jwtPayload), constants_1.ACCESS_TOKEN);
    const refreshToken = (0, lodash_1.get)(JSON.parse(jwtPayload), constants_1.REFRESH_TOKEN);
    const result = { [constants_1.ACCESS_TOKEN]: accessToken };
    if (refreshToken) {
        result[constants_1.REFRESH_TOKEN] = refreshToken;
    }
    return result;
};
exports.parseToken = parseToken;
const prepareCookiesPayload = (accessToken, refreshToken) => {
    const result = { [constants_1.ACCESS_TOKEN]: accessToken };
    if (refreshToken) {
        result[constants_1.REFRESH_TOKEN] = refreshToken;
    }
    return JSON.stringify(result);
};
exports.prepareCookiesPayload = prepareCookiesPayload;
