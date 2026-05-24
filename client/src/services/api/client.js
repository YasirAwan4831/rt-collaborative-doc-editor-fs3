import { env, isFirebaseConfigured } from '../../config/env.js';
import { auth } from '../../config/firebase.js';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
  console.log('[API] Auth token set', token ? 'present' : 'cleared');
}

export function getAuthToken() {
  return authToken;
}

/**
 * Get current Firebase ID token from authenticated user
 */
async function getFirebaseToken() {
  if (!isFirebaseConfigured()) return null;
  if (!auth?.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken(true);
  } catch (err) {
    console.error('[API] Token refresh failed:', err.message);
    return null;
  }
}

async function request(endpoint, options = {}) {
  const url = `${env.apiUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Try to get fresh Firebase token if configured, fallback to cached dev token
  const token = await getFirebaseToken() || authToken;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default apiClient;
