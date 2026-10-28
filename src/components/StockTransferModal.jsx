'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function StockTransferModal({ isOpen, onClose, product = null, defaultFrom = 'shop', defaultTo = 'store' }) {
  const { products, transferStock } = useApp();

  const [productId, setProductId] = useState('');
  const [fromLoc, setFromLoc] = useState(defaultFrom);
  const [toLoc, setToLoc] = useState(defaultTo);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setProductId(product.id);
      setFromLoc(defaultFrom);
      setToLoc(defaultTo);
    } else if (products.length > 0 && !productId) {
      setProductId(products[0].id);
    }
  }, [product, defaultFrom, defaultTo, isOpen, products, productId]);

  if (!isOpen) return null;

  const currentProd = products.find(p => p.id === productId);
  const availableStock = currentProd ? (fromLoc === 'shop' ? currentProd.shopStock : currentProd.storeStock) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProd) return;
    const numQty = Number(qty) || 0;
    if (numQty <= 0) {
      alert('Quantity must be greater than zero.');
      return;
    }
    if (numQty > availableStock) {
      alert(`Cannot transfer ${numQty} ${currentProd.unit}. Only ${availableStock} available in ${fromLoc}!`);
      return;
    }

    transferStock(productId, fromLoc, toLoc, numQty);
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3 className="modal-title">🔄 Transfer Stock (Shop &harr; Godown)</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group" style={{ marginBottom: '14px' }}>
              <label className="input-label">Product</label>
              <select
                className="select"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Shop: {p.shopStock} | Store: {p.storeStock} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div className="input-group">
                <label className="input-label">From Location</label>
                <select
                  className="select"
                  value={fromLoc}
                  onChange={(e) => {
                    const fromVal = e.target.value;
                    setFromLoc(fromVal);
                    setToLoc(fromVal === 'shop' ? 'store' : 'shop');
                  }}
                >
                  <option value="shop">Shop Counter ({currentProd?.shopStock || 0})</option>
                  <option value="store">Store Godown ({currentProd?.storeStock || 0})</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">To Location</label>
                <select
                  className="select"
                  value={toLoc}
                  onChange={(e) => {
                    const toVal = e.target.value;
                    setToLoc(toVal);
                    setFromLoc(toVal === 'shop' ? 'store' : 'shop');
                  }}
                >
                  <option value="store">Store Godown ({currentProd?.storeStock || 0})</option>
                  <option value="shop">Shop Counter ({currentProd?.shopStock || 0})</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Quantity to Move ({currentProd?.unit || 'units'})</label>
              <input
                type="number"
                min="1"
                max={availableStock}
                className="input"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                required
              />
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Available to move from {fromLoc}: <b>{availableStock} {currentProd?.unit}</b>
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={availableStock <= 0}>
              Transfer Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
