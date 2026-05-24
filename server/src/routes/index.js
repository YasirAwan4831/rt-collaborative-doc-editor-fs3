import { Router } from 'express';
import healthRoutes from './health.routes.js';
import documentRoutes from './document.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/documents', documentRoutes);
router.use('/users', userRoutes);

export default router;
