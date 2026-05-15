import * as dotenv from 'dotenv';

// Load .env from the backend directory (not the monorepo root)
dotenv.config({ path: __dirname + '/../../.env' });

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  PORT: parseInt(process.env.PORT || '8000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  // 9Router AI / LLM
  NINE_ROUTER_API: process.env.NINE_ROUTER_API || '',
  NINE_ROUTER_API_KEY: process.env.NINE_ROUTER_API_KEY || '',
  NINE_ROUTER_MODEL: process.env.NINE_ROUTER_MODEL || 'cx/gpt-5.2',
  // Google OAuth (shared with frontend)
  GOOGLE_REDIRECT_URI: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/auth/google/callback`,
  // Cloudflare Turnstile (CAPTCHA)
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || '',
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}
