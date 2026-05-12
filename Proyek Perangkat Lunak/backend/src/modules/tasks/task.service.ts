import { prisma } from '../../lib/prisma';
import { NotFoundError, ForbiddenError } from '../../lib/errors';
import { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput } from './task.validation';
import { calculatePriorityScore } from '../../utils/priority';

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

    return this.getTaskById(userId, task.id);
  }

  async getTasks(userId: string, status?: string) {
    const where: any = { userId };
    
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

    return this.getTaskById(userId, taskId);
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

    return task;
  }

  async deleteTask(userId: string, taskId: string) {
    await this.getTaskById(userId, taskId);

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully' };
  }

  async getTaskStats(userId: string) {
    const [pending, done, skipped] = await Promise.all([
      prisma.task.count({ where: { userId, status: 'PENDING' } }),
      prisma.task.count({ where: { userId, status: 'DONE' } }),
      prisma.task.count({ where: { userId, status: 'SKIPPED' } }),
    ]);

    return { pending, done, skipped };
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