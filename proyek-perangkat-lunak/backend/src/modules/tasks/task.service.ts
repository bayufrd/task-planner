import { prisma } from '../../lib/prisma';
import { NotFoundError, ForbiddenError } from '../../lib/errors';
import { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput } from './task.validation';
import { calculatePriorityScore } from '../../utils/priority';
import { AiService } from '../ai/ai.service';

const aiService = new AiService();

const DAILY_REMINDER_KIND = 'DAILY_SCHEDULE';
const DAILY_DISCIPLINE_QUOTES = [
  'Disiplin waktu adalah bentuk sederhana dari menghargai masa depan sendiri.',
  'Waktu yang diatur dengan disiplin akan berubah menjadi hasil yang konsisten.',
  'Jadwal yang dijaga hari ini akan membentuk pencapaian esok hari.',
  'Konsistensi kecil setiap hari lebih kuat daripada niat besar yang tertunda.',
];
const DAILY_SCHEDULE_CAPTION_BATCH_THRESHOLD = 750;
const DAILY_SCHEDULE_TEXT_BATCH_THRESHOLD = 1500;

export interface DailyScheduleReminderBatch {
  pesan: string;
  hasLampiran: boolean;
}

export interface DailyScheduleReminder {
  reminderKey: string;
  userId: string;
  nomor: string;
  lampiranPath: string;
  batches: DailyScheduleReminderBatch[];
}

const splitLongText = (text: string, maxLength: number): string[] => {
  const normalized = text.trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let remaining = normalized;

  while (remaining.length > maxLength) {
    let splitIndex = remaining.lastIndexOf('\n', maxLength);
    if (splitIndex <= 0 || splitIndex < Math.floor(maxLength * 0.6)) {
      splitIndex = remaining.lastIndexOf(' ', maxLength);
    }
    if (splitIndex <= 0 || splitIndex < Math.floor(maxLength * 0.6)) {
      splitIndex = maxLength;
    }

    const part = remaining.slice(0, splitIndex).trim();
    if (part) {
      chunks.push(part);
    }
    remaining = remaining.slice(splitIndex).trim();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
};

const buildDailyScheduleBatches = (caption: string): DailyScheduleReminderBatch[] => {
  const normalized = caption.trim();
  if (!normalized) {
    return [];
  }

  if (normalized.length <= DAILY_SCHEDULE_CAPTION_BATCH_THRESHOLD) {
    return [{ pesan: normalized, hasLampiran: true }];
  }

  const firstChunk = splitLongText(normalized, DAILY_SCHEDULE_CAPTION_BATCH_THRESHOLD)[0] ?? normalized.slice(0, DAILY_SCHEDULE_CAPTION_BATCH_THRESHOLD).trim();
  const remaining = normalized.slice(firstChunk.length).trim();
  const overflowChunks = splitLongText(remaining, DAILY_SCHEDULE_TEXT_BATCH_THRESHOLD).map((pesan) => ({
    pesan,
    hasLampiran: false,
  }));

  return [
    { pesan: firstChunk, hasLampiran: true },
    ...overflowChunks,
  ];
};

export class TaskService {
  async createTask(userId: string, data: CreateTaskInput) {
    const deadline = new Date(data.deadline);
    
    const task = await prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        deadline,
        priority: data.priority,
        estimatedDuration: data.estimatedDuration || 60,
        reminderTime: data.reminderTime,
        status: 'PENDING',
      },
      include: {
        tags: true,
      },
    });

    // Create tags if provided
    if (data.tags && data.tags.length > 0) {
      await prisma.taskTag.createMany({
        data: data.tags.map((tagName) => ({
          taskId: task.id,
          tagName,
        })),
      });
    }

    return this.getTaskById(userId, task.id).then(async (result) => {
      // Invalidate AI overview cache
      await aiService.invalidateCache(userId).catch(() => {});
      return result;
    });
  }

  async getTasks(userId: string, status?: string) {
    const where: any = { userId, deletedAt: null };
    
    if (status) {
      where.status = status.toUpperCase();
    } else {
      // Default: exclude DONE tasks
      where.status = { not: 'DONE' };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        tags: true,
      },
      orderBy: [
        { deadline: 'asc' },
      ],
    });

    // Calculate priorityScore for each task
    const tasksWithScore = tasks.map((task) => {
      const score = calculatePriorityScore({
        deadline: task.deadline,
        priority: task.priority as 'HIGH' | 'MEDIUM' | 'LOW',
        reminderTime: task.reminderTime,
        estimatedDuration: task.estimatedDuration || 60,
      });
      return {
        ...task,
        priorityScore: score,
      };
    });

    return tasksWithScore;
  }

  async getTaskById(userId: string, taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        tags: true,
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    // Calculate priorityScore
    const score = calculatePriorityScore({
      deadline: task.deadline,
      priority: task.priority as 'HIGH' | 'MEDIUM' | 'LOW',
      reminderTime: task.reminderTime,
      estimatedDuration: task.estimatedDuration || 60,
    });

    return {
      ...task,
      priorityScore: score,
    };
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskInput) {
    await this.getTaskById(userId, taskId);

    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.deadline !== undefined) {
      updateData.deadline = new Date(data.deadline);
    }
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.estimatedDuration !== undefined) updateData.estimatedDuration = data.estimatedDuration;
    if (data.reminderTime !== undefined) updateData.reminderTime = data.reminderTime;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'DONE') {
        updateData.completedAt = new Date();
      }
    }

    await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        tags: true,
      },
    });

    // Update tags if provided
    if (data.tags !== undefined) {
      await prisma.taskTag.deleteMany({
        where: { taskId },
      });

      if (data.tags.length > 0) {
        await prisma.taskTag.createMany({
          data: data.tags.map((tagName) => ({
            taskId,
            tagName,
          })),
        });
      }
    }

    return this.getTaskById(userId, taskId).then(async (result) => {
      // Invalidate AI overview cache
      await aiService.invalidateCache(userId).catch(() => {});
      return result;
    });
  }

  async updateTaskStatus(userId: string, taskId: string, data: UpdateTaskStatusInput) {
    await this.getTaskById(userId, taskId);

    const updateData: any = { status: data.status };
    
    if (data.status === 'DONE') {
      updateData.completedAt = new Date();
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        tags: true,
      },
    });

    // Invalidate AI overview cache
    await aiService.invalidateCache(userId).catch(() => {});

    return task;
  }

  async deleteTask(userId: string, taskId: string) {
    await this.getTaskById(userId, taskId);


    // Soft delete - set deletedAt timestamp instead of actually deleting
    await prisma.task.update({
      where: { id: taskId },
      data: { deletedAt: new Date() },
    });

    // Invalidate AI overview cache
    await aiService.invalidateCache(userId).catch(() => {});

    return { message: 'Task deleted successfully' };
  }

  async getTaskStats(userId: string) {
    const [pending, done, skipped] = await Promise.all([
      prisma.task.count({ where: { userId, status: 'PENDING', deletedAt: null } }),
      prisma.task.count({ where: { userId, status: 'DONE', deletedAt: null } }),
      prisma.task.count({ where: { userId, status: 'SKIPPED', deletedAt: null } }),
    ]);

    return { pending, done, skipped };
  }

  async getDailyTaskStats(userId: string, days: number = 30) {
    const now = new Date();
    
    // Use local time for date boundaries to ensure "today" is correct for the user
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        completedAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'DONE',
      },
      select: {
        completedAt: true,
      },
      orderBy: {
        completedAt: 'asc',
      },
    });

    // Helper to get YYYY-MM-DD in local time to avoid UTC shifting
    const getLocalDateKey = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Group by date
    const dailyStats: Record<string, number> = {};
    
    // Initialize all days with 0 (from startDate to today)
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = getLocalDateKey(date);
      dailyStats[dateKey] = 0;
    }

    // Count completed tasks per day
    tasks.forEach((task) => {
      if (task.completedAt) {
        const dateKey = getLocalDateKey(task.completedAt);
        if (dailyStats[dateKey] !== undefined) {
          dailyStats[dateKey]++;
        }
      }
    });

    return Object.entries(dailyStats).map(([date, count]) => ({
      date,
      count,
    }));
  }

  async getWeeklyTaskStats(userId: string, weeks: number = 12) {
    const now = new Date();
    
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (weeks * 7));
    startDate.setHours(0, 0, 0, 0);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        completedAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'DONE',
      },
      select: {
        completedAt: true,
      },
      orderBy: {
        completedAt: 'asc',
      },
    });

    // Group by week
    const weeklyStats: Record<string, number> = {};
    
    // Helper to get week key using local time
    const getWeekKey = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    };

    // Initialize all weeks with 0 (from startDate to today)
    for (let i = 0; i <= weeks; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (i * 7));
      const weekKey = getWeekKey(date);
      weeklyStats[weekKey] = 0;
    }

    // Count completed tasks per week
    tasks.forEach((task) => {
      if (task.completedAt) {
        const weekKey = getWeekKey(task.completedAt);
        if (weeklyStats[weekKey] !== undefined) {
          weeklyStats[weekKey]++;
        }
      }
    });

    return Object.entries(weeklyStats).map(([week, count]) => ({
      week,
      count,
    }));
  }

  async autoSkipOverdueTasks() {
    const now = new Date();
    const minimumToleranceMs = 60 * 60 * 1000;
    const minimumOverdueDeadline = new Date(now.getTime() - minimumToleranceMs);

    const candidates = await prisma.task.findMany({
      where: {
        status: 'PENDING',
        deletedAt: null,
        deadline: { lte: minimumOverdueDeadline },
      },
      select: {
        id: true,
        title: true,
        deadline: true,
        estimatedDuration: true,
        priority: true,
        user: {
          select: {
            name: true,
            whatsappNumber: true,
          },
        },
      },
    });

    const overdueTasks = candidates
      .map((task) => ({
        id: task.id,
        title: task.title,
        deadline: task.deadline,
        estimatedDuration: task.estimatedDuration,
        priority: task.priority,
        userName: task.user.name,
        whatsappNumber: task.user.whatsappNumber,
      }))
      .filter((task) => {
        const toleranceMinutes = Math.max(task.estimatedDuration || 60, 60);
        const skippedAt = new Date(task.deadline).getTime() + toleranceMinutes * 60 * 1000;
        return skippedAt <= now.getTime();
      });

    const overdueTaskIds = overdueTasks.map((task) => task.id);

    if (overdueTaskIds.length === 0) {
      return { skipped: 0, skippedNotifications: [] as Array<{ taskId: string; nomor: string; pesan: string }> };
    }

    const result = await prisma.task.updateMany({
      where: {
        id: { in: overdueTaskIds },
        status: 'PENDING',
      },
      data: {
        status: 'SKIPPED',
      },
    });

    const skippedNotifications = overdueTasks
      .filter((task) => task.whatsappNumber)
      .map((task) => {
        const toleranceMinutes = Math.max(task.estimatedDuration || 60, 60);
        return {
          taskId: task.id,
          nomor: String(task.whatsappNumber).trim(),
          pesan: [
            `⛔ Task otomatis menjadi SKIPPED${task.userName ? `, ${task.userName}` : ''}`,
            `Task: ${task.title}`,
            `Deadline: ${new Date(task.deadline).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Jakarta' })} WIB`,
            `Batas toleransi selesai: ${toleranceMinutes} menit setelah deadline.`,
            'Task ini sudah melewati batas toleransi dan statusnya diubah menjadi SKIPPED.',
          ].join('\n'),
        };
      });

    return { skipped: result.count, skippedNotifications };
  }

  async processWhatsappDeadlineReminders() {
    const now = new Date();
    const oneHourMs = 60 * 60 * 1000;
    const twentyFourHoursMs = 24 * oneHourMs;
    const windowMs = 5 * 60 * 1000;

    const candidates = await prisma.task.findMany({
      where: {
        status: 'PENDING',
        deletedAt: null,
        deadline: {
          gte: new Date(now.getTime() - windowMs),
          lte: new Date(now.getTime() + twentyFourHoursMs + windowMs),
        },
        user: {
          whatsappNumber: { not: null },
        },
        OR: [
          { reminder24hSent: false },
          { reminder1hSent: false },
          { reminderDeadlineSent: false },
        ],
      },
      select: {
        id: true,
        title: true,
        deadline: true,
        priority: true,
        estimatedDuration: true,
        userId: true,
        reminder24hSent: true,
        reminder1hSent: true,
        reminderDeadlineSent: true,
        user: {
          select: {
            name: true,
            whatsappNumber: true,
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
    });

    const reminders: Array<{
      taskId: string;
      type: '24h' | '1h' | 'deadline';
      nomor: string;
      pesan: string;
    }> = [];

    for (const task of candidates) {
      const whatsappNumber = task.user.whatsappNumber?.trim();
      if (!whatsappNumber) continue;

      const deadline = new Date(task.deadline);
      const remainingMs = deadline.getTime() - now.getTime();
      const userName = task.user.name ? `, ${task.user.name}` : '';
      const deadlineLabel = deadline.toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Jakarta',
      });

      if (!task.reminder24hSent && remainingMs <= twentyFourHoursMs && remainingMs >= twentyFourHoursMs - windowMs) {
        reminders.push({
          taskId: task.id,
          type: '24h',
          nomor: whatsappNumber,
          pesan: [
            `⏰ Pengingat Task 24 Jam${userName}`,
            `Task: ${task.title}`,
            `Deadline: ${deadlineLabel} WIB`,
            `Sisa waktu: sekitar 24 jam lagi.`,
            `Prioritas: ${task.priority}`,
            'Segera siapkan task ini agar tidak terlewat.',
          ].join('\n'),
        });
      }

      if (!task.reminder1hSent && remainingMs <= oneHourMs && remainingMs >= oneHourMs - windowMs) {
        reminders.push({
          taskId: task.id,
          type: '1h',
          nomor: whatsappNumber,
          pesan: [
            `🚨 Pengingat Task 1 Jam${userName}`,
            `Task: ${task.title}`,
            `Deadline: ${deadlineLabel} WIB`,
            `Sisa waktu: sekitar 1 jam lagi.`,
            `Prioritas: ${task.priority}`,
            'Harap segera diselesaikan atau dijadwalkan ulang jika perlu.',
          ].join('\n'),
        });
      }

      if (!task.reminderDeadlineSent && remainingMs <= windowMs && remainingMs >= 0) {
        const toleranceMinutes = Math.max(task.estimatedDuration || 60, 60);
        reminders.push({
          taskId: task.id,
          type: 'deadline',
          nomor: whatsappNumber,
          pesan: [
            `⏳ Deadline task sudah tiba${userName}`,
            `Task: ${task.title}`,
            `Deadline: ${deadlineLabel} WIB`,
            `Jika belum selesai, balas dengan format seperti: selesai ${task.title}`,
            `Jika tidak diubah menjadi DONE dalam ${toleranceMinutes} menit lagi, task ini akan otomatis menjadi SKIPPED.`,
          ].join('\n'),
        });
      }
    }

    return reminders;
  }

  async markWhatsappReminderSent(taskId: string, type: '24h' | '1h' | 'deadline') {
    const data =
      type === '24h'
        ? { reminder24hSent: true, reminderSent: true }
        : type === '1h'
          ? { reminder1hSent: true, reminderSent: true }
          : { reminderDeadlineSent: true, reminderSent: true };

    await prisma.task.updateMany({
      where: {
        id: taskId,
        deletedAt: null,
        status: 'PENDING',
      },
      data,
    });
  }

  async processDailyScheduleReminder(referenceDate: Date = new Date()) {
    const jakartaFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const dayKey = jakartaFormatter.format(referenceDate);
    const [year, month, day] = dayKey.split('-').map(Number);
    const startOfDayUtc = new Date(Date.UTC(year, month - 1, day, -7, 0, 0, 0));
    const endOfDayUtc = new Date(Date.UTC(year, month - 1, day, 16, 59, 59, 999));

    const quote = DAILY_DISCIPLINE_QUOTES[day % DAILY_DISCIPLINE_QUOTES.length];
    const dailyImagePath = 'public/harian-candidate-600.jpg';
    const reminderKey = `${DAILY_REMINDER_KIND}:${dayKey}`;

    const users = await prisma.user.findMany({
      where: {
        whatsappNumber: { not: null },
      },
      select: {
        id: true,
        name: true,
        whatsappNumber: true,
        tasks: {
          where: {
            deletedAt: null,
            deadline: {
              gte: startOfDayUtc,
              lte: endOfDayUtc,
            },
          },
          select: {
            title: true,
            deadline: true,
            status: true,
          },
          orderBy: {
            deadline: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const reminders: DailyScheduleReminder[] = [];

    for (const user of users) {
      const number = user.whatsappNumber?.trim();
      if (!number) continue;

      const existing = await prisma.reminder.findFirst({
        where: {
          id: `${reminderKey}:${user.id}`,
          userId: user.id,
          taskId: null,
          sent: true,
        },
        select: { id: true },
      });
      if (existing) continue;

      const dateLabel = startOfDayUtc.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      });
      const userName = user.name ? `, ${user.name}` : '';
      const taskLines = user.tasks.map((task, index) => {
        const timeLabel = new Date(task.deadline).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta',
        });

        return [
          `${index + 1}. ${task.title}`,
          `   - Jam: ${timeLabel} WIB`,
          `   - Status: ${task.status}`,
        ].join('\n');
      });

      const caption = user.tasks.length > 0
        ? [
            `Selamat pagi${userName}! Ini jadwal Anda untuk hari ini, ${dateLabel}.`,
            '',
            'Jadwal hari ini:',
            ...taskLines,
            '',
            'Tetap fokus dan kerjakan sesuai urutan prioritas.',
            '',
            `"${quote}"`,
          ].join('\n')
        : [
            `Selamat pagi${userName}! Hari ini belum ada jadwal yang tercatat.`,
            '',
            'Yuk buat task baru agar hari Anda tetap terarah.',
            '',
            'Panduan singkat:',
            '- daftar akun WA: user_id daftar',
            '- lihat bantuan: task bantuan',
            '- contoh tambah task: task tambah meeting besok jam 10 malam #urgent',
            '- lihat task aktif: task lihat jadwal',
            '- lihat task besok: task lihat jadwal besok',
            '- overview: task overview',
            '',
            `"${quote}"`,
          ].join('\n');

      reminders.push({
        reminderKey,
        userId: user.id,
        nomor: number,
        lampiranPath: dailyImagePath,
        batches: buildDailyScheduleBatches(caption),
      });
    }

    return reminders;
  }

  async markDailyScheduleReminderSent(reminderKey: string, userId: string, sentAt: Date = new Date()) {
    const reminderId = `${reminderKey}:${userId}`;

    await prisma.reminder.upsert({
      where: { id: reminderId },
      update: {
        sent: true,
        sentAt,
      },
      create: {
        id: reminderId,
        userId,
        taskId: null,
        remindAt: sentAt,
        sent: true,
        sentAt,
      },
    });
  }

  async markSkippedNotificationSent(taskId: string) {
    await prisma.task.update({
      where: { id: taskId },
      data: { skippedNotificationSent: true },
    });
  }

  async calculateTaskPriority(userId: string, taskId: string) {
    const task = await this.getTaskById(userId, taskId);

    const score = calculatePriorityScore({
      deadline: task.deadline,
      priority: task.priority as 'HIGH' | 'MEDIUM' | 'LOW',
      reminderTime: task.reminderTime,
      estimatedDuration: task.estimatedDuration || 60,
    });

    return { taskId, score };
  }
}