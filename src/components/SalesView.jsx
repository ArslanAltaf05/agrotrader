'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export default function SalesView({ onOpenNewSale, onOpenInvoiceView }) {
  const {
    sales,
    deleteSale,
    hideAmounts,
    auth,
    activeBranchId,
    showToast
  } = useApp();

  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'superadmin';

  // Filters and Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all' | 'cash' | 'ledger'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'customer'

  const todayStr = new Date().toISOString().split('T')[0];

  // Branch-filtered sales
  const branchSales = useMemo(() => {
    return sales.filter(s => !s.branchId || s.branchId === activeBranchId);
  }, [sales, activeBranchId]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    const now = new Date();

    return branchSales.filter(sale => {
      const sDateStr = sale.date.split('T')[0];
      const sDate = new Date(sale.date);

      // Payment Type filter
      if (paymentFilter !== 'all' && sale.paymentType !== paymentFilter) return false;

      // Date filter
      if (dateFilter === 'today') {
        if (sDateStr !== todayStr) return false;
      } else if (dateFilter === 'yesterday') {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        if (sDateStr !== y.toISOString().split('T')[0]) return false;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        if (sDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 86400000);
        if (sDate < monthAgo) return false;
      } else if (dateFilter === 'custom') {
        if (customStart && sDateStr < customStart) return false;
        if (customEnd && sDateStr > customEnd) return false;
      }

      // Search query (Invoice #, Customer Name, Items, Staff)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = sale.id.toLowerCase().includes(q);
        const matchCustomer = sale.customerName.toLowerCase().includes(q);
        const matchUser = sale.createdBy?.toLowerCase().includes(q);
        const matchItems = sale.items?.some(it => it.name.toLowerCase().includes(q));
        if (!matchId && !matchCustomer && !matchUser && !matchItems) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return (b.grandTotal || 0) - (a.grandTotal || 0);
      if (sortBy === 'amount-asc') return (a.grandTotal || 0) - (b.grandTotal || 0);
      if (sortBy === 'customer') return (a.customerName || '').localeCompare(b.customerName || '');
      return 0;
    });
  }, [branchSales, paymentFilter, dateFilter, todayStr, customStart, customEnd, searchQuery, sortBy]);

  // Aggregate Metrics for filtered view
  const totalRevenue = useMemo(() => filteredSales.reduce((s, it) => s + (it.grandTotal || 0), 0), [filteredSales]);
  const totalCashCollected = useMemo(() => filteredSales.reduce((s, it) => s + (it.paidAmount || 0), 0), [filteredSales]);
  const totalKhataReceivable = useMemo(() => filteredSales.reduce((s, it) => s + (it.balanceAmount || 0), 0), [filteredSales]);
  const totalItemsSold = useMemo(() => filteredSales.reduce((s, it) => s + (it.items?.reduce((is, i) => is + (i.qty || 0), 0) || 0), 0), [filteredSales]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Invoice #', 'Date', 'Time', 'Customer', 'Payment Type', 'Items Summary', 'Subtotal', 'Discount', 'Grand Total', 'Paid', 'Khata Balance', 'Billed By'];
    const rows = filteredSales.map(s => [
      `"${s.id}"`,
      `"${formatDate(s.date)}"`,
      `"${formatTime(s.date)}"`,
      `"${s.customerName.replace(/"/g, '""')}"`,
      `"${s.paymentType}"`,
      `"${s.items.map(i => `${i.name} (${i.qty} ${i.unit || 'bags'})`).join('; ')}"`,
      s.subtotal,
      s.discount,
      s.grandTotal,
      s.paidAmount,
      s.balanceAmount,
      `"${s.createdBy || 'staff'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sales_Invoices_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported sales invoices to CSV!', 'success');
  };

  return (
    <div className="page-body">
      {/* Top Dynamic KPI Stat Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL SALES REVENUE</span>
            <span className="kpi-icon-pill" style={{ background: '#dcfce7', color: '#16a34a' }}>💰</span>
          </div>
          <div className="kpi-value" style={{ color: '#16a34a' }}>
            {formatCurrency(totalRevenue, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>{filteredSales.length} invoices matching active filter</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">CASH COLLECTED</span>
            <span className="kpi-icon-pill" style={{ background: '#eff6ff', color: '#2563eb' }}>💵</span>
          </div>
          <div className="kpi-value" style={{ color: '#2563eb' }}>
            {formatCurrency(totalCashCollected, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>Realized liquid cash inflow</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">KHATA / RECEIVABLES</span>
            <span className="kpi-icon-pill" style={{ background: '#fee2e2', color: '#b91c1c' }}>👥</span>
          </div>
          <div className="kpi-value" style={{ color: '#b91c1c' }}>
            {formatCurrency(totalKhataReceivable, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>Pending customer khata balance</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL UNITS / BAGS SOLD</span>
            <span className="kpi-icon-pill" style={{ background: '#fef3c7', color: '#d97706' }}>📦</span>
          </div>
          <div className="kpi-value" style={{ color: '#d97706' }}>
            {totalItemsSold.toLocaleString()} Units
          </div>
          <div className="kpi-subtext">
            <span>Fertilizers, seeds &amp; agro-chemicals</span>
          </div>
        </div>
      </div>

      {/* Dynamic Filter and Action Toolbar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 260px', maxWidth: '400px' }}>
            <input
              type="text"
              className="input"
              placeholder="🔍 Search Invoice #, Customer, or Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '38px' }}
            />
          </div>

          {/* Payment Type Segmented Control */}
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${paymentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPaymentFilter('all')}
            >
              All Types
            </button>
            <button
              type="button"
              className={`segmented-btn ${paymentFilter === 'cash' ? 'active' : ''}`}
              onClick={() => setPaymentFilter('cash')}
            >
              Cash Only
            </button>
            <button
              type="button"
              className={`segmented-btn ${paymentFilter === 'ledger' ? 'active' : ''}`}
              onClick={() => setPaymentFilter('ledger')}
            >
              Ledger Only
            </button>
          </div>

          {/* Date Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              className="select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ height: '38px', minWidth: '130px' }}
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month (30d)</option>
              <option value="custom">Custom Date Range</option>
            </select>

            {dateFilter === 'custom' && (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <input
                  type="date"
                  className="input"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  style={{ height: '38px', fontSize: '11px', padding: '4px 6px' }}
                />
                <span style={{ fontSize: '12px' }}>to</span>
                <input
                  type="date"
                  className="input"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  style={{ height: '38px', fontSize: '11px', padding: '4px 6px' }}
                />
              </div>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              className="select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ height: '38px', minWidth: '150px' }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="customer">Customer (A-Z)</option>
            </select>
          </div>

          {/* Export & New Sale Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleExportCSV}
              style={{ height: '38px', fontSize: '12px' }}
              title="Download CSV spreadsheet"
            >
              📥 Export CSV
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenNewSale}
              style={{ height: '38px', fontSize: '12px' }}
            >
              🛒 + New Sale Billing Counter (F1)
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Sales Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>INVOICE #</th>
                <th>DATE &amp; TIME</th>
                <th>CUSTOMER</th>
                <th>PAYMENT TYPE</th>
                <th>ITEMS ORDERED</th>
                <th>SUBTOTAL</th>
                <th>DISCOUNT</th>
                <th>GRAND TOTAL</th>
                <th>PAID</th>
                <th>KHATA BALANCE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>No sales records found</div>
                    <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                      Try adjusting your search query, payment type, or date range filters.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setSearchQuery('');
                          setPaymentFilter('all');
                          setDateFilter('all');
                        }}
                      >
                        Reset All Filters
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onOpenNewSale}
                      >
                        🛒 + Create New Sale Now (F1)
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', cursor: 'pointer' }} onClick={() => onOpenInvoiceView && onOpenInvoiceView(sale)}>
                        {sale.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{formatDate(sale.date)}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatTime(sale.date)}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{sale.customerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Billed by: {sale.createdBy || 'staff'}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${sale.paymentType === 'cash' ? 'badge-success' : 'badge-warning'}`}
                        style={{ textTransform: 'uppercase', fontSize: '10.5px' }}
                      >
                        {sale.paymentType}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sale.items?.map(i => `${i.name} (${i.qty})`).join(', ')}
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '10px', marginTop: '2px' }}>
                        {sale.items?.reduce((s, i) => s + (i.qty || 0), 0)} {sale.items[0]?.unit || 'bags'} total
                      </span>
                    </td>
                    <td>{formatCurrency(sale.subtotal, hideAmounts)}</td>
                    <td style={{ color: sale.discount > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                      {sale.discount > 0 ? `-${formatCurrency(sale.discount, hideAmounts)}` : 'Rs 0'}
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '13.5px' }}>
                      {formatCurrency(sale.grandTotal, hideAmounts)}
                    </td>
                    <td style={{ color: '#16a34a', fontWeight: 700 }}>
                      {formatCurrency(sale.paidAmount, hideAmounts)}
                    </td>
                    <td style={{ color: sale.balanceAmount > 0 ? '#b91c1c' : '#64748b', fontWeight: 800 }}>
                      {formatCurrency(sale.balanceAmount, hideAmounts)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-icon-only"
                          onClick={() => onOpenInvoiceView && onOpenInvoiceView(sale)}
                          title="View & Print Official Receipt"
                        >
                          👁️
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete invoice ${sale.id} for ${sale.customerName}?\nThis will revert inventory stock and ledger balances.`)) {
                                deleteSale(sale.id);
                              }
                            }}
                            title="Delete Invoice (Reverts Stock & Balance)"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
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
