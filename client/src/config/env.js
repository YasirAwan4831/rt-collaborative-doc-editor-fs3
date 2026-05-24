/**
 * Environment configuration
 * Loads and validates environment variables from .env
 */

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  authDevMode: import.meta.env.VITE_AUTH_DEV_MODE === 'true',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
};

/**
 * Check if Firebase is properly configured
 * Returns false if using dev mode or if critical Firebase config is missing
 */
export function isFirebaseConfigured() {
  if (env.authDevMode) return false;
  const { apiKey, authDomain, projectId, appId } = env.firebase;
  return Boolean(apiKey && authDomain && projectId && appId);
}

export default env;