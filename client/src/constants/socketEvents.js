export const SOCKET_EVENTS = {
  DOC_JOIN: 'document:join',
  DOC_LEAVE: 'document:leave',
  DOC_JOINED: 'document:joined',
  DOC_UPDATE: 'document:update',
  DOC_UPDATED: 'document:updated',
  DOC_SAVE: 'document:save',
  DOC_SAVED: 'document:saved',
  PRESENCE_SYNC: 'presence:sync',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  TYPING_SYNC: 'typing:sync',
  CURSOR_UPDATE: 'cursor:update',
  CURSOR_SYNC: 'cursor:sync',
  ERROR: 'error',
};

export default SOCKET_EVENTS;
