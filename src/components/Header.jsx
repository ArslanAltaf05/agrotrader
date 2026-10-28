'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';
import { formatDate, formatTime } from '../utils/formatters';

export default function Header({ onToggleMobileMenu }) {
  const {
    activeTab,
    setActiveTab,
    hideAmounts,
    toggleHideAmounts,
    theme,
    setTheme,
    storeProfile,
    activeBranchId,
    switchBranch,
    branches,
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
      {/* SaaS Multi-Branch & Realtime Cloud Bar */}
      <div className="saas-top-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div className="saas-badge-plan">
            <span>🌾</span>
            <span>{saasPlan.name} ({saasPlan.expiresInDays}d)</span>
          </div>
          <div className="saas-branch-selector">
            <label style={{ fontSize: '11px', color: '#94a3b8' }}>Branch:</label>
            <select
              className="branch-select-input"
              value={activeBranchId}
              onChange={(e) => switchBranch(e.target.value)}
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} {b.isMain ? '★' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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

          <div className="cloud-sync-status">
            <span className="cloud-sync-pulse" />
            <span className="cloud-sync-text">Cloud Sync</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className={`badge ${auth.user?.role === 'superadmin' ? 'badge-warning' : 'badge-info'}`} style={{ textTransform: 'capitalize', fontSize: '10.5px', padding: '2px 6px' }}>
              {auth.user?.role || 'admin'}
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
            className="btn btn-outline btn-icon-only"
            onClick={logout}
            title="Logout"
          >
            <span dangerouslySetInnerHTML={{ __html: icons.logout }} />
          </button>
        </div>
      </header>
    </>
  );
}
