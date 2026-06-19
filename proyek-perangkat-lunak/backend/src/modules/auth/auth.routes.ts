import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import {
  clientGoogleRateLimit,
  clientLoginRateLimit,
  clientRegisterRateLimit,
} from '../../middleware/rate-limit';
import {
  registerSchema,
  loginSchema,
  clientRegisterSchema,
  clientLoginSchema,
  mobileGoogleSchema,
  refreshTokenSchema,
} from './auth.validation';

const router = Router();
const authController = new AuthController();

// Regular auth
router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/register-client', clientRegisterRateLimit, validate(clientRegisterSchema), authController.registerClient.bind(authController));
router.post('/login-client', clientLoginRateLimit, validate(clientLoginSchema), authController.loginClient.bind(authController));
router.get('/me', authenticate, authController.getMe.bind(authController));
router.post('/logout', authController.logout.bind(authController));

// Google OAuth
router.get('/google', authController.googleAuth.bind(authController));
router.get('/google/callback', authController.googleCallback.bind(authController));
router.post('/google/mobile', clientGoogleRateLimit, validate(mobileGoogleSchema), authController.googleMobile.bind(authController));
router.post('/refresh', validate(refreshTokenSchema), authController.refresh.bind(authController));
router.post('/sync', authController.syncNextAuth.bind(authController));

export default router;
