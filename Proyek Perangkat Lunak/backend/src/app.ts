import express, { Application } from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/error-handler';
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/tasks/task.routes';
import taskSkipRoutes from './modules/tasks/task.skip.routes';
import reminderRoutes from './modules/reminders/reminder.routes';
import calendarRoutes from './modules/calendar/calendar.routes';
import calendarRefreshRoutes from './modules/calendar/calendar.refresh.routes';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/tasks', taskSkipRoutes);
  app.use('/api/reminders', reminderRoutes);
  app.use('/api/calendars', calendarRoutes);
  app.use('/api/calendars', calendarRefreshRoutes);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};