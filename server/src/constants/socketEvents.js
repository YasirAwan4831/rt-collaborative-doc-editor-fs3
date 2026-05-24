export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Document room
  DOC_JOIN: 'document:join',
  DOC_LEAVE: 'document:leave',
  DOC_JOINED: 'document:joined',
  DOC_LEFT: 'document:left',
  DOC_STATE: 'document:state',
  DOC_UPDATE: 'document:update',
  DOC_UPDATED: 'document:updated',
  DOC_SAVE: 'document:save',
  DOC_SAVED: 'document:saved',

  // Presence
  PRESENCE_UPDATE: 'presence:update',
  PRESENCE_SYNC: 'presence:sync',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',

  // Typing & cursors
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  TYPING_SYNC: 'typing:sync',
  CURSOR_UPDATE: 'cursor:update',
  CURSOR_SYNC: 'cursor:sync',

  // Errors
  ERROR: 'error',
};

export default SOCKET_EVENTS;
