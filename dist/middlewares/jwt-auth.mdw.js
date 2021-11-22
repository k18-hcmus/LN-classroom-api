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
const user_schema_1 = __importDefault(require("@schemas/user.schema"));
const refresh_token_service_1 = require("@services/refresh-token.service");
const constants_1 = require("@shared/constants");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const authenticateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.cookies && req.cookies[constants_1.JWT_KEY]) {
            const jwtPayload = req.cookies[constants_1.JWT_KEY];
            const { accessToken } = (0, refresh_token_service_1.parseToken)(jwtPayload);
            const secretOrKey = process.env.JWT_SECRET_KEY || constants_1.JWT_SECRET;
            const decodeData = jsonwebtoken_1.default.verify(accessToken, secretOrKey);
            const id = (0, lodash_1.get)(decodeData, "id");
            const user = yield user_schema_1.default.findById(id).exec();
            if (!user) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(constants_1.UNAUTHORIZE_MESSAGE);
            }
            req.user = user;
            return next();
        }
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(constants_1.UNAUTHORIZE_MESSAGE);
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(constants_1.UNAUTHORIZE_MESSAGE);
    }
});
exports.default = authenticateJWT;
