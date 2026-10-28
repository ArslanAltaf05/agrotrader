'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/formatters';

export default function HoldStockView() {
  const { holdStock, products, customers, addHoldStock, releaseHoldStock, deleteHoldStock, auth } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [releaseModalData, setReleaseModalData] = useState(null); // { item, qty }
  const [releaseQty, setReleaseQty] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // New Custody form
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    totalBags: 20,
    location: 'Godown Section A',
    notes: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === formData.customerId);
    const prod = products.find(p => p.id === formData.productId);
    if (!cust || !prod) {
      alert('Please select both customer and product.');
      return;
    }

    addHoldStock({
      customerId: cust.id,
      customerName: cust.name,
      productId: prod.id,
      productName: prod.name,
      totalBags: Number(formData.totalBags) || 1,
      location: formData.location,
      notes: formData.notes
    });

    setShowAddModal(false);
    setFormData({ customerId: '', productId: '', totalBags: 20, location: 'Godown Section A', notes: '' });
  };

  const handleReleaseSubmit = (e) => {
    e.preventDefault();
    if (!releaseModalData) return;
    releaseHoldStock(releaseModalData.id, Number(releaseQty) || 1);
    setReleaseModalData(null);
  };

  const filteredHoldStock = holdStock.filter(h => {
    if (statusFilter === 'active' && h.remainingBags <= 0) return false;
    if (statusFilter === 'completed' && h.remainingBags > 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCust = h.customerName?.toLowerCase().includes(q);
      const matchProd = h.productName?.toLowerCase().includes(q);
      const matchLoc = h.location?.toLowerCase().includes(q);
      const matchNotes = h.notes?.toLowerCase().includes(q);
      if (!matchCust && !matchProd && !matchLoc && !matchNotes) return false;
    }
    return true;
  });

  const totalBagsInCustody = holdStock.reduce((s, h) => s + h.remainingBags, 0);

  return (
    <div className="page-body">
      {/* Top Custody KPI Banner */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL HELD BAGS IN GODOWN</span>
            <span className="kpi-icon-pill" style={{ background: '#ffedd5', color: '#c2410c' }}>📦</span>
          </div>
          <div className="kpi-value" style={{ color: '#c2410c' }}>
            {totalBagsInCustody} Bags
          </div>
          <div className="kpi-subtext">
            <span>Amanat stock custody held for farmers</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">ACTIVE CUSTODY ACCOUNTS</span>
            <span className="kpi-icon-pill" style={{ background: '#eff6ff', color: '#2563eb' }}>👥</span>
          </div>
          <div className="kpi-value">
            {holdStock.filter(h => h.remainingBags > 0).length} Farmers
          </div>
          <div className="kpi-subtext">
            <span>Awaiting field delivery / tractor lift</span>
          </div>
        </div>
      </div>

      {/* Action and Filter Toolbar */}
      <div className="card" style={{ padding: '12px 18px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 240px', maxWidth: '360px' }}>
            <input
              type="text"
              className="input"
              placeholder="🔍 Search Farmer, Product, or Bay Location..."
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
              All Records ({holdStock.length})
            </button>
            <button
              type="button"
              className={`segmented-btn ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
              style={{ fontSize: '11.5px', padding: '4px 10px' }}
            >
              In Custody ({holdStock.filter(h => h.remainingBags > 0).length})
            </button>
            <button
              type="button"
              className={`segmented-btn ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
              style={{ fontSize: '11.5px', padding: '4px 10px' }}
            >
              Released / Completed
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            + Deposit Customer Stock (Amanat Entry)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>DEPOSIT DATE</th>
                <th>CUSTOMER NAME</th>
                <th>PRODUCT</th>
                <th>TOTAL DEPOSITED</th>
                <th>RELEASED</th>
                <th>REMAINING IN GODOWN</th>
                <th>LOCATION</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldStock.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No customer stock records found. Click <b>+ Deposit Customer Stock</b> to book advance bags.
                  </td>
                </tr>
              ) : (
                filteredHoldStock.map(h => (
                  <tr key={h.id}>
                    <td>{formatDate(h.date)}</td>
                    <td style={{ fontWeight: 700 }}>{h.customerName}</td>
                    <td>{h.productName}</td>
                    <td style={{ fontWeight: 600 }}>{h.totalBags} bags</td>
                    <td style={{ color: '#16a34a' }}>{h.releasedBags} bags</td>
                    <td style={{ fontWeight: 800, color: h.remainingBags > 0 ? '#b91c1c' : '#64748b' }}>
                      {h.remainingBags} bags
                    </td>
                    <td><span className="badge badge-neutral">{h.location}</span></td>
                    <td>
                      <span className={`badge ${h.remainingBags > 0 ? 'badge-warning' : 'badge-success'}`}>
                        {h.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        {h.remainingBags > 0 ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ fontSize: '12px', padding: '5px 12px' }}
                            onClick={() => {
                              setReleaseModalData(h);
                              setReleaseQty(1);
                            }}
                          >
                            🚚 Release
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Completed</span>
                        )}
                        {(auth.user?.role === 'admin' || auth.user?.role === 'superadmin') && (
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove custody record for ${h.customerName} (${h.productName})?`)) {
                                deleteHoldStock(h.id);
                              }
                            }}
                            title="Delete Custody Record"
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

      {/* Add Custody Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Deposit Customer Stock (Amanat Entry)</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label className="input-label">Customer / Farmer <span className="req">*</span></label>
                  <select
                    className="select"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    required
                  >
                    <option value="">-- Select Farmer --</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.village || 'Farmer'})</option>)}
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label className="input-label">Product to Hold <span className="req">*</span></label>
                  <select
                    className="select"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    required
                  >
                    <option value="">-- Select Fertilizer / Seed Product --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Total Bags to Hold <span className="req">*</span></label>
                    <input
                      type="number"
                      min="1"
                      className="input"
                      value={formData.totalBags}
                      onChange={(e) => setFormData({ ...formData, totalBags: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Godown Storage Location</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Notes & Booking Terms</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Paid in full, advance booking rate"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Amanat Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Release Dispatch Modal */}
      {releaseModalData && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Release Bags to Farmer</h3>
              <button type="button" className="modal-close-btn" onClick={() => setReleaseModalData(null)}>&times;</button>
            </div>
            <form onSubmit={handleReleaseSubmit}>
              <div className="modal-body">
                <div style={{ background: 'var(--bg-hover)', padding: '12px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                  <div>Farmer: <b>{releaseModalData.customerName}</b></div>
                  <div>Product: <b>{releaseModalData.productName}</b></div>
                  <div style={{ marginTop: '4px', color: '#b91c1c', fontWeight: 700 }}>
                    Remaining in Godown: {releaseModalData.remainingBags} bags
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Number of Bags Released Now</label>
                  <input
                    type="number"
                    min="1"
                    max={releaseModalData.remainingBags}
                    className="input"
                    value={releaseQty}
                    onChange={(e) => setReleaseQty(Math.min(releaseModalData.remainingBags, Math.max(1, parseInt(e.target.value) || 1)))}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setReleaseModalData(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Dispatch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
