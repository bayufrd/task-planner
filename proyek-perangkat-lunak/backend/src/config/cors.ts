import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8000',
      'https://taskplanner.dastrevas.com',
      'https://api-taskplanner.dastrevas.com',
      // Expo Go origins
      'exp://',
      'exp://localhost:8082',
      'exp://192.168.1.7:8082',
    ];

    // Allow all exp:// origins for Expo Go
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('exp://')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};