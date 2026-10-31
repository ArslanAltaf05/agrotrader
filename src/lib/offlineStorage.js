import { openDB } from 'idb';

const DB_NAME = 'agrotrader_offline_v1';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';

let dbPromise = null;

// Initialize or get the IndexedDB database instance
export function getDb() {
  if (typeof window === 'undefined') return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
          const store = db.createObjectStore(PRODUCTS_STORE, { keyPath: 'id' });
          store.createIndex('synced', 'synced');
          store.createIndex('deleted', 'deleted');
          store.createIndex('updatedAt', 'updatedAt');
        }
      }
    });
  }
  return dbPromise;
}

// Generate client-side UUID
export function generateProductId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return 'prod-' + crypto.randomUUID();
  }
  return 'prod-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

// Get all non-deleted products from local IndexedDB
export async function getLocalProducts() {
  const db = await getDb();
  if (!db) return [];
  const all = await db.getAll(PRODUCTS_STORE);
  return all.filter(p => !p.deleted);
}

// Get all products including tombstones
export async function getAllLocalRecords() {
  const db = await getDb();
  if (!db) return [];
  return await db.getAll(PRODUCTS_STORE);
}

// Save or update a product locally in IndexedDB
export async function saveLocalProduct(product, synced = false) {
  const db = await getDb();
  if (!db) return product;

  const record = {
    ...product,
    id: product.id || generateProductId(),
    synced: Boolean(synced),
    deleted: Boolean(product.deleted),
    updatedAt: product.updatedAt || new Date().toISOString()
  };

  await db.put(PRODUCTS_STORE, record);
  console.log(`[IndexedDB] Saved product "${record.name}" (id: ${record.id}, synced: ${record.synced})`);
  return record;
}

// Mark product as deleted (tombstone) locally in IndexedDB
export async function deleteLocalProduct(id) {
  const db = await getDb();
  if (!db) return;

  const existing = await db.get(PRODUCTS_STORE, id);
  if (existing) {
    const tombstone = {
      ...existing,
      deleted: true,
      synced: false, // Must be synced to Neon to delete remotely
      updatedAt: new Date().toISOString()
    };
    await db.put(PRODUCTS_STORE, tombstone);
    console.log(`[IndexedDB] Marked product ${id} as deleted (synced: false)`);
    return tombstone;
  }
}

// Bulk save products to IndexedDB (e.g. from server pull)
export async function saveLocalProductsBatch(productsList) {
  const db = await getDb();
  if (!db || !Array.isArray(productsList) || !productsList.length) return;

  const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
  for (const item of productsList) {
    if (!item || !item.id) continue;
    await tx.store.put(item);
  }
  await tx.done;
}

// Get all pending records that have not been synced to Neon yet
export async function getPendingProducts() {
  const db = await getDb();
  if (!db) return [];
  const all = await db.getAll(PRODUCTS_STORE);
  return all.filter(p => p.synced === false || p.synced === undefined);
}

// Mark specific products as synced in IndexedDB
export async function markProductsSynced(ids) {
  const db = await getDb();
  if (!db || !ids || !ids.length) return;

  const idSet = new Set(ids);
  const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
  for (const id of idSet) {
    const item = await tx.store.get(id);
    if (item) {
      item.synced = true;
      await tx.store.put(item);
    }
  }
  await tx.done;
  console.log(`[IndexedDB] Marked ${ids.length} product(s) as synced:`, ids);
}
