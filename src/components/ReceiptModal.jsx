'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export default function ReceiptModal({ isOpen, onClose, sale }) {
  const { storeProfile, customers, hideAmounts } = useApp();
  const [printFormat, setPrintFormat] = useState('thermal'); // 'thermal' (80mm) | 'a4'

  if (!isOpen || !sale) return null;

  const customer = customers.find(c => c.id === sale.customerId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog" style={{ maxWidth: printFormat === 'thermal' ? '460px' : '750px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 className="modal-title">Invoice &bull; {sale.id}</h3>
            <div className="segmented-control" style={{ background: 'rgba(255,255,255,0.2)', border: 'none' }}>
              <button
                type="button"
                className={`segmented-btn ${printFormat === 'thermal' ? 'active' : ''}`}
                style={{ color: '#fff' }}
                onClick={() => setPrintFormat('thermal')}
              >
                80mm Thermal Slip
              </button>
              <button
                type="button"
                className={`segmented-btn ${printFormat === 'a4' ? 'active' : ''}`}
                style={{ color: '#fff' }}
                onClick={() => setPrintFormat('a4')}
              >
                Standard A4 Bill
              </button>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body" style={{ background: '#f8fafc', padding: '24px' }}>
          {/* Printable Receipt Paper Container */}
          <div
            id="printable-receipt-area"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: printFormat === 'thermal' ? '20px' : '36px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              fontFamily: printFormat === 'thermal' ? 'monospace' : 'inherit',
              fontSize: printFormat === 'thermal' ? '12px' : '13.5px',
              color: '#0f172a'
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '16px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: printFormat === 'thermal' ? '16px' : '22px', fontWeight: 800 }}>{storeProfile.name}</h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{storeProfile.subtitle}</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>{storeProfile.address}</p>
              <p style={{ fontSize: '11px', fontWeight: 600 }}>Phone/WhatsApp: {storeProfile.phone} &bull; NTN: {storeProfile.ntn}</p>
            </div>

            {/* Invoice Meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '11.5px' }}>
              <div>
                <div><b>Invoice:</b> {sale.id}</div>
                <div><b>Date:</b> {formatDate(sale.date)}</div>
                <div><b>Time:</b> {formatTime(sale.date)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><b>Customer:</b> {sale.customerName}</div>
                {customer?.village && <div><b>Village:</b> {customer.village}</div>}
                {customer?.phone && <div><b>Phone:</b> {customer.phone}</div>}
                <div><b>Billed By:</b> {sale.createdBy || 'Staff'}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: printFormat === 'thermal' ? '11px' : '12.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #0f172a', textAlign: 'left' }}>
                  <th style={{ padding: '6px 4px' }}>ITEM</th>
                  <th style={{ padding: '6px 4px', textAlign: 'center' }}>QTY</th>
                  <th style={{ padding: '6px 4px', textAlign: 'right' }}>RATE</th>
                  <th style={{ padding: '6px 4px', textAlign: 'right' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px dashed #e2e8f0' }}>
                    <td style={{ padding: '6px 4px' }}>
                      <div style={{ fontWeight: 600 }}>{it.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{it.source === 'store' ? 'Store' : 'Shop'}</div>
                    </td>
                    <td style={{ padding: '6px 4px', textAlign: 'center' }}>{it.qty} {it.unit}</td>
                    <td style={{ padding: '6px 4px', textAlign: 'right' }}>{it.price}</td>
                    <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 700 }}>{it.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(sale.subtotal, hideAmounts)}</span>
              </div>
              {sale.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                  <span>Discount:</span>
                  <span>-{formatCurrency(sale.discount, hideAmounts)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, borderTop: '1px solid #0f172a', borderBottom: '1px solid #0f172a', padding: '6px 0', margin: '4px 0' }}>
                <span>Grand Total:</span>
                <span>{formatCurrency(sale.grandTotal, hideAmounts)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Paid Now ({sale.paymentType.toUpperCase()}):</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>{formatCurrency(sale.paidAmount, hideAmounts)}</span>
              </div>
              {sale.balanceAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b91c1c', fontWeight: 700 }}>
                  <span>Charged to Khata Ledger:</span>
                  <span>{formatCurrency(sale.balanceAmount, hideAmounts)}</span>
                </div>
              )}
            </div>

            {/* Customer Ledger Balance Summary */}
            {customer && customer.id !== 'walk-in' && (
              <div style={{ marginTop: '14px', background: '#f1f5f9', padding: '10px', borderRadius: '4px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Current Total Ledger Balance:</span>
                  <span style={{ fontWeight: 800, color: customer.balance > 0 ? '#b91c1c' : '#16a34a' }}>
                    {formatCurrency(customer.balance, hideAmounts)} (Debit)
                  </span>
                </div>
              </div>
            )}

            {/* Footer Tagline */}
            <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '11px', color: '#64748b' }}>
              <p>{storeProfile.tagline}</p>
              <p style={{ marginTop: '4px', fontWeight: 600 }}>Thank you for your business &bull; Powered by AgriSol Pro</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Close</button>
          <button type="button" className="btn btn-primary" onClick={handlePrint} style={{ minWidth: '130px' }}>
            🖨️ Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
