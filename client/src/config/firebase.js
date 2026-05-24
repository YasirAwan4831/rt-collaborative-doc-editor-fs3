import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { env, isFirebaseConfigured } from './env.js';

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured()) {
  app = initializeApp(env.firebase);
  auth = getAuth(app);
  db = getFirestore(app);
}

/**
 * Firestore instance — connect collections when database is set up.
 * Usage: import { db } from '@/config/firebase'
 */
export { app, auth, db };
export default { app, auth, db };
