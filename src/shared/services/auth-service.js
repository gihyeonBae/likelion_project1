import { readStorage, removeStorage, writeStorage } from './storage.js';

const SESSION_STORAGE_KEY = 'session';

export function getSession() {
  return readStorage(SESSION_STORAGE_KEY, null);
}

export function saveSession(session) {
  return writeStorage(SESSION_STORAGE_KEY, session);
}

export function clearSession() {
  removeStorage(SESSION_STORAGE_KEY);
}
