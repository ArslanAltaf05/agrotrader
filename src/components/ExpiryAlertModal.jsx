'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getExpiryDetails } from '../utils/formatters';

export default function ExpiryAlertModal({ isOpen, onClose, onOpenNewSale }) {
  const { criticalExpiryProducts, setActiveTab, hideAmounts } = useApp();

  if (!isOpen) return null;

  const expiredCount = criticalExpiryProducts.filter(p => p.isExpired).length;
  const expiringSoonCount = criticalExpiryProducts.filter(p => !p.isExpired).length;
  const totalUnitsAtRisk = criticalExpiryProducts.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
  const totalValueAtRisk = criticalExpiryProducts.reduce((sum, p) => sum + (p.stockValueAtRisk || 0), 0);

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog" style={{ maxWidth: '850px' }}>
        <div className="modal-header" style={{ borderBottom: '2px solid #fee2e2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>⚠️</span>
            <div>
              <h3 className="modal-title" style={{ color: '#991b1b', margin: 0, fontSize: '17px' }}>
                Inventory Expiry Alert &bull; Critical 7-Day Window
              </h3>
              <p style={{ fontSize: '12px', color: '#7f1d1d', margin: 0 }}>
                Products expiring within 1 week or past their expiration date requiring clearance or supplier return.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ padding: '16px 20px' }}>
          {/* Summary Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '16px'
            }}
          >
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b' }}>CRITICAL BATCHES</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>
                {criticalExpiryProducts.length} Product{criticalExpiryProducts.length > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: '11px', color: '#7f1d1d' }}>
                {expiredCount} Expired &bull; {expiringSoonCount} Expiring ≤ 7d
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>TOTAL STOCK AT RISK</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#d97706' }}>
                {totalUnitsAtRisk} Bags / Units
              </div>
              <div style={{ fontSize: '11px', color: '#b45309' }}>
                Unsold inventory approaching expiry
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>FINANCIAL VALUE AT RISK</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                {formatCurrency(totalValueAtRisk, hideAmounts)}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Based on purchase cost
              </div>
            </div>
          </div>

          {/* Critical Items Table */}
          {criticalExpiryProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '32px' }}>✅</span>
              <h4 style={{ color: '#166534', margin: '8px 0 4px' }}>No Batches Expiring in the Next 7 Days</h4>
              <p style={{ fontSize: '13px', color: '#15803d', margin: 0 }}>
                All active inventory batches have healthy expiry dates.
              </p>
            </div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: '340px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr style={{ background: '#fef2f2' }}>
                    <th style={{ color: '#991b1b', fontSize: '11px' }}>PRODUCT &amp; BATCH</th>
                    <th style={{ color: '#991b1b', fontSize: '11px' }}>EXPIRY COUNTDOWN</th>
                    <th style={{ color: '#991b1b', fontSize: '11px', textAlign: 'center' }}>STOCK ON HAND</th>
                    <th style={{ color: '#991b1b', fontSize: '11px', textAlign: 'right' }}>VALUE AT RISK</th>
                    <th style={{ color: '#991b1b', fontSize: '11px', textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalExpiryProducts.map(p => {
                    const expiry = getExpiryDetails(p.expiryDate);
                    const totalUnits = (p.shopStock || 0) + (p.storeStock || 0);

                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            SKU: {p.sku} {p.batchNo && `• Batch: ${p.batchNo}`} &bull; {p.category}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              className={`badge ${expiry?.badgeClass || 'badge-warning'}`}
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                background: expiry?.bg,
                                color: expiry?.color,
                                border: `1px solid ${expiry?.color}40`
                              }}
                            >
                              {expiry?.isExpired ? '🔴 ' : '⏳ '}
                              {expiry?.label || p.expiryDate}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              ({p.expiryDate})
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            className="badge"
                            style={{
                              fontWeight: 700,
                              background: totalUnits > 0 ? '#fee2e2' : '#f3f4f6',
                              color: totalUnits > 0 ? '#b91c1c' : '#6b7280'
                            }}
                          >
                            {totalUnits} {p.unit}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>
                          {formatCurrency(totalUnits * (p.costPrice || 0), hideAmounts)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            style={{ fontSize: '11px', padding: '3px 10px' }}
                            onClick={() => {
                              onClose();
                              if (onOpenNewSale) onOpenNewSale();
                            }}
                            title="Open POS with product"
                          >
                            🛒 Sell in POS
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '12px' }}
            onClick={() => {
              onClose();
              setActiveTab('inventory');
            }}
          >
            📦 Open Inventory Manager
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '12px' }}
            onClick={onClose}
          >
            Done / Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
