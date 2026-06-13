import { Router } from 'express';
import { reminderController } from './reminder.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createReminderSchema, updateReminderSchema } from './reminder.validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createReminderSchema), reminderController.createReminder);
router.get('/', reminderController.getReminders);
router.get('/due', reminderController.getDueReminders);
router.get('/:id', reminderController.getReminderById);
router.patch('/:id', validate(updateReminderSchema), reminderController.updateReminder);
router.delete('/:id', reminderController.deleteReminder);

export default router;