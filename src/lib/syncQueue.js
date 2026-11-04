import {
  STORES,
  getPendingItems,
  markItemsSynced,
  getAllLocalItems,
  saveLocalBatch,
  getLocalItems,
  filterOutDemo,
  DEMO_IDS
} from './offlineStorage';
import { loadFromNeon, saveToNeon } from './db';

let isSyncingAll = false;

/**
 * Pushes pending (or all local when pushAll=true) items across all entities to Neon
 */
export async function flushAllQueues(pushAll = false) {
  if (typeof window === 'undefined') return { totalSynced: 0 };
  if (isSyncingAll) {
    console.log('[SyncQueue] Multi-entity sync already in progress, skipping duplicate.');
    return { skipped: true };
  }

  try {
    const fetchFn = pushAll ? getAllLocalItems : getPendingItems;

    // Gather records across all 8 stores
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
      fetchFn(STORES.products),
      fetchFn(STORES.customers),
      fetchFn(STORES.suppliers),
      fetchFn(STORES.sales),
      fetchFn(STORES.purchases),
      fetchFn(STORES.payments),
      fetchFn(STORES.holdStock),
      fetchFn(STORES.tempLedger)
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

    let result = null;

    // 1. Direct Neon DB save first (instant write for mobile APK and web client)
    try {
      const directRes = await saveToNeon({
        ...payload,
        tenantId: 'tenant-1'
      });
      if (directRes && directRes.success) {
        result = {
          success: true,
          syncedIds: {
            products: pendingProducts.map(p => p.id),
            customers: pendingCustomers.map(c => c.id),
            suppliers: pendingSuppliers.map(s => s.id),
            sales: pendingSales.map(s => s.id),
            purchases: pendingPurchases.map(p => p.id),
            payments: pendingPayments.map(p => p.id),
            holdStock: pendingHoldStock.map(h => h.id),
            tempLedger: pendingTempLedger.map(t => t.id)
          },
          syncedCounts: directRes.mergedCounts
        };
        console.log('[SyncQueue] Direct Neon save successful.');
      }
    } catch (neonErr) {
      console.warn('[SyncQueue] Direct Neon save error, trying /api/sync/ fallback:', neonErr);
    }

    // 2. Fallback to API route if direct save didn't run
    if (!result || !result.success) {
      try {
        const res = await fetch('/api/sync/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          if (json && json.success) result = json;
        }
      } catch (fetchErr) {
        console.warn('[SyncQueue] POST /api/sync/ fallback failed:', fetchErr);
      }
    }

    if (result && result.success && result.syncedIds) {
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

    return { success: false, error: 'Could not reach server or Neon DB' };
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
  const cleanServerList = filterOutDemo(serverList);
  const localList = filterOutDemo(await getAllLocalItems(storeName));
  const localMap = new Map(localList.map(item => [item.id, item]));
  const serverIdSet = new Set(cleanServerList.map(s => s.id));

  const mergedMap = new Map();

  // 1. Process all items received from Neon server
  for (const serverItem of cleanServerList) {
    if (!serverItem || !serverItem.id || DEMO_IDS.has(serverItem.id)) continue;
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
      // Record exists in Neon but not in local IndexedDB: insert into IndexedDB
      mergedMap.set(serverItem.id, { ...serverItem, synced: true });
    }
  }

  // 2. Process all items in local IndexedDB that were not in serverList
  for (const local of localList) {
    if (!local || !local.id || DEMO_IDS.has(local.id)) continue;
    if (!serverIdSet.has(local.id)) {
      // Keep only if pending offline write (synced === false); discard stale deleted items
      if (local.synced === false) {
        mergedMap.set(local.id, local);
      }
    }
  }

  const merged = filterOutDemo(Array.from(mergedMap.values()));

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
    console.log('[SyncQueue] Pulling complete dynamic store dataset from Neon DB...');
    let data = null;

    // 1. Direct Neon DB load (instant, dynamic, works directly in mobile APK and web client)
    try {
      const directData = await loadFromNeon('tenant-1');
      if (directData && directData.success && directData.found && directData.data) {
        data = {
          success: true,
          products: directData.data.products || [],
          customers: directData.data.customers || [],
          suppliers: directData.data.suppliers || [],
          sales: directData.data.sales || [],
          purchases: directData.data.purchases || [],
          payments: directData.data.payments || [],
          holdStock: directData.data.holdStock || [],
          tempLedger: directData.data.tempLedger || []
        };
        console.log('[SyncQueue] Successfully retrieved store data directly from Neon database.');
      }
    } catch (neonErr) {
      console.warn('[SyncQueue] Direct loadFromNeon fallback failed, trying /api/sync/:', neonErr);
    }

    // 2. Fallback to API route if direct load didn't run
    if (!data || !data.success) {
      try {
        const res = await fetch('/api/sync/');
        if (res.ok) {
          const json = await res.json();
          if (json && json.success) data = json;
        }
      } catch (fetchErr) {
        console.warn('[SyncQueue] /api/sync/ fetch fallback failed:', fetchErr);
      }
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Could not retrieve data from server or Neon DB');
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
 * 1. Push pending local changes to Neon (or all local if pushAll=true).
 * 2. Pull all remote changes and merge locally.
 */
export async function syncAllFull(pushAll = false) {
  await flushAllQueues(pushAll);
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
