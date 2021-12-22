<<<<<<< HEAD
import authenticateJWT from '@middlewares/jwt-auth.mdw';
import { changePassword, getUserById, getUserByStudentId, updateProfile } from '@controllers/user.controller';
import { Router } from 'express';

=======
import authenticateJWT from "@middlewares/jwt-auth.mdw";
import {
  changePassword,
  getUserById,
  getUserByStudentId,
  updateProfile,
} from "@controllers/user.controller";
import { Router } from "express";
>>>>>>> 4b81cd10026032009ac15e11d9df7074408eaa83

// User-route
const router = Router();
router.use(authenticateJWT);

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

<<<<<<< HEAD
router.patch('/', updateProfile);
router.get("/students/:studentId", getUserByStudentId)
router.post('/change-password', changePassword);
router.get('/:id', getUserById);

=======
router.patch("/", updateProfile);
router.get("/students/:studentId", getUserByStudentId);
router.post("/change-password", changePassword);
router.get("/:id", getUserById);
>>>>>>> 4b81cd10026032009ac15e11d9df7074408eaa83

export default router;
