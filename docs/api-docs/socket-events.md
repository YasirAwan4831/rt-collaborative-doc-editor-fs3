# Socket.io Events

Connection auth: `socket.handshake.auth.token`

## Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `document:join` | `{ documentId }` | Join document room |
| `document:leave` | `{ documentId }` | Leave document room |
| `document:update` | `{ documentId, content, title? }` | Broadcast content change |
| `document:save` | `{ documentId, content }` | Persist document |
| `typing:start` | `{ documentId }` | Typing indicator on |
| `typing:stop` | `{ documentId }` | Typing indicator off |
| `cursor:update` | `{ documentId, cursor }` | Cursor position (placeholder) |
| `presence:update` | `{ documentId, status, cursor }` | Presence heartbeat |

## Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `document:joined` | `{ document, collaborators }` | Join confirmation |
| `document:updated` | `{ documentId, content, updatedBy }` | Remote edit |
| `document:saved` | `{ documentId, savedAt }` | Save confirmation |
| `presence:sync` | `Collaborator[]` | Active users list |
| `user:online` | `Collaborator` | User joined |
| `user:offline` | `{ userId, socketId }` | User left |
| `typing:sync` | `{ documentId, typingUsers }` | Who is typing |
| `cursor:sync` | `{ documentId, userId, cursor }` | Remote cursor |
| `error` | `{ message }` | Error notification |
