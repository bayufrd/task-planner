import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { AiController } from './ai.controller';

const router = Router();
const aiController = new AiController();

router.use(authenticate);
router.post('/parse-task', aiController.parseTaskCommand);
router.post('/overview-analysis', aiController.analyzeOverview);

// Adaptive behavior endpoint for VueJS frontend (no AI external required)
router.get('/adaptive-behavior-vuejs', aiController.getAdaptiveBehaviorVuejs);

export default router;
