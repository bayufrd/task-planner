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
import { AiService } from './modules/ai/ai.service';
import { TaskService } from './modules/tasks/task.service';

const aiService = new AiService();
const taskService = new TaskService();

type WhatsappIntent = 'REGISTER' | 'CREATE_TASK' | 'LIST_TASKS' | 'LIST_BY_DATE' | 'COMPLETE_TASK' | 'OVERVIEW' | 'UNKNOWN';

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

const formatTaskLine = (task: {
  title: string;
  deadline: Date;
  priority: string;
  status: string;
}) => {
  const formattedDate = task.deadline.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `- ${task.title} | ${formattedDate} | ${task.priority} | ${task.status}`;
};

const buildOverviewMessage = async (userId: string, name?: string | null) => {
  const stats = await taskService.getTaskStats(userId);
  const dailyData = await taskService.getDailyTaskStats(userId, 7);
  const analysis = await aiService.analyzeOverview(userId, stats, dailyData).catch(() => null);
  const total = stats.pending + stats.done + stats.skipped;
  const completionRate = total > 0 ? Math.round((stats.done / total) * 100) : 0;
  const skipRate = total > 0 ? Math.round((stats.skipped / total) * 100) : 0;
  const insight = analysis?.insights?.[0] || 'Tetap konsisten menyelesaikan task prioritas tertinggi terlebih dahulu.';

  return [
    `Ringkasan tugas${name ? ` untuk ${name}` : ''}:`,
    `- Total: ${total}`,
    `- Pending: ${stats.pending}`,
    `- Done: ${stats.done}`,
    `- Skipped: ${stats.skipped}`,
    `- Completion rate: ${completionRate}%`,
    `- Skip rate: ${skipRate}%`,
    `- Insight AI: ${insight}`,
  ].join('\n');
};

const detectWhatsappIntent = (command: string): WhatsappIntent => {
  const normalized = command.trim().toLowerCase();

  if (/^(\S+)\s+daftar$/i.test(command)) return 'REGISTER';
  if (/^task\s+(overview|ringkasan|summary)/i.test(normalized)) return 'OVERVIEW';
  if (/^task\s+(lihat|list|daftar|jadwal|agenda).*(tanggal|besok|lusa|hari ini|today)/i.test(normalized)) return 'LIST_BY_DATE';
  if (/^task\s+(lihat|list|daftar|jadwal|agenda)/i.test(normalized)) return 'LIST_TASKS';
  if (/^task\s+(selesai|done|complete|tandai selesai)/i.test(normalized)) return 'COMPLETE_TASK';
  if (/^task\s+/i.test(normalized)) return 'CREATE_TASK';

  return 'UNKNOWN';
};

const resolveDateFilter = (command: string): { start: Date; end: Date; label: string } | null => {
  const lower = command.toLowerCase();
  const now = new Date();
  const base = new Date(now);
  base.setHours(0, 0, 0, 0);

  if (lower.includes('hari ini') || lower.includes('today')) {
    const end = new Date(base);
    end.setHours(23, 59, 59, 999);
    return { start: base, end, label: 'hari ini' };
  }

  if (lower.includes('besok')) {
    const start = new Date(base);
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: 'besok' };
  }

  if (lower.includes('lusa')) {
    const start = new Date(base);
    start.setDate(start.getDate() + 2);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: 'lusa' };
  }

  const tanggalMatch = lower.match(/tanggal\s+(\d{1,2})/i);
  if (tanggalMatch) {
    const day = Number(tanggalMatch[1]);
    if (day >= 1 && day <= 31) {
      const start = new Date(base.getFullYear(), base.getMonth(), day, 0, 0, 0, 0);
      if (start.getDate() !== day) return null;
      if (start < base) {
        start.setMonth(start.getMonth() + 1);
      }
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end, label: `tanggal ${day}` };
    }
  }

  return null;
};

const buildListMessage = async (userId: string, command: string, name?: string | null) => {
  const dateFilter = resolveDateFilter(command);
  const tasks = await taskService.getTasks(userId);
  const filteredTasks = dateFilter
    ? tasks.filter((task) => task.deadline >= dateFilter.start && task.deadline <= dateFilter.end)
    : tasks;

  if (filteredTasks.length === 0) {
    return dateFilter
      ? `Tidak ada task untuk ${dateFilter.label}${name ? `, ${name}` : ''}.`
      : `Tidak ada task aktif${name ? ` untuk ${name}` : ''}.`;
  }

  const header = dateFilter
    ? `Daftar task ${dateFilter.label}${name ? ` untuk ${name}` : ''}:`
    : `Daftar task aktif${name ? ` untuk ${name}` : ''}:`;

  return [header, ...filteredTasks.slice(0, 10).map(formatTaskLine)].join('\n');
};

const extractCompletionTitle = (command: string) =>
  command
    .replace(/^task\s+/i, '')
    .replace(/^(selesai|done|complete|tandai selesai)\s*/i, '')
    .trim();

const handleTaskCompletion = async (userId: string, command: string, name?: string | null) => {
  const rawTitle = extractCompletionTitle(command);
  if (!rawTitle) {
    return {
      reply: 'Format selesai belum lengkap. Contoh: task selesai meeting client',
      operation: { success: false, type: 'COMPLETE_TASK', reason: 'MISSING_TITLE' },
    };
  }

  const tasks = await taskService.getTasks(userId);
  const normalizedTitle = rawTitle.toLowerCase();
  const matchedTasks = tasks.filter((task) => task.title.toLowerCase().includes(normalizedTitle));

  if (matchedTasks.length === 0) {
    return {
      reply: `Task dengan kata kunci "${rawTitle}" tidak ditemukan.`,
      operation: { success: false, type: 'COMPLETE_TASK', reason: 'TASK_NOT_FOUND', keyword: rawTitle },
    };
  }

  if (matchedTasks.length > 1) {
    return {
      reply: ['Saya menemukan lebih dari satu task. Mohon lebih spesifik:', ...matchedTasks.slice(0, 5).map(formatTaskLine)].join('\n'),
      operation: { success: false, type: 'COMPLETE_TASK', reason: 'AMBIGUOUS_TASK', keyword: rawTitle, matches: matchedTasks.slice(0, 5) },
    };
  }

  const updatedTask = await taskService.updateTaskStatus(userId, matchedTasks[0].id, { status: 'DONE' });

  return {
    reply: `Task selesai ditandai DONE${name ? ` untuk ${name}` : ''}:\n${formatTaskLine(updatedTask)}`,
    operation: { success: true, type: 'COMPLETE_TASK', task: updatedTask },
  };
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
  const intent = detectWhatsappIntent(command);
  const registrationCommand = intent === 'REGISTER';

  let registration = null;
  let registrationNotification = null;
  let whatsappReply: null | { sent: boolean; number: string; message: string; type: string } = null;
  let operation: Record<string, unknown> | null = null;

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

  if (!registrationCommand) {
    const safeWhatsappNumber = normalizeSafeWhatsappNumber(waNumber);

    if (!safeWhatsappNumber) {
      sendError(res, 'VALIDATION_ERROR', 'Unable to normalize WhatsApp number', 400);
      return;
    }

    const linkedUser = await prisma.user.findFirst({
      where: { whatsappNumber: safeWhatsappNumber },
      select: {
        id: true,
        name: true,
        whatsappNumber: true,
      },
    });

    if (!linkedUser) {
      const unregisteredMessage = 'Nomor WhatsApp ini belum terhubung ke Task Planner. Kirim format `user_id daftar` terlebih dahulu untuk menghubungkan akun Anda.';

      try {
        await sendWhatsappMessage(safeWhatsappNumber, unregisteredMessage);
        whatsappReply = {
          sent: true,
          number: safeWhatsappNumber,
          message: unregisteredMessage,
          type: 'number-not-registered',
        };
      } catch (error) {
        console.error('[WA AI] Failed to send unregistered-number message:', error);
        whatsappReply = {
          sent: false,
          number: safeWhatsappNumber,
          message: unregisteredMessage,
          type: 'number-not-registered',
        };
      }

      operation = {
        type: intent,
        success: false,
        reason: 'WHATSAPP_NUMBER_NOT_REGISTERED',
      };
    } else {
      let replyMessage = '';

      if (intent === 'LIST_TASKS' || intent === 'LIST_BY_DATE') {
        replyMessage = await buildListMessage(linkedUser.id, command, linkedUser.name);
        operation = {
          type: intent,
          success: true,
          userId: linkedUser.id,
        };
      } else if (intent === 'OVERVIEW') {
        replyMessage = await buildOverviewMessage(linkedUser.id, linkedUser.name);
        operation = {
          type: 'OVERVIEW',
          success: true,
          userId: linkedUser.id,
        };
      } else if (intent === 'COMPLETE_TASK') {
        const completionResult = await handleTaskCompletion(linkedUser.id, command, linkedUser.name);
        replyMessage = completionResult.reply;
        operation = {
          ...completionResult.operation,
          userId: linkedUser.id,
        };
      } else if (intent === 'CREATE_TASK') {
        const taskCommand = command.replace(/^task\s+/i, '').trim();
        const parsedTask = await aiService.parseTaskCommand(taskCommand);
        const createdTask = await taskService.createTask(linkedUser.id, parsedTask);
        replyMessage = [
          `Task berhasil dibuat${linkedUser.name ? ` untuk ${linkedUser.name}` : ''}:`,
          formatTaskLine(createdTask),
        ].join('\n');
        operation = {
          type: 'CREATE_TASK',
          success: true,
          userId: linkedUser.id,
          parsedTask,
          task: createdTask,
        };
      } else {
        replyMessage = 'Command belum dikenali. Gunakan awalan `task` seperti `task tambah meeting besok jam 10 malam #urgent`, `task lihat jadwal besok`, `task selesai meeting client`, atau `task overview`.';
        operation = {
          type: 'UNKNOWN',
          success: false,
          userId: linkedUser.id,
          reason: 'UNKNOWN_COMMAND',
        };
      }

      try {
        await sendWhatsappMessage(safeWhatsappNumber, replyMessage);
        whatsappReply = {
          sent: true,
          number: safeWhatsappNumber,
          message: replyMessage,
          type: intent.toLowerCase(),
        };
      } catch (error) {
        console.error('[WA AI] Failed to send WhatsApp reply:', error);
        whatsappReply = {
          sent: false,
          number: safeWhatsappNumber,
          message: replyMessage,
          type: intent.toLowerCase(),
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
    intent,
    operation,
    whatsappReply,
  };

  sendSuccess(
    res,
    normalizedPayload,
    registrationCommand ? 'WhatsApp registration captured and saved' : 'WhatsApp inbound command processed',
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