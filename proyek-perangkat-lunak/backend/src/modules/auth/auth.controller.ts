import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AuthService } from './auth.service';
import { GoogleOAuthService } from './google-oauth.service';
import { sendSuccess } from '../../lib/response';
import {
  RegisterInput,
  LoginInput,
  ClientRegisterInput,
  ClientLoginInput,
  MobileGoogleInput,
} from './auth.validation';
import { env } from '../../config/env';
import { verifyTurnstileToken, getErrorMessage } from '../../lib/captcha/turnstile.service';
import { BadRequestError } from '../../lib/errors';

const authService = new AuthService();
const googleOAuthService = new GoogleOAuthService();

type ClientAuthMetadata = {
  clientType?: string;
  deviceId?: string;
  appVersion?: string;
  platform?: string;
};

export class AuthController {
  private getClientAuthMetadata(req: AuthRequest): ClientAuthMetadata {
    const { clientType, deviceId, appVersion, platform } = req.body ?? {};

    return { clientType, deviceId, appVersion, platform };
  }

  private logClientAuthEvent(action: string, req: AuthRequest, extra?: Record<string, unknown>) {
    const metadata = this.getClientAuthMetadata(req);

    console.info(`[auth:${action}] client flow`, {
      email: req.body?.email,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      ...metadata,
      ...extra,
    });
  }
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;

      // Verify CAPTCHA
      if (!env.TURNSTILE_SECRET_KEY) {
        console.warn('[captcha] TURNSTILE_SECRET_KEY not configured, skipping verification')
      } else {
        // Check for testing mode - 2x prefix = always pass
        const isTestingMode = env.TURNSTILE_SECRET_KEY.startsWith('2x00000000000000000000')
        if (isTestingMode) {
          console.log('[captcha] Testing mode - skipping verification')
        } else {
          const remoteIp = req.ip || req.socket.remoteAddress
          const verifyResult = await verifyTurnstileToken(data.captchaToken, env.TURNSTILE_SECRET_KEY, remoteIp)
          
          if (!verifyResult.success) {
            console.error('[captcha] register verification failed', {
              errorCodes: verifyResult.errorCodes,
              hostname: req.headers.origin || req.headers.referer,
              remoteIp,
            })
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
        // Check for testing mode - 2x prefix = always pass
        const isTestingMode = env.TURNSTILE_SECRET_KEY.startsWith('2x00000000000000000000')
        if (isTestingMode) {
          console.log('[captcha] Testing mode - skipping verification')
        } else {
          const remoteIp = req.ip || req.socket.remoteAddress
          const verifyResult = await verifyTurnstileToken(data.captchaToken, env.TURNSTILE_SECRET_KEY, remoteIp)
          
          if (!verifyResult.success) {
            console.error('[captcha] login verification failed', {
              errorCodes: verifyResult.errorCodes,
              hostname: req.headers.origin || req.headers.referer,
              remoteIp,
            })
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

  async registerClient(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: ClientRegisterInput = req.body;
      this.logClientAuthEvent('register-client', req);
      const result = await authService.register(data);
      sendSuccess(res, {
        ...result,
        authContext: {
          clientType: data.clientType ?? 'mobile',
          captchaRequired: false,
        },
      }, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  async loginClient(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: ClientLoginInput = req.body;
      this.logClientAuthEvent('login-client', req);
      const result = await authService.login(data);
      sendSuccess(res, {
        ...result,
        authContext: {
          clientType: data.clientType ?? 'mobile',
          captchaRequired: false,
        },
      }, 'Login successful');
    } catch (error) {
      console.error('[auth:login-client] failed', {
        email: req.body?.email,
        error: error instanceof Error ? error.message : error,
        ...this.getClientAuthMetadata(req),
      });
      next(error);
    }
  }

  async googleMobile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: MobileGoogleInput = req.body;
      this.logClientAuthEvent('google-mobile', req);

      const tokenInfoResponse = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(data.idToken)}`
      );

      if (!tokenInfoResponse.ok) {
        throw new BadRequestError('Invalid or expired Google ID token');
      }

      const tokenInfo = await tokenInfoResponse.json() as { email?: string; name?: string };
      const email = tokenInfo.email;
      const name = tokenInfo.name || 'Google User';

      if (!email) {
        throw new BadRequestError('Could not determine email from Google ID token');
      }

      const user = await authService.findOrCreateFromGoogle(email, name);
      const token = authService.generateToken(user.id);

      sendSuccess(res, {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        provider: 'google',
        authContext: {
          clientType: data.clientType ?? 'mobile',
          captchaRequired: false,
        },
      }, 'Mobile Google login successful');
    } catch (error) {
      console.error('[auth:google-mobile] failed', {
        error: error instanceof Error ? error.message : error,
        ...this.getClientAuthMetadata(req),
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

      // Redirect to frontend with token and user
      const userParam = encodeURIComponent(JSON.stringify(result.user));
      const redirectUrl = `${env.FRONTEND_URL}/auth/callback?token=${result.token}&user=${userParam}`;
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
