import { prisma } from '../../lib/prisma';
import { CreateCalendarInput, UpdateCalendarInput, SyncCalendarInput } from './calendar.validation';
import { NotFoundError, BadRequestError } from '../../lib/errors';

export class CalendarService {
  async createCalendar(userId: string, data: CreateCalendarInput) {
    if (data.isDefault) {
      await prisma.calendar.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const calendar = await prisma.calendar.create({
      data: {
        userId,
        calendarId: data.calendarId,
        name: data.name,
        description: data.description,
        type: data.type || 'personal',
        color: data.color || '#3B82F6',
        isDefault: data.isDefault || false,
      },
    });

    return calendar;
  }

  async getCalendars(userId: string) {
    const calendars = await prisma.calendar.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    return calendars;
  }

  async getCalendarById(userId: string, calendarId: string) {
    const calendar = await prisma.calendar.findFirst({
      where: {
        id: calendarId,
        userId,
      },
    });

    if (!calendar) {
      throw new NotFoundError('Calendar not found');
    }

    return calendar;
  }

  async updateCalendar(userId: string, calendarId: string, data: UpdateCalendarInput) {
    const existing = await this.getCalendarById(userId, calendarId);

    if (data.isDefault) {
      await prisma.calendar.updateMany({
        where: { userId, isDefault: true, id: { not: calendarId } },
        data: { isDefault: false },
      });
    }

    const calendar = await prisma.calendar.update({
      where: { id: existing.id },
      data,
    });

    return calendar;
  }

  async deleteCalendar(userId: string, calendarId: string) {
    const existing = await this.getCalendarById(userId, calendarId);

    if (existing.isDefault) {
      throw new BadRequestError('Cannot delete default calendar');
    }

    await prisma.calendar.delete({
      where: { id: existing.id },
    });

    return { success: true };
  }

  async syncCalendar(userId: string, data: SyncCalendarInput) {
    const calendar = await prisma.calendar.findFirst({
      where: {
        userId,
        calendarId: data.calendarId,
      },
    });

    if (!calendar) {
      throw new NotFoundError('Calendar not found');
    }

    let tasks;
    if (data.taskIds && data.taskIds.length > 0) {
      tasks = await prisma.task.findMany({
        where: {
          userId,
          id: { in: data.taskIds },
        },
      });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          userId,
          status: { not: 'DONE' },
        },
      });
    }

    const syncedTasks = [];
    for (const task of tasks) {
      const updated = await prisma.task.update({
        where: { id: task.id },
        data: {
          googleCalendarId: calendar.calendarId,
        },
      });
      syncedTasks.push(updated);
    }

    await prisma.calendar.update({
      where: { id: calendar.id },
      data: { isSynced: true },
    });

    return {
      calendar,
      syncedTasks,
      count: syncedTasks.length,
    };
  }

  async getDefaultCalendar(userId: string) {
    let calendar = await prisma.calendar.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });

    if (!calendar) {
      calendar = await prisma.calendar.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });
    }

    return calendar;
  }
}

export const calendarService = new CalendarService();