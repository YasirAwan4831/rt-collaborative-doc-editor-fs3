import { io } from 'socket.io-client';
import { env } from '../../config/env.js';
import { SOCKET_EVENTS } from '../../constants/socketEvents.js';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(env.socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => console.info('[Socket] Connected'));
    this.socket.on('disconnect', (reason) => console.info('[Socket] Disconnected:', reason));
    this.socket.on('connect_error', (err) => console.warn('[Socket] Connection error:', err.message));

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  joinDocument(documentId) {
    this.socket?.emit(SOCKET_EVENTS.DOC_JOIN, { documentId });
  }

  leaveDocument(documentId) {
    this.socket?.emit(SOCKET_EVENTS.DOC_LEAVE, { documentId });
  }

  sendUpdate(documentId, content, title) {
    this.socket?.emit(SOCKET_EVENTS.DOC_UPDATE, { documentId, content, title });
  }

  saveDocument(documentId, content) {
    this.socket?.emit(SOCKET_EVENTS.DOC_SAVE, { documentId, content });
  }

  startTyping(documentId) {
    this.socket?.emit(SOCKET_EVENTS.TYPING_START, { documentId });
  }

  stopTyping(documentId) {
    this.socket?.emit(SOCKET_EVENTS.TYPING_STOP, { documentId });
  }

  updateCursor(documentId, cursor) {
    this.socket?.emit(SOCKET_EVENTS.CURSOR_UPDATE, { documentId, cursor });
  }

  on(event, callback) {
    this.socket?.on(event, callback);
    const key = `${event}-${callback}`;
    this.listeners.set(key, { event, callback });
  }

  off(event, callback) {
    this.socket?.off(event, callback);
    this.listeners.delete(`${event}-${callback}`);
  }
}

export const socketService = new SocketService();
export default socketService;
