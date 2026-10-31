'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';
import { formatCurrency, formatNumber, getExpiryDetails } from '../utils/formatters';

export default function InventoryView({ onOpenAddProduct, onEditProduct, onOpenTransfer }) {
  const { products, categories, manufacturers, units, deleteProduct, hideAmounts, metrics, auth } = useApp();
  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'superadmin';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedFlag, setSelectedFlag] = useState('All');

  // Filter products
  const filteredProducts = products.filter(p => {
    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      const matchBarcode = p.barcode?.toLowerCase().includes(q);
      const matchGeneric = p.generic?.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBarcode && !matchGeneric) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

    // Manufacturer filter
    if (selectedManufacturer !== 'All' && p.manufacturer !== selectedManufacturer) return false;

    // Unit filter
    if (selectedUnit !== 'All' && p.unit !== selectedUnit) return false;

    // Batch filter
    if (selectedBatch !== 'All' && p.batchNo !== selectedBatch) return false;

    // Status filter
    const totalQty = (p.shopStock || 0) + (p.storeStock || 0);
    if (selectedStatus === 'In Stock' && totalQty <= (p.alertQty || 10)) return false;
    if (selectedStatus === 'Low Stock' && (totalQty > (p.alertQty || 10) || totalQty === 0)) return false;
    if (selectedStatus === 'Out of Stock' && totalQty > 0) return false;
    if (selectedStatus === 'Expiring Soon (≤ 7 Days)') {
      const exp = getExpiryDetails(p.expiryDate);
      if (!exp || !exp.isExpiringSoon) return false;
    }
    if (selectedStatus === 'Expired') {
      const exp = getExpiryDetails(p.expiryDate);
      if (!exp || !exp.isExpired) return false;
    }

    // Flag filter
    if (selectedFlag === 'Narcotic' && !p.flags?.narcotic) return false;
    if (selectedFlag === 'Serial Item' && !p.flags?.serialItem) return false;
    if (selectedFlag === 'Keep Record' && !p.flags?.keepRecord) return false;

    return true;
  });

  // Unique batches for filter dropdown
  const uniqueBatches = Array.from(new Set(products.map(p => p.batchNo).filter(Boolean)));

  // Export CSV helper
  const handleExportCSV = () => {
    const headers = ['Product Name', 'SKU', 'Category', 'Manufacturer', 'Cost Price', 'Sale Price', 'Shop Stock', 'Store Stock', 'Total Stock', 'Unit', 'Status'];
    const rows = filteredProducts.map(p => [
      `"${p.name}"`,
      `"${p.sku}"`,
      `"${p.category}"`,
      `"${p.manufacturer}"`,
      p.costPrice,
      p.salePrice,
      p.shopStock,
      p.storeStock,
      (p.shopStock || 0) + (p.storeStock || 0),
      `"${p.unit}"`,
      (p.shopStock || 0) + (p.storeStock || 0) === 0 ? 'Out of Stock' : ((p.shopStock || 0) + (p.storeStock || 0) <= p.alertQty ? 'Low Stock' : 'In Stock')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-body">
      {/* 6 Inventory KPI Stat Cards matching Screenshot 5 */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        {/* 1. Total Products */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL PRODUCTS</span>
            <span className="kpi-icon-pill" style={{ background: '#eff6ff', color: '#2563eb' }}>
              📦
            </span>
          </div>
          <div className="kpi-value">{metrics.totalProducts}</div>
          <div className="kpi-subtext">
            <span>{metrics.activeProducts} active</span>
          </div>
        </div>

        {/* 2. Inventory Value */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">INVENTORY VALUE</span>
            <span className="kpi-icon-pill" style={{ background: '#dcfce7', color: '#16a34a' }}>
              💲
            </span>
          </div>
          <div className="kpi-value">{formatCurrency(metrics.totalInventoryValue, hideAmounts)}</div>
          <div className="kpi-subtext">
            <span>At weighted avg cost</span>
          </div>
        </div>

        {/* 3. Retail Value */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">RETAIL VALUE</span>
            <span className="kpi-icon-pill" style={{ background: '#eff6ff', color: '#0284c7' }}>
              🏷️
            </span>
          </div>
          <div className="kpi-value">{formatCurrency(metrics.totalRetailValue, hideAmounts)}</div>
          <div className="kpi-subtext">
            <span>Sale value</span>
          </div>
        </div>

        {/* 4. Potential Profit */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">POTENTIAL PROFIT</span>
            <span className="kpi-icon-pill" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
              📈
            </span>
          </div>
          <div className="kpi-value">{formatCurrency(metrics.potentialProfit, hideAmounts)}</div>
          <div className="kpi-subtext">
            <span>On stock</span>
          </div>
        </div>

        {/* 5. Low / Out of Stock */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">LOW / OUT OF STOCK</span>
            <span className="kpi-icon-pill" style={{ background: '#fee2e2', color: '#dc2626' }}>
              ⚠️
            </span>
          </div>
          <div className="kpi-value">
            {metrics.lowStockCount} / {metrics.outOfStockCount}
          </div>
          <div className="kpi-subtext" style={{ color: '#dc2626' }}>
            <span>Attention</span>
          </div>
        </div>

        {/* 6. Stock Units */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">STOCK UNITS</span>
            <span className="kpi-icon-pill" style={{ background: '#fef3c7', color: '#d97706' }}>
              🌾
            </span>
          </div>
          <div className="kpi-value">{formatNumber(metrics.totalStockUnits, hideAmounts)}</div>
          <div className="kpi-subtext">
            <span>{metrics.categoryCount} categories</span>
          </div>
        </div>

        {/* 7. Expiring Soon (<= 7 Days) */}
        <div
          className="kpi-card"
          onClick={() => setSelectedStatus(selectedStatus === 'Expiring Soon (≤ 7 Days)' ? 'All' : 'Expiring Soon (≤ 7 Days)')}
          style={{
            cursor: 'pointer',
            border: (metrics.expiringSoonCount || 0) + (metrics.expiredCount || 0) > 0 ? '1px solid #fecaca' : undefined,
            background: (metrics.expiringSoonCount || 0) + (metrics.expiredCount || 0) > 0 ? '#fffbfb' : undefined
          }}
          title="Click to filter products expiring within 1 week or expired"
        >
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: (metrics.expiringSoonCount || 0) > 0 ? '#b91c1c' : undefined }}>
              EXPIRING SOON (≤ 7D)
            </span>
            <span className="kpi-icon-pill" style={{ background: '#fef2f2', color: '#dc2626' }}>
              ⏳
            </span>
          </div>
          <div className="kpi-value" style={{ color: (metrics.expiringSoonCount || 0) + (metrics.expiredCount || 0) > 0 ? '#dc2626' : undefined }}>
            {metrics.expiringSoonCount || 0}
            {(metrics.expiredCount || 0) > 0 && (
              <span style={{ fontSize: '13px', color: '#ef4444', marginLeft: '4px' }}>
                ({metrics.expiredCount} exp)
              </span>
            )}
          </div>
          <div className="kpi-subtext" style={{ color: (metrics.expiringSoonCount || 0) > 0 ? '#dc2626' : undefined }}>
            <span>{(metrics.expiringSoonCount || 0) + (metrics.expiredCount || 0) > 0 ? 'Action required' : 'All batches safe'}</span>
          </div>
        </div>
      </div>

      {/* Search & Multi-Filters Toolbar matching Screenshot 5 */}
      <div className="filter-bar">
        {/* Search input */}
        <div className="search-input-wrapper">
          <span dangerouslySetInnerHTML={{ __html: icons.search }} />
          <input
            type="text"
            className="input"
            placeholder="Search by name, SKU, barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category dropdown */}
        <select
          className="select"
          style={{ width: 'auto', minWidth: '130px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Status dropdown */}
        <select
          className="select"
          style={{ width: 'auto', minWidth: '130px' }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Expiring Soon (≤ 7 Days)">⏳ Expiring Soon (≤ 7 Days)</option>
          <option value="Expired">⛔ Expired Batches</option>
        </select>

        {/* Batches dropdown */}
        <select
          className="select"
          style={{ width: 'auto', minWidth: '110px' }}
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        >
          <option value="All">All Batches</option>
          {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        {/* Manufacturer dropdown */}
        <select
          className="select"
          style={{ width: 'auto', minWidth: '140px' }}
          value={selectedManufacturer}
          onChange={(e) => setSelectedManufacturer(e.target.value)}
        >
          <option value="All">All Manufacturers</option>
          {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Units dropdown */}
        <select
          className="select"
          style={{ width: 'auto', minWidth: '100px' }}
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
        >
          <option value="All">All Units</option>
          {units.map(u => <option key={u} value={u}>{u}</option>)}
        </select>

        {/* Flags dropdown */}
        <select
          className="select"
          style={{ width: 'auto', minWidth: '100px' }}
          value={selectedFlag}
          onChange={(e) => setSelectedFlag(e.target.value)}
        >
          <option value="All">All Flags</option>
          <option value="Narcotic">Narcotic</option>
          <option value="Serial Item">Serial Item</option>
          <option value="Keep Record">Keep Record</option>
        </select>

        {/* Right action buttons */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '7px 12px', fontSize: '12.5px' }}
            onClick={handleExportCSV}
            title="Export filtered catalogue to CSV spreadsheet"
          >
            <span dangerouslySetInnerHTML={{ __html: icons.download }} />
            <span>Export CSV</span>
          </button>

          {/* + Product Button matching Screenshot 5 */}
          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '7px 16px', fontSize: '12.5px' }}
            onClick={onOpenAddProduct}
          >
            <span dangerouslySetInnerHTML={{ __html: icons.plus }} />
            <span>+ Product</span>
          </button>
        </div>
      </div>

      {/* Main Inventory Table matching Screenshot 5 */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '36px', textAlign: 'center' }}>
                  <input type="checkbox" aria-label="Select all" />
                </th>
                <th>PRODUCT &uarr;</th>
                <th>CATEGORY &uarr;</th>
                <th>SALE PRICE &uarr;</th>
                <th>SHOP &uarr;</th>
                <th>STORE &uarr;</th>
                <th>TOTAL &darr;</th>
                <th>STATUS &uarr;</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No products found matching filters. Click <b>+ Product</b> to add your first inventory item!
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const total = (p.shopStock || 0) + (p.storeStock || 0);
                  const isOutOfStock = total === 0;
                  const isLowStock = !isOutOfStock && total <= (p.alertQty || 10);

                  let statusBadge = <span className="badge badge-success">In Stock</span>;
                  if (isOutOfStock) {
                    statusBadge = <span className="badge badge-danger">Out of Stock</span>;
                  } else if (isLowStock) {
                    statusBadge = <span className="badge badge-warning">Low Stock ({p.alertQty} min)</span>;
                  }

                  return (
                    <tr key={p.id}>
                      <td style={{ textAlign: 'center' }}>
                        <input type="checkbox" aria-label={`Select ${p.name}`} />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                          <span>SKU: {p.sku}</span>
                          {p.batchNo && <span>&bull; Batch: {p.batchNo}</span>}
                          {p.manufacturer && <span>&bull; {p.manufacturer}</span>}
                        </div>
                        {p.expiryDate && (
                          <div style={{ marginTop: '3px' }}>
                            {(() => {
                              const exp = getExpiryDetails(p.expiryDate);
                              if (!exp) return null;
                              return (
                                <span
                                  className={`badge ${exp.badgeClass}`}
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    background: exp.bg,
                                    color: exp.color,
                                    border: `1px solid ${exp.color}40`,
                                    padding: '1px 6px'
                                  }}
                                >
                                  {exp.isExpired ? '🔴 ' : (exp.isCritical ? '⏳ ' : '📅 ')}
                                  {exp.label} ({p.expiryDate})
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {formatCurrency(p.salePrice, hideAmounts)}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{ background: '#ecfdf5', color: '#065f46', cursor: 'pointer', border: '1px solid #bbf7d0' }}
                          title="Click to transfer to Store"
                          onClick={() => onOpenTransfer && onOpenTransfer(p, 'shop', 'store')}
                        >
                          {p.shopStock || 0} {p.unit}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{ background: '#eff6ff', color: '#1e40af', cursor: 'pointer', border: '1px solid #bfdbfe' }}
                          title="Click to transfer to Shop"
                          onClick={() => onOpenTransfer && onOpenTransfer(p, 'store', 'shop')}
                        >
                          {p.storeStock || 0} {p.unit}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {total} {p.unit}
                      </td>
                      <td>{statusBadge}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {/* Stock Transfer Icon */}
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            title="Transfer Stock between Shop and Godown"
                            onClick={() => onOpenTransfer && onOpenTransfer(p, 'shop', 'store')}
                          >
                            <span dangerouslySetInnerHTML={{ __html: icons.transfer }} />
                          </button>

                          {/* Edit Pencil Icon */}
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            title="Edit Product Details"
                            onClick={() => onEditProduct && onEditProduct(p)}
                          >
                            <span dangerouslySetInnerHTML={{ __html: icons.edit }} />
                          </button>

                          {/* Delete Trash Icon (Admin Only) */}
                          {isAdmin && (
                            <button
                              type="button"
                              className="btn btn-outline btn-icon-only"
                              style={{ color: '#ef4444' }}
                              title="Delete Product"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                            >
                              <span dangerouslySetInnerHTML={{ __html: icons.trash }} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
