/**
 * Socket layer entry — re-exports socket service for consistent imports.
 * Usage: import { socketService } from '@/sockets'
 */
export { socketService } from '../services/socket/socketService.js';
export { SOCKET_EVENTS } from '../constants/socketEvents.js';
