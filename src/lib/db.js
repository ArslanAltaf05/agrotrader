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

export function mergeEntityLists(existingList = [], incomingList = []) {
  const mergedMap = new Map();

  // 1. Load existing items from DB (skip any item previously marked deleted or demo)
  const existingArr = Array.isArray(existingList)
    ? existingList
    : (typeof existingList === 'string' ? JSON.parse(existingList || '[]') : []);

  for (const item of existingArr) {
    if (item && item.id && !item.deleted && !DEMO_IDS.has(item.id) && !String(item.id).startsWith('demo-')) {
      mergedMap.set(String(item.id), item);
    }
  }

  // 2. Union with incoming items from device
  const incomingArr = Array.isArray(incomingList)
    ? incomingList
    : (typeof incomingList === 'string' ? JSON.parse(incomingList || '[]') : []);

  for (const item of incomingArr) {
    if (!item || !item.id || DEMO_IDS.has(item.id) || String(item.id).startsWith('demo-')) continue;
    const strId = String(item.id);

    // If incoming record is marked deleted, actively remove from map so it deletes from Neon DB!
    if (item.deleted === true) {
      mergedMap.delete(strId);
      continue;
    }

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
    }
  }

  // Filter out any deleted items and demo items before returning
  return filterOutDemo(Array.from(mergedMap.values()).filter(item => !item.deleted));
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
      if (!p || !p.id) continue;
      if (p.deleted === true) {
        await sql`DELETE FROM products WHERE id = ${p.id}`;
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
      if (!c || !c.id) continue;
      if (c.deleted === true) {
        await sql`DELETE FROM customers WHERE id = ${c.id}`;
        continue;
      }
      if (!c.name) continue;
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

    // Suppliers
    for (const s of (Array.isArray(suppliers) ? suppliers : [])) {
      if (s?.id && s.deleted === true) {
        await sql`DELETE FROM suppliers WHERE id = ${s.id}`;
      }
    }

    // Sales
    for (const sale of (Array.isArray(sales) ? sales : [])) {
      if (sale?.id && sale.deleted === true) {
        await sql`DELETE FROM sales WHERE id = ${sale.id}`;
      }
    }

    // Purchases
    for (const po of (Array.isArray(purchases) ? purchases : [])) {
      if (po?.id && po.deleted === true) {
        await sql`DELETE FROM purchases WHERE id = ${po.id}`;
      }
    }

    // Payments
    for (const pay of (Array.isArray(payments) ? payments : [])) {
      if (pay?.id && pay.deleted === true) {
        await sql`DELETE FROM payments WHERE id = ${pay.id}`;
      }
    }

    // Hold Stock
    for (const hs of (Array.isArray(holdStock) ? holdStock : [])) {
      if (hs?.id && hs.deleted === true) {
        await sql`DELETE FROM hold_stock WHERE id = ${hs.id}`;
      }
    }

    // Temp Ledger
    for (const tl of (Array.isArray(tempLedger) ? tempLedger : [])) {
      if (tl?.id && tl.deleted === true) {
        await sql`DELETE FROM temp_ledger WHERE id = ${tl.id}`;
      }
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
 * Helpers for parsing and mapping dynamic Neon DB records
 */
function safeParseJson(val, fallback = []) {
  if (!val) return fallback;
  if (Array.isArray(val) || typeof val === 'object') return val;
  try { return JSON.parse(val); } catch (e) { return fallback; }
}

function mapDbProduct(r) {
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    name: r.name,
    sku: r.sku || '',
    generic: r.generic || '',
    barcode: r.barcode || '',
    batchNo: r.batch_no || '',
    mfgDate: r.mfg_date || '',
    expiryDate: r.expiry_date || '',
    category: r.category || 'Fertilizers',
    manufacturer: r.manufacturer || '',
    unit: r.unit || 'bag',
    unitWeight: Number(r.unit_weight) || 0,
    costPrice: Number(r.cost_price) || 0,
    salePrice: Number(r.sale_price) || 0,
    offerPrice: Number(r.offer_price) || 0,
    shopStock: Number(r.shop_stock) || 0,
    storeStock: Number(r.store_stock) || 0,
    alertQty: Number(r.alert_qty) || 10,
    location: r.location || 'Godown Main',
    flags: r.flags || { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: r.notes || '',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapDbCustomer(r) {
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    name: r.name,
    fatherName: r.father_name || '',
    phone: r.phone || '',
    cnic: r.cnic || '',
    address: r.address || '',
    creditLimit: Number(r.credit_limit) || 0,
    openingBalance: Number(r.opening_balance) || 0,
    balance: Number(r.balance) || 0,
    notes: r.notes || '',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapDbSupplier(r) {
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    name: r.name,
    company: r.company || '',
    phone: r.phone || '',
    address: r.address || '',
    balance: Number(r.balance) || 0,
    notes: r.notes || '',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapDbSale(r) {
  let items = safeParseJson(r.items, []);
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    invoiceNo: r.invoice_no || r.id,
    date: r.date || '',
    customerId: r.customer_id || '',
    customerName: r.customer_name || 'Walk-in Farmer',
    paymentType: r.payment_type || 'cash',
    subtotal: Number(r.subtotal) || 0,
    discount: Number(r.discount) || 0,
    tax: Number(r.tax) || 0,
    total: Number(r.total) || 0,
    paid: Number(r.paid) || 0,
    balance: Number(r.balance) || 0,
    items: Array.isArray(items) ? items : [],
    notes: r.notes || '',
    status: r.status || 'Completed',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapDbPurchase(r) {
  let items = safeParseJson(r.items, []);
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    poNumber: r.po_number || r.id,
    date: r.date || '',
    supplierId: r.supplier_id || '',
    supplierName: r.supplier_name || '',
    items: Array.isArray(items) ? items : [],
    subtotal: Number(r.subtotal) || 0,
    tax: Number(r.tax) || 0,
    total: Number(r.total) || 0,
    paid: Number(r.paid) || 0,
    balance: Number(r.balance) || 0,
    status: r.status || 'Received',
    notes: r.notes || '',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapDbPayment(r) {
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    voucherNo: r.voucher_no || r.id,
    date: r.date || '',
    type: r.type || 'in',
    accountType: r.account_type || 'customer',
    accountId: r.account_id || '',
    accountName: r.account_name || '',
    amount: Number(r.amount) || 0,
    mode: r.payment_mode || 'Cash',
    paymentMode: r.payment_mode || 'Cash',
    reference: r.reference || '',
    notes: r.notes || '',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapDbHoldStock(r) {
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    bookingNo: r.booking_no || r.id,
    customerId: r.customer_id || '',
    customerName: r.customer_name || '',
    productId: r.product_id || '',
    productName: r.product_name || '',
    qty: Number(r.qty) || 0,
    unit: r.unit || 'bag',
    unitPrice: Number(r.unit_price) || 0,
    totalAmount: Number(r.total_amount) || 0,
    advancePaid: Number(r.advance_paid) || 0,
    remainingBalance: Number(r.remaining_balance) || 0,
    bookingDate: r.booking_date || '',
    expiryDate: r.expiry_date || '',
    status: r.status || 'Booked',
    notes: r.notes || '',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapDbTempLedger(r) {
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    date: r.date || '',
    partyName: r.party_name || '',
    personName: r.party_name || '',
    phone: r.phone || '',
    details: r.details || '',
    description: r.details || '',
    amount: Number(r.amount) || 0,
    type: r.type || 'Sale',
    status: r.status || 'Pending',
    isCleared: Boolean(r.is_cleared),
    notes: r.notes || '',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

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

    // 1. Fetch snapshot from agro_store_sync
    const syncRows = await sql`
      SELECT * FROM agro_store_sync 
      WHERE tenant_id = ${tenantId} 
      LIMIT 1;
    `;
    const row = (syncRows && syncRows.length > 0) ? syncRows[0] : null;

    // 2. Fetch live relational rows in parallel
    const [relProducts, relCustomers, relSuppliers, relSales, relPurchases, relPayments, relHoldStock, relTempLedger] = await Promise.all([
      sql`SELECT * FROM products WHERE deleted = FALSE ORDER BY updated_at DESC;`.catch(() => []),
      sql`SELECT * FROM customers WHERE deleted = FALSE ORDER BY updated_at DESC;`.catch(() => []),
      sql`SELECT * FROM suppliers WHERE deleted = FALSE ORDER BY updated_at DESC;`.catch(() => []),
      sql`SELECT * FROM sales WHERE deleted = FALSE ORDER BY updated_at DESC;`.catch(() => []),
      sql`SELECT * FROM purchases WHERE deleted = FALSE ORDER BY updated_at DESC;`.catch(() => []),
      sql`SELECT * FROM payments WHERE deleted = FALSE ORDER BY updated_at DESC;`.catch(() => []),
      sql`SELECT * FROM hold_stock WHERE deleted = FALSE ORDER BY updated_at DESC;`.catch(() => []),
      sql`SELECT * FROM temp_ledger WHERE deleted = FALSE ORDER BY updated_at DESC;`.catch(() => [])
    ]);

    // 3. Union merge snapshot JSON arrays with active relational SQL tables
    const snapProducts = safeParseJson(row?.products, []);
    const snapCustomers = safeParseJson(row?.customers, []);
    const snapSuppliers = safeParseJson(row?.suppliers, []);
    const snapSales = safeParseJson(row?.sales, []);
    const snapPurchases = safeParseJson(row?.purchases, []);
    const snapPayments = safeParseJson(row?.payments, []);
    const snapHoldStock = safeParseJson(row?.hold_stock, []);
    const snapTempLedger = safeParseJson(row?.temp_ledger, []);

    const dynamicProducts = mergeEntityLists(snapProducts, (relProducts || []).map(mapDbProduct));
    const dynamicCustomers = mergeEntityLists(snapCustomers, (relCustomers || []).map(mapDbCustomer));
    const dynamicSuppliers = mergeEntityLists(snapSuppliers, (relSuppliers || []).map(mapDbSupplier));
    const dynamicSales = mergeEntityLists(snapSales, (relSales || []).map(mapDbSale));
    const dynamicPurchases = mergeEntityLists(snapPurchases, (relPurchases || []).map(mapDbPurchase));
    const dynamicPayments = mergeEntityLists(snapPayments, (relPayments || []).map(mapDbPayment));
    const dynamicHoldStock = mergeEntityLists(snapHoldStock, (relHoldStock || []).map(mapDbHoldStock));
    const dynamicTempLedger = mergeEntityLists(snapTempLedger, (relTempLedger || []).map(mapDbTempLedger));

    const branches = safeParseJson(row?.branches, []);
    const tenants = safeParseJson(row?.tenants, []);
    const tenantUsers = safeParseJson(row?.tenant_users, []);
    const storeProfile = row?.store_profile ? (typeof row.store_profile === 'string' ? JSON.parse(row.store_profile) : row.store_profile) : null;

    return {
      success: true,
      configured: true,
      found: Boolean(row || dynamicProducts.length > 0 || dynamicCustomers.length > 0),
      tenantId: row?.tenant_id || tenantId,
      storeName: row?.store_name || storeProfile?.name || 'Asmat Agro Traders Retra',
      lastSyncedAt: row?.last_synced_at || new Date().toISOString(),
      data: {
        storeProfile,
        products: dynamicProducts,
        customers: dynamicCustomers,
        suppliers: dynamicSuppliers,
        sales: dynamicSales,
        purchases: dynamicPurchases,
        payments: dynamicPayments,
        holdStock: dynamicHoldStock,
        tempLedger: dynamicTempLedger,
        branches,
        tenants,
        tenantUsers
      }
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

/**
 * Permanently deletes an entry from Neon Serverless PostgreSQL.
 * Deletes from relational table and purges from agro_store_sync JSON snapshot.
 */
export async function deleteFromNeon(tableName, id, tenantId = 'tenant-1') {
  if (!isNeonConfigured() || !id) {
    return { success: false, configured: false };
  }

  const sql = getSql();
  if (!sql) {
    return { success: false, configured: false, error: 'Database client unavailable' };
  }

  try {
    // 1. Delete from relational table
    if (tableName === 'products') await sql`DELETE FROM products WHERE id = ${id}`;
    else if (tableName === 'customers') await sql`DELETE FROM customers WHERE id = ${id}`;
    else if (tableName === 'suppliers') await sql`DELETE FROM suppliers WHERE id = ${id}`;
    else if (tableName === 'sales') await sql`DELETE FROM sales WHERE id = ${id}`;
    else if (tableName === 'purchases') await sql`DELETE FROM purchases WHERE id = ${id}`;
    else if (tableName === 'payments') await sql`DELETE FROM payments WHERE id = ${id}`;
    else if (tableName === 'hold_stock' || tableName === 'holdStock') await sql`DELETE FROM hold_stock WHERE id = ${id}`;
    else if (tableName === 'temp_ledger' || tableName === 'tempLedger') await sql`DELETE FROM temp_ledger WHERE id = ${id}`;

    // 2. Also purge from agro_store_sync JSON snapshot so it never resurrects on subsequent pull
    const rows = await sql`
      SELECT * FROM agro_store_sync WHERE tenant_id = ${tenantId} LIMIT 1;
    `;
    if (rows && rows.length > 0) {
      const row = rows[0];
      const colMap = {
        products: 'products',
        customers: 'customers',
        suppliers: 'suppliers',
        sales: 'sales',
        purchases: 'purchases',
        payments: 'payments',
        hold_stock: 'hold_stock',
        holdStock: 'hold_stock',
        temp_ledger: 'temp_ledger',
        tempLedger: 'temp_ledger',
        tenants: 'tenants',
        tenant_users: 'tenant_users',
        tenantUsers: 'tenant_users'
      };

      const col = colMap[tableName] || tableName;
      let items = row[col] || [];
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch (e) { items = []; }
      }

      if (Array.isArray(items)) {
        const filtered = items.filter(x => String(x.id) !== String(id));
        if (col === 'products') await sql`UPDATE agro_store_sync SET products = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'customers') await sql`UPDATE agro_store_sync SET customers = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'suppliers') await sql`UPDATE agro_store_sync SET suppliers = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'sales') await sql`UPDATE agro_store_sync SET sales = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'purchases') await sql`UPDATE agro_store_sync SET purchases = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'payments') await sql`UPDATE agro_store_sync SET payments = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'hold_stock') await sql`UPDATE agro_store_sync SET hold_stock = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'temp_ledger') await sql`UPDATE agro_store_sync SET temp_ledger = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'tenants') await sql`UPDATE agro_store_sync SET tenants = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
        else if (col === 'tenant_users') await sql`UPDATE agro_store_sync SET tenant_users = ${JSON.stringify(filtered)}::jsonb, last_synced_at = NOW() WHERE tenant_id = ${tenantId}`;
      }
    }

    // 3. Log audit event
    await sql`
      INSERT INTO agro_sync_logs (tenant_id, action, details)
      VALUES (${tenantId}, 'DELETE_ENTRY', ${`Deleted ${tableName} entry ${id} from Neon DB`});
    `;

    console.log(`[Neon DB] Deleted ${tableName} record ${id}`);
    return { success: true, deleted: true, id, tableName };
  } catch (err) {
    console.error(`[Neon DB] Error deleting ${tableName} record ${id}:`, err);
    return { success: false, error: err.message };
  }
}
