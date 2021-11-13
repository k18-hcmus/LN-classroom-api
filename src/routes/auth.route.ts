import { Router } from 'express';
import { login, checkAuthentication, refreshToken } from '@controllers/auth.controller';
import jwtAuthMdw from '@middlewares/jwt-auth.mdw';
import localAuthMdw from '@middlewares/local-auth.mdw';

// Auth-route
const router = Router();

router.get('/', jwtAuthMdw, checkAuthentication);
router.post('/login', localAuthMdw, login);
router.post('/refresh-token', refreshToken);

export default router;