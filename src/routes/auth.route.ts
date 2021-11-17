import { Router } from 'express';
import { login, checkAuthentication, refreshToken, googleLogin } from '@controllers/auth.controller';
import jwtAuthMdw from '@middlewares/jwt-auth.mdw';
import localAuthMdw from '@middlewares/local-auth.mdw';
import googleAuthMdw from '@middlewares/google-auth.mdw';

// Auth-route
const router = Router();

router.get('/', jwtAuthMdw, checkAuthentication);
router.post('/login', localAuthMdw, login);
router.post('/refresh-token', refreshToken);
router.get('/google', googleAuthMdw({
    scope: ["profile", "email"],
    accessType: "offline",
}))

router.get('/google/success', googleAuthMdw({
    failureRedirect: `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
}), googleLogin);
export default router;