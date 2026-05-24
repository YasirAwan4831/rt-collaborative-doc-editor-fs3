# REST API Reference

Base URL: `http://localhost:5000/api/v1`

All protected routes require: `Authorization: Bearer <token>`

## Health

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/health` | No |

## Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents?search=&limit=` | List user documents |
| POST | `/documents` | Create document `{ title? }` |
| GET | `/documents/:id` | Get document |
| PATCH | `/documents/:id` | Update `{ title?, content? }` |
| PATCH | `/documents/:id/rename` | Rename `{ title }` |
| DELETE | `/documents/:id` | Delete (owner only) |
| GET | `/documents/:id/versions` | Version history |
| POST | `/documents/:id/versions/:versionId/restore` | Restore version |

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Current user profile |
| PATCH | `/users/me` | Update profile |
