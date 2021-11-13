import { Router } from 'express';
import { createUser } from '@controllers/user.controller';


// User-route
const router = Router();

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

router.post('/', createUser);


export default router;