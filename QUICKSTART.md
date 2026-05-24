# Quick Start Guide

## 🚀 Run Application in 2 Steps

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Start Both Servers (Open 2 Terminals)

**Terminal 1 - Backend (Port 5001)**
```bash
cd server && npm run dev
```

**Terminal 2 - Frontend (Port 5173)**
```bash
cd client && npm run dev
```

## 🌐 Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/v1/health

## 🔐 Test Login (Dev Mode)
- **Email**: anything@example.com
- **Password**: anything
- Click "Sign in" or "Continue with Google"

## 📝 Available Commands

```bash
# From root directory
npm run install:all      # Install all dependencies
npm run dev             # Run both servers (concurrent)
npm run dev:client      # Frontend only
npm run dev:server      # Backend only
npm run build           # Build frontend for production
npm start               # Start production server

# Individual commands
cd client && npm run build    # Build frontend
cd server && npm start        # Production server
```

## ✅ What's Working
- ✅ Authentication (Email/Password, Google)
- ✅ Document creation/editing
- ✅ Real-time collaboration
- ✅ Version history
- ✅ User presence
- ✅ Dashboard
- ✅ Protected routes

## 🆘 Port Conflict?
If port 5000/5001 is in use:
1. Edit `server/.env` and change `PORT=5000`
2. Edit `client/.env` and update `VITE_SOCKET_URL`

## 📖 Full Documentation
- `PROJECT_COMPLETION.md` - Detailed completion report
- `FIREBASE_SETUP.md` - Firebase integration guide
- `README.md` - Project overview

## 🔥 Production Ready?
Yes! Once you add Firebase credentials:
1. Update `.env` files with Firebase config
2. Set `AUTH_DEV_MODE=false`
3. Follow deployment guide in `FIREBASE_SETUP.md`

---

**That's it! Start developing! 🎉**
