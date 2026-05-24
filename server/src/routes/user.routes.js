import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getProfile);
router.patch(
  '/me',
  [
    body('displayName').optional().trim().isLength({ min: 1, max: 80 }),
    body('photoURL').optional().isURL(),
  ],
  validate,
  userController.updateProfile,
);

export default router;
