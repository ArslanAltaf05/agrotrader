export const dynamic = 'force-static';

import { neon } from '@neondatabase/serverless';

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set on the server');
  }
  return neon(url);
}

// Data Mappers: Database (snake_case) -> Frontend (camelCase)
function mapCustomer(r) {
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

function mapSupplier(r) {
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

function mapSale(r) {
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
    items: Array.isArray(r.items) ? r.items : (typeof r.items === 'string' ? JSON.parse(r.items) : []),
    notes: r.notes || '',
    status: r.status || 'Completed',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapPurchase(r) {
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    poNumber: r.po_number || r.id,
    date: r.date || '',
    supplierId: r.supplier_id || '',
    supplierName: r.supplier_name || '',
    items: Array.isArray(r.items) ? r.items : (typeof r.items === 'string' ? JSON.parse(r.items) : []),
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

function mapPayment(r) {
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

function mapHoldStock(r) {
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

function mapTempLedger(r) {
  return {
    id: r.id,
    branchId: r.branch_id || 'branch-1',
    date: r.date || '',
    personName: r.person_name || '',
    phone: r.phone || '',
    description: r.description || '',
    amount: Number(r.amount) || 0,
    type: r.type || 'debit',
    isCleared: Boolean(r.is_cleared),
    notes: r.notes || '',
    deleted: Boolean(r.deleted),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    synced: true
  };
}

function mapProduct(r) {
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

// GET /api/sync: Pull entire store dataset from Neon
export async function GET() {
  try {
    const sql = getDb();

    const [
      productsRows,
      customersRows,
      suppliersRows,
      salesRows,
      purchasesRows,
      paymentsRows,
      holdStockRows,
      tempLedgerRows
    ] = await Promise.all([
      sql`SELECT * FROM products WHERE COALESCE(deleted, FALSE) = FALSE ORDER BY updated_at DESC`,
      sql`SELECT * FROM customers WHERE COALESCE(deleted, FALSE) = FALSE ORDER BY updated_at DESC`,
      sql`SELECT * FROM suppliers WHERE COALESCE(deleted, FALSE) = FALSE ORDER BY updated_at DESC`,
      sql`SELECT * FROM sales WHERE COALESCE(deleted, FALSE) = FALSE ORDER BY updated_at DESC`,
      sql`SELECT * FROM purchases WHERE COALESCE(deleted, FALSE) = FALSE ORDER BY updated_at DESC`,
      sql`SELECT * FROM payments WHERE COALESCE(deleted, FALSE) = FALSE ORDER BY updated_at DESC`,
      sql`SELECT * FROM hold_stock WHERE COALESCE(deleted, FALSE) = FALSE ORDER BY updated_at DESC`,
      sql`SELECT * FROM temp_ledger WHERE COALESCE(deleted, FALSE) = FALSE ORDER BY updated_at DESC`
    ]);

    let products = productsRows.map(mapProduct);
    let customers = customersRows.map(mapCustomer);
    let suppliers = suppliersRows.map(mapSupplier);
    let sales = salesRows.map(mapSale);
    let purchases = purchasesRows.map(mapPurchase);
    let payments = paymentsRows.map(mapPayment);
    let holdStock = holdStockRows.map(mapHoldStock);
    let tempLedger = tempLedgerRows.map(mapTempLedger);

    // If relational tables are empty, fallback to agro_store_sync backup if available
    if (products.length === 0 && customers.length === 0 && sales.length === 0) {
      try {
        const backupRows = await sql`SELECT * FROM agro_store_sync LIMIT 1`;
        if (backupRows && backupRows.length > 0) {
          const b = backupRows[0];
          if (Array.isArray(b.products) && b.products.length > 0) products = b.products;
          if (Array.isArray(b.customers) && b.customers.length > 0) customers = b.customers;
          if (Array.isArray(b.suppliers) && b.suppliers.length > 0) suppliers = b.suppliers;
          if (Array.isArray(b.sales) && b.sales.length > 0) sales = b.sales;
          if (Array.isArray(b.purchases) && b.purchases.length > 0) purchases = b.purchases;
          if (Array.isArray(b.payments) && b.payments.length > 0) payments = b.payments;
          if (Array.isArray(b.hold_stock) && b.hold_stock.length > 0) holdStock = b.hold_stock;
          if (Array.isArray(b.temp_ledger) && b.temp_ledger.length > 0) tempLedger = b.temp_ledger;
        }
      } catch (e) {
        console.warn('Fallback to agro_store_sync error:', e);
      }
    }

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      products,
      customers,
      suppliers,
      sales,
      purchases,
      payments,
      holdStock,
      tempLedger
    });
  } catch (err) {
    console.error('GET /api/sync error:', err);
    return Response.json(
      { success: false, error: err.message || 'Failed to pull data from Neon' },
      { status: 500 }
    );
  }
}

// POST /api/sync: Batch push changes for all entities to Neon
export async function POST(request) {
  try {
    const sql = getDb();
    const body = await request.json();
    const now = new Date().toISOString();

    const syncedCounts = {
      products: 0,
      customers: 0,
      suppliers: 0,
      sales: 0,
      purchases: 0,
      payments: 0,
      holdStock: 0,
      tempLedger: 0
    };

    const syncedIds = {
      products: [],
      customers: [],
      suppliers: [],
      sales: [],
      purchases: [],
      payments: [],
      holdStock: [],
      tempLedger: []
    };

    // 1. Products
    if (Array.isArray(body.products) && body.products.length > 0) {
      for (const p of body.products) {
        if (!p || !p.id) continue;
        if (p.deleted === true) {
          await sql`DELETE FROM products WHERE id = ${p.id}`;
          syncedIds.products.push(p.id);
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
            deleted = EXCLUDED.deleted, updated_at = NOW();
        `;
        syncedIds.products.push(p.id);
      }
      syncedCounts.products = syncedIds.products.length;
    }

    // 2. Customers
    if (Array.isArray(body.customers) && body.customers.length > 0) {
      for (const c of body.customers) {
        if (!c || !c.id) continue;
        if (c.deleted === true) {
          await sql`DELETE FROM customers WHERE id = ${c.id}`;
          syncedIds.customers.push(c.id);
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
        syncedIds.customers.push(c.id);
      }
      syncedCounts.customers = syncedIds.customers.length;
    }

    // 3. Suppliers
    if (Array.isArray(body.suppliers) && body.suppliers.length > 0) {
      for (const s of body.suppliers) {
        if (!s || !s.id) continue;
        if (s.deleted === true) {
          await sql`DELETE FROM suppliers WHERE id = ${s.id}`;
          syncedIds.suppliers.push(s.id);
          continue;
        }
        if (!s.name) continue;
        await sql`
          INSERT INTO suppliers (
            id, branch_id, name, company, phone, address, balance, notes, deleted, updated_at
          ) VALUES (
            ${s.id}, ${s.branchId || 'branch-1'}, ${s.name}, ${s.company || ''},
            ${s.phone || ''}, ${s.address || ''}, ${Number(s.balance) || 0},
            ${s.notes || ''}, ${Boolean(s.deleted)}, ${s.updatedAt || now}
          )
          ON CONFLICT (id) DO UPDATE SET
            branch_id = EXCLUDED.branch_id, name = EXCLUDED.name, company = EXCLUDED.company,
            phone = EXCLUDED.phone, address = EXCLUDED.address, balance = EXCLUDED.balance,
            notes = EXCLUDED.notes, deleted = EXCLUDED.deleted, updated_at = EXCLUDED.updated_at;
        `;
        syncedIds.suppliers.push(s.id);
      }
      syncedCounts.suppliers = syncedIds.suppliers.length;
    }

    // 4. Sales
    if (Array.isArray(body.sales) && body.sales.length > 0) {
      for (const s of body.sales) {
        if (!s || !s.id) continue;
        if (s.deleted === true) {
          await sql`DELETE FROM sales WHERE id = ${s.id}`;
          syncedIds.sales.push(s.id);
          continue;
        }
        const itemsJson = JSON.stringify(s.items || []);
        await sql`
          INSERT INTO sales (
            id, branch_id, invoice_no, date, customer_id, customer_name,
            payment_type, subtotal, discount, tax, total, paid, balance,
            items, notes, status, deleted, updated_at
          ) VALUES (
            ${s.id}, ${s.branchId || 'branch-1'}, ${s.invoiceNo || s.id},
            ${s.date || ''}, ${s.customerId || ''}, ${s.customerName || 'Walk-in Farmer'},
            ${s.paymentType || 'cash'}, ${Number(s.subtotal) || 0}, ${Number(s.discount) || 0},
            ${Number(s.tax) || 0}, ${Number(s.total) || 0}, ${Number(s.paid) || 0},
            ${Number(s.balance) || 0}, ${itemsJson}::jsonb, ${s.notes || ''},
            ${s.status || 'Completed'}, ${Boolean(s.deleted)}, ${s.updatedAt || now}
          )
          ON CONFLICT (id) DO UPDATE SET
            branch_id = EXCLUDED.branch_id, invoice_no = EXCLUDED.invoice_no, date = EXCLUDED.date,
            customer_id = EXCLUDED.customer_id, customer_name = EXCLUDED.customer_name,
            payment_type = EXCLUDED.payment_type, subtotal = EXCLUDED.subtotal, discount = EXCLUDED.discount,
            tax = EXCLUDED.tax, total = EXCLUDED.total, paid = EXCLUDED.paid, balance = EXCLUDED.balance,
            items = EXCLUDED.items, notes = EXCLUDED.notes, status = EXCLUDED.status,
            deleted = EXCLUDED.deleted, updated_at = EXCLUDED.updated_at;
        `;
        syncedIds.sales.push(s.id);
      }
      syncedCounts.sales = syncedIds.sales.length;
    }

    // 5. Purchases
    if (Array.isArray(body.purchases) && body.purchases.length > 0) {
      for (const po of body.purchases) {
        if (!po || !po.id) continue;
        if (po.deleted === true) {
          await sql`DELETE FROM purchases WHERE id = ${po.id}`;
          syncedIds.purchases.push(po.id);
          continue;
        }
        const itemsJson = JSON.stringify(po.items || []);
        await sql`
          INSERT INTO purchases (
            id, branch_id, po_number, date, supplier_id, supplier_name,
            items, subtotal, tax, total, paid, balance, status, notes,
            deleted, updated_at
          ) VALUES (
            ${po.id}, ${po.branchId || 'branch-1'}, ${po.poNumber || po.id},
            ${po.date || ''}, ${po.supplierId || ''}, ${po.supplierName || ''},
            ${itemsJson}::jsonb, ${Number(po.subtotal) || 0}, ${Number(po.tax) || 0},
            ${Number(po.total) || 0}, ${Number(po.paid) || 0}, ${Number(po.balance) || 0},
            ${po.status || 'Received'}, ${po.notes || ''}, ${Boolean(po.deleted)},
            ${po.updatedAt || now}
          )
          ON CONFLICT (id) DO UPDATE SET
            branch_id = EXCLUDED.branch_id, po_number = EXCLUDED.po_number, date = EXCLUDED.date,
            supplier_id = EXCLUDED.supplier_id, supplier_name = EXCLUDED.supplier_name,
            items = EXCLUDED.items, subtotal = EXCLUDED.subtotal, tax = EXCLUDED.tax,
            total = EXCLUDED.total, paid = EXCLUDED.paid, balance = EXCLUDED.balance,
            status = EXCLUDED.status, notes = EXCLUDED.notes, deleted = EXCLUDED.deleted,
            updated_at = EXCLUDED.updated_at;
        `;
        syncedIds.purchases.push(po.id);
      }
      syncedCounts.purchases = syncedIds.purchases.length;
    }

    // 6. Payments
    if (Array.isArray(body.payments) && body.payments.length > 0) {
      for (const pay of body.payments) {
        if (!pay || !pay.id) continue;
        if (pay.deleted === true) {
          await sql`DELETE FROM payments WHERE id = ${pay.id}`;
          syncedIds.payments.push(pay.id);
          continue;
        }
        await sql`
          INSERT INTO payments (
            id, branch_id, voucher_no, date, type, account_type, account_id,
            account_name, amount, payment_mode, reference, notes, deleted, updated_at
          ) VALUES (
            ${pay.id}, ${pay.branchId || 'branch-1'}, ${pay.voucherNo || pay.id},
            ${pay.date || ''}, ${pay.type || 'in'}, ${pay.accountType || 'customer'},
            ${pay.accountId || ''}, ${pay.accountName || ''}, ${Number(pay.amount) || 0},
            ${pay.mode || pay.paymentMode || 'Cash'}, ${pay.reference || ''}, ${pay.notes || ''},
            ${Boolean(pay.deleted)}, ${pay.updatedAt || now}
          )
          ON CONFLICT (id) DO UPDATE SET
            branch_id = EXCLUDED.branch_id, voucher_no = EXCLUDED.voucher_no, date = EXCLUDED.date,
            type = EXCLUDED.type, account_type = EXCLUDED.account_type, account_id = EXCLUDED.account_id,
            account_name = EXCLUDED.account_name, amount = EXCLUDED.amount, payment_mode = EXCLUDED.payment_mode,
            reference = EXCLUDED.reference, notes = EXCLUDED.notes, deleted = EXCLUDED.deleted,
            updated_at = EXCLUDED.updated_at;
        `;
        syncedIds.payments.push(pay.id);
      }
      syncedCounts.payments = syncedIds.payments.length;
    }

    // 7. Hold Stock
    if (Array.isArray(body.holdStock) && body.holdStock.length > 0) {
      for (const h of body.holdStock) {
        if (!h || !h.id) continue;
        if (h.deleted === true) {
          await sql`DELETE FROM hold_stock WHERE id = ${h.id}`;
          syncedIds.holdStock.push(h.id);
          continue;
        }
        await sql`
          INSERT INTO hold_stock (
            id, branch_id, booking_no, customer_id, customer_name,
            product_id, product_name, qty, unit, unit_price, total_amount,
            advance_paid, remaining_balance, booking_date, expiry_date,
            status, notes, deleted, updated_at
          ) VALUES (
            ${h.id}, ${h.branchId || 'branch-1'}, ${h.bookingNo || h.id},
            ${h.customerId || ''}, ${h.customerName || ''}, ${h.productId || ''},
            ${h.productName || ''}, ${Number(h.qty) || 0}, ${h.unit || 'bag'},
            ${Number(h.unitPrice) || 0}, ${Number(h.totalAmount) || 0},
            ${Number(h.advancePaid) || 0}, ${Number(h.remainingBalance) || 0},
            ${h.bookingDate || ''}, ${h.expiryDate || ''}, ${h.status || 'Booked'},
            ${h.notes || ''}, ${Boolean(h.deleted)}, ${h.updatedAt || now}
          )
          ON CONFLICT (id) DO UPDATE SET
            branch_id = EXCLUDED.branch_id, booking_no = EXCLUDED.booking_no,
            customer_id = EXCLUDED.customer_id, customer_name = EXCLUDED.customer_name,
            product_id = EXCLUDED.product_id, product_name = EXCLUDED.product_name,
            qty = EXCLUDED.qty, unit = EXCLUDED.unit, unit_price = EXCLUDED.unit_price,
            total_amount = EXCLUDED.total_amount, advance_paid = EXCLUDED.advance_paid,
            remaining_balance = EXCLUDED.remaining_balance, booking_date = EXCLUDED.booking_date,
            expiry_date = EXCLUDED.expiry_date, status = EXCLUDED.status, notes = EXCLUDED.notes,
            deleted = EXCLUDED.deleted, updated_at = EXCLUDED.updated_at;
        `;
        syncedIds.holdStock.push(h.id);
      }
      syncedCounts.holdStock = syncedIds.holdStock.length;
    }

    // 8. Temp Ledger
    if (Array.isArray(body.tempLedger) && body.tempLedger.length > 0) {
      for (const t of body.tempLedger) {
        if (!t || !t.id) continue;
        if (t.deleted === true) {
          await sql`DELETE FROM temp_ledger WHERE id = ${t.id}`;
          syncedIds.tempLedger.push(t.id);
          continue;
        }
        await sql`
          INSERT INTO temp_ledger (
            id, branch_id, date, person_name, phone, description,
            amount, type, is_cleared, notes, deleted, updated_at
          ) VALUES (
            ${t.id}, ${t.branchId || 'branch-1'}, ${t.date || ''},
            ${t.personName || ''}, ${t.phone || ''}, ${t.description || ''},
            ${Number(t.amount) || 0}, ${t.type || 'debit'}, ${Boolean(t.isCleared)},
            ${t.notes || ''}, ${Boolean(t.deleted)}, ${t.updatedAt || now}
          )
          ON CONFLICT (id) DO UPDATE SET
            branch_id = EXCLUDED.branch_id, date = EXCLUDED.date, person_name = EXCLUDED.person_name,
            phone = EXCLUDED.phone, description = EXCLUDED.description, amount = EXCLUDED.amount,
            type = EXCLUDED.type, is_cleared = EXCLUDED.is_cleared, notes = EXCLUDED.notes,
            deleted = EXCLUDED.deleted, updated_at = EXCLUDED.updated_at;
        `;
        syncedIds.tempLedger.push(t.id);
      }
      syncedCounts.tempLedger = syncedIds.tempLedger.length;
    }

    // Also purge any deleted items from agro_store_sync JSON snapshot
    try {
      const backupRows = await sql`SELECT * FROM agro_store_sync LIMIT 1`;
      if (backupRows && backupRows.length > 0) {
        const b = backupRows[0];
        const delProd = new Set((body.products || []).filter(p => p.deleted).map(p => String(p.id)));
        const delCust = new Set((body.customers || []).filter(c => c.deleted).map(c => String(c.id)));
        const delSupp = new Set((body.suppliers || []).filter(s => s.deleted).map(s => String(s.id)));
        const delSale = new Set((body.sales || []).filter(s => s.deleted).map(s => String(s.id)));
        const delPurch = new Set((body.purchases || []).filter(p => p.deleted).map(p => String(p.id)));
        const delPay = new Set((body.payments || []).filter(p => p.deleted).map(p => String(p.id)));
        const delHold = new Set((body.holdStock || []).filter(h => h.deleted).map(h => String(h.id)));
        const delTemp = new Set((body.tempLedger || []).filter(t => t.deleted).map(t => String(t.id)));

        if (delProd.size > 0 && Array.isArray(b.products)) {
          const f = b.products.filter(p => !delProd.has(String(p.id)));
          await sql`UPDATE agro_store_sync SET products = ${JSON.stringify(f)}::jsonb WHERE tenant_id = ${b.tenant_id}`;
        }
        if (delCust.size > 0 && Array.isArray(b.customers)) {
          const f = b.customers.filter(c => !delCust.has(String(c.id)));
          await sql`UPDATE agro_store_sync SET customers = ${JSON.stringify(f)}::jsonb WHERE tenant_id = ${b.tenant_id}`;
        }
        if (delSupp.size > 0 && Array.isArray(b.suppliers)) {
          const f = b.suppliers.filter(s => !delSupp.has(String(s.id)));
          await sql`UPDATE agro_store_sync SET suppliers = ${JSON.stringify(f)}::jsonb WHERE tenant_id = ${b.tenant_id}`;
        }
        if (delSale.size > 0 && Array.isArray(b.sales)) {
          const f = b.sales.filter(s => !delSale.has(String(s.id)));
          await sql`UPDATE agro_store_sync SET sales = ${JSON.stringify(f)}::jsonb WHERE tenant_id = ${b.tenant_id}`;
        }
        if (delPurch.size > 0 && Array.isArray(b.purchases)) {
          const f = b.purchases.filter(p => !delPurch.has(String(p.id)));
          await sql`UPDATE agro_store_sync SET purchases = ${JSON.stringify(f)}::jsonb WHERE tenant_id = ${b.tenant_id}`;
        }
        if (delPay.size > 0 && Array.isArray(b.payments)) {
          const f = b.payments.filter(p => !delPay.has(String(p.id)));
          await sql`UPDATE agro_store_sync SET payments = ${JSON.stringify(f)}::jsonb WHERE tenant_id = ${b.tenant_id}`;
        }
        if (delHold.size > 0 && Array.isArray(b.hold_stock)) {
          const f = b.hold_stock.filter(h => !delHold.has(String(h.id)));
          await sql`UPDATE agro_store_sync SET hold_stock = ${JSON.stringify(f)}::jsonb WHERE tenant_id = ${b.tenant_id}`;
        }
        if (delTemp.size > 0 && Array.isArray(b.temp_ledger)) {
          const f = b.temp_ledger.filter(t => !delTemp.has(String(t.id)));
          await sql`UPDATE agro_store_sync SET temp_ledger = ${JSON.stringify(f)}::jsonb WHERE tenant_id = ${b.tenant_id}`;
        }
      }
    } catch (purgeErr) {
      console.warn('Purge error in POST /api/sync:', purgeErr);
    }

    return Response.json({
      success: true,
      syncedCounts,
      syncedIds
    });
  } catch (err) {
    console.error('POST /api/sync error:', err);
    return Response.json(
      { success: false, error: err.message || 'Failed to sync data to Neon database' },
      { status: 500 }
    );
  }
}

// DELETE /api/sync: Direct hard deletion from Neon relational table and snapshot
export async function DELETE(request) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId') || 'tenant-1';

    if (!table || !id) {
      return Response.json({ success: false, error: 'table and id parameters required' }, { status: 400 });
    }

    if (table === 'products') await sql`DELETE FROM products WHERE id = ${id}`;
    else if (table === 'customers') await sql`DELETE FROM customers WHERE id = ${id}`;
    else if (table === 'suppliers') await sql`DELETE FROM suppliers WHERE id = ${id}`;
    else if (table === 'sales') await sql`DELETE FROM sales WHERE id = ${id}`;
    else if (table === 'purchases') await sql`DELETE FROM purchases WHERE id = ${id}`;
    else if (table === 'payments') await sql`DELETE FROM payments WHERE id = ${id}`;
    else if (table === 'hold_stock' || table === 'holdStock') await sql`DELETE FROM hold_stock WHERE id = ${id}`;
    else if (table === 'temp_ledger' || table === 'tempLedger') await sql`DELETE FROM temp_ledger WHERE id = ${id}`;

    // Purge from agro_store_sync
    try {
      const rows = await sql`SELECT * FROM agro_store_sync WHERE tenant_id = ${tenantId} LIMIT 1`;
      if (rows && rows.length > 0) {
        const b = rows[0];
        const col = table === 'holdStock' ? 'hold_stock' : table === 'tempLedger' ? 'temp_ledger' : table;
        let items = b[col] || [];
        if (typeof items === 'string') {
          try { items = JSON.parse(items); } catch(e) { items = []; }
        }
        if (Array.isArray(items)) {
          const filtered = items.filter(x => String(x.id) !== String(id));
          if (col === 'products') await sql`UPDATE agro_store_sync SET products = ${JSON.stringify(filtered)}::jsonb WHERE tenant_id = ${tenantId}`;
          else if (col === 'customers') await sql`UPDATE agro_store_sync SET customers = ${JSON.stringify(filtered)}::jsonb WHERE tenant_id = ${tenantId}`;
          else if (col === 'suppliers') await sql`UPDATE agro_store_sync SET suppliers = ${JSON.stringify(filtered)}::jsonb WHERE tenant_id = ${tenantId}`;
          else if (col === 'sales') await sql`UPDATE agro_store_sync SET sales = ${JSON.stringify(filtered)}::jsonb WHERE tenant_id = ${tenantId}`;
          else if (col === 'purchases') await sql`UPDATE agro_store_sync SET purchases = ${JSON.stringify(filtered)}::jsonb WHERE tenant_id = ${tenantId}`;
          else if (col === 'payments') await sql`UPDATE agro_store_sync SET payments = ${JSON.stringify(filtered)}::jsonb WHERE tenant_id = ${tenantId}`;
          else if (col === 'hold_stock') await sql`UPDATE agro_store_sync SET hold_stock = ${JSON.stringify(filtered)}::jsonb WHERE tenant_id = ${tenantId}`;
          else if (col === 'temp_ledger') await sql`UPDATE agro_store_sync SET temp_ledger = ${JSON.stringify(filtered)}::jsonb WHERE tenant_id = ${tenantId}`;
        }
      }
    } catch (e) {
      console.warn('agro_store_sync update error:', e);
    }

    return Response.json({ success: true, table, id, deleted: true });
  } catch (err) {
    console.error('DELETE /api/sync error:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
