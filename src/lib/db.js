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

    return { success: true, configured: true, message: 'Neon DB schema initialized successfully' };
  } catch (error) {
    console.error('Neon DB initialization error:', error);
    return { success: false, configured: true, error: error.message };
  }
}

/**
 * Saves entire store state to Neon Serverless PostgreSQL
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

    const now = new Date().toISOString();

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
        ${storeName},
        ${JSON.stringify(storeProfile)},
        ${JSON.stringify(products)},
        ${JSON.stringify(customers)},
        ${JSON.stringify(suppliers)},
        ${JSON.stringify(sales)},
        ${JSON.stringify(purchases)},
        ${JSON.stringify(payments)},
        ${JSON.stringify(holdStock)},
        ${JSON.stringify(tempLedger)},
        ${JSON.stringify(branches)},
        ${JSON.stringify(tenants)},
        ${JSON.stringify(tenantUsers)},
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

    // Add log
    await sql`
      INSERT INTO agro_sync_logs (tenant_id, action, details)
      VALUES (
        ${tenantId},
        'SYNC_PUSH',
        ${`Synced ${products.length} products, ${sales.length} sales, ${customers.length} farmers by ${syncedBy}`}
      );
    `;

    return {
      success: true,
      configured: true,
      synced: true,
      lastSyncedAt: now,
      tenantId,
      message: 'All ledgers and transactions saved to Neon PostgreSQL Database!'
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
