import { neon } from '@neondatabase/serverless';

const DEFAULT_NEON_URL = "postgresql://neondb_owner:npg_qXaY4pnsm6Rf@ep-super-cloud-b7l7ud0o-pooler.c-13.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export function getDatabaseUrl() {
  const envUrl = (typeof process !== 'undefined' && process.env)
    ? (process.env.NEXT_PUBLIC_NEON_DATABASE_URL || process.env.DATABASE_URL)
    : '';
  return envUrl || DEFAULT_NEON_URL;
}

export function isNeonConfigured() {
  const url = getDatabaseUrl();
  return Boolean(url && !url.includes('YOUR_NEON_PASSWORD') && url.startsWith('postgres'));
}

export function getSql() {
  const url = getDatabaseUrl();
  if (!isNeonConfigured()) {
    return null;
  }
  return neon(url);
}

/**
 * Multi-device array union helper:
 * Combines existing items in Neon with incoming items from the syncing device.
 * Never flushes or deletes items from other devices.
 * For items with matching IDs, uses the newer updatedAt timestamp.
 */
export function mergeEntityLists(existingList = [], incomingList = []) {
  const mergedMap = new Map();

  // 1. Load existing items from DB
  const existingArr = Array.isArray(existingList)
    ? existingList
    : (typeof existingList === 'string' ? JSON.parse(existingList || '[]') : []);

  for (const item of existingArr) {
    if (item && item.id) {
      mergedMap.set(String(item.id), item);
    }
  }

  // 2. Union with incoming items from device
  const incomingArr = Array.isArray(incomingList)
    ? incomingList
    : (typeof incomingList === 'string' ? JSON.parse(incomingList || '[]') : []);

  for (const item of incomingArr) {
    if (!item || !item.id) continue;
    const strId = String(item.id);
    const existingItem = mergedMap.get(strId);

    if (!existingItem) {
      // New item from this device: add to set
      mergedMap.set(strId, item);
    } else {
      // Both exist: compare timestamps so the newest update wins
      const existingTime = new Date(existingItem.updatedAt || existingItem.updated_at || 0).getTime();
      const incomingTime = new Date(item.updatedAt || item.updated_at || 0).getTime();

      if (incomingTime >= existingTime) {
        mergedMap.set(strId, { ...existingItem, ...item });
      }
      // If DB already has newer timestamp, keep existingItem
    }
  }

  return Array.from(mergedMap.values());
}

/**
 * Initializes required tables in Neon Serverless Postgres
 */
export async function initNeonDatabase() {
  const sql = getSql();
  if (!sql) {
    return { success: false, configured: false, message: 'Neon DB is not configured in .env' };
  }

  try {
    // 1. Master multi-tenant store backup table
    await sql`
      CREATE TABLE IF NOT EXISTS agro_store_sync (
        tenant_id VARCHAR(100) PRIMARY KEY,
        store_name VARCHAR(255),
        store_profile JSONB,
        products JSONB,
        customers JSONB,
        suppliers JSONB,
        sales JSONB,
        purchases JSONB,
        payments JSONB,
        hold_stock JSONB,
        temp_ledger JSONB,
        branches JSONB,
        tenants JSONB,
        tenant_users JSONB,
        last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        synced_by VARCHAR(100),
        device_info JSONB
      );
    `;

    // 2. Audit & Sync Event Log
    await sql`
      CREATE TABLE IF NOT EXISTS agro_sync_logs (
        id SERIAL PRIMARY KEY,
        tenant_id VARCHAR(100),
        action VARCHAR(50),
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Relational Tables for Multi-Device SQL Replication
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        branch_id VARCHAR(100),
        name VARCHAR(255),
        sku VARCHAR(100),
        generic VARCHAR(255),
        barcode VARCHAR(100),
        batch_no VARCHAR(100),
        mfg_date VARCHAR(50),
        expiry_date VARCHAR(50),
        category VARCHAR(100),
        manufacturer VARCHAR(255),
        unit VARCHAR(50),
        unit_weight NUMERIC DEFAULT 0,
        cost_price NUMERIC DEFAULT 0,
        sale_price NUMERIC DEFAULT 0,
        offer_price NUMERIC DEFAULT 0,
        shop_stock NUMERIC DEFAULT 0,
        store_stock NUMERIC DEFAULT 0,
        alert_qty NUMERIC DEFAULT 10,
        location VARCHAR(100),
        flags JSONB,
        notes TEXT,
        deleted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(100) PRIMARY KEY,
        branch_id VARCHAR(100),
        name VARCHAR(255),
        father_name VARCHAR(255),
        phone VARCHAR(50),
        cnic VARCHAR(50),
        address TEXT,
        credit_limit NUMERIC DEFAULT 0,
        opening_balance NUMERIC DEFAULT 0,
        balance NUMERIC DEFAULT 0,
        notes TEXT,
        deleted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS suppliers (
        id VARCHAR(100) PRIMARY KEY,
        branch_id VARCHAR(100),
        name VARCHAR(255),
        company VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        balance NUMERIC DEFAULT 0,
        notes TEXT,
        deleted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(100) PRIMARY KEY,
        branch_id VARCHAR(100),
        invoice_no VARCHAR(100),
        date VARCHAR(50),
        customer_id VARCHAR(100),
        customer_name VARCHAR(255),
        payment_type VARCHAR(50),
        subtotal NUMERIC DEFAULT 0,
        discount NUMERIC DEFAULT 0,
        tax NUMERIC DEFAULT 0,
        total NUMERIC DEFAULT 0,
        paid NUMERIC DEFAULT 0,
        balance NUMERIC DEFAULT 0,
        items JSONB,
        notes TEXT,
        status VARCHAR(50),
        deleted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS purchases (
        id VARCHAR(100) PRIMARY KEY,
        branch_id VARCHAR(100),
        po_number VARCHAR(100),
        date VARCHAR(50),
        supplier_id VARCHAR(100),
        supplier_name VARCHAR(255),
        items JSONB,
        subtotal NUMERIC DEFAULT 0,
        tax NUMERIC DEFAULT 0,
        total NUMERIC DEFAULT 0,
        paid NUMERIC DEFAULT 0,
        balance NUMERIC DEFAULT 0,
        status VARCHAR(50),
        notes TEXT,
        deleted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(100) PRIMARY KEY,
        branch_id VARCHAR(100),
        voucher_no VARCHAR(100),
        date VARCHAR(50),
        type VARCHAR(50),
        account_type VARCHAR(50),
        account_id VARCHAR(100),
        account_name VARCHAR(255),
        amount NUMERIC DEFAULT 0,
        payment_mode VARCHAR(50),
        reference VARCHAR(255),
        notes TEXT,
        deleted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS hold_stock (
        id VARCHAR(100) PRIMARY KEY,
        branch_id VARCHAR(100),
        booking_no VARCHAR(100),
        customer_id VARCHAR(100),
        customer_name VARCHAR(255),
        product_id VARCHAR(100),
        product_name VARCHAR(255),
        qty NUMERIC DEFAULT 0,
        unit VARCHAR(50),
        unit_price NUMERIC DEFAULT 0,
        total_amount NUMERIC DEFAULT 0,
        advance_paid NUMERIC DEFAULT 0,
        remaining_balance NUMERIC DEFAULT 0,
        booking_date VARCHAR(50),
        expiry_date VARCHAR(50),
        status VARCHAR(50),
        notes TEXT,
        deleted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS temp_ledger (
        id VARCHAR(100) PRIMARY KEY,
        branch_id VARCHAR(100),
        date VARCHAR(50),
        person_name VARCHAR(255),
        phone VARCHAR(50),
        description TEXT,
        amount NUMERIC DEFAULT 0,
        type VARCHAR(50),
        is_cleared BOOLEAN DEFAULT FALSE,
        notes TEXT,
        deleted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return { success: true, configured: true, message: 'Neon DB schema initialized successfully' };
  } catch (error) {
    console.error('Neon DB initialization error:', error);
    return { success: false, configured: true, error: error.message };
  }
}

/**
 * Saves store state to Neon Serverless PostgreSQL with non-destructive two-way union merge.
 * Multi-device safe: Device B will NEVER overwrite or flush Device A's data!
 */
export async function saveToNeon(payload) {
  if (!isNeonConfigured()) {
    return {
      success: true,
      configured: false,
      synced: false,
      message: 'Local offline storage active. To replicate to cloud, enter your Neon credentials in .env'
    };
  }

  const sql = getSql();
  if (!sql) {
    return { success: false, configured: false, error: 'Database client unavailable' };
  }

  const {
    tenantId = 'tenant-1',
    storeName = 'Agro Store',
    storeProfile = null,
    products = [],
    customers = [],
    suppliers = [],
    sales = [],
    purchases = [],
    payments = [],
    holdStock = [],
    tempLedger = [],
    branches = [],
    tenants = [],
    tenantUsers = [],
    syncedBy = 'Store Admin',
    deviceInfo = {}
  } = payload;

  try {
    await initNeonDatabase();

    // 1. Fetch current cloud state for this tenant to perform non-destructive union merge
    const existingRows = await sql`
      SELECT * FROM agro_store_sync WHERE tenant_id = ${tenantId} LIMIT 1;
    `;
    const existing = (existingRows && existingRows.length > 0) ? existingRows[0] : null;

    // 2. Perform union merge across all 8 core entities
    const mergedProducts = mergeEntityLists(existing?.products, products);
    const mergedCustomers = mergeEntityLists(existing?.customers, customers);
    const mergedSuppliers = mergeEntityLists(existing?.suppliers, suppliers);
    const mergedSales = mergeEntityLists(existing?.sales, sales);
    const mergedPurchases = mergeEntityLists(existing?.purchases, purchases);
    const mergedPayments = mergeEntityLists(existing?.payments, payments);
    const mergedHoldStock = mergeEntityLists(existing?.hold_stock, holdStock);
    const mergedTempLedger = mergeEntityLists(existing?.temp_ledger, tempLedger);

    const mergedBranches = (Array.isArray(branches) && branches.length > 0)
      ? branches
      : (existing?.branches || []);
    const mergedTenants = (Array.isArray(tenants) && tenants.length > 0)
      ? tenants
      : (existing?.tenants || []);
    const mergedTenantUsers = (Array.isArray(tenantUsers) && tenantUsers.length > 0)
      ? tenantUsers
      : (existing?.tenant_users || []);
    const mergedStoreProfile = storeProfile || existing?.store_profile || null;
    const finalStoreName = storeName || existing?.store_name || 'Agro Store';

    const now = new Date().toISOString();

    // 3. Upsert the merged union into agro_store_sync
    await sql`
      INSERT INTO agro_store_sync (
        tenant_id,
        store_name,
        store_profile,
        products,
        customers,
        suppliers,
        sales,
        purchases,
        payments,
        hold_stock,
        temp_ledger,
        branches,
        tenants,
        tenant_users,
        last_synced_at,
        synced_by,
        device_info
      ) VALUES (
        ${tenantId},
        ${finalStoreName},
        ${JSON.stringify(mergedStoreProfile)},
        ${JSON.stringify(mergedProducts)},
        ${JSON.stringify(mergedCustomers)},
        ${JSON.stringify(mergedSuppliers)},
        ${JSON.stringify(mergedSales)},
        ${JSON.stringify(mergedPurchases)},
        ${JSON.stringify(mergedPayments)},
        ${JSON.stringify(mergedHoldStock)},
        ${JSON.stringify(mergedTempLedger)},
        ${JSON.stringify(mergedBranches)},
        ${JSON.stringify(mergedTenants)},
        ${JSON.stringify(mergedTenantUsers)},
        ${now},
        ${syncedBy},
        ${JSON.stringify(deviceInfo)}
      )
      ON CONFLICT (tenant_id) DO UPDATE SET
        store_name = EXCLUDED.store_name,
        store_profile = EXCLUDED.store_profile,
        products = EXCLUDED.products,
        customers = EXCLUDED.customers,
        suppliers = EXCLUDED.suppliers,
        sales = EXCLUDED.sales,
        purchases = EXCLUDED.purchases,
        payments = EXCLUDED.payments,
        hold_stock = EXCLUDED.hold_stock,
        temp_ledger = EXCLUDED.temp_ledger,
        branches = EXCLUDED.branches,
        tenants = EXCLUDED.tenants,
        tenant_users = EXCLUDED.tenant_users,
        last_synced_at = EXCLUDED.last_synced_at,
        synced_by = EXCLUDED.synced_by,
        device_info = EXCLUDED.device_info;
    `;

    // 4. Also upsert items into relational tables so SQL queries and individual table sync stay up-to-date
    const itemsToUpsert = (Array.isArray(products) && products.length > 0) ? products : mergedProducts;
    for (const p of itemsToUpsert) {
      if (!p || !p.id || !p.name) continue;
      const flagsJson = JSON.stringify(p.flags || { active: true, narcotic: false, serialItem: false, keepRecord: true });
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
          deleted = EXCLUDED.deleted, updated_at = EXCLUDED.updated_at;
      `;
    }

    const customersToUpsert = (Array.isArray(customers) && customers.length > 0) ? customers : mergedCustomers;
    for (const c of customersToUpsert) {
      if (!c || !c.id || !c.name) continue;
      await sql`
        INSERT INTO customers (
          id, branch_id, name, father_name, phone, cnic,
          address, credit_limit, opening_balance, balance, notes,
          deleted, updated_at
        ) VALUES (
          ${c.id}, ${c.branchId || 'branch-1'}, ${c.name}, ${c.fatherName || ''},
          ${c.phone || ''}, ${c.cnic || ''}, ${c.address || ''},
          ${Number(c.creditLimit) || 0}, ${Number(c.openingBalance) || 0},
          ${Number(c.balance) || 0}, ${c.notes || ''}, ${Boolean(c.deleted)},
          ${c.updatedAt || now}
        )
        ON CONFLICT (id) DO UPDATE SET
          branch_id = EXCLUDED.branch_id, name = EXCLUDED.name, father_name = EXCLUDED.father_name,
          phone = EXCLUDED.phone, cnic = EXCLUDED.cnic, address = EXCLUDED.address,
          credit_limit = EXCLUDED.credit_limit, opening_balance = EXCLUDED.opening_balance,
          balance = EXCLUDED.balance, notes = EXCLUDED.notes, deleted = EXCLUDED.deleted,
          updated_at = EXCLUDED.updated_at;
      `;
    }

    // 5. Add audit log
    await sql`
      INSERT INTO agro_sync_logs (tenant_id, action, details)
      VALUES (
        ${tenantId},
        'SYNC_PUSH',
        ${`Multi-Device Sync by ${syncedBy}: Total ${mergedProducts.length} products, ${mergedCustomers.length} customers, ${mergedSales.length} sales preserved.`}
      );
    `;

    return {
      success: true,
      configured: true,
      synced: true,
      lastSyncedAt: now,
      tenantId,
      mergedCounts: {
        products: mergedProducts.length,
        customers: mergedCustomers.length,
        suppliers: mergedSuppliers.length,
        sales: mergedSales.length,
        purchases: mergedPurchases.length,
        payments: mergedPayments.length,
        holdStock: mergedHoldStock.length,
        tempLedger: mergedTempLedger.length
      },
      message: `Multi-device union sync successful: ${mergedProducts.length} products & ${mergedSales.length} sales preserved in Neon.`
    };
  } catch (error) {
    console.error('saveToNeon error:', error);
    return {
      success: false,
      configured: true,
      synced: false,
      error: error.message
    };
  }
}

/**
 * Loads store state from Neon Serverless PostgreSQL
 */
export async function loadFromNeon(tenantId = 'tenant-1') {
  if (!isNeonConfigured()) {
    return {
      success: false,
      configured: false,
      message: 'Neon DB is not configured in .env'
    };
  }

  const sql = getSql();
  if (!sql) {
    return { success: false, configured: false, error: 'Database client unavailable' };
  }

  try {
    await initNeonDatabase();
    const rows = await sql`
      SELECT * FROM agro_store_sync 
      WHERE tenant_id = ${tenantId} 
      LIMIT 1;
    `;

    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        success: true,
        configured: true,
        found: true,
        tenantId: row.tenant_id,
        storeName: row.store_name,
        lastSyncedAt: row.last_synced_at,
        data: {
          storeProfile: row.store_profile,
          products: row.products,
          customers: row.customers,
          suppliers: row.suppliers,
          sales: row.sales,
          purchases: row.purchases,
          payments: row.payments,
          holdStock: row.hold_stock,
          tempLedger: row.temp_ledger,
          branches: row.branches,
          tenants: row.tenants,
          tenantUsers: row.tenant_users
        }
      };
    }

    return {
      success: true,
      configured: true,
      found: false,
      message: `No cloud snapshot found in Neon DB for ${tenantId}.`
    };
  } catch (error) {
    console.error('loadFromNeon error:', error);
    return {
      success: false,
      configured: true,
      error: error.message
    };
  }
}

/**
 * Health check for Neon DB connection
 */
export async function testNeonConnection() {
  if (!isNeonConfigured()) {
    return { configured: false, message: 'Neon DB is not configured in .env' };
  }
  const sql = getSql();
  try {
    const start = performance.now();
    const rows = await sql`SELECT NOW() as current_time;`;
    const latency = Math.round(performance.now() - start);
    return {
      configured: true,
      connected: true,
      neonTime: rows[0]?.current_time,
      latencyMs: latency,
      message: `Successfully connected to Neon Serverless PostgreSQL (${latency}ms latency)`
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      error: error.message
    };
  }
}
