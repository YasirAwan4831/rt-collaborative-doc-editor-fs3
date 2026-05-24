import { asyncHandler } from '../utils/asyncHandler.js';
import { documentService } from '../services/document.service.js';

export const listDocuments = asyncHandler(async (req, res) => {
  const { search, limit } = req.query;
  const documents = await documentService.listByUser(req.user.uid, {
    search,
    limit: limit ? parseInt(limit, 10) : 50,
  });
  res.json({ success: true, data: documents, count: documents.length });
});

export const getDocument = asyncHandler(async (req, res) => {
  const doc = await documentService.getById(req.params.id, req.user.uid);
  res.json({ success: true, data: doc });
});

export const createDocument = asyncHandler(async (req, res) => {
  const doc = await documentService.create(req.user.uid, req.body);
  res.status(201).json({ success: true, data: doc });
});

export const updateDocument = asyncHandler(async (req, res) => {
  const doc = await documentService.update(req.params.id, req.user.uid, req.body);
  res.json({ success: true, data: doc });
});

export const renameDocument = asyncHandler(async (req, res) => {
  const doc = await documentService.rename(req.params.id, req.user.uid, req.body.title);
  res.json({ success: true, data: doc });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const result = await documentService.delete(req.params.id, req.user.uid);
  res.json({ success: true, data: result });
});

export const getVersionHistory = asyncHandler(async (req, res) => {
  const versions = await documentService.getVersions(req.params.id, req.user.uid);
  res.json({ success: true, data: versions });
});

export const restoreVersion = asyncHandler(async (req, res) => {
  const doc = await documentService.restoreVersion(req.params.id, req.user.uid, req.params.versionId);
  res.json({ success: true, data: doc, message: 'Version restored (placeholder — connect Firestore for persistence)' });
});

export default {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  renameDocument,
  deleteDocument,
  getVersionHistory,
  restoreVersion,
};
