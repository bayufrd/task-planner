import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AuthService } from './auth.service';
import { GoogleOAuthService } from './google-oauth.service';
import { sendSuccess } from '../../lib/response';
import { RegisterInput, LoginInput } from './auth.validation';
import { env } from '../../config/env';
import { verifyTurnstileToken, getErrorMessage } from '../../lib/captcha/turnstile.service';

const authService = new AuthService();
const googleOAuthService = new GoogleOAuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;

      // Verify CAPTCHA
      if (!env.TURNSTILE_SECRET_KEY) {
        console.warn('[captcha] TURNSTILE_SECRET_KEY not configured, skipping verification')
      } else {
        const remoteIp = req.ip || req.socket.remoteAddress
        const verifyResult = await verifyTurnstileToken(data.captchaToken, env.TURNSTILE_SECRET_KEY, remoteIp)
        
        if (!verifyResult.success) {
          res.status(400).json({
            success: false,
            error: {
              code: 'CAPTCHA_FAILED',
              message: getErrorMessage(verifyResult.errorCodes),
            },
          })
          return
        }
      }

      const result = await authService.register(data);
      sendSuccess(res, result, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body;

      // Verify CAPTCHA
      if (!env.TURNSTILE_SECRET_KEY) {
        console.warn('[captcha] TURNSTILE_SECRET_KEY not configured, skipping verification')
      } else {
        const remoteIp = req.ip || req.socket.remoteAddress
        const verifyResult = await verifyTurnstileToken(data.captchaToken, env.TURNSTILE_SECRET_KEY, remoteIp)
        
        if (!verifyResult.success) {
          res.status(400).json({
            success: false,
            error: {
              code: 'CAPTCHA_FAILED',
              message: getErrorMessage(verifyResult.errorCodes),
            },
          })
          return
        }
      }

      const result = await authService.login(data);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      console.error('[auth:login] failed', {
        email: req.body?.email,
        error: error instanceof Error ? error.message : error,
      });
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

  /**
   * Sync NextAuth (Google OAuth) session to Express JWT
   * Called by frontend when NextAuth session exists but no Express token
   */
  async syncNextAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { googleAccessToken, email, name } = req.body as {
        googleAccessToken?: string
        email?: string
        name?: string
      }

      if (!googleAccessToken) {
        res.status(400).json({
          success: false,
          error: { code: 'BAD_REQUEST', message: 'googleAccessToken is required' },
        })
        return
      }

      // Validate Google access token by calling Google's tokeninfo endpoint
      const tokenInfoResponse = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${googleAccessToken}`
      )

      if (!tokenInfoResponse.ok) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Invalid or expired Google access token' },
        })
        return
      }

      const tokenInfo = await tokenInfoResponse.json() as { email?: string; name?: string }
      const googleEmail = tokenInfo.email || email
      const googleName = tokenInfo.name || name || 'Google User'

      if (!googleEmail) {
        res.status(400).json({
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Could not determine email from Google token' },
        })
        return
      }

      // Find or create user in Express database
      const user = await authService.findOrCreateFromGoogle(googleEmail, googleName)
      if (!user) {
        res.status(500).json({
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to create or find user' },
        })
        return
      }

      // Generate Express JWT
      const token = authService.generateToken(user.id)
      sendSuccess(res, {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }, 'Session sync successful')
    } catch (error) {
      console.error('[auth:sync] failed', {
        error: error instanceof Error ? error.message : error,
      })
      next(error)
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
