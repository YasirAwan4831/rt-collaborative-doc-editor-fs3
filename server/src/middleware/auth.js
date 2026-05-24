import config from '../config/index.js';
import { getAuth } from '../config/firebase.js';
import { ApiError } from '../utils/ApiError.js';
import { userService } from '../services/user.service.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or invalid authorization header');
    }

    const token = authHeader.split('Bearer ')[1];
    let decoded;

    if (config.authDevMode && token.startsWith('dev_')) {
      const [, uid, email, name] = token.split('_');
      decoded = {
        uid: uid || 'dev-user-1',
        email: email || 'dev@collab.editor',
        name: decodeURIComponent(name || 'Dev User'),
      };
    } else {
      const auth = getAuth();
      if (!auth) {
        throw ApiError.unauthorized('Firebase Auth not configured on server');
      }
      decoded = await auth.verifyIdToken(token);
    }

    req.user = await userService.upsertFromAuth(decoded);
    req.auth = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  return authenticate(req, res, next);
}

export default { authenticate, optionalAuth };
