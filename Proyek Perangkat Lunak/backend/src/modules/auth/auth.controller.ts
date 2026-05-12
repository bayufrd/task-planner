import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../lib/response';
import { RegisterInput, LoginInput } from './auth.validation';

const authService = new AuthService();

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
}