import { SOCKET_EVENTS } from '../constants/socketEvents.js';

const roomPresence = new Map();

function getRoomUsers(documentId) {
  if (!roomPresence.has(documentId)) {
    roomPresence.set(documentId, new Map());
  }
  return roomPresence.get(documentId);
}

export function addUserToRoom(documentId, user) {
  const users = getRoomUsers(documentId);
  users.set(user.socketId, user);
  return Array.from(users.values());
}

export function removeUserFromRoom(documentId, socketId) {
  const users = getRoomUsers(documentId);
  users.delete(socketId);
  if (users.size === 0) roomPresence.delete(documentId);
  return Array.from(users.values());
}

export function getPresenceList(documentId) {
  return Array.from(getRoomUsers(documentId).values());
}

export function registerPresenceHandlers(io, socket) {
  socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, ({ documentId, status, cursor }) => {
    const users = getRoomUsers(documentId);
    const existing = users.get(socket.id);
    if (existing) {
      users.set(socket.id, {
        ...existing,
        status: status || 'active',
        cursor,
        lastSeen: Date.now(),
      });
    }
    io.to(`doc:${documentId}`).emit(SOCKET_EVENTS.PRESENCE_SYNC, getPresenceList(documentId));
  });
}

export default { registerPresenceHandlers, getPresenceList, addUserToRoom, removeUserFromRoom };
