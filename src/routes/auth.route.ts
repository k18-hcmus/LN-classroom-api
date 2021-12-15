import { checkAuthentication, googleLogin, login, logout, refreshToken, registerUser } from '@controllers/auth.controller';
import googleAuth from '@middlewares/google-auth.mdw';
import jwtAuthMdw from '@middlewares/jwt-auth.mdw';
import localAuthMdw from '@middlewares/local-auth.mdw';
import { Router } from 'express';

// Auth-route
const router = Router();

router.get('/', jwtAuthMdw, checkAuthentication);
router.post('/login', localAuthMdw, login);
router.post('/refresh-token', refreshToken);
router.post('/register', registerUser);
router.post('/logout', logout);
router.post('/google', googleAuth, googleLogin)
export default router;