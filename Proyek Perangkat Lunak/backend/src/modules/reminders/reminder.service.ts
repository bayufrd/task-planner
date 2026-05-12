import { prisma } from '../../lib/prisma';
import { CreateReminderInput, UpdateReminderInput } from './reminder.validation';
import { NotFoundError } from '../../lib/errors';

export class ReminderService {
  async createReminder(userId: string, data: CreateReminderInput) {
    const reminder = await prisma.reminder.create({
      data: {
        userId,
        taskId: data.taskId,
        remindAt: new Date(data.remindAt),
      },
      include: {
        task: true,
      },
    });

    return reminder;
  }

  async getReminders(userId: string, filters?: { sent?: boolean; upcoming?: boolean }) {
    const where: any = { userId };

    if (filters?.sent !== undefined) {
      where.sent = filters.sent;
    }

    if (filters?.upcoming) {
      where.remindAt = {
        gte: new Date(),
      };
      where.sent = false;
    }

    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        task: true,
      },
      orderBy: {
        remindAt: 'asc',
      },
    });

    return reminders;
  }

  async getReminderById(userId: string, reminderId: string) {
    const reminder = await prisma.reminder.findFirst({
      where: {
        id: reminderId,
        userId,
      },
      include: {
        task: true,
      },
    });

    if (!reminder) {
      throw new NotFoundError('Reminder not found');
    }

    return reminder;
  }

  async updateReminder(userId: string, reminderId: string, data: UpdateReminderInput) {
    const existing = await this.getReminderById(userId, reminderId);

    const updateData: any = {};

    if (data.remindAt) {
      updateData.remindAt = new Date(data.remindAt);
    }

    if (data.sent !== undefined) {
      updateData.sent = data.sent;
      if (data.sent) {
        updateData.sentAt = new Date();
      }
    }

    const reminder = await prisma.reminder.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        task: true,
      },
    });

    return reminder;
  }

  async deleteReminder(userId: string, reminderId: string) {
    const existing = await this.getReminderById(userId, reminderId);

    await prisma.reminder.delete({
      where: { id: existing.id },
    });

    return { success: true };
  }

  async markReminderAsSent(reminderId: string) {
    const reminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: {
        sent: true,
        sentAt: new Date(),
      },
    });

    return reminder;
  }

  async getDueReminders() {
    const now = new Date();

    const reminders = await prisma.reminder.findMany({
      where: {
        sent: false,
        remindAt: {
          lte: now,
        },
      },
      include: {
        task: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return reminders;
  }
}

export const reminderService = new ReminderService();