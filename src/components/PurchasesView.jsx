'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function PurchasesView() {
  const { suppliers, products, purchases, recordPurchase, deletePurchase, hideAmounts, auth } = useApp();

  const [supplierId, setSupplierId] = useState('');
  const [productId, setProductId] = useState('');
  const [targetLoc, setTargetLoc] = useState('store'); // 'store' (godown) or 'shop'
  const [qty, setQty] = useState(50);
  const [unitCost, setUnitCost] = useState('');
  const [paymentMode, setPaymentMode] = useState('Credit (Payable Khata)');
  const [searchTerm, setSearchTerm] = useState('');

  const handleProductSelect = (id) => {
    setProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setUnitCost(prod.costPrice?.toString() || '');
    }
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === supplierId);
    const prod = products.find(p => p.id === productId);
    if (!sup || !prod) {
      alert('Please select both supplier and product.');
      return;
    }

    const numQty = Number(qty) || 1;
    const cost = Number(unitCost) || prod.costPrice;

    recordPurchase({
      supplierId: sup.id,
      supplierName: sup.name,
      productId: prod.id,
      productName: prod.name,
      qty: numQty,
      unit: prod.unit,
      unitCost: cost,
      paymentMode,
      targetLoc
    });

    setQty(50);
    setProductId('');
    setUnitCost('');
  };

  const totalPurchaseValue = purchases.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  const totalBagsInward = purchases.reduce((sum, p) => sum + (p.qty || 0), 0);

  const filteredPurchases = purchases.filter(po =>
    po.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-body">
      {/* Top Purchase KPI Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL INWARD STOCK VALUE</span>
            <span className="kpi-icon-pill" style={{ background: '#dbeafe', color: '#1d4ed8' }}>🚚</span>
          </div>
          <div className="kpi-value" style={{ color: '#1d4ed8' }}>
            {formatCurrency(totalPurchaseValue, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>{purchases.length} company shipments received</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL BAGS / UNITS RECEIVED</span>
            <span className="kpi-icon-pill" style={{ background: '#dcfce7', color: '#15803d' }}>📦</span>
          </div>
          <div className="kpi-value" style={{ color: '#15803d' }}>
            {totalBagsInward.toLocaleString()} Units
          </div>
          <div className="kpi-subtext">
            <span>Fertilizers, seeds, and agro chemicals</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">ACTIVE SUPPLIERS & MILLS</span>
            <span className="kpi-icon-pill" style={{ background: '#fef3c7', color: '#b45309' }}>🏢</span>
          </div>
          <div className="kpi-value" style={{ color: '#b45309' }}>
            {suppliers.length} Companies
          </div>
          <div className="kpi-subtext">
            <span>FFC, Engro, Fatima, Bayer, FMC</span>
          </div>
        </div>
      </div>

      {/* Quick Inward Order Form */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <span>🚚</span>
            <span>Record Inward Stock Purchase from Company (Auto Updates Stock &amp; Khata)</span>
          </div>
        </div>

        <form onSubmit={handlePurchaseSubmit}>
          <div className="inward-purchase-grid">
            <div className="input-group">
              <label className="input-label">Supplier Company <span className="req">*</span></label>
              <select
                className="select"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
              >
                <option value="">-- Choose Supplier --</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} (Payable: Rs {s.balance.toLocaleString()})</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Product Inward <span className="req">*</span></label>
              <select
                className="select"
                value={productId}
                onChange={(e) => handleProductSelect(e.target.value)}
                required
              >
                <option value="">-- Choose Product --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Quantity</label>
              <input
                type="number"
                min="1"
                className="input"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Cost/Trade Price (Rs)</label>
              <input
                type="number"
                className="input"
                placeholder="Rate"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Destination</label>
              <select
                className="select"
                value={targetLoc}
                onChange={(e) => setTargetLoc(e.target.value)}
              >
                <option value="store">Store / Godown</option>
                <option value="shop">Shop Counter</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Payment Terms</label>
              <select
                className="select"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="Credit (Payable Khata)">Credit (Payable Khata)</option>
                <option value="Paid via Cash">Paid via Cash</option>
                <option value="Paid via Bank Transfer">Paid via Bank Transfer</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '38px', padding: '0 18px', whiteSpace: 'nowrap' }}>
              + Receive Stock
            </button>
          </div>
        </form>
      </div>

      {/* Purchases History Toolbar */}
      <div className="filter-bar" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontWeight: 700, fontSize: '15px' }}>
          Recent Inward Stock Shipments &amp; Orders ({filteredPurchases.length})
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ minWidth: '260px' }}>
            <input
              type="text"
              className="input"
              placeholder="Search PO #, supplier, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ height: '36px', fontSize: '12px' }}
            />
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ height: '36px', fontSize: '12px' }}
            onClick={() => {
              const headers = ['Order #', 'Date', 'Supplier', 'Product', 'Qty', 'Unit', 'Trade Rate', 'Total Cost', 'Payment Mode', 'Location', 'Status'];
              const rows = filteredPurchases.map(po => [
                `"${po.id}"`,
                `"${formatDate(po.date)}"`,
                `"${po.supplierName}"`,
                `"${po.productName}"`,
                po.qty,
                `"${po.unit}"`,
                po.unitCost,
                po.totalCost,
                `"${po.paymentMode}"`,
                `"${po.targetLoc}"`,
                `"${po.status}"`
              ]);
              const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
              const link = document.createElement('a');
              link.setAttribute('href', encodeURI(csvContent));
              link.setAttribute('download', `Purchases_Report_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Purchases History Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ORDER #</th>
                <th>DATE</th>
                <th>SUPPLIER COMPANY</th>
                <th>PRODUCT</th>
                <th>QTY</th>
                <th>TRADE RATE</th>
                <th>TOTAL INVOICE COST</th>
                <th>PAYMENT MODE</th>
                <th>DESTINATION</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No purchase orders found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(po => (
                  <tr key={po.id}>
                    <td style={{ fontWeight: 700 }}>{po.id}</td>
                    <td>{formatDate(po.date)}</td>
                    <td style={{ fontWeight: 600 }}>{po.supplierName}</td>
                    <td>{po.productName}</td>
                    <td style={{ fontWeight: 700 }}>{po.qty} {po.unit}</td>
                    <td>{formatCurrency(po.unitCost, hideAmounts)}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      {formatCurrency(po.totalCost, hideAmounts)}
                    </td>
                    <td>
                      <span className={`badge ${po.paymentMode?.includes('Credit') ? 'badge-warning' : 'badge-success'}`}>
                        {po.paymentMode || 'Credit'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                        {po.targetLoc}
                      </span>
                    </td>
                    <td><span className="badge badge-success">{po.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      {(auth.user?.role === 'admin' || auth.user?.role === 'superadmin') && (
                        <button
                          type="button"
                          className="btn btn-outline btn-icon-only"
                          style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete PO ${po.id} for ${po.productName}?\nThis will revert godown stock and supplier khata balance.`)) {
                              deletePurchase(po.id);
                            }
                          }}
                          title="Delete / Void Purchase Order"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
