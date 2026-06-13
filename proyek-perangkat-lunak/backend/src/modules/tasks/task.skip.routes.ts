import { Router } from 'express';
import { skipTask } from './task.skip.controller';

const router = Router();

// POST /api/tasks/:id/skip
router.post('/:id/skip', skipTask);

export default router;
