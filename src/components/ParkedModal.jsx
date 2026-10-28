'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export default function ParkedModal({ isOpen, onClose, onResumeCart }) {
  const { parkedSales, resumeParkedSale, hideAmounts } = useApp();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 className="modal-title">⏸️ Parked / Held Sales Cart</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {parkedSales.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              No held sales. When a customer steps away or needs time, click <b>Park Cart</b> in New Sale to hold their cart here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {parkedSales.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{p.customerName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Held at: {formatDate(p.date)} &bull; {formatTime(p.date)}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Items: {p.cart.items?.map(i => `${i.qty} ${i.unit} ${i.name}`).join(', ')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--primary)' }}>
                      {formatCurrency(p.cart.subtotal, hideAmounts)}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '12.5px' }}
                      onClick={() => {
                        const cart = resumeParkedSale(p.id);
                        if (cart && onResumeCart) {
                          onResumeCart(cart);
                        }
                        onClose();
                      }}
                    >
                      Resume Cart &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
