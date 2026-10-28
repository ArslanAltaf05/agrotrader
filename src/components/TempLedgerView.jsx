'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TempLedgerView() {
  const { tempLedger, addTempLedger, approveTempLedger, deleteTempLedger, hideAmounts } = useApp();

  const [partyName, setPartyName] = useState('');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Sale');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Pending' | 'Approved'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'Sale' | 'Expense' | 'Cash Receipt'

  const handleAdd = (e) => {
    e.preventDefault();
    if (!partyName.trim() || !amount) return;

    addTempLedger({
      partyName,
      details,
      amount: Number(amount),
      type
    });

    setPartyName('');
    setDetails('');
    setAmount('');
  };

  const filteredTempLedger = tempLedger.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchParty = item.partyName?.toLowerCase().includes(q);
      const matchDetails = item.details?.toLowerCase().includes(q);
      if (!matchParty && !matchDetails) return false;
    }
    return true;
  });

  const totalPending = tempLedger
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalApproved = tempLedger
    .filter(t => t.status !== 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="page-body">
      {/* Top Banner */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">PENDING KATCHA KHATA</span>
            <span className="kpi-icon-pill" style={{ background: '#f3e8ff', color: '#7e22ce' }}>📝</span>
          </div>
          <div className="kpi-value" style={{ color: '#7e22ce' }}>
            {formatCurrency(totalPending, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>{tempLedger.filter(t => t.status === 'Pending').length} rough scratchpad entries awaiting audit</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">RECONCILED / APPROVED</span>
            <span className="kpi-icon-pill" style={{ background: '#dcfce7', color: '#16a34a' }}>✅</span>
          </div>
          <div className="kpi-value" style={{ color: '#16a34a' }}>
            {formatCurrency(totalApproved, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>Audited & verified entries</span>
          </div>
        </div>
      </div>

      {/* Quick Entry Box */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header" style={{ marginBottom: '12px' }}>
          <div className="card-title">
            <span>⚡</span>
            <span>Quick Scratchpad Entry (Busy Market Hours)</span>
          </div>
        </div>
        <form onSubmit={handleAdd} className="temp-ledger-grid">
          <div className="input-group">
            <label className="input-label">Person / Driver Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Aslam Tractor Driver"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Particulars / Rough Item Notes</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. 2 bags Urea taken on verbal word of Haji sb"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Amount (Rs)</label>
            <input
              type="number"
              className="input"
              placeholder="9300"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Type</label>
            <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Sale">Sale (Debit)</option>
              <option value="Expense">Expense</option>
              <option value="Cash Receipt">Cash Receipt</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '38px', padding: '0 18px' }}>
            + Note Down
          </button>
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '12px 18px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 240px', maxWidth: '340px' }}>
            <input
              type="text"
              className="input"
              placeholder="🔍 Search Party Name or Notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '36px', fontSize: '12px' }}
            />
          </div>

          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
              style={{ fontSize: '11.5px', padding: '4px 10px' }}
            >
              All ({tempLedger.length})
            </button>
            <button
              type="button"
              className={`segmented-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
              style={{ fontSize: '11.5px', padding: '4px 10px' }}
            >
              Pending ({tempLedger.filter(t => t.status === 'Pending').length})
            </button>
            <button
              type="button"
              className={`segmented-btn ${statusFilter === 'Approved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Approved')}
              style={{ fontSize: '11.5px', padding: '4px 10px' }}
            >
              Approved
            </button>
          </div>

          <select
            className="select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ height: '36px', fontSize: '12px', width: 'auto' }}
          >
            <option value="all">All Types</option>
            <option value="Sale">Sale Only</option>
            <option value="Expense">Expense Only</option>
            <option value="Cash Receipt">Cash Receipt Only</option>
          </select>
        </div>
      </div>

      {/* Temp Ledger Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>PARTY / PERSON</th>
                <th>PARTICULARS</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTempLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No scratchpad entries match your search/filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTempLedger.map(item => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td style={{ fontWeight: 700 }}>{item.partyName}</td>
                    <td>{item.details}</td>
                    <td><span className="badge badge-neutral">{item.type}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {formatCurrency(item.amount, hideAmounts)}
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {item.status === 'Pending' && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ fontSize: '11px', padding: '3px 8px' }}
                            onClick={() => approveTempLedger(item.id)}
                            title="Reconcile and mark approved"
                          >
                            ✓ Reconcile
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline btn-icon-only"
                          style={{ color: '#ef4444', width: '24px', height: '24px' }}
                          onClick={() => deleteTempLedger(item.id)}
                          title="Delete"
                        >
                          &times;
                        </button>
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
