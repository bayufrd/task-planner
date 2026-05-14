import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthRequest } from '../../middleware/auth';

export const refreshCalendar = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
  }

  try {
    // Check if calendar exists and belongs to user
    const calendar = await prisma.calendar.findFirst({
      where: { id: String(id), userId: String(userId) },
    });

    if (!calendar) {
      return res.status(404).json({
        success: false,
        error: { code: 'CALENDAR_NOT_FOUND', message: 'Calendar not found or not owned by user' },
      });
    }

    // Simulate refresh logic (placeholder for actual Google Calendar sync)
    const refreshedCalendar = await prisma.calendar.update({
      where: { id },
      data: { lastSyncedAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      data: refreshedCalendar,
      message: 'Calendar refresh initiated',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while refreshing the calendar' },
    });
  }
};

export { authenticate };
