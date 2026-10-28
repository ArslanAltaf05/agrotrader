'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';

export default function MobileBottomNav({ onOpenNewSale, onToggleMobileMenu }) {
  const { activeTab, setActiveTab, metrics, parkedSales } = useApp();

  return (
    <nav className="mobile-bottom-nav">
      <button
        type="button"
        className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <span className="mobile-nav-icon" dangerouslySetInnerHTML={{ __html: icons.dashboard }} />
        <span>Dashboard</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-btn ${activeTab === 'accounts' ? 'active' : ''}`}
        onClick={() => setActiveTab('accounts')}
      >
        <span className="mobile-nav-icon" dangerouslySetInnerHTML={{ __html: icons.accounts }} />
        <span>Khata</span>
      </button>

      {/* Prominent Center POS Billing Action */}
      <button
        type="button"
        className="mobile-nav-center-action"
        onClick={onOpenNewSale}
        title="Open POS Billing Counter (F1)"
      >
        <div className="mobile-center-pos-pill">
          <span style={{ fontSize: '18px' }}>🛒</span>
          <span className="mobile-center-pos-text">NEW SALE</span>
        </div>
      </button>

      <button
        type="button"
        className={`mobile-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => setActiveTab('inventory')}
      >
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <span className="mobile-nav-icon" dangerouslySetInnerHTML={{ __html: icons.inventory }} />
          {metrics.lowStockCount > 0 && <span className="mobile-nav-badge-dot" />}
        </div>
        <span>Stock</span>
      </button>

      <button
        type="button"
        className="mobile-nav-btn"
        onClick={onToggleMobileMenu}
        title="More Store Options"
      >
        <span className="mobile-nav-icon" style={{ fontSize: '20px', lineHeight: 1 }}>☰</span>
        <span>More</span>
      </button>
    </nav>
  );
}
