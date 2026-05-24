import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../config/firebase.js';
import { env, isFirebaseConfigured } from '../../config/env.js';
import { setAuthToken } from '../api/client.js';

const DEV_USER_KEY = 'collab_dev_user';

function createDevToken(user) {
  const name = encodeURIComponent(user.displayName || 'Dev User');
  return `dev_${user.uid}_${user.email}_${name}`;
}

function saveDevUser(user) {
  localStorage.setItem(DEV_USER_KEY, JSON.stringify(user));
}

function loadDevUser() {
  try {
    const raw = localStorage.getItem(DEV_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const authService = {
  isDevMode: () => env.authDevMode && !isFirebaseConfigured(),

  async login(email, password) {
    if (this.isDevMode()) {
      const user = {
        uid: `dev-${btoa(email).slice(0, 8)}`,
        email,
        displayName: email.split('@')[0],
        photoURL: null,
      };
      saveDevUser(user);
      const token = createDevToken(user);
      setAuthToken(token);
      return { user, token };
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    setAuthToken(token);
    return { user: credential.user, token };
  },

  async register(email, password, displayName) {
    if (this.isDevMode()) {
      const user = { uid: `dev-${Date.now()}`, email, displayName, photoURL: null };
      saveDevUser(user);
      const token = createDevToken(user);
      setAuthToken(token);
      return { user, token };
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(credential.user, { displayName });
    const token = await credential.user.getIdToken();
    setAuthToken(token);
    return { user: credential.user, token };
  },

  async loginWithGoogle() {
    if (this.isDevMode()) {
      const user = {
        uid: 'dev-google-user',
        email: 'google.user@collabspace.dev',
        displayName: 'Google User',
        photoURL: null,
      };
      saveDevUser(user);
      const token = createDevToken(user);
      setAuthToken(token);
      return { user, token };
    }

    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const token = await credential.user.getIdToken();
    setAuthToken(token);
    return { user: credential.user, token };
  },

  async logout() {
    setAuthToken(null);
    localStorage.removeItem(DEV_USER_KEY);
    if (!this.isDevMode() && auth) await signOut(auth);
  },

  async getToken() {
    if (this.isDevMode()) {
      const user = loadDevUser();
      if (user) {
        const token = createDevToken(user);
        setAuthToken(token);
        return token;
      }
      return null;
    }
    if (!auth?.currentUser) return null;
    const token = await auth.currentUser.getIdToken();
    setAuthToken(token);
    return token;
  },

  subscribe(callback) {
    if (this.isDevMode()) {
      const user = loadDevUser();
      if (user) {
        const token = createDevToken(user);
        setAuthToken(token);
      }
      callback(user);
      return () => {};
    }
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }
      callback(firebaseUser);
    });
  },

  mapUser(firebaseOrDevUser) {
    if (!firebaseOrDevUser) return null;
    return {
      uid: firebaseOrDevUser.uid,
      email: firebaseOrDevUser.email,
      displayName: firebaseOrDevUser.displayName || firebaseOrDevUser.email?.split('@')[0],
      photoURL: firebaseOrDevUser.photoURL,
    };
  },
};

export default authService;
