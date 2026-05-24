export function createUserPayload(data) {
  const now = new Date().toISOString();
  return {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName || data.email?.split('@')[0] || 'User',
    photoURL: data.photoURL || null,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
}

export default { createUserPayload };
