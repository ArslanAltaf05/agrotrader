'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export default function PaymentsView({ onOpenPaymentModal }) {
  const { payments, deletePayment, hideAmounts, auth } = useApp();
  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'superadmin';
  const [filterType, setFilterType] = useState('all'); // 'all' | 'in' | 'out'
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = payments.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.accountName?.toLowerCase().includes(q);
      const matchId = p.id?.toLowerCase().includes(q);
      const matchRef = p.refNo?.toLowerCase().includes(q);
      const matchRemarks = p.remarks?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchRef && !matchRemarks) return false;
    }
    return true;
  });

  const totalIn = payments.filter(p => p.type === 'in').reduce((s, p) => s + p.amount, 0);
  const totalOut = payments.filter(p => p.type === 'out').reduce((s, p) => s + p.amount, 0);

  const handleExportCSV = () => {
    const headers = ['Voucher #', 'Date & Time', 'Type', 'Party / Account', 'Payment Mode', 'Reference #', 'Amount', 'Remarks'];
    const rows = filtered.map(p => [
      `"${p.id}"`,
      `"${formatDate(p.date)} ${formatTime(p.date)}"`,
      `"${p.type === 'in' ? 'Payment In' : 'Payment Out'}"`,
      `"${p.accountName}"`,
      `"${p.mode}"`,
      `"${p.refNo || ''}"`,
      p.amount,
      `"${(p.remarks || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Payment_Vouchers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-body">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL CASH / PAYMENTS RECEIVED</span>
            <span className="kpi-icon-pill" style={{ background: '#dcfce7', color: '#16a34a' }}>📥</span>
          </div>
          <div className="kpi-value" style={{ color: '#16a34a' }}>
            {formatCurrency(totalIn, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>From farmer recoveries &amp; cash receipts</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL PAYMENTS MADE (OUT)</span>
            <span className="kpi-icon-pill" style={{ background: '#fee2e2', color: '#b91c1c' }}>📤</span>
          </div>
          <div className="kpi-value" style={{ color: '#b91c1c' }}>
            {formatCurrency(totalOut, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>To fertilizer suppliers &amp; operational expenses</span>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', maxWidth: '320px' }}>
          <input
            type="text"
            className="input"
            placeholder="🔍 Search Party, Voucher #, or Ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ height: '36px', fontSize: '12px' }}
          />
        </div>

        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Vouchers ({payments.length})
          </button>
          <button
            type="button"
            className={`segmented-btn ${filterType === 'in' ? 'active' : ''}`}
            onClick={() => setFilterType('in')}
          >
            Payment In (Customer)
          </button>
          <button
            type="button"
            className={`segmented-btn ${filterType === 'out' ? 'active' : ''}`}
            onClick={() => setFilterType('out')}
          >
            Payment Out (Supplier)
          </button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExportCSV}
            style={{ height: '36px', fontSize: '12px' }}
          >
            📥 Export CSV
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onOpenPaymentModal && onOpenPaymentModal('in')}
            style={{ height: '36px', fontSize: '12px' }}
          >
            📥 + Payment In
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onOpenPaymentModal && onOpenPaymentModal('out')}
            style={{ height: '36px', fontSize: '12px' }}
          >
            📤 + Payment Out
          </button>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>VOUCHER #</th>
                <th>DATE & TIME</th>
                <th>TYPE</th>
                <th>PARTY / ACCOUNT</th>
                <th>PAYMENT MODE</th>
                <th>REF / CHEQUE #</th>
                <th>AMOUNT</th>
                <th>REMARKS</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>ACTIONS</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No payment vouchers recorded.
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.id}</td>
                    <td style={{ fontSize: '12px' }}>
                      {formatDate(p.date)} &bull; {formatTime(p.date)}
                    </td>
                    <td>
                      <span className={`badge ${p.type === 'in' ? 'badge-success' : 'badge-danger'}`}>
                        {p.type === 'in' ? 'Payment In' : 'Payment Out'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.accountName}</td>
                    <td><span className="badge badge-neutral">{p.mode}</span></td>
                    <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.refNo || '-'}</td>
                    <td style={{ fontWeight: 800, color: p.type === 'in' ? '#16a34a' : '#b91c1c' }}>
                      {formatCurrency(p.amount, hideAmounts)}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.remarks || '-'}</td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-icon-only"
                          style={{ color: '#ef4444', width: '26px', height: '26px' }}
                          onClick={() => {
                            if (confirm(`Delete payment voucher ${p.id}?`)) {
                              deletePayment(p.id);
                            }
                          }}
                          title="Delete Voucher"
                        >
                          🗑️
                        </button>
                      </td>
                    )}
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
