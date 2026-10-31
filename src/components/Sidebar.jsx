'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';

export default function Sidebar({ isOpenMobile, onCloseMobile }) {
  const {
    activeTab,
    setActiveTab,
    storeProfile,
    metrics,
    parkedSales,
    auth,
    impersonatingTenant,
    staffPermissions
  } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { id: 'payments', label: 'Payments', icon: icons.payments },
    { id: 'sales', label: 'Sales (POS)', icon: icons.sales, badge: parkedSales.length ? `${parkedSales.length} Parked` : null },
    { id: 'accounts', label: 'Accounts & Khata', icon: icons.accounts },
    { id: 'inventory', label: 'Inventory', icon: icons.inventory, badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount} Low` : null },
    { id: 'purchases', label: 'Purchases', icon: icons.purchases },
    { id: 'holdStock', label: 'Hold Stock (Amanat)', icon: icons.holdStock },
    { id: 'tempLedger', label: 'Temp Ledger', icon: icons.tempLedger },
    { id: 'reports', label: 'Reports', icon: icons.reports },
    { id: 'logs', label: 'Logs', icon: icons.logs },
    { id: 'settings', label: 'Settings', icon: icons.settings }
  ];

  const isSuperAdmin = auth.user?.role === 'superadmin' || !!impersonatingTenant;
  const isAdmin = auth.user?.role === 'admin' || isSuperAdmin;
  const isStaff = auth.user?.role === 'staff';
  const canViewLogs = isAdmin || staffPermissions?.canViewLogs;
  const canViewReports = isAdmin || staffPermissions?.canViewReports;

  const visibleMenuItems = menuItems.filter(item => {
    if (isStaff) {
      if (item.id === 'settings') return false;
      if (item.id === 'logs' && !canViewLogs) return false;
      if (item.id === 'reports' && !canViewReports) return false;
    }
    return true;
  });

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isOpenMobile && (
        <div
          className="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          title="Close Navigation Drawer"
        />
      )}
      <aside className={`app-sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        <div>
          {/* Branding */}
          <div className="sidebar-header">
            <div className="store-logo-badge">
              <span dangerouslySetInnerHTML={{ __html: icons.leaf }} />
            </div>
            <div className="store-branding">
              <h2>{storeProfile.name}</h2>
              <p>{storeProfile.subtitle}</p>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={onCloseMobile}
              title="Close Menu"
              aria-label="Close Menu"
            >
              &times;
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="sidebar-menu">
            {isSuperAdmin && (
              <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="sidebar-section-title" style={{ color: '#f59e0b' }}>SaaS Master Control</div>
                <div
                  className={`nav-item ${activeTab === 'superadmin' ? 'active' : ''}`}
                  style={{
                    background: activeTab === 'superadmin' ? 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)' : 'rgba(217, 119, 6, 0.12)',
                    border: '1px solid rgba(217, 119, 6, 0.35)',
                    color: activeTab === 'superadmin' ? '#ffffff' : '#fbbf24',
                    fontWeight: 700
                  }}
                  onClick={() => handleSelectTab('superadmin')}
                >
                  <div className="nav-item-left">
                    <span style={{ fontSize: '15px' }}>🛡️</span>
                    <span>Super Admin Portal</span>
                  </div>
                  <span className="nav-badge" style={{ background: '#d97706', color: '#fff' }}>SaaS</span>
                </div>
              </div>
            )}

            <div className="sidebar-section-title">Store Operations</div>
            {visibleMenuItems.map(item => (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleSelectTab(item.id)}
              >
                <div className="nav-item-left">
                  <span dangerouslySetInnerHTML={{ __html: item.icon }} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="nav-badge">{item.badge}</span>
                ) : (
                  activeTab === item.id && <span style={{ opacity: 0.8, fontSize: '12px' }}>&rsaquo;</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Contact Hotline */}
        <div className="sidebar-footer">
          <a
            href={`https://wa.me/${storeProfile.phone?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-badge"
            title="Open WhatsApp Support"
          >
            <span dangerouslySetInnerHTML={{ __html: icons.whatsapp }} />
            <span>WhatsApp: {storeProfile.phone}</span>
          </a>

          <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center' }}>
            AgriSol SaaS Pro &bull; v2.0
          </div>
        </div>
      </aside>
    </>
  );
}
