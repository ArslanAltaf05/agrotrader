export const dynamic = 'force-static';

import { neon } from '@neondatabase/serverless';

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set on the server');
  }
  return neon(url);
}

// Convert database snake_case row to frontend camelCase product
function toCamel(row) {
  return {
    id: row.id,
    branchId: row.branch_id || 'branch-1',
    name: row.name,
    sku: row.sku || '',
    generic: row.generic || '',
    barcode: row.barcode || '',
    batchNo: row.batch_no || '',
    mfgDate: row.mfg_date || '',
    expiryDate: row.expiry_date || '',
    category: row.category || 'Fertilizers',
    manufacturer: row.manufacturer || '',
    unit: row.unit || 'bag',
    unitWeight: Number(row.unit_weight) || 0,
    costPrice: Number(row.cost_price) || 0,
    salePrice: Number(row.sale_price) || 0,
    offerPrice: Number(row.offer_price) || 0,
    shopStock: Number(row.shop_stock) || 0,
    storeStock: Number(row.store_stock) || 0,
    alertQty: Number(row.alert_qty) || 10,
    location: row.location || 'Godown Main',
    flags: row.flags || { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: row.notes || '',
    deleted: Boolean(row.deleted),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

// GET: Fetch all products from Neon
export async function GET(request) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    let rows;
    if (includeDeleted) {
      rows = await sql`SELECT * FROM products ORDER BY updated_at DESC`;
    } else {
      rows = await sql`SELECT * FROM products WHERE deleted = FALSE ORDER BY updated_at DESC`;
    }

    const products = rows.map(toCamel);
    return Response.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return Response.json(
      { success: false, error: err.message || 'Failed to fetch products from Neon database' },
      { status: 500 }
    );
  }
}

// POST: Batch upsert products to Neon
export async function POST(request) {
  try {
    const sql = getDb();
    const body = await request.json();

    // Support both single product and array of products
    const items = Array.isArray(body) ? body : (body.products ? body.products : [body]);
    if (!items.length) {
      return Response.json({ success: true, count: 0, syncedIds: [] });
    }

    const syncedIds = [];
    const now = new Date().toISOString();

    for (const p of items) {
      if (!p || !p.id) continue;

      const isDeleted = Boolean(p.deleted);
      if (isDeleted) {
        // Permanently remove from relational table
        await sql`DELETE FROM products WHERE id = ${p.id}`;

        // Also purge from agro_store_sync snapshot table
        try {
          const syncRows = await sql`SELECT tenant_id, products FROM agro_store_sync LIMIT 10`;
          for (const sRow of syncRows) {
            let pList = sRow.products;
            if (typeof pList === 'string') {
              try { pList = JSON.parse(pList); } catch (e) { pList = []; }
            }
            if (Array.isArray(pList) && pList.some(item => String(item.id) === String(p.id))) {
              const updatedList = pList.filter(item => String(item.id) !== String(p.id));
              await sql`UPDATE agro_store_sync SET products = ${JSON.stringify(updatedList)}::jsonb WHERE tenant_id = ${sRow.tenant_id}`;
            }
          }
        } catch (e) {
          console.warn('[Sync API] error purging deleted product from agro_store_sync:', e);
        }

        syncedIds.push(p.id);
        continue;
      }

      if (!p.name) continue;

      const flagsJson = JSON.stringify(p.flags || { active: true, narcotic: false, serialItem: false, keepRecord: true });

      await sql`
        INSERT INTO products (
          id, branch_id, name, sku, generic, barcode, batch_no,
          mfg_date, expiry_date, category, manufacturer, unit,
          unit_weight, cost_price, sale_price, offer_price,
          shop_stock, store_stock, alert_qty, location, flags,
          notes, deleted, updated_at
        ) VALUES (
          ${p.id},
          ${p.branchId || 'branch-1'},
          ${p.name},
          ${p.sku || ''},
          ${p.generic || ''},
          ${p.barcode || ''},
          ${p.batchNo || ''},
          ${p.mfgDate || ''},
          ${p.expiryDate || ''},
          ${p.category || 'Fertilizers'},
          ${p.manufacturer || ''},
          ${p.unit || 'bag'},
          ${Number(p.unitWeight) || 0},
          ${Number(p.costPrice) || 0},
          ${Number(p.salePrice) || 0},
          ${Number(p.offerPrice) || 0},
          ${Number(p.shopStock) || 0},
          ${Number(p.storeStock) || 0},
          ${Number(p.alertQty) || 10},
          ${p.location || 'Godown Main'},
          ${flagsJson}::jsonb,
          ${p.notes || ''},
          false,
          ${p.updatedAt || now}
        )
        ON CONFLICT (id) DO UPDATE SET
          branch_id = EXCLUDED.branch_id,
          name = EXCLUDED.name,
          sku = EXCLUDED.sku,
          generic = EXCLUDED.generic,
          barcode = EXCLUDED.barcode,
          batch_no = EXCLUDED.batch_no,
          mfg_date = EXCLUDED.mfg_date,
          expiry_date = EXCLUDED.expiry_date,
          category = EXCLUDED.category,
          manufacturer = EXCLUDED.manufacturer,
          unit = EXCLUDED.unit,
          unit_weight = EXCLUDED.unit_weight,
          cost_price = EXCLUDED.cost_price,
          sale_price = EXCLUDED.sale_price,
          offer_price = EXCLUDED.offer_price,
          shop_stock = EXCLUDED.shop_stock,
          store_stock = EXCLUDED.store_stock,
          alert_qty = EXCLUDED.alert_qty,
          location = EXCLUDED.location,
          flags = EXCLUDED.flags,
          notes = EXCLUDED.notes,
          deleted = false,
          updated_at = NOW();
      `;

      syncedIds.push(p.id);
    }

    console.log(`[Sync] Upserted/synced ${syncedIds.length} products to Neon DB`);

    return Response.json({
      success: true,
      syncedCount: syncedIds.length,
      syncedIds
    });
  } catch (err) {
    console.error('POST /api/products error:', err);
    return Response.json(
      { success: false, error: err.message || 'Failed to upsert products to Neon database' },
      { status: 500 }
    );
  }
}

// DELETE: Permanently delete product from Neon database
export async function DELETE(request) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ success: false, error: 'Product id is required' }, { status: 400 });
    }

    // 1. Delete from products table
    await sql`DELETE FROM products WHERE id = ${id}`;

    // 2. Also purge from agro_store_sync JSON products array
    try {
      const syncRows = await sql`SELECT tenant_id, products FROM agro_store_sync LIMIT 10`;
      for (const sRow of syncRows) {
        let pList = sRow.products;
        if (typeof pList === 'string') {
          try { pList = JSON.parse(pList); } catch (e) { pList = []; }
        }
        if (Array.isArray(pList) && pList.some(item => String(item.id) === String(id))) {
          const updatedList = pList.filter(item => String(item.id) !== String(id));
          await sql`UPDATE agro_store_sync SET products = ${JSON.stringify(updatedList)}::jsonb WHERE tenant_id = ${sRow.tenant_id}`;
        }
      }
    } catch (e) {
      console.warn('[DELETE /api/products] error purging from agro_store_sync:', e);
    }

    return Response.json({ success: true, id, deleted: true, removedFromNeon: true });
  } catch (err) {
    console.error('DELETE /api/products error:', err);
    return Response.json(
      { success: false, error: err.message || 'Failed to delete product in Neon database' },
      { status: 500 }
    );
  }
}
