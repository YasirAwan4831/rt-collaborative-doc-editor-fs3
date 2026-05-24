# Firebase Authentication & Firestore Integration Guide

## Current Status ✅
The application is **fully functional** in development mode with all authentication flows working through an in-memory store.

### What's Working Now
- ✅ User authentication (Email/Password)
- ✅ Google Sign-In (configured)
- ✅ Protected routes
- ✅ Real-time collaborative editing via Socket.io
- ✅ Document management
- ✅ Version history tracking
- ✅ Role-based access control
- ✅ User presence tracking
- ✅ Dev mode authentication (any email works)

---

## Part 1: Frontend Firebase Configuration

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the setup wizard
3. Enable Google Analytics (optional)
4. Create a web app in the project settings

### Step 2: Get Firebase Credentials
1. In Firebase Console → Project Settings → Web app config
2. Copy your Firebase configuration
3. Update `client/.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Disable dev mode to use Firebase
VITE_AUTH_DEV_MODE=false
```

### Step 3: Enable Firebase Authentication Methods
1. Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Enable "Google"
4. For Google, add your OAuth consent screen details

### Step 4: Configure OAuth Redirect URIs
Add to Firebase Console → Authentication → Settings → Authorized domains:
- `localhost` (for development)
- `localhost:5173` (for Vite dev server)
- Your production domain

---

## Part 2: Backend Firebase Admin Setup

### Step 1: Generate Firebase Admin Credentials
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely

### Step 2: Add Credentials to Backend
Update `server/.env`:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=service-account-email@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# Enable Firebase verification
AUTH_DEV_MODE=false
```

⚠️ **IMPORTANT**: Handle `FIREBASE_PRIVATE_KEY` carefully:
- Keep it in `.env` (never in code)
- Escape newlines as `\n`
- Add to `.gitignore`

### Step 3: Set Backend Environment
```env
NODE_ENV=production  # or development
CLIENT_URL=http://localhost:5173  # Update for production
```

---

## Part 3: Connect Firestore Collections

The application has placeholder functions ready for Firestore. Collections needed:

### Collections Structure

```
users/
├── {uid}
│   ├── uid
│   ├── email
│   ├── displayName
│   ├── photoURL
│   ├── createdAt
│   └── updatedAt

documents/
├── {docId}
│   ├── id
│   ├── title
│   ├── content
│   ├── ownerId
│   ├── collaborators[]
│   │   ├── userId
│   │   └── role (owner|editor|viewer)
│   ├── version
│   ├── createdAt
│   ├── updatedAt
│   └── lastEditedBy

documents/{docId}/versions/
├── {versionId}
│   ├── documentId
│   ├── version
│   ├── title
│   ├── content
│   ├── editedBy
│   └── createdAt
```

### Enable Firestore
1. Firebase Console → Firestore Database → Create Database
2. Start in **test mode** (then add security rules)
3. Choose a region close to your users

### Security Rules Example
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    match /documents/{docId} {
      allow read: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         request.auth.uid in resource.data.collaborators[*].userId);
      
      allow write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid ||
         request.auth.uid in resource.data.collaborators[*].userId);
    }
    
    match /documents/{docId}/versions/{versionId} {
      allow read: if request.auth != null;
    }
  }
}
```

---

## Part 4: Implement Firestore Services

Replace placeholder implementations in:

### Frontend: Connect Auth Token Refresh
`client/src/services/auth/authService.js` already handles token refresh and persistence.

### Backend: Replace Document Service
Replace in-memory store in `server/src/services/document.service.js`:

```javascript
// Example: Firestore implementation
import { getFirestore, collection, doc, getDoc, getDocs, query, where } from 'firebase-admin/firestore';

export const documentService = {
  async listByUser(userId, { search = '', limit = 50 } = {}) {
    const db = getFirestore();
    const q = query(
      collection(db, 'documents'),
      where('ownerId', '==', userId)
    );
    const docs = await getDocs(q);
    // Apply search filter and sorting
    return docs.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  // ... implement other methods
};
```

### Backend: Replace User Service
`server/src/services/user.service.js` - Similar pattern with Firestore

---

## Development & Testing

### Run with Firebase (Once Configured)
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend  
cd client && npm run dev
```

### Test Authentication Flow
1. Visit `http://localhost:5173/register`
2. Create account with real email
3. Check Firebase Console → Authentication → Users
4. Try login/logout/Google Sign-In
5. Verify documents sync across tabs

### Test Real-time Collaboration
1. Open document in two browser tabs
2. Edit in one tab → changes appear in other
3. Check Socket.io connection in DevTools

---

## Production Deployment

### Frontend (Vercel)
```bash
cd client && npm run build
# Deploy dist/ folder to Vercel
```

Add production environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-api.example.com/api/v1
VITE_SOCKET_URL=https://your-api.example.com
VITE_FIREBASE_API_KEY=...
# ... other Firebase config
```

### Backend (Railway/Render)
```bash
cd server && npm start
```

Add production environment variables:
```
NODE_ENV=production
CLIENT_URL=https://your-frontend.example.com
PORT=8080
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

---

## Troubleshooting

### "Firebase is not configured"
- Check `.env` files have correct values
- Verify `VITE_AUTH_DEV_MODE=false` on frontend
- Verify `AUTH_DEV_MODE=false` on backend

### Socket Connection Fails
- Ensure backend is running and reachable
- Check `VITE_SOCKET_URL` points to correct server
- Check CORS settings if cross-origin

### Firestore Rules Rejection
- Check Cloud Firestore logs in Firebase Console
- Verify user is authenticated
- Ensure rules allow the operation

### Token Verification Fails
- Verify Firebase Admin credentials are correct
- Check token hasn't expired (auto-refreshed)
- Enable dev mode to test without Firebase

---

## Environment Checklist

- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] Authentication methods enabled (Email, Google)
- [ ] Service account key generated
- [ ] Frontend `.env` filled with Firebase config
- [ ] Backend `.env` filled with Admin credentials  
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] OAuth redirect URIs configured
- [ ] `AUTH_DEV_MODE` set to `false` in both
- [ ] Both frontend and backend running
- [ ] Authentication flow tested end-to-end
