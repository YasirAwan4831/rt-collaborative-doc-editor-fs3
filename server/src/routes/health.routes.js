import { Router } from 'express';
import { isFirestoreConnected } from '../services/firestore.placeholder.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    firestore: isFirestoreConnected() ? 'connected' : 'placeholder',
  });
});

export default router;
