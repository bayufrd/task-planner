import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { sendSuccess } from '../../lib/response';
import { AiService } from './ai.service';

const aiService = new AiService();

export class AiController {
  async parseTaskCommand(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const command = typeof req.body?.command === 'string' ? req.body.command.trim() : '';

      if (!command) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Command is required',
          },
        });
        return;
      }

      if (command.length > 1000) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Command is too long',
          },
        });
        return;
      }

      const parsed = await aiService.parseTaskCommand(command);
      sendSuccess(res, parsed, 'Task command parsed successfully');
    } catch (error) {
      next(error);
    }
  }

  async analyzeOverview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User ID not found',
          },
        });
        return;
      }

      const { stats, dailyData } = req.body;

      if (!stats || !dailyData) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Stats and dailyData are required',
          },
        });
        return;
      }

      const analysis = await aiService.analyzeOverview(req.userId, stats, dailyData);
      sendSuccess(res, analysis, 'Overview analysis completed');
    } catch (error) {
      next(error);
    }
  }
}
