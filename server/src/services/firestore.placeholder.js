/**
 * Firestore integration helpers.
 * Provides collection references and connection helpers.
 */

import { getFirestore } from '../config/firebase.js';

export const COLLECTIONS = {
  USERS: 'users',
  DOCUMENTS: 'documents',
  VERSIONS: 'versions',
  COLLABORATORS: 'collaborators',
};

export function isFirestoreConnected() {
  return Boolean(getFirestore());
}

export function getFirestoreDb() {
  const db = getFirestore();
  if (!db) throw new Error('Firestore is not connected');
  return db;
}

export function getUsersCollection() {
  return getFirestoreDb().collection(COLLECTIONS.USERS);
}

export function getDocumentsCollection() {
  return getFirestoreDb().collection(COLLECTIONS.DOCUMENTS);
}

export function getDocumentRef(docId) {
  return getDocumentsCollection().doc(docId);
}

export function getVersionsCollection(docId) {
  return getDocumentRef(docId).collection(COLLECTIONS.VERSIONS);
}

export default {
  COLLECTIONS,
  isFirestoreConnected,
  getFirestoreDb,
  getUsersCollection,
  getDocumentsCollection,
  getDocumentRef,
  getVersionsCollection,
};
