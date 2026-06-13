import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthRequest } from '../../middleware/auth';

export const skipTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
  }

  try {
    // Check if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: { id: String(id), userId: String(userId) },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found or not owned by user' },
      });
    }

    // Update task status to SKIPPED
    const updatedTask = await prisma.task.update({
      where: { id: String(id) },
      data: { status: 'SKIPPED' },
    });

    return res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task successfully skipped',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while skipping the task' },
    });
  }
};

export { authenticate };
