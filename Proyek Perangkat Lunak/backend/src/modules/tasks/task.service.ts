import { prisma } from '../../lib/prisma';
import { NotFoundError, ForbiddenError } from '../../lib/errors';
import { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput } from './task.validation';
import { calculatePriorityScore } from '../../utils/priority';
import { AiService } from '../ai/ai.service';

const aiService = new AiService();

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

    return tasks;
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

    return task;
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskInput) {
    await this.getTaskById(userId, taskId);

    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.deadline !== undefined) updateData.deadline = new Date(data.deadline);
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
        deadline: {
          lte: minimumOverdueDeadline,
        },
      },
      select: {
        id: true,
        deadline: true,
        estimatedDuration: true,
      },
    });

    const overdueTaskIds = candidates
      .filter((task) => {
        const toleranceMinutes = Math.max(task.estimatedDuration || 60, 60);
        const skippedAt = task.deadline.getTime() + toleranceMinutes * 60 * 1000;

        return skippedAt <= now.getTime();
      })
      .map((task) => task.id);

    if (overdueTaskIds.length === 0) {
      return { skipped: 0 };
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

    return { skipped: result.count };
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