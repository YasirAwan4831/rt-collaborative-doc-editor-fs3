import { SOCKET_EVENTS } from '../constants/socketEvents.js';
import { documentService } from '../services/document.service.js';
import { ROLES, canPerform } from '../constants/roles.js';
import {
  addUserToRoom,
  removeUserFromRoom,
  getPresenceList,
} from './presence.socket.js';

const typingUsers = new Map();

function getTypingSet(documentId) {
  if (!typingUsers.has(documentId)) typingUsers.set(documentId, new Set());
  return typingUsers.get(documentId);
}

export function registerDocumentHandlers(io, socket) {
  const { user } = socket;

  socket.on(SOCKET_EVENTS.DOC_JOIN, async ({ documentId }) => {
    try {
      const doc = await documentService.getById(documentId, user.uid);
      const room = `doc:${documentId}`;
      await socket.join(room);

      const presenceUser = {
        socketId: socket.id,
        userId: user.uid,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL,
        role: doc.role,
        status: 'online',
        isTyping: false,
        cursor: null,
        color: hashColor(user.uid),
        joinedAt: Date.now(),
      };

      addUserToRoom(documentId, presenceUser);

      socket.data.documentId = documentId;
      socket.data.role = doc.role;

      socket.emit(SOCKET_EVENTS.DOC_JOINED, {
        document: doc,
        collaborators: getPresenceList(documentId),
      });

      socket.to(room).emit(SOCKET_EVENTS.USER_ONLINE, presenceUser);
      io.to(room).emit(SOCKET_EVENTS.PRESENCE_SYNC, getPresenceList(documentId));
    } catch (error) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: error.message || 'Failed to join document' });
    }
  });

  socket.on(SOCKET_EVENTS.DOC_LEAVE, ({ documentId }) => {
    leaveDocument(io, socket, documentId);
  });

  socket.on(SOCKET_EVENTS.DOC_UPDATE, ({ documentId, content, title }) => {
    const role = socket.data.role;
    if (!canPerform(role, 'write')) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Viewer cannot edit' });
    }

    documentService.applyContent(documentId, user.uid, content);
    socket.to(`doc:${documentId}`).emit(SOCKET_EVENTS.DOC_UPDATED, {
      documentId,
      content,
      title,
      updatedBy: user.uid,
      updatedAt: new Date().toISOString(),
    });
  });

  socket.on(SOCKET_EVENTS.DOC_SAVE, async ({ documentId, content }) => {
    const role = socket.data.role;
    if (!canPerform(role, 'write')) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Viewer cannot save' });
    }
    try {
      await documentService.update(documentId, user.uid, { content });
      socket.emit(SOCKET_EVENTS.DOC_SAVED, { documentId, savedAt: new Date().toISOString() });
      io.to(`doc:${documentId}`).emit(SOCKET_EVENTS.DOC_SAVED, {
        documentId,
        savedBy: user.uid,
        savedAt: new Date().toISOString(),
      });
    } catch (error) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
    }
  });

  socket.on(SOCKET_EVENTS.TYPING_START, ({ documentId }) => {
    if (!canPerform(socket.data.role, 'write')) return;
    const set = getTypingSet(documentId);
    set.add(user.uid);
    socket.to(`doc:${documentId}`).emit(SOCKET_EVENTS.TYPING_SYNC, {
      documentId,
      typingUsers: Array.from(set),
    });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, ({ documentId }) => {
    const set = getTypingSet(documentId);
    set.delete(user.uid);
    socket.to(`doc:${documentId}`).emit(SOCKET_EVENTS.TYPING_SYNC, {
      documentId,
      typingUsers: Array.from(set),
    });
  });

  socket.on(SOCKET_EVENTS.CURSOR_UPDATE, ({ documentId, cursor }) => {
    socket.to(`doc:${documentId}`).emit(SOCKET_EVENTS.CURSOR_SYNC, {
      documentId,
      userId: user.uid,
      displayName: user.displayName,
      color: hashColor(user.uid),
      cursor,
    });
  });

  socket.on('disconnecting', () => {
    const documentId = socket.data.documentId;
    if (documentId) leaveDocument(io, socket, documentId);
  });
}

function leaveDocument(io, socket, documentId) {
  const room = `doc:${documentId}`;
  const remaining = removeUserFromRoom(documentId, socket.id);
  socket.leave(room);
  socket.to(room).emit(SOCKET_EVENTS.USER_OFFLINE, { userId: socket.user.uid, socketId: socket.id });
  io.to(room).emit(SOCKET_EVENTS.PRESENCE_SYNC, remaining);
  socket.data.documentId = null;
}

function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 55%)`;
}

export default registerDocumentHandlers;
