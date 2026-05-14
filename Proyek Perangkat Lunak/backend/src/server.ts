import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { taskAutoSkipScheduler } from './modules/tasks/task.auto-skip.scheduler';

const app = createApp();

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');

    // Start server
    app.listen(env.PORT, () => {
      taskAutoSkipScheduler.start();

      console.log(`✓ Server running on port ${env.PORT}`);
      console.log(`✓ Environment: ${env.NODE_ENV}`);
      console.log(`✓ Health check: http://localhost:${env.PORT}/health`);
      console.log('✓ Auto-skip scheduler started');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  taskAutoSkipScheduler.stop();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  taskAutoSkipScheduler.stop();
  await prisma.$disconnect();
  process.exit(0);
});

startServer();