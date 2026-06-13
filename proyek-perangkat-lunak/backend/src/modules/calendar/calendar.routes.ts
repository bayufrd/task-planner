import { Router } from 'express';
import { calendarController } from './calendar.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createCalendarSchema, updateCalendarSchema, syncCalendarSchema } from './calendar.validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createCalendarSchema), calendarController.createCalendar);
router.get('/', calendarController.getCalendars);
router.get('/default', calendarController.getDefaultCalendar);
router.post('/sync', validate(syncCalendarSchema), calendarController.syncCalendar);
router.get('/:id', calendarController.getCalendarById);
router.patch('/:id', validate(updateCalendarSchema), calendarController.updateCalendar);
router.delete('/:id', calendarController.deleteCalendar);

export default router;