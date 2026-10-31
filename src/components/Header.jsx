'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';
import { formatDate, formatTime } from '../utils/formatters';

export default function Header({ onToggleMobileMenu, onOpenDownloadApp, onOpenExpiryAlert }) {
  const {
    activeTab,
    setActiveTab,
    criticalExpiryProducts,
    hideAmounts,
    toggleHideAmounts,
    theme,
    setTheme,
    storeProfile,
    saasPlan,
    auth,
    logout,
    impersonatingTenant,
    exitImpersonation
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'inventory': return 'Inventory';
      case 'sales': return 'Sales & Invoices';
      case 'payments': return 'Payments & Vouchers';
      case 'accounts': return 'Accounts & Khata';
      case 'purchases': return 'Purchases';
      case 'holdStock': return 'Hold Customer Stock';
      case 'tempLedger': return 'Temp Ledger (Katcha Khata)';
      case 'reports': return 'Reports & Analytics';
      case 'logs': return 'Activity Logs';
      case 'settings': return 'System Settings';
      case 'superadmin': return 'SaaS Master Super Admin Console';
      default: return 'Dashboard';
    }
  };

  return (
    <>
      {/* SaaS Status & Realtime Cloud Bar */}
      <div className="saas-top-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div className="saas-badge-plan">
            <span>🌾</span>
            <span>{storeProfile.name || 'AgroTrader Pro'} ({saasPlan.name})</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Download App / Software Hub */}
          <button
            type="button"
            className="btn btn-sm"
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#93c5fd',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              fontWeight: 700,
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onClick={onOpenDownloadApp}
            title="Download AgroTrader Desktop ERP (.EXE) or Mobile POS (.APK)"
          >
            <span>💻</span>
            <span>Download Software</span>
          </button>

          {(auth.user?.role === 'superadmin' || impersonatingTenant) && (
            <button
              type="button"
              className="btn btn-sm"
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                background: activeTab === 'superadmin' ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' : 'rgba(217, 119, 6, 0.2)',
                color: activeTab === 'superadmin' ? '#fff' : '#f59e0b',
                border: '1px solid rgba(217, 119, 6, 0.5)',
                fontWeight: 700,
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('superadmin')}
              title="Open SaaS Super Admin Master Portal"
            >
              🛡️ SaaS Master
            </button>
          )}

          {criticalExpiryProducts && criticalExpiryProducts.length > 0 && (
            <button
              type="button"
              className="btn btn-sm"
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                background: 'rgba(239, 68, 68, 0.22)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                fontWeight: 700,
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={onOpenExpiryAlert}
              title={`${criticalExpiryProducts.length} product(s) expiring within 7 days or expired! Click to inspect.`}
            >
              <span>⚠️</span>
              <span>{criticalExpiryProducts.length} Expiring (≤ 7d)</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className={`badge ${auth.user?.role === 'superadmin' ? 'badge-warning' : auth.user?.role === 'staff' ? 'badge-accent' : 'badge-info'}`}
              style={{ fontSize: '11px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
            >
              <span>{auth.user?.role === 'superadmin' ? '🛡️' : auth.user?.role === 'staff' ? '👤' : '👑'}</span>
              <span>
                {auth.user?.role === 'superadmin'
                  ? 'Master SuperAdmin'
                  : auth.user?.role === 'staff'
                  ? `Staff (${auth.user?.branchName || 'Counter'})`
                  : 'Admin Manager'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main App Header */}
      <header className="main-header">
        <div className="header-left">
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={onToggleMobileMenu}
            title="Open Menu"
            aria-label="Open Menu"
          >
            ☰
          </button>

          <div className="page-title-badge">
            <span dangerouslySetInnerHTML={{ __html: activeTab === 'superadmin' ? icons.shield : (icons[activeTab] || icons.dashboard) }} />
            <span>{getPageTitle()}</span>
          </div>

          <div className="date-time-chips">
            <div className="chip">
              <span>📅</span>
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="chip">
              <span>🕒</span>
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* Hide Amounts Privacy Toggle */}
          <button
            type="button"
            className={`btn ${hideAmounts ? 'btn-accent' : 'btn-outline'}`}
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={toggleHideAmounts}
            title="Toggle masking amounts for customer privacy"
          >
            <span dangerouslySetInnerHTML={{ __html: hideAmounts ? icons.eyeOff : icons.eye }} />
            <span>{hideAmounts ? 'Show Amounts' : 'Hide Amounts'}</span>
          </button>

          {/* Theme Switcher Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span dangerouslySetInnerHTML={{ __html: icons.palette }} style={{ color: 'var(--text-muted)' }} />
            <select
              className="select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{ width: 'auto', padding: '5px 8px', fontSize: '12px', fontWeight: 600 }}
              title="Select application theme"
            >
              <option value="theme-sapphire">✨ Sapphire & Gold (New Theme)</option>
              <option value="theme-emerald">🌲 Emerald Classic (Screenshot)</option>
              <option value="theme-obsidian">🌑 Obsidian Dark Cockpit</option>
              <option value="theme-arctic">❄️ Arctic Clean Slate</option>
            </select>
          </div>

          {/* User profile / Logout */}
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '12px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={logout}
            title="Logout &amp; Switch Account"
          >
            <span dangerouslySetInnerHTML={{ __html: icons.logout }} />
            <span>Logout</span>
          </button>
        </div>
      </header>
    </>
  );
}
