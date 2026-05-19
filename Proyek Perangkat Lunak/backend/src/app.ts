import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { prisma } from './lib/prisma';
import { sendError, sendSuccess } from './lib/response';
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/tasks/task.routes';
import taskSkipRoutes from './modules/tasks/task.skip.routes';
import reminderRoutes from './modules/reminders/reminder.routes';
import calendarRoutes from './modules/calendar/calendar.routes';
import calendarRefreshRoutes from './modules/calendar/calendar.refresh.routes';
import aiRoutes from './modules/ai/ai.routes';

const extractWaNumber = (value?: string | null): string | null => {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  return digits || null;
};

const normalizeSafeWhatsappNumber = (value?: string | null): string | null => {
  const digits = extractWaNumber(value);

  if (!digits) {
    return null;
  }

  if (digits.startsWith('62')) {
    return digits;
  }

  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }

  return `62${digits}`;
};

const sendWhatsappMessage = async (number: string, message: string): Promise<void> => {
  if (!env.WHATSAPP_BOT_URL) {
    return;
  }

  const response = await fetch(`${env.WHATSAPP_BOT_URL}/api/whatsapp/send-personal`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.TOKEN_WHATSAPP}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      number,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send WhatsApp message: ${response.status} ${response.statusText}`);
  }
};

const sendWhatsappRegistrationSuccess = async (number: string, name: string): Promise<void> => {
  await sendWhatsappMessage(
    number,
    `Halo ${name}! Nomor WhatsApp Anda sudah berhasil terhubung ke Smart Task Planner by Dastrevas AI.\n\nMulai sekarang Anda bisa kirim perintah dengan awalan *task* untuk mengelola tugas langsung dari WhatsApp.\n\nContoh:\n- task tambah meeting besok jam 10 malam #urgent\n- task tanggal 10 ada meeting jam 9 malam di apartement #kerjaan\n\nAI kami dari dastrevas.com akan membantu membaca pesan Anda dan mengubahnya menjadi task dengan lebih akurat.\n\nSilakan coba sekarang dengan format awalan *task*.`
  );
};

const handleWhatsappInbound = async (req: Request, res: Response): Promise<void> => {
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.substring(7).trim()
    : '';
  const serviceSecret = String(req.headers['x-service-secret'] || '').trim();

  if (!env.TOKEN_WHATSAPP) {
    sendError(res, 'CONFIG_ERROR', 'TOKEN_WHATSAPP is not configured', 500);
    return;
  }

  if (bearerToken !== env.TOKEN_WHATSAPP || serviceSecret !== env.TOKEN_WHATSAPP) {
    sendError(res, 'UNAUTHORIZED', 'Invalid service secret', 401);
    return;
  }

  const command = typeof req.body?.command === 'string' ? req.body.command.trim() : '';
  const rawMessage = typeof req.body?.rawMessage === 'string' ? req.body.rawMessage.trim() : '';
  const source = typeof req.body?.source === 'string' ? req.body.source.trim() : '';
  const service = typeof req.body?.service === 'string' ? req.body.service.trim() : '';
  const messageBody = typeof req.body?.message?.body === 'string' ? req.body.message.body.trim() : '';
  const participant = typeof req.body?.user?.participant === 'string' ? req.body.user.participant : '';
  const chatId = typeof req.body?.user?.chatId === 'string' ? req.body.user.chatId : '';
  const remoteJid = typeof req.body?.context?.remoteJid === 'string' ? req.body.context.remoteJid : '';
  const waNumber =
    extractWaNumber(req.body?.user?.waNumber) ||
    extractWaNumber(participant) ||
    extractWaNumber(chatId) ||
    extractWaNumber(remoteJid);

  if (!command) {
    sendError(res, 'VALIDATION_ERROR', 'command is required', 400);
    return;
  }

  if (!waNumber) {
    sendError(res, 'VALIDATION_ERROR', 'Unable to resolve WhatsApp number from payload', 400);
    return;
  }

  const commandMatch = command.match(/^(\S+)\s+daftar$/i);
  const taskPlannerUserId = commandMatch?.[1] || null;
  const registrationCommand = Boolean(taskPlannerUserId);

  let registration = null;
  let registrationNotification = null;

  if (taskPlannerUserId) {
    const safeWhatsappNumber = normalizeSafeWhatsappNumber(waNumber);

    if (!safeWhatsappNumber) {
      sendError(res, 'VALIDATION_ERROR', 'Unable to normalize WhatsApp number', 400);
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: taskPlannerUserId },
      select: {
        id: true,
        name: true,
        email: true,
        whatsappNumber: true,
        whatsappChatId: true,
        updatedAt: true,
      },
    });

    if (!existingUser) {
      const notRegisteredMessage =
        'user id tidak terdaftar pada Task Planner silahkan daftar dengan mengunjungi https://taskplanner.dastrevas.com/auth/signup?callbackUrl=%2Fdashboard';

      try {
        await sendWhatsappMessage(safeWhatsappNumber, notRegisteredMessage);
        registrationNotification = {
          sent: true,
          number: safeWhatsappNumber,
          type: 'user-not-found',
          message: notRegisteredMessage,
        };
      } catch (error) {
        console.error('[WA Registration] Failed to send user-not-found message:', error);
        registrationNotification = {
          sent: false,
          number: safeWhatsappNumber,
          type: 'user-not-found',
          message: notRegisteredMessage,
        };
      }

      registration = {
        linked: false,
        reason: 'USER_NOT_FOUND',
        userId: taskPlannerUserId,
      };
    } else if (existingUser.whatsappNumber) {
      const alreadyRegisteredMessage = `user untuk ${taskPlannerUserId} atas nama ${existingUser.name} sudah terdaftar`;

      try {
        await sendWhatsappMessage(safeWhatsappNumber, alreadyRegisteredMessage);
        registrationNotification = {
          sent: true,
          number: safeWhatsappNumber,
          type: 'already-registered',
          message: alreadyRegisteredMessage,
        };
      } catch (error) {
        console.error('[WA Registration] Failed to send already-registered message:', error);
        registrationNotification = {
          sent: false,
          number: safeWhatsappNumber,
          type: 'already-registered',
          message: alreadyRegisteredMessage,
        };
      }

      registration = {
        linked: false,
        reason: 'WHATSAPP_ALREADY_REGISTERED',
        user: existingUser,
      };
    } else {
      const existingWhatsappOwner = await prisma.user.findFirst({
        where: {
          whatsappNumber: safeWhatsappNumber,
          NOT: { id: taskPlannerUserId },
        },
        select: { id: true },
      });

      if (existingWhatsappOwner) {
        sendError(res, 'CONFLICT', 'WhatsApp number is already registered to another user', 409);
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: taskPlannerUserId },
        data: {
          whatsappNumber: safeWhatsappNumber,
          whatsappChatId: chatId || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          whatsappNumber: true,
          whatsappChatId: true,
          updatedAt: true,
        },
      });

      registration = {
        linked: true,
        user: updatedUser,
      };

      try {
        await sendWhatsappRegistrationSuccess(
          safeWhatsappNumber,
          updatedUser.name || req.body?.user?.name || 'User'
        );

        registrationNotification = {
          sent: true,
          number: safeWhatsappNumber,
          type: 'registration-success',
        };
      } catch (error) {
        console.error('[WA Registration] Failed to send confirmation message:', error);
        registrationNotification = {
          sent: false,
          number: safeWhatsappNumber,
          type: 'registration-success',
        };
      }
    }
  }

  const normalizedPayload = {
    source,
    service,
    command,
    rawMessage,
    registrationCommand,
    taskPlannerUserId,
    user: {
      waNumber: normalizeSafeWhatsappNumber(waNumber) || waNumber,
      name: typeof req.body?.user?.name === 'string' ? req.body.user.name : null,
      chatId: chatId || null,
      participant: participant || null,
      isGroup: Boolean(req.body?.user?.isGroup),
    },
    message: {
      id: typeof req.body?.message?.id === 'string' ? req.body.message.id : null,
      timestamp: typeof req.body?.message?.timestamp === 'string' ? req.body.message.timestamp : null,
      body: messageBody || null,
    },
    context: {
      groupId: typeof req.body?.context?.groupId === 'string' ? req.body.context.groupId : null,
      remoteJid: remoteJid || null,
      pushName: typeof req.body?.context?.pushName === 'string' ? req.body.context.pushName : null,
      senderIsAdmin: Boolean(req.body?.context?.senderIsAdmin),
    },
    receivedAt: new Date().toISOString(),
    registration,
    registrationNotification,
  };

  sendSuccess(
    res,
    normalizedPayload,
    registrationCommand ? 'WhatsApp registration captured and saved' : 'WhatsApp inbound payload captured',
    201
  );
};

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
  app.post('/internal/wa/inbound', handleWhatsappInbound);
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/tasks', taskSkipRoutes);
  app.use('/api/reminders', reminderRoutes);
  app.use('/api/calendars', calendarRoutes);
  app.use('/api/calendars', calendarRefreshRoutes);
  app.use('/api/ai', aiRoutes);

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