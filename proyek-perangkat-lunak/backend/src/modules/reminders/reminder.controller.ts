import { Request, Response, NextFunction } from 'express';
import { reminderService } from './reminder.service';
import { successResponse } from '../../lib/response';

export class ReminderController {
  async createReminder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const reminder = await reminderService.createReminder(userId, req.body);
      
      successResponse(res, reminder, 'Reminder created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getReminders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { sent, upcoming } = req.query;

      const filters: any = {};
      if (sent !== undefined) {
        filters.sent = sent === 'true';
      }
      if (upcoming === 'true') {
        filters.upcoming = true;
      }

      const reminders = await reminderService.getReminders(userId, filters);
      
      successResponse(res, reminders);
    } catch (error) {
      next(error);
    }
  }

  async getReminderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const reminder = await reminderService.getReminderById(userId, String(id));
      
      successResponse(res, reminder);
    } catch (error) {
      next(error);
    }
  }

  async updateReminder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const reminder = await reminderService.updateReminder(userId, String(id), req.body);
      
      successResponse(res, reminder, 'Reminder updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteReminder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await reminderService.deleteReminder(userId, String(id));
      
      successResponse(res, null, 'Reminder deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDueReminders(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reminders = await reminderService.getDueReminders();
      
      successResponse(res, reminders);
    } catch (error) {
      next(error);
    }
  }
}

export const reminderController = new ReminderController();