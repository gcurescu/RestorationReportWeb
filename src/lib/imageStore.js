// IndexedDB helper for storing large images
const DB_NAME = 'RestorationReportDB';
const STORE_NAME = 'images';
const VERSION = 1;

let db = null;

const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveImage = async (id, dataUrl) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, dataUrl, timestamp: Date.now() });
    
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const getImage = async (id) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.dataUrl : null);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteImage = async (id) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Clean up old images (optional - call periodically)
export const cleanupOldImages = async (daysOld = 30) => {
  const database = await initDB();
  const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.timestamp < cutoff) {
          cursor.delete();
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
};

// Helper function to check if storage is available
export const isIndexedDBAvailable = () => {
  return typeof indexedDB !== 'undefined';
};

// Get storage usage info (for debugging)
export const getStorageInfo = async () => {
  if (!navigator.storage || !navigator.storage.estimate) {
    return null;
  }
  
  try {
    const estimate = await navigator.storage.estimate();
    return {
      quota: estimate.quota,
      usage: estimate.usage,
      available: estimate.quota - estimate.usage,
      usagePercentage: ((estimate.usage / estimate.quota) * 100).toFixed(2)
    };
  } catch (error) {
    console.warn('Could not get storage info:', error);
    return null;
  }
};
