import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as documentController from '../controllers/document.controller.js';
import {
  createDocumentRules,
  updateDocumentRules,
  documentIdParam,
  searchQueryRules,
  restoreVersionRules,
} from '../validators/document.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', searchQueryRules, validate, documentController.listDocuments);
router.post('/', createDocumentRules, validate, documentController.createDocument);
router.get('/:id', documentIdParam, validate, documentController.getDocument);
router.patch('/:id', updateDocumentRules, validate, documentController.updateDocument);
router.patch(
  '/:id/rename',
  [...documentIdParam, body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title required')],
  validate,
  documentController.renameDocument,
);
router.delete('/:id', documentIdParam, validate, documentController.deleteDocument);
router.get('/:id/versions', documentIdParam, validate, documentController.getVersionHistory);
router.post('/:id/versions/:versionId/restore', restoreVersionRules, validate, documentController.restoreVersion);

export default router;
