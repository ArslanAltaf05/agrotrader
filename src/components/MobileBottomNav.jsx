'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';

export default function MobileBottomNav({ onOpenNewSale, onToggleMobileMenu }) {
  const { activeTab, setActiveTab, metrics, auth, impersonatingTenant } = useApp();
  const [showPortalsModal, setShowPortalsModal] = useState(false);

  const portalsList = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', desc: 'Overview, Sales & Live Cloud Status' },
    { id: 'sales', label: 'POS Billing Counter', icon: '🛒', desc: 'Direct counter invoice & receipt print' },
    { id: 'accounts', label: 'Farmer & Supplier Khata', icon: '📖', desc: 'Ledger statements, Udhar & Jama' },
    { id: 'inventory', label: 'Stock & Inventory', icon: '📦', desc: 'Godown balance, batch & expiry' },
    { id: 'payments', label: 'Recovery & Payments', icon: '💰', desc: 'Udhar collection vouchers & recovery' },
    { id: 'purchases', label: 'Purchases & Inward', icon: '📥', desc: 'Company stock inward & billing' },
    { id: 'holdStock', label: 'Hold Stock (Amanat)', icon: '⏳', desc: 'Farmer advance booking in godown' },
    { id: 'tempLedger', label: 'Temp Ledger (Katcha Khata)', icon: '📝', desc: 'Scratchpad counter credit notes' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📊', desc: 'P&L, Day closing & Item sales summary' },
    { id: 'logs', label: 'Activity & Audit Logs', icon: '📜', desc: 'System security history & tracking' },
    { id: 'settings', label: 'Store Settings & Cloud', icon: '⚙️', desc: 'Store profile, backup & print config' }
  ];

  if (auth.user?.role === 'superadmin' || impersonatingTenant) {
    portalsList.push({
      id: 'superadmin',
      label: 'SaaS Super Admin Console',
      icon: '🛡️',
      desc: 'Multi-tenant master cloud manager'
    });
  }

  const handlePortalSelect = (id) => {
    setShowPortalsModal(false);
    setActiveTab(id);
  };

  return (
    <>
      <nav className="mobile-bottom-nav">
        {/* 1. Home / Dashboard */}
        <button
          type="button"
          className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          title="Home Dashboard"
        >
          <div className="mobile-nav-icon-wrapper">
            <span style={{ fontSize: '19px', lineHeight: 1 }}>🏠</span>
          </div>
          <span>Home</span>
        </button>

        {/* 2. Sales Tab */}
        <button
          type="button"
          className={`mobile-nav-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
          title="Sales Invoices & POS"
        >
          <div className="mobile-nav-icon-wrapper">
            <span style={{ fontSize: '19px', lineHeight: 1 }}>🛒</span>
          </div>
          <span>Sales</span>
        </button>

        {/* 3. Khata */}
        <button
          type="button"
          className={`mobile-nav-btn ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
          title="Farmer & Supplier Khata"
        >
          <div className="mobile-nav-icon-wrapper">
            <span style={{ fontSize: '19px', lineHeight: 1 }}>📖</span>
          </div>
          <span>Khata</span>
        </button>

        {/* 4. Stock */}
        <button
          type="button"
          className={`mobile-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
          title="Stock & Inventory"
        >
          <div className="mobile-nav-icon-wrapper" style={{ position: 'relative' }}>
            <span style={{ fontSize: '19px', lineHeight: 1 }}>📦</span>
            {metrics.lowStockCount > 0 && <span className="mobile-nav-badge-dot" />}
          </div>
          <span>Stock</span>
        </button>

        {/* 5. All Portals Sheet Trigger */}
        <button
          type="button"
          className="mobile-nav-btn mobile-nav-portals-btn"
          onClick={() => setShowPortalsModal(true)}
          title="All Store Portals"
        >
          <div className="mobile-nav-icon-wrapper">
            <span style={{ fontSize: '20px', lineHeight: 1 }}>🗂️</span>
          </div>
          <span>Portals</span>
        </button>
      </nav>

      {/* Modern Slide-Up "All Portals" Launcher Modal */}
      {showPortalsModal && (
        <div className="modal-overlay" onClick={() => setShowPortalsModal(false)} style={{ zIndex: 3500 }}>
          <div
            className="mobile-portals-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-portals-sheet-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🌾</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#111827' }}>
                    AgroTrader Portals &amp; Modules
                  </h4>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    Connected to Cloud &bull; Tap any module to switch
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-icon-only"
                style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px' }}
                onClick={() => setShowPortalsModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="mobile-portals-sheet-grid">
              {portalsList.map((portal) => (
                <div
                  key={portal.id}
                  className={`mobile-portal-sheet-item ${activeTab === portal.id ? 'active' : ''}`}
                  onClick={() => handlePortalSelect(portal.id)}
                >
                  <span className="mobile-portal-item-icon">{portal.icon}</span>
                  <div className="mobile-portal-item-text">
                    <div className="mobile-portal-item-title">{portal.label}</div>
                    <div className="mobile-portal-item-desc">{portal.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mobile-portals-sheet-footer">
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '13px', padding: '10px 14px' }}
                onClick={() => handlePortalSelect('dashboard')}
              >
                🏠 Return to Main Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
