import { Server } from 'socket.io';
import config from '../config/index.js';
import { verifySocketToken } from '../helpers/socketAuth.js';
import { userService } from '../services/user.service.js';
import { registerDocumentHandlers } from './document.socket.js';
import { registerPresenceHandlers } from './presence.socket.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const decoded = await verifySocketToken(token);
      const profile = await userService.upsertFromAuth(decoded);
      socket.user = profile;
      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    console.info(`[Socket] Connected: ${socket.user?.uid} (${socket.id})`);

    registerDocumentHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.info(`[Socket] Disconnected: ${socket.user?.uid} — ${reason}`);
    });

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      console.warn('[Socket] Client error:', payload);
    });
  });

  return io;
}

export default initializeSocket;
