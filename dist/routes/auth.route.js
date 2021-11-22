"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("@controllers/auth.controller");
const jwt_auth_mdw_1 = __importDefault(require("@middlewares/jwt-auth.mdw"));
const local_auth_mdw_1 = __importDefault(require("@middlewares/local-auth.mdw"));
const google_auth_mdw_1 = __importDefault(require("@middlewares/google-auth.mdw"));
// Auth-route
const router = (0, express_1.Router)();
router.get('/', jwt_auth_mdw_1.default, auth_controller_1.checkAuthentication);
router.post('/login', local_auth_mdw_1.default, auth_controller_1.login);
router.post('/refresh-token', auth_controller_1.refreshToken);
router.post('/register', auth_controller_1.registerUser);
router.post('/logout', auth_controller_1.logout);
router.get('/google', (0, google_auth_mdw_1.default)({
    scope: ["profile", "email"],
    accessType: "offline",
}));
router.get('/google/success', (0, google_auth_mdw_1.default)({
    failureRedirect: `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
}), auth_controller_1.googleLogin);
exports.default = router;
