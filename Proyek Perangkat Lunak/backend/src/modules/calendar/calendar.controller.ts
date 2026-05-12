import { Request, Response, NextFunction } from 'express';
import { calendarService } from './calendar.service';
import { successResponse } from '../../lib/response';

export class CalendarController {
  async createCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const calendar = await calendarService.createCalendar(userId, req.body);
      
      successResponse(res, calendar, 'Calendar created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getCalendars(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const calendars = await calendarService.getCalendars(userId);
      
      successResponse(res, calendars);
    } catch (error) {
      next(error);
    }
  }

  async getCalendarById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const calendar = await calendarService.getCalendarById(userId, String(id));
      
      successResponse(res, calendar);
    } catch (error) {
      next(error);
    }
  }

  async updateCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const calendar = await calendarService.updateCalendar(userId, String(id), req.body);
      
      successResponse(res, calendar, 'Calendar updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await calendarService.deleteCalendar(userId, String(id));
      
      successResponse(res, null, 'Calendar deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async syncCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await calendarService.syncCalendar(userId, req.body);
      
      successResponse(res, result, 'Calendar synced successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDefaultCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const calendar = await calendarService.getDefaultCalendar(userId);
      
      successResponse(res, calendar);
    } catch (error) {
      next(error);
    }
  }
}

export const calendarController = new CalendarController();