'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export default function POSModal({ isOpen, onClose, onSaleComplete, resumedCart }) {
  const { products, customers, createSale, parkSale, hideAmounts, auth, staffPermissions, addCustomer } = useApp();

  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'superadmin';
  const canEditPrices = isAdmin || staffPermissions?.canEditPrices;
  const canGiveDiscounts = isAdmin || staffPermissions?.canGiveDiscounts;

  const [selectedCustomerId, setSelectedCustomerId] = useState('walk-in');
  const [showQuickCust, setShowQuickCust] = useState(false);
  const [quickCustName, setQuickCustName] = useState('');
  const [quickCustPhone, setQuickCustPhone] = useState('');
  const [quickCustVillage, setQuickCustVillage] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSource, setSelectedSource] = useState('shop');
  const [addQty, setAddQty] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState('cash'); // 'cash' | 'ledger' | 'partial'
  const [cashPaid, setCashPaid] = useState('');
  const [notes, setNotes] = useState('');

  // Handle Resumed Cart from Parked Sales
  useEffect(() => {
    if (resumedCart && isOpen) {
      if (resumedCart.items) setCart(resumedCart.items);
      if (resumedCart.customerId) setSelectedCustomerId(resumedCart.customerId);
      if (resumedCart.discount) setDiscount(resumedCart.discount);
      if (resumedCart.notes) setNotes(resumedCart.notes);
    }
  }, [resumedCart, isOpen]);

  if (!isOpen) return null;

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Add item to cart
  const handleAddItem = () => {
    if (!selectedProductId) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    const available = selectedSource === 'store' ? (prod.storeStock || 0) : (prod.shopStock || 0);
    const existing = cart.find(i => i.productId === prod.id && i.source === selectedSource);
    const currentInCart = existing ? existing.qty : 0;

    if (currentInCart + addQty > available) {
      alert(`Insufficient stock in ${selectedSource}! Available: ${available} ${prod.unit}`);
      return;
    }

    if (existing) {
      setCart(cart.map(i => i.productId === prod.id && i.source === selectedSource
        ? { ...i, qty: i.qty + addQty, total: (i.qty + addQty) * i.price }
        : i
      ));
    } else {
      setCart([...cart, {
        productId: prod.id,
        name: prod.name,
        unit: prod.unit,
        price: prod.salePrice,
        qty: addQty,
        source: selectedSource,
        total: addQty * prod.salePrice
      }]);
    }

    setAddQty(1);
    setSelectedProductId('');
  };

  const handleUpdateItemPrice = (index, newPrice) => {
    const p = Math.max(0, Number(newPrice) || 0);
    setCart(cart.map((item, idx) => idx === index ? { ...item, price: p, total: p * item.qty } : item));
  };

  const handleUpdateItemQty = (index, newQty) => {
    const q = Math.max(1, Number(newQty) || 1);
    const item = cart[index];
    const prod = products.find(p => p.id === item.productId);
    const available = item.source === 'store' ? (prod?.storeStock || 999) : (prod?.shopStock || 999);
    if (q > available) {
      alert(`Cannot exceed available stock of ${available} ${item.unit}!`);
      return;
    }
    setCart(cart.map((item, idx) => idx === index ? { ...item, qty: q, total: item.price * q } : item));
  };

  const handleRemoveItem = (index) => {
    setCart(cart.filter((_, idx) => idx !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = Math.max(0, subtotal - (Number(discount) || 0));

  let paidAmount = grandTotal;
  let balanceAmount = 0;

  if (paymentType === 'ledger') {
    paidAmount = 0;
    balanceAmount = grandTotal;
  } else if (paymentType === 'partial') {
    paidAmount = Math.min(grandTotal, Number(cashPaid) || 0);
    balanceAmount = Math.max(0, grandTotal - paidAmount);
  }

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const q = barcodeInput.trim().toLowerCase();
    const found = products.find(p => p.barcode?.toLowerCase() === q || p.sku?.toLowerCase() === q);
    if (found) {
      const available = selectedSource === 'store' ? (found.storeStock || 0) : (found.shopStock || 0);
      const existing = cart.find(i => i.productId === found.id && i.source === selectedSource);
      const currentInCart = existing ? existing.qty : 0;

      if (currentInCart + 1 > available) {
        alert(`Insufficient stock in ${selectedSource}! Available: ${available} ${found.unit}`);
        return;
      }

      if (existing) {
        setCart(cart.map(i => i.productId === found.id && i.source === selectedSource
          ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.price }
          : i
        ));
      } else {
        setCart([...cart, {
          productId: found.id,
          name: found.name,
          unit: found.unit,
          price: found.salePrice,
          qty: 1,
          source: selectedSource,
          total: found.salePrice
        }]);
      }
      setBarcodeInput('');
    } else {
      alert(`No product found with barcode / SKU: "${barcodeInput}"`);
    }
  };

  const handleCreateCustomerInline = (e) => {
    e.preventDefault();
    if (!quickCustName.trim()) return;
    const created = addCustomer({
      name: quickCustName.trim(),
      phone: quickCustPhone.trim(),
      village: quickCustVillage.trim(),
      creditLimit: 300000,
      balance: 0,
      type: 'Farmer'
    });
    setSelectedCustomerId(created.id);
    setShowQuickCust(false);
    setQuickCustName('');
    setQuickCustPhone('');
    setQuickCustVillage('');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Add at least one product.');
      return;
    }

    if (paymentType !== 'cash' && selectedCustomerId === 'walk-in') {
      alert('Ledger / Credit sale requires selecting a customer account (Khata).');
      return;
    }

    const sale = createSale({
      customerId: selectedCustomerId,
      customerName: selectedCustomerId === 'walk-in' ? 'Walk-in Cash Customer' : selectedCustomer?.name,
      paymentType,
      items: cart,
      subtotal,
      discount: Number(discount) || 0,
      grandTotal,
      paidAmount,
      balanceAmount,
      notes
    });

    onSaleComplete(sale);
    setCart([]);
    onClose();
  };

  const handlePark = () => {
    if (cart.length === 0) return;
    parkSale({
      customerName: selectedCustomerId === 'walk-in' ? 'Walk-in Customer' : selectedCustomer?.name,
      customerId: selectedCustomerId,
      items: cart,
      subtotal,
      discount
    });
    setCart([]);
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog" style={{ maxWidth: '980px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 className="modal-title">New Sale &bull; POS Billing Counter (F1)</h3>
            {canEditPrices && (
              <span className="badge badge-success" style={{ fontSize: '10px' }}>
                ⚡ Dynamic Price Editing Active
              </span>
            )}
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* Top Row: Customer Selection & Quick Register Button */}
          <div className="pos-customer-row" style={{ alignItems: 'flex-start' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="input-label" style={{ margin: 0 }}>Select Customer / Khata Account</label>
                <button
                  type="button"
                  onClick={() => setShowQuickCust(prev => !prev)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showQuickCust ? '✕ Cancel' : '👤 + Quick Register Farmer'}
                </button>
              </div>

              {showQuickCust ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', padding: '10px', background: 'var(--bg-hover)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Farmer Name *"
                    value={quickCustName}
                    onChange={(e) => setQuickCustName(e.target.value)}
                    style={{ fontSize: '12px', height: '32px' }}
                    required
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Phone #"
                    value={quickCustPhone}
                    onChange={(e) => setQuickCustPhone(e.target.value)}
                    style={{ fontSize: '12px', height: '32px' }}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Village / Chak"
                    value={quickCustVillage}
                    onChange={(e) => setQuickCustVillage(e.target.value)}
                    style={{ fontSize: '12px', height: '32px' }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreateCustomerInline}
                    style={{ fontSize: '11.5px', height: '32px' }}
                  >
                    ✓ Save &amp; Select
                  </button>
                </div>
              ) : (
                <select
                  className="select"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="walk-in">Walk-in Cash Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.village || c.phone || 'Farmer'}) &bull; Khata Bal: {formatCurrency(c.balance, hideAmounts)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedCustomerId !== 'walk-in' && selectedCustomer && !showQuickCust && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '160px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Previous Khata Balance</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: selectedCustomer.balance > 0 ? '#ef4444' : '#10b981' }}>
                  {formatCurrency(selectedCustomer.balance, hideAmounts)}
                  <span style={{ fontSize: '11px', marginLeft: '6px', color: 'var(--text-muted)' }}>
                    {selectedCustomer.balance > 0 ? '(Debit / Receivable)' : '(Cleared)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Barcode Quick Scanner Strip */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: '6px', border: '1px dashed var(--border-color)' }}>
            <span style={{ fontSize: '14px' }}>📟</span>
            <input
              type="text"
              className="input"
              placeholder="Barcode scanner or SKU quick scan (Press Enter)..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleBarcodeSubmit(e);
                }
              }}
              style={{ fontSize: '12px', height: '32px', flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleBarcodeSubmit}
              style={{ fontSize: '11.5px', height: '32px', whiteSpace: 'nowrap' }}
            >
              + Scan &amp; Add
            </button>
          </div>

          {/* Product Manual Quick Add Row */}
          <div className="pos-add-row">
            <div className="input-group">
              <label className="input-label">Select Product to Add</label>
              <select
                className="select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">-- Choose Fertilizer, Seed or Chemical --</option>
                {products.map(p => {
                  const avail = selectedSource === 'store' ? p.storeStock : p.shopStock;
                  return (
                    <option key={p.id} value={p.id} disabled={avail <= 0}>
                      {p.name} - Rs {p.salePrice} ({avail} {p.unit} in {selectedSource})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Stock Location</label>
              <select
                className="select"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <option value="shop">Shop Counter</option>
                <option value="store">Store / Godown</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Quantity</label>
              <input
                type="number"
                min="1"
                className="input"
                value={addQty}
                onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ height: '38px', padding: '0 18px' }}
              onClick={handleAddItem}
            >
              + Add Item
            </button>
          </div>

          {/* Cart Table */}
          <div className="table-responsive" style={{ minHeight: '160px', maxHeight: '220px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>PRODUCT</th>
                  <th>SOURCE</th>
                  <th>RATE {canEditPrices ? '(EDITABLE)' : ''}</th>
                  <th>QTY</th>
                  <th>TOTAL</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No items in cart. Select product above and click <b>+ Add Item</b>.
                    </td>
                  </tr>
                ) : (
                  cart.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>
                        <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                          {item.source}
                        </span>
                      </td>
                      <td>
                        {canEditPrices ? (
                          <input
                            type="number"
                            min="0"
                            className="input"
                            style={{ width: '95px', padding: '3px 6px', fontSize: '12px', fontWeight: 600 }}
                            value={item.price}
                            onChange={(e) => handleUpdateItemPrice(idx, e.target.value)}
                            title="Edit Unit Rate for this sale"
                          />
                        ) : (
                          formatCurrency(item.price, hideAmounts)
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            style={{ width: '22px', height: '22px', fontSize: '11px', padding: 0 }}
                            onClick={() => handleUpdateItemQty(idx, item.qty - 1)}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '22px', textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            style={{ width: '22px', height: '22px', fontSize: '11px', padding: 0 }}
                            onClick={() => handleUpdateItemQty(idx, item.qty + 1)}
                          >
                            +
                          </button>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.unit}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {formatCurrency(item.total, hideAmounts)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline btn-icon-only"
                          style={{ color: '#ef4444', width: '26px', height: '26px' }}
                          onClick={() => handleRemoveItem(idx)}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Checkout & Payment Section */}
          <div className="pos-checkout-grid">
            <div>
              <div className="form-section-title">PAYMENT MODE</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  type="button"
                  className={`btn ${paymentType === 'cash' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => setPaymentType('cash')}
                >
                  💵 Cash Full
                </button>
                <button
                  type="button"
                  className={`btn ${paymentType === 'ledger' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => setPaymentType('ledger')}
                >
                  📝 Ledger / Khata
                </button>
                <button
                  type="button"
                  className={`btn ${paymentType === 'partial' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => setPaymentType('partial')}
                >
                  ⚡ Partial
                </button>
              </div>

              {paymentType === 'partial' && (
                <div className="input-group" style={{ marginBottom: '10px' }}>
                  <label className="input-label">Cash Received Now (Rs)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="Enter cash received"
                    value={cashPaid}
                    onChange={(e) => setCashPaid(e.target.value)}
                  />
                </div>
              )}

              <div className="input-group">
                <label className="input-label">Invoice Remarks / Notes</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Optional delivery notes or driver name"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Invoice Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal, hideAmounts)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Discount (Rs):
                  {!canGiveDiscounts && <span style={{ fontSize: '10px', color: '#ef4444', marginLeft: '4px' }}>🔒 Locked</span>}
                </span>
                <input
                  type="number"
                  className="input"
                  style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}
                  value={discount}
                  disabled={!canGiveDiscounts}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>

              <div style={{ borderTop: '2px dashed var(--border-color)', margin: '6px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                <span>Grand Total:</span>
                <span>{formatCurrency(grandTotal, hideAmounts)}</span>
              </div>

              {paymentType === 'partial' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>
                  <span>Added to Customer Khata:</span>
                  <span>{formatCurrency(balanceAmount, hideAmounts)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer pos-modal-footer">
          <div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handlePark}
              disabled={cart.length === 0}
            >
              ⏸️ Park Cart (F2)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              ✓ Complete Sale &amp; Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
