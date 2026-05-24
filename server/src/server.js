import http from 'http';
import app from './app.js';
import config from './config/index.js';
import { initializeFirebase } from './config/firebase.js';
import { initializeSocket } from './sockets/index.js';

initializeFirebase();

const httpServer = http.createServer(app);
initializeSocket(httpServer);

httpServer.listen(config.port, () => {
  console.info(`
  ╔══════════════════════════════════════════════════╗
  ║  RT Collaborative Doc Editor — API Server        ║
  ╠══════════════════════════════════════════════════╣
  ║  Environment: ${config.env.padEnd(33)}║
  ║  Port:        ${String(config.port).padEnd(33)}║
  ║  Client URL:  ${config.clientUrl.padEnd(33)}║
  ║  Auth Mode:   ${(config.authDevMode ? 'development' : 'firebase').padEnd(33)}║
  ╚══════════════════════════════════════════════════╝
  `);
});

export default httpServer;
