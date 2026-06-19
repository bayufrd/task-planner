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
} from './auth.validation';

const router = Router();
const authController = new AuthController();

// Regular auth
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/register-client', clientRegisterRateLimit, validate(clientRegisterSchema), authController.registerClient);
router.post('/login-client', clientLoginRateLimit, validate(clientLoginSchema), authController.loginClient);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authController.logout);

// Google OAuth
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.post('/google/mobile', clientGoogleRateLimit, validate(mobileGoogleSchema), authController.googleMobile);
router.post('/sync', authController.syncNextAuth);

export default router;
