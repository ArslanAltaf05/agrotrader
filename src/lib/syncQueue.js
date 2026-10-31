import {
  getLocalProducts,
  getPendingProducts,
  markProductsSynced,
  saveLocalProductsBatch,
  getAllLocalRecords
} from './offlineStorage';

let isSyncing = false;

/**
 * Pushes all pending (synced === false) products from IndexedDB to the Neon server API
 */
export async function flushQueue() {
  if (typeof window === 'undefined') return { syncedCount: 0 };
  if (isSyncing) {
    console.log('[SyncQueue] Sync already in progress, skipping duplicate call');
    return { skipped: true };
  }

  try {
    const pending = await getPendingProducts();
    if (!pending.length) {
      console.log('[SyncQueue] No pending products to sync.');
      return { success: true, syncedCount: 0 };
    }

    console.log(`[SyncQueue] Found ${pending.length} pending product(s) to sync to Neon...`, pending.map(p => ({ id: p.id, name: p.name, deleted: p.deleted })));
    isSyncing = true;

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pending)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status} from /api/products`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.syncedIds)) {
      await markProductsSynced(data.syncedIds);
      console.log(`[SyncQueue] Successfully synced ${data.syncedIds.length} product(s) to Neon!`);
      return { success: true, syncedCount: data.syncedIds.length, syncedIds: data.syncedIds };
    }

    return { success: false, error: 'Unexpected response from /api/products' };
  } catch (err) {
    console.warn('[SyncQueue] Failed to push pending products to Neon (will retry automatically):', err.message);
    return { success: false, error: err.message };
  } finally {
    isSyncing = false;
  }
}

/**
 * Pulls latest products from Neon and merges with local IndexedDB records.
 * Local pending changes always take precedence to prevent overwriting un-synced edits.
 */
export async function pullLatestFromServer() {
  if (typeof window === 'undefined') return [];

  try {
    console.log('[SyncQueue] Pulling latest products from Neon API...');
    const res = await fetch('/api/products?includeDeleted=true');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching products`);
    }

    const data = await res.json();
    if (!data.success || !Array.isArray(data.products)) {
      throw new Error('Invalid products payload from server');
    }

    const serverProducts = data.products;
    console.log(`[SyncQueue] Received ${serverProducts.length} product(s) from Neon.`);

    // Get all local records to respect pending local edits
    const localRecords = await getAllLocalRecords();
    const localMap = new Map(localRecords.map(p => [p.id, p]));

    const mergedToSaveLocally = [];

    for (const serverProd of serverProducts) {
      const local = localMap.get(serverProd.id);
      if (local && local.synced === false) {
        // Pending local edit exists: keep local version!
        console.log(`[SyncQueue] Preserving local pending changes for "${local.name}" (${local.id})`);
        mergedToSaveLocally.push(local);
      } else {
        // Server version is up-to-date
        mergedToSaveLocally.push({
          ...serverProd,
          synced: true
        });
      }
    }

    // Also include any new local items that haven't been created on server yet
    for (const local of localRecords) {
      if (!serverProducts.some(sp => sp.id === local.id)) {
        mergedToSaveLocally.push(local);
      }
    }

    // Save consolidated batch into IndexedDB
    await saveLocalProductsBatch(mergedToSaveLocally);

    // Return only active (non-deleted) products for UI state
    const activeProducts = mergedToSaveLocally.filter(p => !p.deleted);
    return activeProducts;
  } catch (err) {
    console.warn('[SyncQueue] Could not pull from Neon (offline or server error). Serving from IndexedDB:', err.message);
    return await getLocalProducts();
  }
}

/**
 * Full bidirectional synchronization:
 * 1. Push pending local writes to Neon.
 * 2. Pull updated database records from Neon and merge.
 */
export async function syncProductsFull() {
  // Step 1: push pending
  await flushQueue();
  // Step 2: pull & merge
  const products = await pullLatestFromServer();
  return products;
}
