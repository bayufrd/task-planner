import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
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
router.post('/register-client', validate(clientRegisterSchema), authController.registerClient);
router.post('/login-client', validate(clientLoginSchema), authController.loginClient);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authController.logout);

// Google OAuth
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.post('/google/mobile', validate(mobileGoogleSchema), authController.googleMobile);
router.post('/sync', authController.syncNextAuth);

export default router;
