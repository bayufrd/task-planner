import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { TaskService } from './task.service';
import { sendSuccess } from '../../lib/response';
import { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput } from './task.validation';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const data: CreateTaskInput = req.body;
      const task = await taskService.createTask(req.userId, data);
      sendSuccess(res, task, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const status = req.query.status as string | undefined;
      const tasks = await taskService.getTasks(req.userId, status);
      sendSuccess(res, tasks);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const task = await taskService.getTaskById(req.userId, String(req.params.id));
      sendSuccess(res, task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const data: UpdateTaskInput = req.body;
      const task = await taskService.updateTask(req.userId, String(req.params.id), data);
      sendSuccess(res, task, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTaskStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const data: UpdateTaskStatusInput = req.body;
      const task = await taskService.updateTaskStatus(req.userId, String(req.params.id), data);
      sendSuccess(res, task, 'Task status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const result = await taskService.deleteTask(req.userId, String(req.params.id));
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getTaskStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const stats = await taskService.getTaskStats(req.userId);
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }

  async getDailyStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const stats = await taskService.getDailyTaskStats(req.userId, days);
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }

  async getWeeklyStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const weeks = req.query.weeks ? parseInt(req.query.weeks as string, 10) : 12;
      const stats = await taskService.getWeeklyTaskStats(req.userId, weeks);
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }

  async calculatePriority(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new Error('User ID not found');
      const result = await taskService.calculateTaskPriority(req.userId, String(req.params.id));
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}