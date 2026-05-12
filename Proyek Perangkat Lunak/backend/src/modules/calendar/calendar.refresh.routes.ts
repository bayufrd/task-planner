import { Router } from 'express';
import { refreshCalendar } from './calendar.refresh.controller';

const router = Router();

// POST /api/calendar/:id/refresh
router.post('/:id/refresh', refreshCalendar);

export default router;
