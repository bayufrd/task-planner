import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { sendSuccess } from '../../lib/response';
import { AiService } from './ai.service';
import { TaskService } from '../tasks/task.service';
import { calculateAdaptiveBehavior } from '../../utils/behavior-engine';

const aiService = new AiService();
const taskService = new TaskService();

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

  /**
   * Adaptive Behavior Analysis for VueJS Frontend
   * Returns only score and level, frontend handles image/color
   */
  async getAdaptiveBehaviorVuejs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User ID not found' },
        });
        return;
      }

      // Fetch user data directly from database
      const [stats, dailyStats, weeklyStats] = await Promise.all([
        taskService.getTaskStats(req.userId),
        taskService.getDailyTaskStats(req.userId, 30),
        taskService.getWeeklyTaskStats(req.userId, 12),
      ]);

      // Transform to match behavior engine format
      const transformedDaily = dailyStats.map((d: any) => ({ date: d.date, completed: d.count || 0, created: 0 }));
      const transformedWeekly = weeklyStats.map((w: any) => ({ week: w.week, completed: w.count || 0, created: 0 }));

      // Calculate adaptive behavior using pure logic engine
      const analysis = calculateAdaptiveBehavior(stats, transformedDaily, transformedWeekly);

      // Return only score and level for frontend
      sendSuccess(res, {
        score: analysis.score,
        level: analysis.level,
        stats: analysis.stats,
        insights: analysis.insights,
        advice: analysis.advice,
      }, 'Adaptive behavior analysis completed');
    } catch (error) {
      next(error);
    }
  }
}
