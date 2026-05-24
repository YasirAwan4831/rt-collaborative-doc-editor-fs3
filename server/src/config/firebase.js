import admin from 'firebase-admin';
import config from './index.js';

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK when credentials are provided.
 * Firestore operations are delegated to firestore.service.js (placeholder until connected).
 */
export function initializeFirebase() {
  const { projectId, clientEmail, privateKey } = config.firebase;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[Firebase] Admin SDK not configured — using in-memory store. Add credentials to .env when ready.');
    return null;
  }

  try {
    firebaseApp = admin.apps.length
      ? admin.app()
      : admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
    console.info('[Firebase] Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    console.error('[Firebase] Failed to initialize:', error.message);
    return null;
  }
}

export function getFirebaseAdmin() {
  return firebaseApp ? admin : null;
}

export function getAuth() {
  return firebaseApp ? admin.auth() : null;
}

export function getFirestore() {
  return firebaseApp ? admin.firestore() : null;
}

export default { initializeFirebase, getFirebaseAdmin, getAuth, getFirestore };
