import { Router } from 'express';
import { TaskController } from './task.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from './task.validation';

const router = Router();
const taskController = new TaskController();

// All routes require authentication
router.use(authenticate);

router.get('/', taskController.getTasks);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/stats', taskController.getTaskStats);
router.get('/stats/daily', taskController.getDailyStats);
router.get('/stats/weekly', taskController.getWeeklyStats);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
router.patch('/:id/status', validate(updateTaskStatusSchema), taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/priority', taskController.calculatePriority);

export default router;