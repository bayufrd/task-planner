import { NextFunction, Request, Response } from 'express';
import { sendError } from '../lib/response';

type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyPrefix: string;
  errorCode?: string;
  message?: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0] || 'unknown';
  }

  return req.ip || req.socket.remoteAddress || 'unknown';
};

const cleanupExpiredEntries = (now: number): void => {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
};

export const createRateLimit = ({
  windowMs,
  max,
  keyPrefix,
  errorCode = 'TOO_MANY_REQUESTS',
  message = 'Too many auth attempts. Please try again later.',
}: RateLimitOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    cleanupExpiredEntries(now);

    const ip = getClientIp(req);
    const email = typeof req.body?.email === 'string' ? req.body.email.toLowerCase() : 'unknown';
    const key = `${keyPrefix}:${ip}:${email}`;
    const currentEntry = rateLimitStore.get(key);

    if (!currentEntry || currentEntry.resetAt <= now) {
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      next();
      return;
    }

    currentEntry.count += 1;

    if (currentEntry.count > max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((currentEntry.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSeconds));
      console.warn(`[rate-limit:${keyPrefix}] blocked`, {
        ip,
        email,
        path: req.path,
        retryAfterSeconds,
      });
      sendError(res, errorCode, message, 429, {
        retryAfterSeconds,
        challengeType: errorCode === 'RISK_CHALLENGE_REQUIRED' ? 'captcha' : undefined,
      });
      return;
    }

    rateLimitStore.set(key, currentEntry);
    next();
  };
};

export const clientLoginRateLimit = createRateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyPrefix: 'auth-login-client',
  errorCode: 'RISK_CHALLENGE_REQUIRED',
  message: 'Too many login attempts. CAPTCHA challenge is now required.',
});

export const clientRegisterRateLimit = createRateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  keyPrefix: 'auth-register-client',
  errorCode: 'CAPTCHA_REQUIRED',
  message: 'Too many registration attempts. CAPTCHA challenge is now required.',
});

export const clientGoogleRateLimit = createRateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyPrefix: 'auth-google-mobile',
  errorCode: 'RISK_CHALLENGE_REQUIRED',
  message: 'Too many Google login attempts. Please retry after cooldown.',
});
