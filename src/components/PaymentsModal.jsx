'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export default function PaymentsModal({ isOpen, onClose, initialType = 'in', initialAccountId = '' }) {
  const { customers, suppliers, addPayment, hideAmounts } = useApp();

  const [type, setType] = useState(initialType); // 'in' | 'out'
  const [accountId, setAccountId] = useState(initialAccountId || '');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash');
  const [refNo, setRefNo] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAccountId(initialAccountId || '');
      setAmount('');
      setRemarks('');
      setRefNo('');
    }
  }, [isOpen, initialType, initialAccountId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    let accountName = 'General Cash Account';
    let accountType = 'other';

    if (type === 'in') {
      const cust = customers.find(c => c.id === accountId);
      if (!cust) {
        alert('Please select a customer.');
        return;
      }
      accountName = cust.name;
      accountType = 'customer';
    } else {
      const sup = suppliers.find(s => s.id === accountId);
      if (!sup) {
        accountName = accountId || 'Expense / Miscellaneous';
        accountType = 'supplier';
      } else {
        accountName = sup.name;
        accountType = 'supplier';
      }
    }

    addPayment({
      type,
      accountId,
      accountName,
      accountType,
      amount: Number(amount),
      mode,
      refNo,
      remarks
    });

    onClose();
  };

  const selectedCust = customers.find(c => c.id === accountId);
  const selectedSup = suppliers.find(s => s.id === accountId);

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            {type === 'in' ? '📥 Payment In (Receive Cash from Farmer)' : '📤 Payment Out (Pay Supplier / Expense)'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Type toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                className={`btn ${type === 'in' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => { setType('in'); setAccountId(''); }}
              >
                📥 Payment In (Customer)
              </button>
              <button
                type="button"
                className={`btn ${type === 'out' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => { setType('out'); setAccountId(''); }}
              >
                📤 Payment Out (Supplier)
              </button>
            </div>

            {/* Account selection */}
            <div className="input-group" style={{ marginBottom: '14px' }}>
              <label className="input-label">
                {type === 'in' ? 'Customer Account (Farmer Khata)' : 'Supplier / Payee Account'} <span className="req">*</span>
              </label>
              {type === 'in' ? (
                <select
                  className="select"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  required
                >
                  <option value="">-- Select Farmer / Landlord --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} &bull; Bal: {formatCurrency(c.balance, hideAmounts)}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="select"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  required
                >
                  <option value="">-- Select Fertilizer / Seed Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} &bull; Payable: {formatCurrency(s.balance, hideAmounts)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Current Balance Notice */}
            {selectedCust && type === 'in' && (
              <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: '6px', fontSize: '12.5px', marginBottom: '14px', color: '#065f46' }}>
                Current Receivable: <b>{formatCurrency(selectedCust.balance, hideAmounts)}</b>
              </div>
            )}
            {selectedSup && type === 'out' && (
              <div style={{ background: '#fffbeb', padding: '10px 14px', borderRadius: '6px', fontSize: '12.5px', marginBottom: '14px', color: '#92400e' }}>
                Current Payable to Company: <b>{formatCurrency(selectedSup.balance, hideAmounts)}</b>
              </div>
            )}

            {/* Amount */}
            <div className="input-group" style={{ marginBottom: '14px' }}>
              <label className="input-label">Amount (Rs) <span className="req">*</span></label>
              <input
                type="number"
                min="1"
                className="input"
                placeholder="e.g. 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Mode & Ref No */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div className="input-group">
                <label className="input-label">Payment Mode</label>
                <select className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="Cash">Cash in Hand</option>
                  <option value="Bank Transfer (HBL)">Bank Transfer (HBL)</option>
                  <option value="Bank Transfer (Meezan)">Bank Transfer (Meezan)</option>
                  <option value="Cheque">Bank Cheque</option>
                  <option value="JazzCash / EasyPaisa">JazzCash / EasyPaisa</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Ref / Cheque #</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. CHQ-99120"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="input-group">
              <label className="input-label">Remarks / Notes</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Partial recovery for DAP bill"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ minWidth: '140px' }}>
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
