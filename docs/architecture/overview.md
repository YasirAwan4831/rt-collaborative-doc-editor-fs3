# Architecture Overview

## System Layers

```
┌─────────────────────────────────────────────────────────┐
│                    React Client (Vite)                   │
│  Pages → Components → Hooks → Services → Socket/API      │
└──────────────────────────┬──────────────────────────────┘
                           │
              REST (Express)     WebSocket (Socket.io)
                           │
┌──────────────────────────▼──────────────────────────────┐
│              Node.js + Express API Server                │
│  Routes → Controllers → Services → Models                │
│  Socket Handlers → Presence → Document Rooms             │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
     Firebase Auth (ready)      Firestore (placeholder)
```

## Frontend Modules

| Module | Responsibility |
|--------|----------------|
| `pages/` | Route-level views |
| `components/` | Reusable UI (auth, dashboard, editor, layout) |
| `context/` | Auth, theme, socket global state |
| `hooks/` | Document list, editor collaboration logic |
| `services/` | API client, Firebase auth, Socket.io |
| `config/` | Environment and Firebase initialization |

## Backend Modules

| Module | Responsibility |
|--------|----------------|
| `routes/` | REST endpoint definitions |
| `controllers/` | Request/response handling |
| `services/` | Business logic + in-memory store |
| `sockets/` | Real-time document sync and presence |
| `middleware/` | Auth, validation, errors |
| `models/` | Data shape contracts for Firestore migration |

## Firebase Integration Path

1. Add Firebase env vars on client and server
2. Set `AUTH_DEV_MODE=false`
3. Implement `firestore.placeholder.js` CRUD methods
4. Replace in-memory maps in `document.service.js`
