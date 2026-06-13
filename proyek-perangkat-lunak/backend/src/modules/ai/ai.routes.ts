import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { AiController } from './ai.controller';

const router = Router();
const aiController = new AiController();

router.use(authenticate);
router.post('/parse-task', aiController.parseTaskCommand);
router.post('/overview-analysis', aiController.analyzeOverview);

export default router;
