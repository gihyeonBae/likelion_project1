const PREFIX = 'libre-cafe';

function getStorage() {
  const storageNames = ['localStorage', 'sessionStorage'];

  for (const storageName of storageNames) {
    try {
      const storage = window[storageName];
      const testKey = `${PREFIX}:storage-test`;
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return storage;
    } catch (error) {
      // Try the next browser storage. Some deployments block localStorage.
    }
  }

  return null;
}

export function makeStorageKey(key) {
  return `${PREFIX}:${key}`;
}

export function readStorage(key, fallbackValue = null) {
  const storage = getStorage();

  if (!storage) {
    return fallbackValue;
  }

  const rawValue = storage.getItem(makeStorageKey(key));

  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return fallbackValue;
  }
}

export function writeStorage(key, value) {
  const storage = getStorage();

  if (!storage) {
    return value;
  }

  storage.setItem(makeStorageKey(key), JSON.stringify(value));
  return value;
}

export function removeStorage(key) {
  const storage = getStorage();

  if (storage) {
    storage.removeItem(makeStorageKey(key));
  }
}

export function clearAppStorage() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  Object.keys(storage)
    .filter((key) => key.startsWith(`${PREFIX}:`))
    .forEach((key) => storage.removeItem(key));
}
