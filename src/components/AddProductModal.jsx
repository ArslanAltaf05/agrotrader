'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateBarcode, generateBatchNumber, generateSKU } from '../utils/formatters';

export default function AddProductModal({ isOpen, onClose, editingProduct = null }) {
  const { addProduct, updateProduct, categories, manufacturers, units } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    sku: 'Auto',
    generic: '',
    barcode: '',
    batchNo: '',
    mfgDate: '',
    expiryDate: '',
    category: 'Fertilizers',
    manufacturer: 'Fauji Fertilizer Company (FFC)',
    unit: 'bag',
    unitWeight: '50',
    costPrice: '',
    salePrice: '',
    offerPrice: '',
    shopStock: '0',
    storeStock: '0',
    alertQty: '10',
    location: '',
    flags: {
      active: true,
      narcotic: false,
      serialItem: false,
      keepRecord: true
    },
    notes: ''
  });

  // Inline custom add states
  const [newCatInput, setNewCatInput] = useState(false);
  const [customCat, setCustomCat] = useState('');
  const [newMfgInput, setNewMfgInput] = useState(false);
  const [customMfg, setCustomMfg] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        sku: editingProduct.sku || 'Auto',
        generic: editingProduct.generic || '',
        barcode: editingProduct.barcode || '',
        batchNo: editingProduct.batchNo || '',
        mfgDate: editingProduct.mfgDate || '',
        expiryDate: editingProduct.expiryDate || '',
        category: editingProduct.category || 'Fertilizers',
        manufacturer: editingProduct.manufacturer || 'Fauji Fertilizer Company (FFC)',
        unit: editingProduct.unit || 'bag',
        unitWeight: editingProduct.unitWeight?.toString() || '50',
        costPrice: editingProduct.costPrice?.toString() || '',
        salePrice: editingProduct.salePrice?.toString() || '',
        offerPrice: editingProduct.offerPrice?.toString() || '',
        shopStock: editingProduct.shopStock?.toString() || '0',
        storeStock: editingProduct.storeStock?.toString() || '0',
        alertQty: editingProduct.alertQty?.toString() || '10',
        location: editingProduct.location || '',
        flags: editingProduct.flags || { active: true, narcotic: false, serialItem: false, keepRecord: true },
        notes: editingProduct.notes || ''
      });
    } else {
      setFormData({
        name: '',
        sku: 'Auto',
        generic: '',
        barcode: generateBarcode(),
        batchNo: generateBatchNumber(),
        mfgDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        category: 'Fertilizers',
        manufacturer: 'Fauji Fertilizer Company (FFC)',
        unit: 'bag',
        unitWeight: '50',
        costPrice: '',
        salePrice: '',
        offerPrice: '',
        shopStock: '0',
        storeStock: '0',
        alertQty: '10',
        location: 'Godown Main',
        flags: {
          active: true,
          narcotic: false,
          serialItem: false,
          keepRecord: true
        },
        notes: ''
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const totalOpening = (Number(formData.shopStock) || 0) + (Number(formData.storeStock) || 0);
  const alertThresh = Number(formData.alertQty) || 10;
  const isOutOfStock = totalOpening === 0;
  const isLowStock = !isOutOfStock && totalOpening <= alertThresh;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Product name is required.');
      return;
    }

    const payload = {
      ...formData,
      category: newCatInput && customCat ? customCat : formData.category,
      manufacturer: newMfgInput && customMfg ? customMfg : formData.manufacturer,
      sku: formData.sku === 'Auto' ? generateSKU(formData.category) : formData.sku,
      unitWeight: Number(formData.unitWeight) || 0,
      costPrice: Number(formData.costPrice) || 0,
      salePrice: Number(formData.salePrice) || 0,
      offerPrice: Number(formData.offerPrice) || 0,
      shopStock: Number(formData.shopStock) || 0,
      storeStock: Number(formData.storeStock) || 0,
      alertQty: Number(formData.alertQty) || 10
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog">
        {/* Header matching Screenshot 4 */}
        <div className="modal-header">
          <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Form Body matching Screenshot 4 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            <div className="product-modal-grid">
              {/* Left Column */}
              <div>
                {/* Section 1: BASIC PRODUCT INFORMATION */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="form-section-title">BASIC PRODUCT INFORMATION</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div className="input-group">
                      <label className="input-label">Product Name <span className="req">*</span></label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Sona Urea 50 KG"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">SKU</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.sku}
                        placeholder="Auto"
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Generic / Description</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Active ingredient, brand name, or description (optional)"
                      value={formData.generic}
                      onChange={(e) => setFormData({ ...formData, generic: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 2: BARCODE / BATCH / DATES */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="form-section-title">BARCODE / BATCH / DATES</div>
                  <div className="input-group" style={{ marginBottom: '12px' }}>
                    <label className="input-label">Barcode / Article No.</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="input"
                        placeholder="Scan or enter barcode"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ whiteSpace: 'nowrap', fontSize: '12px' }}
                        onClick={() => {
                          const code = '890' + Math.floor(100000000 + Math.random() * 900000000);
                          setFormData({ ...formData, barcode: code });
                        }}
                      >
                        ||| Scan
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ whiteSpace: 'nowrap', fontSize: '12px' }}
                        onClick={() => setFormData({ ...formData, barcode: generateBarcode() })}
                      >
                        ||| Generate
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
                    <div className="input-group">
                      <label className="input-label">Batch No.</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="30062026-0001"
                        value={formData.batchNo}
                        onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Mfg Date</label>
                      <input
                        type="date"
                        className="input"
                        value={formData.mfgDate}
                        onChange={(e) => setFormData({ ...formData, mfgDate: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Expiry Date</label>
                      <input
                        type="date"
                        className="input"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: CLASSIFICATION */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="form-section-title">CLASSIFICATION</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    {/* Category */}
                    <div className="input-group">
                      <label className="input-label">Category <span className="req">*</span></label>
                      {!newCatInput ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select
                            className="select"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            title="Add Custom Category"
                            onClick={() => setNewCatInput(true)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            className="input"
                            placeholder="New category..."
                            value={customCat}
                            onChange={(e) => setCustomCat(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            onClick={() => setNewCatInput(false)}
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Manufacturer */}
                    <div className="input-group">
                      <label className="input-label">Manufacturer</label>
                      {!newMfgInput ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select
                            className="select"
                            value={formData.manufacturer}
                            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                          >
                            {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            title="Add Custom Manufacturer"
                            onClick={() => setNewMfgInput(true)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            className="input"
                            placeholder="New manufacturer..."
                            value={customMfg}
                            onChange={(e) => setCustomMfg(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-outline btn-icon-only"
                            onClick={() => setNewMfgInput(false)}
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-group">
                      <label className="input-label">Unit <span className="req">*</span></label>
                      <select
                        className="select"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      >
                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Unit Weight (kg)</label>
                      <input
                        type="number"
                        className="input"
                        placeholder="e.g. 50 or 25"
                        value={formData.unitWeight}
                        onChange={(e) => setFormData({ ...formData, unitWeight: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: PRICING */}
                <div>
                  <div className="form-section-title">PRICING</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                    <div className="input-group">
                      <label className="input-label">Trade / Cost Price (Rs)</label>
                      <input
                        type="number"
                        className="input"
                        placeholder="0"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Sale Price (Rs) <span className="req">*</span></label>
                      <input
                        type="number"
                        className="input"
                        placeholder="0"
                        required
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Offer Price (optional)</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="0 - used in Offer Sales"
                      value={formData.offerPrice}
                      onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Section 5: OPENING STOCK DETAIL */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div className="form-section-title" style={{ margin: 0 }}>OPENING STOCK DETAIL</div>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                      + Location
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div className="input-group">
                      <label className="input-label">Shop</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="number"
                          className="input"
                          value={formData.shopStock}
                          onChange={(e) => setFormData({ ...formData, shopStock: e.target.value })}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formData.unit}</span>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Alert Qty</label>
                      <input
                        type="number"
                        className="input"
                        value={formData.alertQty}
                        onChange={(e) => setFormData({ ...formData, alertQty: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="input-group" style={{ marginBottom: '10px' }}>
                    <label className="input-label">Store / Godown Stock</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        className="input"
                        value={formData.storeStock}
                        onChange={(e) => setFormData({ ...formData, storeStock: e.target.value })}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formData.unit}</span>
                    </div>
                  </div>

                  {/* Stock status indicator badge matching Screenshot 4 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    {isOutOfStock ? (
                      <span className="badge badge-danger">Out of Stock</span>
                    ) : isLowStock ? (
                      <span className="badge badge-warning">Low Stock</span>
                    ) : (
                      <span className="badge badge-success">In Stock</span>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Total {totalOpening} {formData.unit}
                    </span>
                  </div>
                </div>

                {/* Section 6: FLAGS / SETTINGS */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="form-section-title">FLAGS / SETTINGS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.flags.active}
                        onChange={(e) => setFormData({
                          ...formData,
                          flags: { ...formData.flags, active: e.target.checked }
                        })}
                      />
                      <span>Active</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.flags.narcotic}
                        onChange={(e) => setFormData({
                          ...formData,
                          flags: { ...formData.flags, narcotic: e.target.checked }
                        })}
                      />
                      <span>Narcotic</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.flags.serialItem}
                        onChange={(e) => setFormData({
                          ...formData,
                          flags: { ...formData.flags, serialItem: e.target.checked }
                        })}
                      />
                      <span>Serial Item</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.flags.keepRecord}
                        onChange={(e) => setFormData({
                          ...formData,
                          flags: { ...formData.flags, keepRecord: e.target.checked }
                        })}
                      />
                      <span>Keep Record</span>
                    </label>
                  </div>
                </div>

                {/* Section 7: NOTES */}
                <div>
                  <div className="form-section-title">NOTES</div>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Optional - storage notes, remarks, handling precautions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer matching Screenshot 4 */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ minWidth: '140px' }}>
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
