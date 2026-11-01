import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}
const sql = neon(url);

// In-memory simulation of client-side IndexedDB store
class SimulatedIndexedDB {
  constructor(name) {
    this.name = name;
    this.items = new Map();
  }

  put(item) {
    this.items.set(item.id, { ...item });
  }

  getAll() {
    return Array.from(this.items.values());
  }

  getPending() {
    return Array.from(this.items.values()).filter(i => i.synced === false);
  }

  markSynced(ids) {
    for (const id of ids) {
      if (this.items.has(id)) {
        this.items.get(id).synced = true;
      }
    }
  }

  // Exact implementation of mergeStore (Step 3)
  mergeFromServer(serverList) {
    const localMap = new Map(this.items);
    const serverIdSet = new Set(serverList.map(s => s.id));
    const mergedMap = new Map();

    // 1. Process server items
    for (const serverItem of serverList) {
      if (!serverItem || !serverItem.id) continue;
      const local = localMap.get(serverItem.id);

      if (local) {
        if (local.synced === false) {
          mergedMap.set(local.id, local);
        } else {
          const localTime = new Date(local.updatedAt || local.updated_at || 0).getTime();
          const serverTime = new Date(serverItem.updatedAt || serverItem.updated_at || 0).getTime();
          if (serverTime >= localTime) {
            mergedMap.set(serverItem.id, { ...serverItem, synced: true });
          } else {
            mergedMap.set(local.id, local);
          }
        }
      } else {
        mergedMap.set(serverItem.id, { ...serverItem, synced: true });
      }
    }

    // 2. Process local-only items
    for (const local of localMap.values()) {
      if (!serverIdSet.has(local.id)) {
        mergedMap.set(local.id, local);
      }
    }

    // Update store
    this.items = mergedMap;
    return Array.from(mergedMap.values()).filter(i => !i.deleted);
  }
}

// Server upsert function (matching Step 2 in /api/sync)
async function serverUpsertProducts(products) {
  const syncedIds = [];
  const now = new Date().toISOString();

  for (const p of products) {
    if (!p.id || !p.name) continue;
    const flagsJson = JSON.stringify(p.flags || { active: true });

    await sql`
      INSERT INTO products (
        id, branch_id, name, sku, generic, barcode, batch_no,
        mfg_date, expiry_date, category, manufacturer, unit,
        unit_weight, cost_price, sale_price, offer_price,
        shop_stock, store_stock, alert_qty, location, flags,
        notes, deleted, updated_at
      ) VALUES (
        ${p.id}, ${p.branchId || 'branch-1'}, ${p.name}, ${p.sku || ''},
        ${p.generic || ''}, ${p.barcode || ''}, ${p.batchNo || ''},
        ${p.mfgDate || ''}, ${p.expiryDate || ''}, ${p.category || 'Fertilizers'},
        ${p.manufacturer || ''}, ${p.unit || 'bag'}, ${Number(p.unitWeight) || 0},
        ${Number(p.costPrice) || 0}, ${Number(p.salePrice) || 0}, ${Number(p.offerPrice) || 0},
        ${Number(p.shopStock) || 0}, ${Number(p.storeStock) || 0}, ${Number(p.alertQty) || 10},
        ${p.location || 'Godown Main'}, ${flagsJson}::jsonb, ${p.notes || ''},
        ${Boolean(p.deleted)}, ${p.updatedAt || now}
      )
      ON CONFLICT (id) DO UPDATE SET
        branch_id = EXCLUDED.branch_id, name = EXCLUDED.name, sku = EXCLUDED.sku,
        generic = EXCLUDED.generic, barcode = EXCLUDED.barcode, batch_no = EXCLUDED.batch_no,
        mfg_date = EXCLUDED.mfg_date, expiry_date = EXCLUDED.expiry_date, category = EXCLUDED.category,
        manufacturer = EXCLUDED.manufacturer, unit = EXCLUDED.unit, unit_weight = EXCLUDED.unit_weight,
        cost_price = EXCLUDED.cost_price, sale_price = EXCLUDED.sale_price, offer_price = EXCLUDED.offer_price,
        shop_stock = EXCLUDED.shop_stock, store_stock = EXCLUDED.store_stock, alert_qty = EXCLUDED.alert_qty,
        location = EXCLUDED.location, flags = EXCLUDED.flags, notes = EXCLUDED.notes,
        deleted = EXCLUDED.deleted, updated_at = NOW();
    `;
    syncedIds.push(p.id);
  }

  console.log(`[Sync] Upserted ${syncedIds.length} products, 0 deleted`);
  return syncedIds;
}

// Server pull function (matching GET /api/sync)
async function serverPullProducts() {
  const rows = await sql`SELECT * FROM products WHERE deleted = FALSE ORDER BY updated_at DESC`;
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    branchId: r.branch_id,
    salePrice: Number(r.sale_price),
    shopStock: Number(r.shop_stock),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    deleted: Boolean(r.deleted)
  }));
}

async function runTwoDeviceSimulation() {
  console.log('====================================================');
  console.log('🚀 STEP 4: Two-Device Offline Sync & Union Merge Test');
  console.log('====================================================\n');

  const testIds = ['prod-A1', 'prod-A2', 'prod-A3', 'prod-B1', 'prod-B2'];

  // Clean slate for test IDs
  for (const tid of testIds) {
    await sql`DELETE FROM products WHERE id = ${tid}`;
  }

  // --- DEVICE A SETUP ---
  console.log('📱 1. "Device A" creates 3 products offline (A1, A2, A3)...');
  const deviceA = new SimulatedIndexedDB('Device_A_Laptop');
  deviceA.put({ id: 'prod-A1', name: 'Product A1 (Urea Special)', salePrice: 4200, synced: false, updatedAt: new Date().toISOString() });
  deviceA.put({ id: 'prod-A2', name: 'Product A2 (DAP Gold)', salePrice: 11500, synced: false, updatedAt: new Date().toISOString() });
  deviceA.put({ id: 'prod-A3', name: 'Product A3 (Potash Plus)', salePrice: 8900, synced: false, updatedAt: new Date().toISOString() });

  console.log(`   Device A local products count: ${deviceA.getAll().length}`);

  // Device A syncs to Neon
  console.log('🌐 Device A goes online and syncs pending products to Neon...');
  const pendingA = deviceA.getPending();
  const syncedIdsA = await serverUpsertProducts(pendingA);
  deviceA.markSynced(syncedIdsA);

  // Verify Neon has A1, A2, A3
  const neonAfterA = await sql`SELECT id, name FROM products WHERE id IN (${testIds[0]}, ${testIds[1]}, ${testIds[2]})`;
  console.log(`   ✅ Neon now has ${neonAfterA.length} products from Device A:`, neonAfterA.map(p => p.id));

  // --- DEVICE B SETUP ---
  console.log('\n📱 2. "Device B" (fresh browser) creates 2 local products offline (B1, B2)...');
  const deviceB = new SimulatedIndexedDB('Device_B_Phone');
  deviceB.put({ id: 'prod-B1', name: 'Product B1 (Zinc Sulphate 33%)', salePrice: 2800, synced: false, updatedAt: new Date().toISOString() });
  deviceB.put({ id: 'prod-B2', name: 'Product B2 (Bio Fertilizer Liquid)', salePrice: 1950, synced: false, updatedAt: new Date().toISOString() });

  console.log(`   Device B local products count: ${deviceB.getAll().length}`);

  // --- DEVICE B SYNCS ---
  console.log('\n🌐 3. "Device B" goes online and runs sync:');
  console.log('   a) Device B pushes pending (B1, B2) via upsert...');
  const pendingB = deviceB.getPending();
  const syncedIdsB = await serverUpsertProducts(pendingB);
  deviceB.markSynced(syncedIdsB);

  console.log('   b) Device B pulls Neon products and performs two-way union merge...');
  const serverProductsForB = await serverPullProducts();
  const mergedB = deviceB.mergeFromServer(serverProductsForB);

  // --- VERIFY NEON ---
  console.log('\n🔍 4. Verification Check on Neon Database:');
  const allNeonTestProducts = await sql`SELECT id, name FROM products WHERE id = ANY(${testIds}) ORDER BY id`;
  console.log(`   Neon contains ${allNeonTestProducts.length} / 5 products:`);
  for (const p of allNeonTestProducts) {
    console.log(`     - [${p.id}] ${p.name}`);
  }

  if (allNeonTestProducts.length === 5) {
    console.log('   ✅ PASS: Neon contains ALL 5 products. NONE were deleted or wiped!');
  } else {
    console.error(`   ❌ FAIL: Neon has ${allNeonTestProducts.length} products instead of 5!`);
    process.exit(1);
  }

  // --- VERIFY DEVICE B ---
  console.log('\n🔍 5. Verification Check on Device B local store:');
  const deviceBList = deviceB.getAll().filter(p => testIds.includes(p.id)).sort((a,b) => a.id.localeCompare(b.id));
  console.log(`   Device B local store contains ${deviceBList.length} / 5 products:`);
  for (const p of deviceBList) {
    console.log(`     - [${p.id}] ${p.name} (synced: ${p.synced})`);
  }
  if (deviceBList.length === 5) {
    console.log('   ✅ PASS: Device B local store contains all 5 combined products!');
  } else {
    console.error(`   ❌ FAIL: Device B has ${deviceBList.length} products instead of 5!`);
    process.exit(1);
  }

  // --- TRIGGER DEVICE A SYNC ---
  console.log('\n🌐 6. Trigger Device A sync (Device A pulls Neon to merge B1, B2)...');
  const serverProductsForA = await serverPullProducts();
  const mergedA = deviceA.mergeFromServer(serverProductsForA);

  const deviceAList = deviceA.getAll().filter(p => testIds.includes(p.id)).sort((a,b) => a.id.localeCompare(b.id));
  console.log(`   Device A local store now contains ${deviceAList.length} / 5 products:`);
  for (const p of deviceAList) {
    console.log(`     - [${p.id}] ${p.name} (synced: ${p.synced})`);
  }
  if (deviceAList.length === 5) {
    console.log('   ✅ PASS: Device A now has all 5 combined products!');
  } else {
    console.error(`   ❌ FAIL: Device A has ${deviceAList.length} products instead of 5!`);
    process.exit(1);
  }

  // Clean up test records
  console.log('\n🧹 Cleaning up test records from Neon...');
  for (const tid of testIds) {
    await sql`DELETE FROM products WHERE id = ${tid}`;
  }
  console.log('   ✓ Cleanup complete.');

  console.log('\n====================================================');
  console.log('🎉 ALL TWO-DEVICE SYNC TESTS PASSED WITH 100% SUCCESS!');
  console.log('====================================================');
}

runTwoDeviceSimulation().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
