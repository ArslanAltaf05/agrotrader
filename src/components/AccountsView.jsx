'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function AccountsView({ onOpenPaymentIn, onOpenPaymentOut }) {
  const {
    customers,
    suppliers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    sales,
    purchases,
    payments,
    hideAmounts,
    showToast,
    auth,
    selectedAccountId,
    setSelectedAccountId
  } = useApp();

  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'superadmin';

  const [activeTab, setActiveTab] = useState('customers'); // 'customers' | 'suppliers'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null); // for statement modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null); // for editing

  // Auto-open statement modal if an account was clicked from Mobile Dashboard
  useEffect(() => {
    if (selectedAccountId) {
      const match = customers.find(c => c.id === selectedAccountId) || suppliers.find(s => s.id === selectedAccountId);
      if (match) {
        setSelectedAccount(match);
        if (suppliers.some(s => s.id === selectedAccountId)) {
          setActiveTab('suppliers');
        } else {
          setActiveTab('customers');
        }
      }
      setSelectedAccountId(null);
    }
  }, [selectedAccountId, customers, suppliers]);

  // New account form state
  const [newAcc, setNewAcc] = useState({
    name: '',
    phone: '',
    village: '',
    cnic: '',
    creditLimit: '300000',
    contactPerson: '',
    city: ''
  });

  const totalReceivables = customers.reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0);
  const totalPayables = suppliers.reduce((sum, s) => sum + (s.balance > 0 ? s.balance : 0), 0);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm) ||
    c.village?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone?.includes(searchTerm) ||
    s.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newAcc.name.trim()) return;

    if (activeTab === 'customers') {
      addCustomer(newAcc);
    } else {
      addSupplier(newAcc);
    }

    setNewAcc({ name: '', phone: '', village: '', cnic: '', creditLimit: '300000', contactPerson: '', city: '' });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingAccount) return;

    if (editingAccount.accountType === 'customer') {
      updateCustomer(editingAccount.id, {
        name: editingAccount.name,
        phone: editingAccount.phone,
        village: editingAccount.village,
        creditLimit: Number(editingAccount.creditLimit) || 0
      });
    } else {
      updateSupplier(editingAccount.id, {
        name: editingAccount.name,
        phone: editingAccount.phone,
        city: editingAccount.city,
        contactPerson: editingAccount.contactPerson
      });
    }

    setEditingAccount(null);
  };

  const handleDelete = (acc, type) => {
    if (acc.balance > 0) {
      alert(`Cannot delete this account because it has an active unsettled balance of Rs ${acc.balance.toLocaleString()}. Please clear the khata first.`);
      return;
    }
    if (confirm(`Are you sure you want to remove ${acc.name}?`)) {
      if (type === 'customer') {
        deleteCustomer(acc.id);
      } else {
        deleteSupplier(acc.id);
      }
    }
  };

  // Generate statement for selected customer
  const getCustomerStatement = (custId) => {
    const custSales = sales.filter(s => s.customerId === custId).map(s => {
      const items = Array.isArray(s.items) ? s.items : [];
      const productSummary = items.length > 0
        ? items.map(item => `${item.name || item.productName || 'Product'} (${item.qty || 1} ${item.unit || ''})`).join(', ')
        : 'Sale Invoice';
      return {
        date: s.date,
        type: productSummary,
        items,
        ref: s.invoiceNo || s.id,
        debit: s.grandTotal,
        credit: s.paidAmount,
        balanceChange: s.balanceAmount
      };
    });

    const custPayments = payments.filter(p => p.accountId === custId && p.type === 'in').map(p => ({
      date: p.date,
      type: `Payment In (${p.mode || p.paymentMode || 'Cash'})`,
      items: [],
      ref: p.voucherNo || p.id,
      debit: 0,
      credit: p.amount,
      balanceChange: -p.amount
    }));

    const combined = [...custSales, ...custPayments].sort((a, b) => new Date(a.date) - new Date(b.date));
    return combined;
  };

  // Generate statement for selected supplier
  const getSupplierStatement = (supId) => {
    const supPurchases = (purchases || []).filter(po => po.supplierId === supId).map(po => ({
      date: po.date,
      type: `Inward PO (${po.productName} - ${po.qty} ${po.unit})`,
      ref: po.id,
      debit: 0,
      credit: po.totalCost, // Company billed us (Payable increases)
      balanceChange: po.totalCost
    }));

    const supPayments = payments.filter(p => p.accountId === supId && p.type === 'out').map(p => ({
      date: p.date,
      type: `Payment Out (${p.mode})`,
      ref: p.id,
      debit: p.amount, // We paid company (Payable decreases)
      credit: 0,
      balanceChange: -p.amount
    }));

    const combined = [...supPurchases, ...supPayments].sort((a, b) => new Date(a.date) - new Date(b.date));
    return combined;
  };

  const handleExportAccountsCSV = () => {
    if (activeTab === 'customers') {
      const headers = ['Farmer Name', 'Phone', 'Village / Chak', 'CNIC', 'Credit Limit', 'Current Khata Balance', 'Category'];
      const rows = filteredCustomers.map(c => [
        `"${c.name}"`,
        `"${c.phone || ''}"`,
        `"${c.village || ''}"`,
        `"${c.cnic || ''}"`,
        c.creditLimit,
        c.balance,
        `"${c.type || 'Farmer'}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `Farmer_Khata_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['Company Name', 'Contact Person', 'Phone', 'City', 'Current Payable Balance'];
      const rows = filteredSuppliers.map(s => [
        `"${s.name}"`,
        `"${s.contactPerson || ''}"`,
        `"${s.phone || ''}"`,
        `"${s.city || ''}"`,
        s.balance
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `Supplier_Payables_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="page-body">
      {/* Top Ledger Overview Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL RECEIVABLES (FARMER KHATA)</span>
            <span className="kpi-icon-pill" style={{ background: '#fee2e2', color: '#b91c1c' }}>👥</span>
          </div>
          <div className="kpi-value" style={{ color: '#b91c1c' }}>
            {formatCurrency(totalReceivables, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>{customers.filter(c => c.balance > 0).length} farmers with outstanding balances</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL PAYABLES (COMPANIES)</span>
            <span className="kpi-icon-pill" style={{ background: '#fef3c7', color: '#b45309' }}>🏢</span>
          </div>
          <div className="kpi-value" style={{ color: '#b45309' }}>
            {formatCurrency(totalPayables, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>Owed to fertilizer &amp; seed manufacturers</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Farmer / Customer Accounts ({customers.length})
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeTab === 'suppliers' ? 'active' : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            Supplier / Company Accounts ({suppliers.length})
          </button>
        </div>

        <div className="search-input-wrapper" style={{ flex: '1 1 240px', maxWidth: '320px' }}>
          <input
            type="text"
            className="input"
            placeholder={activeTab === 'customers' ? 'Search farmer by name, village, phone...' : 'Search supplier name, city...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExportAccountsCSV}
          >
            📥 Export CSV
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + {activeTab === 'customers' ? 'Add New Farmer' : 'Add New Supplier'}
          </button>
        </div>
      </div>

      {/* Accounts List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ACCOUNT NAME</th>
                <th>{activeTab === 'customers' ? 'VILLAGE / AREA' : 'DEPOT / CITY'}</th>
                <th>PHONE / WHATSAPP</th>
                <th>{activeTab === 'customers' ? 'CREDIT LIMIT' : 'CONTACT PERSON'}</th>
                <th>CURRENT BALANCE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'customers' ? (
                filteredCustomers.map(cust => (
                  <tr key={cust.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{cust.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cust.type}</div>
                    </td>
                    <td>{cust.village || 'Local'}</td>
                    <td>{cust.phone}</td>
                    <td>{formatCurrency(cust.creditLimit, hideAmounts)}</td>
                    <td style={{ fontWeight: 800, color: cust.balance > 0 ? '#b91c1c' : '#10b981' }}>
                      {formatCurrency(cust.balance, hideAmounts)} {cust.balance > 0 ? '(Dr)' : '(Nil)'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ fontSize: '11.5px', padding: '4px 8px' }}
                          onClick={() => setSelectedAccount({ ...cust, accountType: 'customer' })}
                        >
                          📜 Khata
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ fontSize: '11.5px', padding: '4px 8px' }}
                          onClick={() => onOpenPaymentIn && onOpenPaymentIn(cust.id)}
                        >
                          📥 Receive
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-icon-only"
                          style={{ width: '28px', height: '28px', fontSize: '11px' }}
                          onClick={() => setEditingAccount({ ...cust, accountType: 'customer' })}
                          title="Edit Customer"
                        >
                          ✏️
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            style={{ width: '28px', height: '28px', fontSize: '11px', color: '#ef4444' }}
                            onClick={() => handleDelete(cust, 'customer')}
                            title="Delete Customer Account"
                          >
                            🗑️
                          </button>
                        )}
                        {cust.balance > 0 && cust.phone && (
                          <a
                            href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${cust.name} sb, Aap ke khata ka baqaya Rs ${cust.balance.toLocaleString()} hai. Shukriya.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-icon-only"
                            style={{ color: '#15803d', width: '28px', height: '28px' }}
                            title="Send WhatsApp Khata Reminder"
                          >
                            💬
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredSuppliers.map(sup => (
                  <tr key={sup.id}>
                    <td style={{ fontWeight: 700 }}>{sup.name}</td>
                    <td>{sup.city}</td>
                    <td>{sup.phone}</td>
                    <td>{sup.contactPerson}</td>
                    <td style={{ fontWeight: 800, color: '#b45309' }}>
                      {formatCurrency(sup.balance, hideAmounts)} (Cr)
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ fontSize: '11.5px', padding: '4px 8px' }}
                          onClick={() => setSelectedAccount({ ...sup, accountType: 'supplier' })}
                        >
                          📜 Khata
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ fontSize: '11.5px', padding: '4px 8px' }}
                          onClick={() => onOpenPaymentOut && onOpenPaymentOut(sup.id)}
                        >
                          📤 Pay
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-icon-only"
                          style={{ width: '28px', height: '28px', fontSize: '11px' }}
                          onClick={() => setEditingAccount({ ...sup, accountType: 'supplier' })}
                          title="Edit Supplier"
                        >
                          ✏️
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            style={{ width: '28px', height: '28px', fontSize: '11px', color: '#ef4444' }}
                            onClick={() => handleDelete(sup, 'supplier')}
                            title="Delete Supplier Account"
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

      {/* Account Statement Dialog */}
      {selectedAccount && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '840px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedAccount.accountType === 'customer' ? 'Farmer Khata Statement' : 'Supplier Company Khata Statement'}: {selectedAccount.name}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedAccount(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-hover)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Contact Info</div>
                  <div style={{ fontWeight: 600 }}>{selectedAccount.phone} &bull; {selectedAccount.village || selectedAccount.city || 'Head Office'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Ledger Balance</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: selectedAccount.accountType === 'customer' ? '#b91c1c' : '#b45309' }}>
                    {formatCurrency(selectedAccount.balance, hideAmounts)} {selectedAccount.accountType === 'customer' ? '(Debit / Receivable)' : '(Credit / Payable)'}
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>PRODUCTS</th>
                      <th>REF #</th>
                      <th style={{ textAlign: 'right' }}>
                        {selectedAccount.accountType === 'customer' ? 'DEBIT (SALE)' : 'DEBIT (WE PAID)'}
                      </th>
                      <th style={{ textAlign: 'right' }}>
                        {selectedAccount.accountType === 'customer' ? 'CREDIT (PAID)' : 'CREDIT (INWARD PO)'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedAccount.accountType === 'customer'
                      ? getCustomerStatement(selectedAccount.id)
                      : getSupplierStatement(selectedAccount.id)
                    ).map((entry, i) => (
                      <tr key={i}>
                        <td>{formatDate(entry.date)}</td>
                        <td style={{ fontWeight: 600 }}>
                          {entry.items && entry.items.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {entry.items.map((item, idx) => (
                                <div key={idx} style={{ fontSize: '13px', lineHeight: 1.35 }}>
                                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>• {item.name || item.productName}</span>{' '}
                                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                    ({item.qty} {item.unit || 'qty'}{item.salePrice ? ` @ Rs ${item.salePrice}` : ''})
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span>{entry.type}</span>
                          )}
                        </td>
                        <td>{entry.ref}</td>
                        <td style={{ textAlign: 'right', color: entry.debit > 0 ? (selectedAccount.accountType === 'customer' ? '#b91c1c' : '#16a34a') : undefined, fontWeight: entry.debit > 0 ? 700 : 400 }}>
                          {entry.debit > 0 ? formatCurrency(entry.debit, hideAmounts) : '-'}
                        </td>
                        <td style={{ textAlign: 'right', color: entry.credit > 0 ? (selectedAccount.accountType === 'customer' ? '#16a34a' : '#b45309') : undefined, fontWeight: entry.credit > 0 ? 700 : 400 }}>
                          {entry.credit > 0 ? formatCurrency(entry.credit, hideAmounts) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setSelectedAccount(null)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Statement</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {editingAccount && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                Edit {editingAccount.accountType === 'customer' ? 'Farmer Account' : 'Supplier Account'}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setEditingAccount(null)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label className="input-label">Account / Party Name <span className="req">*</span></label>
                  <input
                    type="text"
                    className="input"
                    value={editingAccount.name}
                    onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label className="input-label">Phone / WhatsApp</label>
                  <input
                    type="text"
                    className="input"
                    value={editingAccount.phone || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, phone: e.target.value })}
                  />
                </div>

                {editingAccount.accountType === 'customer' ? (
                  <>
                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">Village / Chak No.</label>
                      <input
                        type="text"
                        className="input"
                        value={editingAccount.village || ''}
                        onChange={(e) => setEditingAccount({ ...editingAccount, village: e.target.value })}
                      />
                    </div>
                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">Credit Limit (Rs)</label>
                      <input
                        type="number"
                        className="input"
                        value={editingAccount.creditLimit || ''}
                        onChange={(e) => setEditingAccount({ ...editingAccount, creditLimit: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">Depot City</label>
                      <input
                        type="text"
                        className="input"
                        value={editingAccount.city || ''}
                        onChange={(e) => setEditingAccount({ ...editingAccount, city: e.target.value })}
                      />
                    </div>
                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">Contact Person / Area Officer</label>
                      <input
                        type="text"
                        className="input"
                        value={editingAccount.contactPerson || ''}
                        onChange={(e) => setEditingAccount({ ...editingAccount, contactPerson: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditingAccount(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {activeTab === 'customers' ? 'Add New Farmer Account' : 'Add New Supplier Account'}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label className="input-label">Account / Party Name <span className="req">*</span></label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Haji Muhammad Aslam"
                    value={newAcc.name}
                    onChange={(e) => setNewAcc({ ...newAcc, name: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label className="input-label">Phone / WhatsApp</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="0300-1234567"
                    value={newAcc.phone}
                    onChange={(e) => setNewAcc({ ...newAcc, phone: e.target.value })}
                  />
                </div>

                {activeTab === 'customers' ? (
                  <>
                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">Village / Chak No.</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Chak 28 SB, Mandi"
                        value={newAcc.village}
                        onChange={(e) => setNewAcc({ ...newAcc, village: e.target.value })}
                      />
                    </div>

                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">CNIC Number</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="38403-1234567-1"
                        value={newAcc.cnic}
                        onChange={(e) => setNewAcc({ ...newAcc, cnic: e.target.value })}
                      />
                    </div>

                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">Credit Limit (Rs)</label>
                      <input
                        type="number"
                        className="input"
                        value={newAcc.creditLimit}
                        onChange={(e) => setNewAcc({ ...newAcc, creditLimit: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">Depot City</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Sargodha / Multan"
                        value={newAcc.city}
                        onChange={(e) => setNewAcc({ ...newAcc, city: e.target.value })}
                      />
                    </div>

                    <div className="input-group" style={{ marginBottom: '12px' }}>
                      <label className="input-label">Company Contact Person</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Area Sales Officer"
                        value={newAcc.contactPerson}
                        onChange={(e) => setNewAcc({ ...newAcc, contactPerson: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
