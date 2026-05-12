import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AuthService } from './auth.service';
import { GoogleOAuthService } from './google-oauth.service';
import { sendSuccess } from '../../lib/response';
import { RegisterInput, LoginInput } from './auth.validation';
import { env } from '../../config/env';

const authService = new AuthService();
const googleOAuthService = new GoogleOAuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);
      sendSuccess(res, result, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new Error('User ID not found');
      }
      const user = await authService.getMe(req.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const authUrl = googleOAuthService.getAuthUrl();
      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  }

  async googleCallback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        throw new Error('Authorization code not found');
      }

      const result = await googleOAuthService.handleCallback(code);

      // Redirect to frontend with token
      const redirectUrl = `${env.FRONTEND_URL}/auth/callback?token=${result.token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // JWT is stateless, so logout is handled client-side by removing token
      // This endpoint exists for consistency and future session management
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
}
