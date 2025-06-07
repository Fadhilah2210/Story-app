// src/modeldb/idbHelper.js
import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

// Fungsi untuk menyimpan cerita ke IndexedDB
export const saveStory = async (story) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, story);  // Menyimpan atau memperbarui cerita
};

// Fungsi untuk mengambil semua cerita dari IndexedDB
export const getAllStories = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);  // Mendapatkan semua cerita dari IndexedDB
};

// Fungsi untuk menghapus cerita dari IndexedDB
export const deleteStory = async (id) => {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);  // Menghapus cerita berdasarkan ID
};
