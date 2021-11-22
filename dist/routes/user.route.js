"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_auth_mdw_1 = __importDefault(require("@middlewares/jwt-auth.mdw"));
const user_controller_1 = require("@controllers/user.controller");
const express_1 = require("express");
// User-route
const router = (0, express_1.Router)();
router.use(jwt_auth_mdw_1.default);
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - username
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         isActive:
 *           type: boolean
 */
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: This is used to create account for user
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example:
 *             firstName: Long
 *             lastName: Tran
 *             username: longthanhtran
 *             email: longthanhtran@gmail.com
 *             password: banlanhat123456
 *     responses:
 *       200:
 *         description: Return the id of created user
 *         content:
 *           application/json; charset=utf-8:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *               example:
 *                 _id: 6187f47c268e144dbeb5d9bc
 */
router.post('/update', user_controller_1.updateProfile);
router.post('/change-password', user_controller_1.changePassword);
router.get('/:id', user_controller_1.getUserById);
exports.default = router;
