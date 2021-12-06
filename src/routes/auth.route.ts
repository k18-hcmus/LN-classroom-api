import { Router } from 'express';
import { login, checkAuthentication, refreshToken, googleLogin, registerUser, logout } from '@controllers/auth.controller';
import jwtAuthMdw from '@middlewares/jwt-auth.mdw';
import localAuthMdw from '@middlewares/local-auth.mdw';
import googleAuthMdw from '@middlewares/google-auth.mdw';

// Auth-route
const router = Router();

router.get('/', jwtAuthMdw, checkAuthentication);
router.post('/login', localAuthMdw, login);
router.post('/refresh-token', refreshToken);
router.post('/register', registerUser);
router.post('/logout', logout);
router.get('/google', googleAuthMdw({
    scope: ["profile", "email"],
    accessType: "offline",
}))

router.get('/google/success', googleAuthMdw({
    failureRedirect: `${process.env.CLIENT_HOST}`,
}), googleLogin);
export default router;