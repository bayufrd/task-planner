import { z } from 'zod';

const clientTypeSchema = z.enum(['web', 'mobile', 'internal', 'unknown']).optional();

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  captchaToken: z.string().min(1, 'CAPTCHA verification required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  captchaToken: z.string().min(1, 'CAPTCHA verification required'),
});

export const clientRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  clientType: clientTypeSchema.default('mobile'),
  deviceId: z.string().trim().min(1).max(191).optional(),
  appVersion: z.string().trim().min(1).max(50).optional(),
  platform: z.string().trim().min(1).max(50).optional(),
});

export const clientLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  clientType: clientTypeSchema.default('mobile'),
  deviceId: z.string().trim().min(1).max(191).optional(),
  appVersion: z.string().trim().min(1).max(50).optional(),
  platform: z.string().trim().min(1).max(50).optional(),
});

export const mobileGoogleSchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
  clientType: clientTypeSchema.default('mobile'),
  deviceId: z.string().trim().min(1).max(191).optional(),
  appVersion: z.string().trim().min(1).max(50).optional(),
  platform: z.string().trim().min(1).max(50).optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
  clientType: clientTypeSchema.default('mobile'),
  deviceId: z.string().trim().min(1).max(191).optional(),
  appVersion: z.string().trim().min(1).max(50).optional(),
  platform: z.string().trim().min(1).max(50).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;
export type ClientLoginInput = z.infer<typeof clientLoginSchema>;
export type MobileGoogleInput = z.infer<typeof mobileGoogleSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;