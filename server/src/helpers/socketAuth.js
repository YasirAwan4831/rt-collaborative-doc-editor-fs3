import config from '../config/index.js';
import { getAuth } from '../config/firebase.js';

export async function verifySocketToken(token) {
  if (!token) throw new Error('Authentication token required');

  if (config.authDevMode && token.startsWith('dev_')) {
    const parts = token.split('_');
    return {
      uid: parts[1] || 'dev-user-1',
      email: parts[2] || 'dev@collab.editor',
      name: decodeURIComponent(parts[3] || 'Dev User'),
    };
  }

  const auth = getAuth();
  if (!auth) throw new Error('Firebase Auth not configured');
  const decoded = await auth.verifyIdToken(token);
  return {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name || decoded.email?.split('@')[0],
    picture: decoded.picture,
  };
}

export default verifySocketToken;
