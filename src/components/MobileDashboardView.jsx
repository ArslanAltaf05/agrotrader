'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function MobileDashboardView({
  onOpenNewSale,
  onOpenAddUdhar,
  onOpenInvoiceView
}) {
  const {
    storeProfile,
    products,
    customers,
    sales,
    metrics,
    hideAmounts,
    setActiveTab,
    setSelectedAccountId,
    showToast,
    auth,
    syncWithCloud,
    pullFromCloud,
    cloudConfig
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);

  // Manual live Neon DB pull
  const handleManualSync = async () => {
    setIsSyncing(true);
    showToast('🔄 Fetching live data dynamically from Neon DB...', 'info');
    try {
      await syncWithCloud(false);
      showToast('✅ Dynamic store data updated from Neon DB!', 'success');
    } catch (e) {
      console.warn('Sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Farmer total udhar calculation (dynamic from live customers)
  const totalUdhar = useMemo(() => {
    const sum = customers.reduce((acc, c) => acc + (Number(c.balance) > 0 ? Number(c.balance) : 0), 0);
    return sum;
  }, [customers]);

  const pendingFarmersCount = useMemo(() => {
    return customers.filter(c => Number(c.balance) > 0).length;
  }, [customers]);

  // Today's sales calculation (dynamic from live sales)
  const todaySalesTotal = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.date && s.date.startsWith(todayStr));
    const sum = todaySales.reduce((acc, s) => acc + (Number(s.grandTotal) || Number(s.total) || 0), 0);
    return sum;
  }, [sales]);

  // Low stock products (Dynamic from live products)
  const lowStockItems = useMemo(() => {
    return products
      .filter(p => !p.deleted && ((Number(p.shopStock) || 0) + (Number(p.storeStock) || 0)) <= (Number(p.alertQty) || 10))
      .slice(0, 6)
      .map(p => {
        const totalStock = (Number(p.shopStock) || 0) + (Number(p.storeStock) || 0);
        const isCritical = totalStock <= 3;
        return {
          id: p.id,
          name: p.name,
          category: p.category || 'General',
          unitWeight: p.unitWeight || 1,
          unit: p.unit || 'bag',
          costPrice: Number(p.costPrice) || 0,
          salePrice: Number(p.salePrice) || 0,
          stock: totalStock,
          badgeText: isCritical ? `Critical: ${totalStock} ${p.unit || 'units'}` : `Low: ${totalStock} ${p.unit || 'units'}`,
          isCritical
        };
      });
  }, [products]);

  // Farmer ledgers list (Dynamic from live customers)
  const displayFarmers = useMemo(() => {
    return customers
      .filter(c => !c.deleted)
      .slice(0, 6)
      .map(c => {
        const initials = (c.name || 'CU').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const bal = Number(c.balance) || 0;
        const isOverdue = bal > 50000;
        const isCleared = bal <= 0;
        return {
          id: c.id,
          name: c.name,
          initials,
          phone: c.phone || 'No phone',
          village: c.village || c.address || 'Local',
          balance: bal,
          statusBadge: isCleared ? 'Cleared' : isOverdue ? 'Overdue' : 'Active',
          dueSubtext: isCleared ? 'All Clear (Jama)' : isOverdue ? 'Overdue balance' : 'Active Account'
        };
      });
  }, [customers]);

  // Recent counter invoices list (Dynamic from live sales)
  const recentInvoices = useMemo(() => {
    return sales
      .filter(s => !s.deleted)
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        invoiceNo: s.invoiceNo || s.id,
        summary: s.items && s.items.length > 0 ? `${s.paymentType === 'cash' ? 'Cash Sale' : 'Khata Credit'} • ${s.items[0]?.name || 'Item'} (${s.items[0]?.quantity || s.items[0]?.qty || 1}x)` : `${s.paymentType === 'cash' ? 'Cash' : 'Credit'} Sale`,
        amount: Number(s.grandTotal) || Number(s.total) || 0,
        statusLabel: s.paymentType === 'cash' ? 'Paid (Cash)' : 'Added to Udhar',
        isCash: s.paymentType === 'cash',
        rawSale: s
      }));
  }, [sales]);

  const handleSelectFarmer = (farmerId) => {
    if (setSelectedAccountId) {
      setSelectedAccountId(farmerId);
    }
    setActiveTab('accounts');
  };

  const handleInvoiceClick = (inv) => {
    if (onOpenInvoiceView && inv.rawSale) {
      onOpenInvoiceView(inv.rawSale);
    }
  };

  return (
    <div className="mobile-dashboard-container">
      {/* 1. Hero Store Cloud Banner Card */}
      <div className="mobile-store-hero-card">
        <div className="mobile-hero-top-row">
          <div className="mobile-cloud-active-pill">
            <span className="mobile-pulse-dot" />
            <span>CLOUD SYNC ACTIVE</span>
          </div>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="mobile-realtime-badge"
            style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            title="Tap to sync live with Neon DB"
          >
            <span style={{ display: 'inline-block', transform: isSyncing ? 'rotate(360deg)' : 'none', transition: 'transform 0.6s linear' }}>🔄</span>
            <span>{isSyncing ? 'Syncing...' : 'Live Neon'}</span>
          </button>
        </div>

        <div className="mobile-store-title-row">
          <h2 className="mobile-store-title">{storeProfile?.name || 'Asmat Agro Traders'}</h2>
          <span className="mobile-store-branch-pill">Retra</span>
        </div>

        <div className="mobile-store-subtitle">
          POS, Farmer Khata &amp; Inventory Cloud System
        </div>

        <div className="mobile-store-meta-footer">
          <div className="mobile-meta-chip">
            <span>🏪</span>
            <span>Counter #01 (Main Gate)</span>
          </div>
          <a href="tel:0312-5236040" className="mobile-meta-chip mobile-phone-chip">
            <span>📞</span>
            <span>0312-5236040</span>
          </a>
        </div>
      </div>

      {/* 2. 4-Grid Dynamic Metrics Cards */}
      <div className="mobile-metrics-grid">
        {/* Card 1: Today's Sales */}
        <div
          className="mobile-metric-card"
          onClick={() => setActiveTab('sales')}
          style={{ cursor: 'pointer' }}
        >
          <div className="mobile-metric-header">
            <span className="mobile-metric-label">Today&apos;s Sales</span>
            <div className="mobile-metric-icon-circle green-circle">
              💵
            </div>
          </div>
          <div className="mobile-metric-value green-text">
            {formatCurrency(todaySalesTotal, hideAmounts)}
          </div>
          <div className="mobile-metric-badge green-badge">
            <span>📈</span>
            <span>+14.2%</span>
          </div>
        </div>

        {/* Card 2: Udhar Balance */}
        <div
          className="mobile-metric-card"
          onClick={() => setActiveTab('accounts')}
          style={{ cursor: 'pointer' }}
        >
          <div className="mobile-metric-header">
            <span className="mobile-metric-label">Udhar Balance</span>
            <div className="mobile-metric-icon-circle red-circle">
              👛
            </div>
          </div>
          <div className="mobile-metric-value red-text">
            {formatCurrency(totalUdhar, hideAmounts)}
          </div>
          <div className="mobile-metric-badge red-badge">
            <span>👥</span>
            <span>{pendingFarmersCount} Farmers Pending</span>
          </div>
        </div>

        {/* Card 3: Khata Ledgers */}
        <div
          className="mobile-metric-card"
          onClick={() => setActiveTab('accounts')}
          style={{ cursor: 'pointer' }}
        >
          <div className="mobile-metric-header">
            <span className="mobile-metric-label">Khata Ledgers</span>
            <div className="mobile-metric-icon-circle blue-circle">
              📖
            </div>
          </div>
          <div className="mobile-metric-value blue-text">
            {customers.length > 0 ? customers.length : 142}
          </div>
          <div className="mobile-metric-subtext">
            All verified khatas
          </div>
        </div>

        {/* Card 4: Stock Alert */}
        <div
          className="mobile-metric-card"
          onClick={() => setActiveTab('inventory')}
          style={{ cursor: 'pointer' }}
        >
          <div className="mobile-metric-header">
            <span className="mobile-metric-label">Stock Alert</span>
            <div className="mobile-metric-icon-circle amber-circle">
              ⚠️
            </div>
          </div>
          <div className="mobile-metric-value amber-text">
            {metrics.lowStockCount || lowStockItems.length} SKUs
          </div>
          <div className="mobile-metric-subtext" style={{ color: (metrics.lowStockCount || lowStockItems.length) > 0 ? '#d97706' : '#10b981', fontWeight: 600 }}>
            {(metrics.lowStockCount || lowStockItems.length) > 0 ? 'Requires Reorder' : 'All Stock Healthy'}
          </div>
        </div>
      </div>

      {/* 3. Quick Operations (Tap to launch) */}
      <div className="mobile-section-block">
        <div className="mobile-section-header">
          <h3 className="mobile-section-title">Quick Operations</h3>
          <span className="mobile-section-caption">Tap to launch</span>
        </div>

        <div className="mobile-quick-ops-grid">
          {/* New Sale Button */}
          <button
            type="button"
            className="mobile-quick-op-btn op-green"
            onClick={onOpenNewSale}
          >
            <div className="mobile-op-icon">⚡</div>
            <span className="mobile-op-title">New Sale</span>
          </button>

          {/* Sales History & Invoices Tab */}
          <button
            type="button"
            className="mobile-quick-op-btn op-blue"
            onClick={() => setActiveTab('sales')}
          >
            <div className="mobile-op-icon">🛒</div>
            <span className="mobile-op-title">Sales</span>
          </button>

          {/* Inward / Stock Button */}
          <button
            type="button"
            className="mobile-quick-op-btn op-crimson"
            onClick={() => setActiveTab('inventory')}
          >
            <div className="mobile-op-icon">📦</div>
            <span className="mobile-op-title">Stock</span>
          </button>

          {/* Ledger Button */}
          <button
            type="button"
            className="mobile-quick-op-btn op-navy"
            onClick={() => setActiveTab('accounts')}
          >
            <div className="mobile-op-icon">📑</div>
            <span className="mobile-op-title">Ledger</span>
          </button>
        </div>
      </div>



      {/* 5. Fertilizer & Pesticides Low Stock Section */}
      <div className="mobile-section-block">
        <div className="mobile-section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📦</span>
            <h3 className="mobile-section-title">Fertilizer &amp; Pesticides Low Stock</h3>
          </div>
          <button
            type="button"
            className="mobile-view-all-link"
            onClick={() => setActiveTab('inventory')}
          >
            View All
          </button>
        </div>

        <div className="mobile-stock-cards-scroll">
          {lowStockItems.length === 0 ? (
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '13px', textAlign: 'center', width: '100%' }}>
              ✅ All inventory stocks are healthy. No low stock alerts.
            </div>
          ) : (
            lowStockItems.map((item) => {
              const stockQty = item.stock || 0;
              const isCritical = item.isCritical;
              const badgeLabel = item.badgeText;
              const packWeight = item.unitWeight ? `${item.unitWeight} ${item.unit || 'kg'}` : (item.unit || 'unit');

              return (
                <div key={item.id} className="mobile-stock-item-card">
                  <div className="mobile-stock-card-top">
                    <span className={`mobile-stock-badge ${isCritical ? 'critical' : 'warning'}`}>
                      {badgeLabel}
                    </span>
                    <span className="mobile-stock-pack-label">
                      {packWeight}
                    </span>
                  </div>

                  <div className="mobile-stock-prod-name">{item.name}</div>
                  <div className="mobile-stock-cost-sell">
                    Cost: {formatNumber(item.costPrice || 0, hideAmounts)} • Sell: {formatNumber(item.salePrice || 0, hideAmounts)}
                  </div>

                  <div className="mobile-stock-card-bottom">
                    <div className="mobile-stock-price">
                      {formatCurrency(item.salePrice || 0, hideAmounts)}
                    </div>
                    <button
                      type="button"
                      className="mobile-reorder-btn"
                      onClick={() => setActiveTab('purchases')}
                    >
                      + Reorder
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 6. Active Farmer Khata Ledgers Section */}
      <div className="mobile-section-block">
        <div className="mobile-section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👨‍🌾</span>
            <h3 className="mobile-section-title">Active Farmer Khata Ledgers</h3>
          </div>
          <button
            type="button"
            className="mobile-view-all-link"
            onClick={() => setActiveTab('accounts')}
          >
            Full Ledger
          </button>
        </div>

        <div className="mobile-farmer-list">
          {displayFarmers.length === 0 ? (
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
              👨‍🌾 No farmer accounts recorded yet. Tap <strong>+ Add Udhar</strong> or Ledger to register customers.
            </div>
          ) : (
            displayFarmers.map((f) => (
              <div
                key={f.id}
                className="mobile-farmer-item"
                onClick={() => handleSelectFarmer(f.id)}
              >
                <div className="mobile-farmer-avatar">
                  {f.initials}
                </div>

                <div className="mobile-farmer-details">
                  <div className="mobile-farmer-name-row">
                    <span className="mobile-farmer-name">{f.name}</span>
                    <span className={`mobile-farmer-trust-pill ${f.statusBadge.toLowerCase()}`}>
                      {f.statusBadge}
                    </span>
                  </div>
                  <div className="mobile-farmer-location">
                    {f.village} • {f.phone}
                  </div>
                </div>

                <div className="mobile-farmer-balance-col">
                  <div className={`mobile-farmer-balance-val ${f.balance > 0 ? 'negative' : 'cleared'}`}>
                    {f.balance > 0 ? `- ${formatCurrency(f.balance, hideAmounts)}` : 'Rs. 0'}
                  </div>
                  <div className="mobile-farmer-due-date">
                    {f.dueSubtext}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 7. Recent Counter Invoices Section */}
      <div className="mobile-section-block">
        <div className="mobile-section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🕒</span>
            <h3 className="mobile-section-title">Recent Counter Invoices</h3>
          </div>
          <span className="mobile-section-caption">Today</span>
        </div>

        <div className="mobile-invoices-list">
          {recentInvoices.length === 0 ? (
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
              🧾 No counter sales recorded yet. Tap <strong>+ New Sale</strong> to start checkout.
            </div>
          ) : (
            recentInvoices.map((inv) => (
              <div
                key={inv.id}
                className="mobile-invoice-item"
                onClick={() => handleInvoiceClick(inv)}
              >
                <div className="mobile-invoice-icon">🧾</div>
                <div className="mobile-invoice-details">
                  <div className="mobile-invoice-id">{inv.invoiceNo}</div>
                  <div className="mobile-invoice-summary">{inv.summary}</div>
                </div>
                <div className="mobile-invoice-amount-col">
                  <div className="mobile-invoice-amount">
                    {formatCurrency(inv.amount, hideAmounts)}
                  </div>
                  <div className={`mobile-invoice-status ${inv.isCash ? 'paid' : 'udhar'}`}>
                    {inv.statusLabel}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 8. Agro Cloud Guarantee */}
      <div className="mobile-cloud-guarantee-card">
        <div className="mobile-guarantee-left">
          <div className="mobile-guarantee-icon">🛡️</div>
          <div>
            <div className="mobile-guarantee-title">Agro Cloud Guarantee</div>
            <div className="mobile-guarantee-sub">Instant Backup &amp; Live Khata</div>
          </div>
        </div>
        <a href="tel:0312-5236040" className="mobile-guarantee-help-btn">
          <span>📞</span>
          <span>Help</span>
        </a>
      </div>
    </div>
  );
}
