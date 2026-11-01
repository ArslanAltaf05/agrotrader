import {
  STORES,
  getPendingItems,
  markItemsSynced,
  getAllLocalItems,
  saveLocalBatch,
  getLocalItems
} from './offlineStorage';

let isSyncingAll = false;

/**
 * Pushes all pending (synced === false) items across all entities to Neon
 */
export async function flushAllQueues() {
  if (typeof window === 'undefined') return { totalSynced: 0 };
  if (isSyncingAll) {
    console.log('[SyncQueue] Multi-entity sync already in progress, skipping duplicate.');
    return { skipped: true };
  }

  try {
    // Gather pending records across all 8 stores
    const [
      pendingProducts,
      pendingCustomers,
      pendingSuppliers,
      pendingSales,
      pendingPurchases,
      pendingPayments,
      pendingHoldStock,
      pendingTempLedger
    ] = await Promise.all([
      getPendingItems(STORES.products),
      getPendingItems(STORES.customers),
      getPendingItems(STORES.suppliers),
      getPendingItems(STORES.sales),
      getPendingItems(STORES.purchases),
      getPendingItems(STORES.payments),
      getPendingItems(STORES.holdStock),
      getPendingItems(STORES.tempLedger)
    ]);

    const totalPending =
      pendingProducts.length +
      pendingCustomers.length +
      pendingSuppliers.length +
      pendingSales.length +
      pendingPurchases.length +
      pendingPayments.length +
      pendingHoldStock.length +
      pendingTempLedger.length;

    if (totalPending === 0) {
      return { success: true, totalSynced: 0 };
    }

    console.log(`[SyncQueue] Pushing ${totalPending} pending record(s) to Neon...`, {
      products: pendingProducts.length,
      customers: pendingCustomers.length,
      suppliers: pendingSuppliers.length,
      sales: pendingSales.length,
      purchases: pendingPurchases.length,
      payments: pendingPayments.length,
      holdStock: pendingHoldStock.length,
      tempLedger: pendingTempLedger.length
    });

    isSyncingAll = true;

    const payload = {
      products: pendingProducts,
      customers: pendingCustomers,
      suppliers: pendingSuppliers,
      sales: pendingSales,
      purchases: pendingPurchases,
      payments: pendingPayments,
      holdStock: pendingHoldStock,
      tempLedger: pendingTempLedger
    };

    const res = await fetch('/api/sync/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status} from /api/sync`);
    }

    const result = await res.json();
    if (result.success && result.syncedIds) {
      // Mark all confirmed IDs as synced in IndexedDB
      await Promise.all([
        markItemsSynced(STORES.products, result.syncedIds.products || []),
        markItemsSynced(STORES.customers, result.syncedIds.customers || []),
        markItemsSynced(STORES.suppliers, result.syncedIds.suppliers || []),
        markItemsSynced(STORES.sales, result.syncedIds.sales || []),
        markItemsSynced(STORES.purchases, result.syncedIds.purchases || []),
        markItemsSynced(STORES.payments, result.syncedIds.payments || []),
        markItemsSynced(STORES.holdStock, result.syncedIds.holdStock || []),
        markItemsSynced(STORES.tempLedger, result.syncedIds.tempLedger || [])
      ]);

      console.log(`[SyncQueue] Successfully synced ${totalPending} record(s) to Neon!`, result.syncedCounts);
      return { success: true, totalSynced: totalPending, syncedCounts: result.syncedCounts };
    }

    return { success: false, error: 'Unexpected response from /api/sync' };
  } catch (err) {
    console.warn('[SyncQueue] Push error (will auto-retry in 30s):', err.message);
    return { success: false, error: err.message };
  } finally {
    isSyncingAll = false;
  }
}

/**
 * Merge helper: implements true two-way union merge
 * - Pulls all records from Neon
 * - If record exists in local IndexedDB with synced: false, preserves local pending change
 * - If record exists in both and is synced, updates only if server updated_at is newer
 * - If record is only in Neon, inserts into IndexedDB
 * - If record is only in IndexedDB (synced or pending), preserves it
 * Result: union of all Neon products + all local products, never deleting rows.
 */
async function mergeStore(storeName, serverList = []) {
  const localList = await getAllLocalItems(storeName);
  const localMap = new Map(localList.map(item => [item.id, item]));
  const serverIdSet = new Set(serverList.map(s => s.id));

  const mergedMap = new Map();

  // 1. Process all items received from Neon server
  for (const serverItem of serverList) {
    if (!serverItem || !serverItem.id) continue;
    const local = localMap.get(serverItem.id);

    if (local) {
      if (local.synced === false) {
        // Local pending item (edited or created offline) takes precedence until flushed
        mergedMap.set(local.id, local);
      } else {
        // Both synced: update if server updated_at is newer
        const localTime = new Date(local.updatedAt || local.updated_at || 0).getTime();
        const serverTime = new Date(serverItem.updatedAt || serverItem.updated_at || 0).getTime();
        if (serverTime >= localTime) {
          mergedMap.set(serverItem.id, { ...serverItem, synced: true });
        } else {
          mergedMap.set(local.id, local);
        }
      }
    } else {
      // Product exists in Neon but not in local IndexedDB: insert into IndexedDB
      mergedMap.set(serverItem.id, { ...serverItem, synced: true });
    }
  }

  // 2. Process all items in local IndexedDB that were not in serverList
  for (const local of localList) {
    if (!local || !local.id) continue;
    if (!serverIdSet.has(local.id)) {
      // Product in IndexedDB that wasn't in server list (pending push or local): keep it!
      mergedMap.set(local.id, local);
    }
  }

  const merged = Array.from(mergedMap.values());

  // Save the complete union dataset into IndexedDB
  await saveLocalBatch(storeName, merged);

  // Return active (non-deleted) items for immediate React state update
  return merged.filter(item => !item.deleted);
}

/**
 * Pulls all collections from Neon and merges with local IndexedDB records
 */
export async function pullAllFromServer() {
  if (typeof window === 'undefined') return null;

  try {
    console.log('[SyncQueue] Pulling complete store dataset from Neon /api/sync/...');
    const res = await fetch('/api/sync/');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from /api/sync`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Server error pulling sync data');
    }

    const [
      products,
      customers,
      suppliers,
      sales,
      purchases,
      payments,
      holdStock,
      tempLedger
    ] = await Promise.all([
      mergeStore(STORES.products, data.products || []),
      mergeStore(STORES.customers, data.customers || []),
      mergeStore(STORES.suppliers, data.suppliers || []),
      mergeStore(STORES.sales, data.sales || []),
      mergeStore(STORES.purchases, data.purchases || []),
      mergeStore(STORES.payments, data.payments || []),
      mergeStore(STORES.holdStock, data.holdStock || []),
      mergeStore(STORES.tempLedger, data.tempLedger || [])
    ]);

    console.log('[SyncQueue] All collections merged successfully from Neon.');
    return {
      products,
      customers,
      suppliers,
      sales,
      purchases,
      payments,
      holdStock,
      tempLedger
    };
  } catch (err) {
    console.warn('[SyncQueue] Could not pull from Neon (offline). Serving from local IndexedDB:', err.message);
    const [
      products,
      customers,
      suppliers,
      sales,
      purchases,
      payments,
      holdStock,
      tempLedger
    ] = await Promise.all([
      getLocalItems(STORES.products),
      getLocalItems(STORES.customers),
      getLocalItems(STORES.suppliers),
      getLocalItems(STORES.sales),
      getLocalItems(STORES.purchases),
      getLocalItems(STORES.payments),
      getLocalItems(STORES.holdStock),
      getLocalItems(STORES.tempLedger)
    ]);
    return {
      products,
      customers,
      suppliers,
      sales,
      purchases,
      payments,
      holdStock,
      tempLedger
    };
  }
}

/**
 * Bidirectional multi-entity synchronization:
 * 1. Push all pending local changes to Neon.
 * 2. Pull all remote changes and merge locally.
 */
export async function syncAllFull() {
  await flushAllQueues();
  const remote = await pullAllFromServer();
  return remote;
}

// Backward-compatible product-specific aliases
export const flushQueue = flushAllQueues;
export const pullLatestFromServer = async () => {
  const all = await pullAllFromServer();
  return all?.products || [];
};
export const syncProductsFull = async () => {
  const all = await syncAllFull();
  return all?.products || [];
};
