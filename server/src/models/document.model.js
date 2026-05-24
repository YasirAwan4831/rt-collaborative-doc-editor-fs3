/**
 * Document schema shape — mirrors intended Firestore structure.
 * Connect firestore.service.js to persist these fields when Firebase is ready.
 */
export function createDocumentPayload(data) {
  const now = new Date().toISOString();
  const collaborators = data.collaborators || [];
  const memberIds = Array.from(
    new Set([data.ownerId, ...collaborators.map((collaborator) => collaborator.userId).filter(Boolean)]),
  );

  return {
    id: data.id,
    title: data.title || 'Untitled Document',
    content: data.content || '<p></p>',
    ownerId: data.ownerId,
    collaborators,
    memberIds,
    role: data.role || 'editor',
    isArchived: data.isArchived ?? false,
    version: data.version ?? 1,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    lastEditedBy: data.lastEditedBy || data.ownerId,
  };
}

export function createVersionSnapshot(doc, editedBy) {
  return {
    id: `v-${doc.version}-${Date.now()}`,
    documentId: doc.id,
    version: doc.version,
    title: doc.title,
    content: doc.content,
    editedBy,
    createdAt: new Date().toISOString(),
  };
}

export default { createDocumentPayload, createVersionSnapshot };
