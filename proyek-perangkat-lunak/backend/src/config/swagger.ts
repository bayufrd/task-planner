import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from './env';

const port = env.PORT || 8000;
const serverUrl = `http://localhost:${port}`;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Smart Task Planner API',
      version: '1.0.0',
      description: 'Swagger documentation for the Express backend.',
    },
    servers: [
      {
        url: serverUrl,
        description: 'Local development server',
      },
    ],
    tags: [
      { name: 'System', description: 'System health endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Tasks', description: 'Task management endpoints' },
      { name: 'Reminders', description: 'Reminder endpoints' },
      { name: 'Calendars', description: 'Calendar integration endpoints' },
      { name: 'AI', description: 'AI assistant endpoints' },
      { name: 'WhatsApp', description: 'Internal WhatsApp integration endpoints' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      parameters: {
        TaskId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Task identifier',
          schema: { type: 'string', example: 'cm_task_123' },
        },
        ReminderId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Reminder identifier',
          schema: { type: 'string', example: 'cm_reminder_123' },
        },
        CalendarId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Calendar identifier',
          schema: { type: 'string', example: 'cm_calendar_123' },
        },
        TaskStatusQuery: {
          name: 'status',
          in: 'query',
          required: false,
          description: 'Optional task status filter',
          schema: {
            type: 'string',
            enum: ['PENDING', 'DONE', 'SKIPPED'],
          },
        },
        DailyStatsDays: {
          name: 'days',
          in: 'query',
          required: false,
          description: 'Number of days to include',
          schema: { type: 'integer', default: 30, example: 30 },
        },
        WeeklyStatsWeeks: {
          name: 'weeks',
          in: 'query',
          required: false,
          description: 'Number of weeks to include',
          schema: { type: 'integer', default: 12, example: 12 },
        },
        ReminderSentQuery: {
          name: 'sent',
          in: 'query',
          required: false,
          description: 'Filter reminders by sent state',
          schema: { type: 'boolean', example: false },
        },
        ReminderUpcomingQuery: {
          name: 'upcoming',
          in: 'query',
          required: false,
          description: 'Limit reminders to upcoming reminders',
          schema: { type: 'boolean', example: true },
        },
      },
      schemas: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Invalid request' },
              },
            },
          },
        },
        AuthRegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'captchaToken'],
          properties: {
            name: { type: 'string', minLength: 2, example: 'Bayu Farid' },
            email: { type: 'string', format: 'email', example: 'bayu@example.com' },
            password: { type: 'string', minLength: 6, example: 'secret123' },
            captchaToken: { type: 'string', example: 'cf-turnstile-token' },
          },
        },
        AuthLoginRequest: {
          type: 'object',
          required: ['email', 'password', 'captchaToken'],
          properties: {
            email: { type: 'string', format: 'email', example: 'bayu@example.com' },
            password: { type: 'string', example: 'secret123' },
            captchaToken: { type: 'string', example: 'cf-turnstile-token' },
          },
        },
        AuthSyncRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'bayu@example.com' },
            name: { type: 'string', example: 'Bayu Farid' },
            image: { type: 'string', example: 'https://example.com/avatar.png' },
          },
        },
        TaskCreateRequest: {
          type: 'object',
          required: ['title', 'deadline'],
          properties: {
            title: { type: 'string', example: 'Meeting dengan tim produk' },
            description: { type: 'string', example: 'Bahas roadmap sprint minggu depan' },
            deadline: { type: 'string', format: 'date-time', example: '2026-06-13T14:00:00.000Z' },
            priority: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'], example: 'HIGH' },
            estimatedDuration: { type: 'integer', example: 90 },
            reminderTime: { type: 'integer', example: 60, description: 'Minutes before deadline' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['kerja', 'meeting'],
            },
          },
        },
        TaskUpdateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Meeting client revisi' },
            description: { type: 'string', example: 'Bawa hasil revisi proposal' },
            deadline: { type: 'string', format: 'date-time', example: '2026-06-13T16:00:00.000Z' },
            priority: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'], example: 'MEDIUM' },
            estimatedDuration: { type: 'integer', example: 120 },
            reminderTime: { type: 'integer', example: 30 },
            status: { type: 'string', enum: ['PENDING', 'DONE', 'SKIPPED'], example: 'PENDING' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['revisi', 'client'],
            },
          },
        },
        TaskStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['PENDING', 'DONE', 'SKIPPED'], example: 'DONE' },
          },
        },
        ReminderCreateRequest: {
          type: 'object',
          required: ['remindAt'],
          properties: {
            taskId: { type: 'string', example: 'cm_task_123' },
            remindAt: { type: 'string', format: 'date-time', example: '2026-06-13T13:00:00.000Z' },
          },
        },
        ReminderUpdateRequest: {
          type: 'object',
          properties: {
            remindAt: { type: 'string', format: 'date-time', example: '2026-06-13T12:30:00.000Z' },
            sent: { type: 'boolean', example: true },
          },
        },
        CalendarCreateRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            calendarId: { type: 'string', example: 'primary' },
            name: { type: 'string', example: 'Kalender Kerja' },
            description: { type: 'string', example: 'Sinkronisasi jadwal kantor' },
            type: { type: 'string', example: 'personal' },
            color: { type: 'string', example: '#0ea5e9' },
            isDefault: { type: 'boolean', example: true },
          },
        },
        CalendarUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Kalender Meeting' },
            description: { type: 'string', example: 'Kalender khusus meeting' },
            type: { type: 'string', example: 'work' },
            color: { type: 'string', example: '#22c55e' },
            isDefault: { type: 'boolean', example: false },
            isSynced: { type: 'boolean', example: true },
          },
        },
        CalendarSyncRequest: {
          type: 'object',
          required: ['calendarId'],
          properties: {
            calendarId: { type: 'string', example: 'primary' },
            taskIds: {
              type: 'array',
              items: { type: 'string' },
              example: ['cm_task_123', 'cm_task_456'],
            },
          },
        },
        AiParseTaskRequest: {
          type: 'object',
          required: ['command'],
          properties: {
            command: {
              type: 'string',
              example: 'besok jam 9 malam meeting dengan tim marketing prioritas tinggi',
            },
          },
        },
        AiOverviewAnalysisRequest: {
          type: 'object',
          required: ['stats', 'dailyData'],
          properties: {
            stats: {
              type: 'object',
              properties: {
                pending: { type: 'integer', example: 8 },
                done: { type: 'integer', example: 12 },
                skipped: { type: 'integer', example: 2 },
              },
            },
            dailyData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', example: '2026-06-12' },
                  count: { type: 'integer', example: 3 },
                },
              },
            },
          },
        },
        WhatsappInboundRequest: {
          type: 'object',
          properties: {
            source: { type: 'string', example: 'whatsapp' },
            service: { type: 'string', example: 'internal-bot' },
            command: { type: 'string', example: 'task tambah meeting besok jam 10 malam #urgent' },
            rawMessage: { type: 'string', example: 'task tambah meeting besok jam 10 malam #urgent' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'wa-user-1' },
                name: { type: 'string', example: 'Bayu' },
                phone: { type: 'string', example: '6281234567890' },
              },
            },
            message: {
              type: 'object',
              properties: {
                text: { type: 'string', example: 'task tambah meeting besok jam 10 malam #urgent' },
              },
            },
            context: {
              type: 'object',
              additionalProperties: true,
            },
          },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['System'],
          summary: 'Health check',
          responses: {
            '200': {
              description: 'Backend is healthy',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/HealthResponse' },
                },
              },
            },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthRegisterRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Registration succeeded' },
            '400': { description: 'Validation error' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthLoginRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Login succeeded' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Current user data' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout current user',
          responses: {
            '200': { description: 'Logout succeeded' },
          },
        },
      },
      '/api/auth/google': {
        get: {
          tags: ['Auth'],
          summary: 'Start Google OAuth flow',
          responses: {
            '302': { description: 'Redirect to Google OAuth' },
          },
        },
      },
      '/api/auth/google/callback': {
        get: {
          tags: ['Auth'],
          summary: 'Handle Google OAuth callback',
          responses: {
            '302': { description: 'Redirect after OAuth callback' },
          },
        },
      },
      '/api/auth/sync': {
        post: {
          tags: ['Auth'],
          summary: 'Sync NextAuth session into backend auth',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthSyncRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Sync succeeded' },
          },
        },
      },
      '/api/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'List tasks',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/TaskStatusQuery' }],
          responses: {
            '200': { description: 'Task list' },
            '401': { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskCreateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Task created' },
            '400': { description: 'Validation error' },
          },
        },
      },
      '/api/tasks/stats': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task statistics',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Task stats' },
          },
        },
      },
      '/api/tasks/stats/daily': {
        get: {
          tags: ['Tasks'],
          summary: 'Get daily task statistics',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/DailyStatsDays' }],
          responses: {
            '200': { description: 'Daily stats' },
          },
        },
      },
      '/api/tasks/stats/weekly': {
        get: {
          tags: ['Tasks'],
          summary: 'Get weekly task statistics',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/WeeklyStatsWeeks' }],
          responses: {
            '200': { description: 'Weekly stats' },
          },
        },
      },
      '/api/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/TaskId' }],
          responses: {
            '200': { description: 'Task detail' },
            '404': { description: 'Task not found' },
          },
        },
        patch: {
          tags: ['Tasks'],
          summary: 'Update task by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/TaskId' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskUpdateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Task updated' },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete task by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/TaskId' }],
          responses: {
            '200': { description: 'Task deleted' },
          },
        },
      },
      '/api/tasks/{id}/status': {
        patch: {
          tags: ['Tasks'],
          summary: 'Update task status',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/TaskId' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskStatusRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Task status updated' },
          },
        },
      },
      '/api/tasks/{id}/priority': {
        post: {
          tags: ['Tasks'],
          summary: 'Calculate task priority',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/TaskId' }],
          responses: {
            '200': { description: 'Priority calculated' },
          },
        },
      },
      '/api/tasks/{id}/skip': {
        post: {
          tags: ['Tasks'],
          summary: 'Skip a task',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/TaskId' }],
          responses: {
            '200': { description: 'Task skipped' },
          },
        },
      },
      '/api/reminders': {
        get: {
          tags: ['Reminders'],
          summary: 'List reminders',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/ReminderSentQuery' },
            { $ref: '#/components/parameters/ReminderUpcomingQuery' },
          ],
          responses: {
            '200': { description: 'Reminder list' },
          },
        },
        post: {
          tags: ['Reminders'],
          summary: 'Create reminder',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReminderCreateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Reminder created' },
          },
        },
      },
      '/api/reminders/due': {
        get: {
          tags: ['Reminders'],
          summary: 'Get due reminders',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Due reminders' },
          },
        },
      },
      '/api/reminders/{id}': {
        get: {
          tags: ['Reminders'],
          summary: 'Get reminder by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/ReminderId' }],
          responses: {
            '200': { description: 'Reminder detail' },
          },
        },
        patch: {
          tags: ['Reminders'],
          summary: 'Update reminder by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/ReminderId' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReminderUpdateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Reminder updated' },
          },
        },
        delete: {
          tags: ['Reminders'],
          summary: 'Delete reminder by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/ReminderId' }],
          responses: {
            '200': { description: 'Reminder deleted' },
          },
        },
      },
      '/api/calendars': {
        get: {
          tags: ['Calendars'],
          summary: 'List calendars',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Calendar list' },
          },
        },
        post: {
          tags: ['Calendars'],
          summary: 'Create calendar',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CalendarCreateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Calendar created' },
          },
        },
      },
      '/api/calendars/default': {
        get: {
          tags: ['Calendars'],
          summary: 'Get default calendar',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Default calendar' },
          },
        },
      },
      '/api/calendars/sync': {
        post: {
          tags: ['Calendars'],
          summary: 'Sync calendar data',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CalendarSyncRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Calendar synced' },
          },
        },
      },
      '/api/calendars/{id}': {
        get: {
          tags: ['Calendars'],
          summary: 'Get calendar by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/CalendarId' }],
          responses: {
            '200': { description: 'Calendar detail' },
          },
        },
        patch: {
          tags: ['Calendars'],
          summary: 'Update calendar by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/CalendarId' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CalendarUpdateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Calendar updated' },
          },
        },
        delete: {
          tags: ['Calendars'],
          summary: 'Delete calendar by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/CalendarId' }],
          responses: {
            '200': { description: 'Calendar deleted' },
          },
        },
      },
      '/api/calendars/{id}/refresh': {
        post: {
          tags: ['Calendars'],
          summary: 'Refresh a calendar manually',
          parameters: [{ $ref: '#/components/parameters/CalendarId' }],
          responses: {
            '200': { description: 'Calendar refreshed' },
          },
        },
      },
      '/api/ai/parse-task': {
        post: {
          tags: ['AI'],
          summary: 'Parse natural language into task payload',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AiParseTaskRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Task parsed' },
          },
        },
      },
      '/api/ai/overview-analysis': {
        post: {
          tags: ['AI'],
          summary: 'Generate overview analysis',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AiOverviewAnalysisRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Analysis completed' },
          },
        },
      },
      '/internal/wa': {
        post: {
          tags: ['WhatsApp'],
          summary: 'Internal WhatsApp inbound webhook',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WhatsappInboundRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Webhook processed' },
          },
        },
      },
    },
  },
  apis: [],
});

export const setupSwagger = (app: Express): void => {
  const swaggerHandler = swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use('/inter/swagger', swaggerUi.serve, swaggerHandler);
};
