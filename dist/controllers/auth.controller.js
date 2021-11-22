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
exports.logout = exports.refreshToken = exports.googleLogin = exports.registerUser = exports.login = exports.checkAuthentication = void 0;
const RefreshTokenService = __importStar(require("@services/refresh-token.service"));
const constants_1 = require("@shared/constants");
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const userService = __importStar(require("@services/user.service"));
const checkAuthentication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const _a = user.toObject(), { password } = _a, response = __rest(_a, ["password"]);
    res.json(response);
});
exports.checkAuthentication = checkAuthentication;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const rememberMe = (0, lodash_1.get)(req.body, "rememberMe");
    const _b = user.toObject(), { password } = _b, response = __rest(_b, ["password"]);
    const accessToken = RefreshTokenService.createNewAccessToken(user.id);
    let refreshToken = null;
    if (rememberMe) {
        refreshToken = yield RefreshTokenService.createNewRefreshToken(user.id);
    }
    const jwtPayload = RefreshTokenService.prepareCookiesPayload(accessToken, refreshToken);
    res.clearCookie(constants_1.JWT_KEY);
    res.cookie(constants_1.JWT_KEY, jwtPayload, { httpOnly: true });
    res.json(response);
});
exports.login = login;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const validationResult = yield userService.validateNewUser(user);
    console.log(validationResult);
    if (validationResult) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(validationResult);
    }
    const result = yield userService.createUser({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password
    });
    res.json({ _id: result._id });
});
exports.registerUser = registerUser;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const accessToken = RefreshTokenService.createNewAccessToken(user.id);
    const refreshToken = yield RefreshTokenService.createNewRefreshToken(user.id);
    const jwtPayload = RefreshTokenService.prepareCookiesPayload(accessToken, refreshToken);
    res.clearCookie(constants_1.JWT_KEY);
    res.cookie(constants_1.JWT_KEY, jwtPayload, { httpOnly: true });
    res.redirect(`${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`);
});
exports.googleLogin = googleLogin;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.cookies && req.cookies[constants_1.JWT_KEY]) {
            const jwtPayload = req.cookies[constants_1.JWT_KEY];
            const { refreshToken } = RefreshTokenService.parseToken(jwtPayload);
            const tokens = yield RefreshTokenService.performRefreshToken(refreshToken);
            if (tokens) {
                const { accessToken, refreshToken } = tokens;
                const newJwtPayload = RefreshTokenService.prepareCookiesPayload(accessToken, refreshToken);
                res.clearCookie(constants_1.JWT_KEY);
                res.cookie(constants_1.JWT_KEY, newJwtPayload, { httpOnly: true });
                return res.json({ message: constants_1.REFRESH_TOKEN_MESSAGE });
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
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie(constants_1.JWT_KEY);
    res.status(http_status_codes_1.StatusCodes.OK).send("OK");
});
exports.logout = logout;
