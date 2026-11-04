'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import QuickActionBar from '../components/QuickActionBar';
import DashboardView from '../components/DashboardView';
import InventoryView from '../components/InventoryView';
import AddProductModal from '../components/AddProductModal';
import POSModal from '../components/POSModal';
import LoginView from '../components/LoginView';
import ReceiptModal from '../components/ReceiptModal';
import PaymentsModal from '../components/PaymentsModal';
import StockTransferModal from '../components/StockTransferModal';
import ParkedModal from '../components/ParkedModal';
import AccountsView from '../components/AccountsView';
import HoldStockView from '../components/HoldStockView';
import TempLedgerView from '../components/TempLedgerView';
import PaymentsView from '../components/PaymentsView';
import PurchasesView from '../components/PurchasesView';
import ReportsView from '../components/ReportsView';
import LogsView from '../components/LogsView';
import SettingsView from '../components/SettingsView';
import SuperAdminView from '../components/SuperAdminView';
import SalesView from '../components/SalesView';
import MobileBottomNav from '../components/MobileBottomNav';
import CloudSyncModal from '../components/CloudSyncModal';
import DownloadAppModal from '../components/DownloadAppModal';
import ExpiryAlertModal from '../components/ExpiryAlertModal';
import { formatCurrency, formatDate } from '../utils/formatters';

function MainApp() {
  const {
    auth,
    activeTab,
    setActiveTab,
    storeProfile,
    toasts,
    sales,
    deleteSale,
    hideAmounts,
    impersonatingTenant,
    exitImpersonation,
    broadcastMessage,
    staffPermissions
  } = useApp();
  const [dismissBroadcast, setDismissBroadcast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showPOSModal, setShowPOSModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeReceiptSale, setActiveReceiptSale] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalType, setPaymentModalType] = useState('in');
  const [paymentModalAccountId, setPaymentModalAccountId] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferProduct, setTransferProduct] = useState(null);
  const [transferFrom, setTransferFrom] = useState('shop');
  const [transferTo, setTransferTo] = useState('store');
  const [showParkedModal, setShowParkedModal] = useState(false);
  const [resumedCartData, setResumedCartData] = useState(null);
  const [showCloudSyncModal, setShowCloudSyncModal] = useState(false);
  const [showDownloadAppModal, setShowDownloadAppModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  // Global Keyboard Shortcuts (F1: New Sale, F2: Parked)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowPOSModal(true);
      } else if (e.key === 'F2') {
        e.preventDefault();
        setShowParkedModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Not authenticated? Show split Login Screen matching Screenshot 1 & 3
  if (!auth.isAuthenticated) {
    return <LoginView />;
  }

  // Open Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setShowAddProductModal(true);
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setShowAddProductModal(true);
  };

  const handleOpenTransfer = (prod, fromLoc, toLoc) => {
    setTransferProduct(prod);
    setTransferFrom(fromLoc);
    setTransferTo(toLoc);
    setShowTransferModal(true);
  };

  const handleOpenPaymentIn = (accountId) => {
    setPaymentModalAccountId(accountId || '');
    setPaymentModalType('in');
    setShowPaymentModal(true);
  };

  const handleOpenPaymentOut = (accountId) => {
    setPaymentModalAccountId(accountId || '');
    setPaymentModalType('out');
    setShowPaymentModal(true);
  };

  const handleSaleComplete = (newSale) => {
    setActiveReceiptSale(newSale);
    setShowReceiptModal(true);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNewSale={() => setShowPOSModal(true)}
            onOpenInvoiceView={(sale) => {
              setActiveReceiptSale(sale);
              setShowReceiptModal(true);
            }}
            onOpenPaymentModal={(t) => {
              setPaymentModalType(t || 'out');
              setShowPaymentModal(true);
            }}
          />
        );
      case 'inventory':
        return (
          <InventoryView
            onOpenAddProduct={handleOpenAddProduct}
            onEditProduct={handleEditProduct}
            onOpenTransfer={handleOpenTransfer}
          />
        );
      case 'sales':
        return (
          <SalesView
            onOpenNewSale={() => setShowPOSModal(true)}
            onOpenInvoiceView={(sale) => {
              setActiveReceiptSale(sale);
              setShowReceiptModal(true);
            }}
          />
        );
      case 'payments':
        return (
          <PaymentsView
            onOpenPaymentModal={(t) => {
              setPaymentModalType(t);
              setShowPaymentModal(true);
            }}
          />
        );
      case 'accounts':
        return (
          <AccountsView
            onOpenPaymentIn={handleOpenPaymentIn}
            onOpenPaymentOut={handleOpenPaymentOut}
          />
        );
      case 'purchases':
        return <PurchasesView />;
      case 'holdStock':
      case 'hold_stock':
        return <HoldStockView />;
      case 'tempLedger':
      case 'temp_ledger':
        return <TempLedgerView />;
      case 'reports':
        if (auth.user?.role === 'staff' && !staffPermissions?.canViewReports) {
          return (
            <div className="page-body">
              <div className="card" style={{ maxWidth: '580px', margin: '40px auto', textAlign: 'center', padding: '36px 24px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '42px' }}>🛡️</span>
                <h3 style={{ color: '#991b1b', marginTop: '12px', fontSize: '18px', fontWeight: 800 }}>Access Denied: Financial Reports</h3>
                <p style={{ fontSize: '13px', color: '#7f1d1d', margin: '8px 0 16px' }}>Staff accounts do not have permission to view store business reports and profit calculations.</p>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('dashboard')}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          );
        }
        return <ReportsView />;
      case 'logs':
        if (auth.user?.role === 'staff' && !staffPermissions?.canViewLogs) {
          return (
            <div className="page-body">
              <div className="card" style={{ maxWidth: '580px', margin: '40px auto', textAlign: 'center', padding: '36px 24px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '42px' }}>🛡️</span>
                <h3 style={{ color: '#991b1b', marginTop: '12px', fontSize: '18px', fontWeight: 800 }}>Access Denied: Audit Logs</h3>
                <p style={{ fontSize: '13px', color: '#7f1d1d', margin: '8px 0 16px' }}>Staff accounts do not have permission to view system audit logs.</p>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('dashboard')}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          );
        }
        return <LogsView />;
      case 'settings':
        if (auth.user?.role === 'staff') {
          return (
            <div className="page-body">
              <div className="card" style={{ maxWidth: '580px', margin: '40px auto', textAlign: 'center', padding: '36px 24px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '42px' }}>🛡️</span>
                <h3 style={{ color: '#991b1b', marginTop: '12px', fontSize: '18px', fontWeight: 800 }}>Access Denied: System Settings</h3>
                <p style={{ fontSize: '13px', color: '#7f1d1d', margin: '8px 0 16px' }}>Staff accounts cannot enter System Settings or modify store configuration.</p>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('dashboard')}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          );
        }
        return <SettingsView />;
      case 'superadmin':
        if (auth.user?.role !== 'superadmin' && !impersonatingTenant) {
          return (
            <div className="page-body">
              <div className="card" style={{ maxWidth: '580px', margin: '40px auto', textAlign: 'center', padding: '36px 24px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '42px' }}>🛡️</span>
                <h3 style={{ color: '#991b1b', marginTop: '12px', fontSize: '18px', fontWeight: 800 }}>Access Denied: Super Admin Portal</h3>
                <p style={{ fontSize: '13px', color: '#7f1d1d', margin: '8px 0 16px' }}>Only Master SaaS Administrators can enter the Multi-Tenant Super Admin Console.</p>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('dashboard')}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          );
        }
        return <SuperAdminView />;
      default:
        return <DashboardView onOpenNewSale={() => setShowPOSModal(true)} />;
    }
  };

  return (
    <div className="app-root-shell" style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Header & Window Chrome */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        onOpenDownloadApp={() => setShowDownloadAppModal(true)}
        onOpenExpiryAlert={() => setShowExpiryModal(true)}
      />

      {/* Impersonation Warning Banner */}
      {impersonatingTenant && (
        <div style={{
          background: 'linear-gradient(90deg, #92400e 0%, #d97706 50%, #b45309 100%)',
          color: '#ffffff',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          zIndex: 50,
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>🛡️</span>
            <span>
              <strong>SUPER ADMIN IMPERSONATION ACTIVE:</strong> Currently managing <u>{storeProfile.name}</u> ({storeProfile.address || storeProfile.city}). Live edits affect this tenant.
            </span>
          </div>
          <button
            type="button"
            style={{
              background: '#ffffff',
              color: '#92400e',
              fontWeight: 700,
              padding: '5px 14px',
              fontSize: '12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={exitImpersonation}
          >
            <span>&larr;</span>
            <span>Exit Store &amp; Return to Super Admin Portal</span>
          </button>
        </div>
      )}

      {/* Global SaaS System Broadcast Announcement */}
      {broadcastMessage?.active && broadcastMessage?.text && !dismissBroadcast && activeTab !== 'superadmin' && (
        <div style={{
          background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
          color: '#ffffff',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          fontWeight: 600,
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          zIndex: 45
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📢</span>
            <span>{broadcastMessage.text}</span>
          </div>
          <button
            type="button"
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', cursor: 'pointer', opacity: 0.8 }}
            onClick={() => setDismissBroadcast(true)}
            title="Dismiss Announcement"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="app-container">
        {/* Left Navigation Sidebar */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Right Application Workspace */}
        <main className="app-main">
          {/* Quick Action Bar (New Sale, Parked, Payment In/Out, Hold Stock, Temp Ledger) - Only in store view */}
          {activeTab !== 'superadmin' && (
            <QuickActionBar
              onOpenNewSale={() => setShowPOSModal(true)}
              onOpenParked={() => setShowParkedModal(true)}
              onOpenPaymentIn={() => handleOpenPaymentIn()}
              onOpenPaymentOut={() => handleOpenPaymentOut()}
              onOpenHoldStock={() => setActiveTab('holdStock')}
              onOpenTempLedger={() => setActiveTab('tempLedger')}
            />
          )}

          {/* Active View */}
          {renderActiveTabContent()}
        </main>
      </div>

      {/* Bottom Ticker Footer */}
      <footer className="app-bottom-ticker desktop-only-ticker">
        <div>
          AgriSol - Contact: {storeProfile.phone} - {storeProfile.website} - Version 2.0.0 SaaS Pro - Welcome to the software
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Terminal ID: POS-01</span>
          <span>Status: Online &bull; Cloud Ready</span>
        </div>
      </footer>

      {/* Modern Touch-Friendly Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenNewSale={() => setShowPOSModal(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Modals */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        editingProduct={editingProduct}
      />

      <POSModal
        isOpen={showPOSModal}
        onClose={() => {
          setShowPOSModal(false);
          setResumedCartData(null);
        }}
        onSaleComplete={handleSaleComplete}
        resumedCart={resumedCartData}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        sale={activeReceiptSale}
      />

      <PaymentsModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentModalAccountId('');
        }}
        initialType={paymentModalType}
        initialAccountId={paymentModalAccountId}
      />

      <StockTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        product={transferProduct}
        defaultFrom={transferFrom}
        defaultTo={transferTo}
      />

      <ParkedModal
        isOpen={showParkedModal}
        onClose={() => setShowParkedModal(false)}
        onResumeCart={(cart) => {
          setResumedCartData(cart);
          setShowPOSModal(true);
        }}
      />

      <CloudSyncModal
        isOpen={showCloudSyncModal}
        onClose={() => setShowCloudSyncModal(false)}
      />

      <DownloadAppModal
        isOpen={showDownloadAppModal}
        onClose={() => setShowDownloadAppModal(false)}
      />

      <ExpiryAlertModal
        isOpen={showExpiryModal}
        onClose={() => setShowExpiryModal(false)}
        onOpenNewSale={() => setShowPOSModal(true)}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span>{t.type === 'success' ? '✅' : t.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
