import { createUserPayload } from '../models/user.model.js';
import {
  getUsersCollection,
  isFirestoreConnected,
} from './firestore.placeholder.js';

const users = new Map();

export const userService = {
  async upsertFromAuth(decodedToken) {
    const now = new Date().toISOString();
    const payload = createUserPayload({
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.displayName,
      photoURL: decodedToken.picture || decodedToken.photoURL,
      createdAt: now,
    });

    if (isFirestoreConnected()) {
      const userRef = getUsersCollection().doc(payload.uid);
      const snapshot = await userRef.get();
      const existing = snapshot.exists ? snapshot.data() : null;
      const data = {
        ...existing,
        ...payload,
        createdAt: existing?.createdAt || payload.createdAt,
        updatedAt: now,
      };
      await userRef.set(data, { merge: true });
      return data;
    }

    const existing = users.get(payload.uid);
    const data = {
      ...existing,
      ...payload,
      createdAt: existing?.createdAt || payload.createdAt,
      updatedAt: now,
    };
    users.set(payload.uid, data);
    return data;
  },

  async getProfile(uid) {
    if (isFirestoreConnected()) {
      const snapshot = await getUsersCollection().doc(uid).get();
      return snapshot.exists ? snapshot.data() : null;
    }
    return users.get(uid) || null;
  },

  async updateProfile(uid, updates) {
    const now = new Date().toISOString();
    if (isFirestoreConnected()) {
      const userRef = getUsersCollection().doc(uid);
      const snapshot = await userRef.get();
      if (!snapshot.exists) return null;
      const data = {
        ...snapshot.data(),
        ...updates,
        updatedAt: now,
      };
      await userRef.set(data, { merge: true });
      return data;
    }

    const user = users.get(uid);
    if (!user) return null;
    const updated = {
      ...user,
      ...updates,
      updatedAt: now,
    };
    users.set(uid, updated);
    return updated;
  },
};

export default userService;
