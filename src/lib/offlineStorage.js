import { openDB } from 'idb';

const DB_NAME = 'agrotrader_offline_v3';
const DB_VERSION = 1;

export const DEMO_IDS = new Set([
  'prod-dap-01', 'prod-cartap-02', 'prod-urea-03', 'prod-tarzan-04',
  'cust-bashir-01', 'cust-riaz-02', 'cust-akhtar-03',
  'supp-ffc-01', 'supp-engro-02', 'supp-syngenta-03',
  'INV-2024-0891', 'INV-2024-0890',
  'PAY-OUT-701', 'PAY-IN-553', 'PAY-IN-990', 'PAY-IN-613', 'PAY-IN-699', 'PAY-IN-932', 'PAY-OUT-878'
]);

export function filterOutDemo(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(item => item && !DEMO_IDS.has(item.id) && !String(item.id).startsWith('demo-') && !String(item.id).includes('demo'));
}

export const STORES = {
  products: 'products',
  customers: 'customers',
  suppliers: 'suppliers',
  sales: 'sales',
  purchases: 'purchases',
  payments: 'payments',
  holdStock: 'holdStock',
  tempLedger: 'tempLedger'
};

let dbPromise = null;

export function getDb() {
  if (typeof window === 'undefined') return null;

  if (!dbPromise) {
    if (typeof indexedDB !== 'undefined') {
      try {
        indexedDB.deleteDatabase('agrotrader_offline_v2');
        indexedDB.deleteDatabase('agrotrader_offline_v1');
      } catch (e) { }
    }

    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('synced', 'synced');
            store.createIndex('deleted', 'deleted');
            store.createIndex('updatedAt', 'updatedAt');
          }
        });
      }
    });
  }
  return dbPromise;
}

// Generate client-side UUID
export function generateEntityId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateProductId() {
  return generateEntityId('prod');
}

// --- Generic IndexedDB CRUD Operations ---

export async function getLocalItems(storeName) {
  const db = await getDb();
  if (!db) return [];
  try {
    const all = await db.getAll(storeName);
    return filterOutDemo(all.filter(item => !item.deleted));
  } catch (err) {
    console.warn(`[IndexedDB] Error fetching ${storeName}:`, err);
    return [];
  }
}

export async function getAllLocalItems(storeName) {
  const db = await getDb();
  if (!db) return [];
  try {
    const all = await db.getAll(storeName);
    return filterOutDemo(all);
  } catch (err) {
    return [];
  }
}

export async function saveLocalItem(storeName, item, synced = false) {
  const db = await getDb();
  if (!db || !item || DEMO_IDS.has(item.id)) return item;

  const record = {
    ...item,
    id: item.id || generateEntityId(storeName.slice(0, 4)),
    synced: Boolean(synced),
    deleted: Boolean(item.deleted),
    updatedAt: item.updatedAt || new Date().toISOString()
  };

  await db.put(storeName, record);
  return record;
}

export async function deleteLocalItem(storeName, id) {
  const db = await getDb();
  if (!db) return;

  const existing = await db.get(storeName, id);
  if (existing) {
    const tombstone = {
      ...existing,
      deleted: true,
      synced: false,
      updatedAt: new Date().toISOString()
    };
    await db.put(storeName, tombstone);
    return tombstone;
  }
}

export async function saveLocalBatch(storeName, itemsList) {
  const db = await getDb();
  if (!db || !Array.isArray(itemsList)) return;

  const cleanList = filterOutDemo(itemsList);
  const tx = db.transaction(storeName, 'readwrite');
  const allCurrent = await tx.store.getAll();
  const newItemIds = new Set(cleanList.map(i => i?.id).filter(Boolean));

  for (const cur of allCurrent) {
    if ((cur.synced || DEMO_IDS.has(cur.id)) && !newItemIds.has(cur.id)) {
      await tx.store.delete(cur.id);
    }
  }

  for (const item of cleanList) {
    if (!item || !item.id) continue;
    await tx.store.put(item);
  }
  await tx.done;
}

export async function getPendingItems(storeName) {
  const db = await getDb();
  if (!db) return [];
  try {
    const all = await db.getAll(storeName);
    return all.filter(item => item.synced === false || item.synced === undefined);
  } catch (err) {
    return [];
  }
}

export async function markItemsSynced(storeName, ids) {
  const db = await getDb();
  if (!db || !ids || !ids.length) return;

  const idSet = new Set(ids);
  const tx = db.transaction(storeName, 'readwrite');
  for (const id of idSet) {
    const item = await tx.store.get(id);
    if (item) {
      if (item.deleted === true) {
        await tx.store.delete(id);
      } else {
        item.synced = true;
        await tx.store.put(item);
      }
    }
  }
  await tx.done;
}

// --- Typed Entity Helpers ---

// Products
export const getLocalProducts = () => getLocalItems(STORES.products);
export const getAllLocalRecords = () => getAllLocalItems(STORES.products);
export const saveLocalProduct = (p, synced = false) => saveLocalItem(STORES.products, p, synced);
export const deleteLocalProduct = (id) => deleteLocalItem(STORES.products, id);
export const saveLocalProductsBatch = (list) => saveLocalBatch(STORES.products, list);
export const getPendingProducts = () => getPendingItems(STORES.products);
export const markProductsSynced = (ids) => markItemsSynced(STORES.products, ids);

// Customers (Accounts / Khata)
export const getLocalCustomers = () => getLocalItems(STORES.customers);
export const saveLocalCustomer = (c, synced = false) => saveLocalItem(STORES.customers, c, synced);
export const deleteLocalCustomer = (id) => deleteLocalItem(STORES.customers, id);
export const saveLocalCustomersBatch = (list) => saveLocalBatch(STORES.customers, list);

// Suppliers
export const getLocalSuppliers = () => getLocalItems(STORES.suppliers);
export const saveLocalSupplier = (s, synced = false) => saveLocalItem(STORES.suppliers, s, synced);
export const deleteLocalSupplier = (id) => deleteLocalItem(STORES.suppliers, id);
export const saveLocalSuppliersBatch = (list) => saveLocalBatch(STORES.suppliers, list);

// Sales (Invoices)
export const getLocalSales = () => getLocalItems(STORES.sales);
export const saveLocalSale = (s, synced = false) => saveLocalItem(STORES.sales, s, synced);
export const deleteLocalSale = (id) => deleteLocalItem(STORES.sales, id);
export const saveLocalSalesBatch = (list) => saveLocalBatch(STORES.sales, list);

// Purchases
export const getLocalPurchases = () => getLocalItems(STORES.purchases);
export const saveLocalPurchase = (po, synced = false) => saveLocalItem(STORES.purchases, po, synced);
export const deleteLocalPurchase = (id) => deleteLocalItem(STORES.purchases, id);
export const saveLocalPurchasesBatch = (list) => saveLocalBatch(STORES.purchases, list);

// Payments (Vouchers)
export const getLocalPayments = () => getLocalItems(STORES.payments);
export const saveLocalPayment = (p, synced = false) => saveLocalItem(STORES.payments, p, synced);
export const deleteLocalPayment = (id) => deleteLocalItem(STORES.payments, id);
export const saveLocalPaymentsBatch = (list) => saveLocalBatch(STORES.payments, list);

// Hold Stock (Customer Bookings)
export const getLocalHoldStock = () => getLocalItems(STORES.holdStock);
export const saveLocalHoldStock = (h, synced = false) => saveLocalItem(STORES.holdStock, h, synced);
export const deleteLocalHoldStock = (id) => deleteLocalItem(STORES.holdStock, id);
export const saveLocalHoldStockBatch = (list) => saveLocalBatch(STORES.holdStock, list);

// Temp Ledger (Katcha Khata)
export const getLocalTempLedger = () => getLocalItems(STORES.tempLedger);
export const saveLocalTempLedger = (t, synced = false) => saveLocalItem(STORES.tempLedger, t, synced);
export const deleteLocalTempLedger = (id) => deleteLocalItem(STORES.tempLedger, id);
export const saveLocalTempLedgerBatch = (list) => saveLocalBatch(STORES.tempLedger, list);
