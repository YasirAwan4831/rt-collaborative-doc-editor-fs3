import { body, param, query } from 'express-validator';

export const createDocumentRules = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
];

export const updateDocumentRules = [
  param('id').isUUID().withMessage('Invalid document ID'),
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('content').optional().isString(),
];

export const documentIdParam = [param('id').isUUID().withMessage('Invalid document ID')];

export const searchQueryRules = [
  query('search').optional().trim().isLength({ max: 100 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

export const restoreVersionRules = [
  param('id').isUUID(),
  param('versionId').notEmpty(),
];

export default {
  createDocumentRules,
  updateDocumentRules,
  documentIdParam,
  searchQueryRules,
  restoreVersionRules,
};
