import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/ApiError.js';
import { ROLES, canPerform } from '../constants/roles.js';
import { createDocumentPayload, createVersionSnapshot } from '../models/document.model.js';
import {
  COLLECTIONS,
  getDocumentsCollection,
  getDocumentRef,
  getFirestoreDb,
  getVersionsCollection,
  isFirestoreConnected,
} from './firestore.placeholder.js';

// In-memory store until Firestore is connected
const documents = new Map();
const versionHistory = new Map();

function getVersions(docId) {
  if (!versionHistory.has(docId)) {
    versionHistory.set(docId, []);
  }
  return versionHistory.get(docId);
}

function prepareDocumentResponse(doc, userId) {
  return {
    ...doc,
    role:
      doc.ownerId === userId
        ? ROLES.OWNER
        : doc.collaborators?.find((c) => c.userId === userId)?.role || ROLES.VIEWER,
  };
}

async function fetchDocumentSnapshot(docId) {
  const docRef = getDocumentRef(docId);
  return docRef.get();
}

export const documentService = {
  async listByUser(userId, { search = '', limit = 50 } = {}) {
    const query = search.toLowerCase().trim();

    if (isFirestoreConnected()) {
      const documentsById = new Map();
      const docsCollection = getDocumentsCollection();

      const [ownerSnapshot, memberSnapshot] = await Promise.all([
        docsCollection.where('ownerId', '==', userId).get(),
        docsCollection.where('memberIds', 'array-contains', userId).get(),
      ]);

      ownerSnapshot.forEach((docSnap) => {
        documentsById.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
      });
      memberSnapshot.forEach((docSnap) => {
        documentsById.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
      });

      const items = Array.from(documentsById.values())
        .filter((doc) => !query || doc.title.toLowerCase().includes(query))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, limit)
        .map((doc) => prepareDocumentResponse(doc, userId));

      return items;
    }

    const items = Array.from(documents.values())
      .filter(
        (doc) =>
          doc.ownerId === userId ||
          doc.collaborators.some((c) => c.userId === userId),
      )
      .filter((doc) => !query || doc.title.toLowerCase().includes(query))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit)
      .map((doc) => prepareDocumentResponse(doc, userId));

    return items;
  },

  async getById(docId, userId) {
    if (isFirestoreConnected()) {
      const snapshot = await fetchDocumentSnapshot(docId);
      if (!snapshot.exists) throw ApiError.notFound('Document not found');
      const doc = { id: snapshot.id, ...snapshot.data() };
      const role = this.resolveRole(doc, userId);
      if (!role) throw ApiError.forbidden('You do not have access to this document');
      return { ...doc, role };
    }

    const doc = documents.get(docId);
    if (!doc) throw ApiError.notFound('Document not found');
    const role = this.resolveRole(doc, userId);
    if (!role) throw ApiError.forbidden('You do not have access to this document');
    return { ...doc, role };
  },

  resolveRole(doc, userId) {
    if (doc.ownerId === userId) return ROLES.OWNER;
    const collab = doc.collaborators?.find((c) => c.userId === userId);
    return collab?.role || null;
  },

  async create(userId, { title } = {}) {
    const id = uuidv4();
    const doc = createDocumentPayload({
      id,
      title: title || 'Untitled Document',
      ownerId: userId,
      role: ROLES.OWNER,
    });

    if (isFirestoreConnected()) {
      const docRef = getDocumentRef(id);
      await docRef.set(doc);
      const version = createVersionSnapshot(doc, userId);
      await getVersionsCollection(id).doc(version.id).set(version);
      return { ...doc, role: ROLES.OWNER, storage: 'firestore' };
    }

    documents.set(id, doc);
    getVersions(id).push(createVersionSnapshot(doc, userId));
    return { ...doc, role: ROLES.OWNER, storage: 'memory' };
  },

  async update(docId, userId, updates) {
    const now = new Date().toISOString();

    if (isFirestoreConnected()) {
      const snapshot = await fetchDocumentSnapshot(docId);
      if (!snapshot.exists) throw ApiError.notFound('Document not found');
      const doc = { id: snapshot.id, ...snapshot.data() };
      const role = this.resolveRole(doc, userId);
      if (!canPerform(role, 'write')) throw ApiError.forbidden('Viewer cannot edit this document');

      const changes = {};
      if (updates.title !== undefined) {
        if (!canPerform(role, 'rename') && role !== ROLES.EDITOR) {
          // editors can rename in this app; viewers cannot
        }
        changes.title = updates.title;
      }

      let versionSnapshot = null;
      if (updates.content !== undefined) {
        changes.content = updates.content;
        changes.version = (doc.version || 0) + 1;
        versionSnapshot = createVersionSnapshot({ ...doc, ...changes }, userId);
      }

      changes.updatedAt = now;
      changes.lastEditedBy = userId;

      await getDocumentRef(docId).update(changes);
      if (versionSnapshot) {
        await getVersionsCollection(docId).doc(versionSnapshot.id).set(versionSnapshot);
      }

      return { ...doc, ...changes, role };
    }

    const doc = documents.get(docId);
    if (!doc) throw ApiError.notFound('Document not found');
    const role = this.resolveRole(doc, userId);
    if (!canPerform(role, 'write')) throw ApiError.forbidden('Viewer cannot edit this document');

    if (updates.title !== undefined) {
      if (!canPerform(role, 'rename') && role !== ROLES.EDITOR) {
        // editors can rename in this app; viewers cannot
      }
      doc.title = updates.title;
    }

    if (updates.content !== undefined) {
      doc.content = updates.content;
      doc.version += 1;
      getVersions(docId).push(createVersionSnapshot(doc, userId));
    }

    doc.updatedAt = now;
    doc.lastEditedBy = userId;
    documents.set(docId, doc);
    return { ...doc, role };
  },

  async rename(docId, userId, title) {
    return this.update(docId, userId, { title });
  },

  async delete(docId, userId) {
    if (isFirestoreConnected()) {
      const snapshot = await fetchDocumentSnapshot(docId);
      if (!snapshot.exists) throw ApiError.notFound('Document not found');
      const doc = { id: snapshot.id, ...snapshot.data() };
      const role = this.resolveRole(doc, userId);
      if (!canPerform(role, 'delete')) throw ApiError.forbidden('Only the owner can delete this document');

      const db = getFirestoreDb();
      const batch = db.batch();
      const versionSnapshot = await getVersionsCollection(docId).get();
      versionSnapshot.forEach((versionDoc) => batch.delete(versionDoc.ref));
      batch.delete(getDocumentRef(docId));
      await batch.commit();
      return { id: docId, deleted: true };
    }

    const doc = documents.get(docId);
    if (!doc) throw ApiError.notFound('Document not found');
    const role = this.resolveRole(doc, userId);
    if (!canPerform(role, 'delete')) throw ApiError.forbidden('Only the owner can delete this document');
    documents.delete(docId);
    versionHistory.delete(docId);
    return { id: docId, deleted: true };
  },

  async getVersions(docId, userId) {
    await this.getById(docId, userId);

    if (isFirestoreConnected()) {
      const snapshot = await getVersionsCollection(docId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    }

    return getVersions(docId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async restoreVersion(docId, userId, versionId) {
    const doc = await this.getById(docId, userId);
    const role = doc.role;
    if (!canPerform(role, 'write')) throw ApiError.forbidden('Cannot restore version as viewer');

    if (isFirestoreConnected()) {
      const versionSnapshot = await getVersionsCollection(docId).doc(versionId).get();
      if (!versionSnapshot.exists) throw ApiError.notFound('Version not found');
      const version = { id: versionSnapshot.id, ...versionSnapshot.data() };
      return this.update(docId, userId, {
        content: version.content,
        title: version.title,
      });
    }

    const versions = getVersions(docId);
    const snapshot = versions.find((v) => v.id === versionId);
    if (!snapshot) throw ApiError.notFound('Version not found');

    return this.update(docId, userId, {
      content: snapshot.content,
      title: snapshot.title,
    });
  },

  // Used by socket layer for live sync persistence
  async getRaw(docId) {
    if (isFirestoreConnected()) {
      const snapshot = await fetchDocumentSnapshot(docId);
      return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
    }
    return documents.get(docId) || null;
  },

  async applyContent(docId, userId, content) {
    const now = new Date().toISOString();

    if (isFirestoreConnected()) {
      const snapshot = await fetchDocumentSnapshot(docId);
      if (!snapshot.exists) return null;
      const doc = { id: snapshot.id, ...snapshot.data() };
      const role = this.resolveRole(doc, userId);
      if (!canPerform(role, 'write')) return null;

      const updates = {
        content,
        updatedAt: now,
        lastEditedBy: userId,
      };
      await getDocumentRef(docId).update(updates);
      return { ...doc, ...updates };
    }

    const doc = documents.get(docId);
    if (!doc) return null;
    const role = this.resolveRole(doc, userId);
    if (!canPerform(role, 'write')) return null;
    doc.content = content;
    doc.updatedAt = now;
    doc.lastEditedBy = userId;
    documents.set(docId, doc);
    return doc;
  },
};

export default documentService;
