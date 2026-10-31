'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { icons } from '../utils/icons';

export default function SuperAdminView() {
  const {
    tenants,
    tenantUsers,
    saasBilling,
    broadcastMessage,
    createTenant,
    updateTenant,
    toggleTenantStatus,
    impersonateTenant,
    resetTenantAdminPin,
    deleteTenant,
    recordSubscriptionPayment,
    extendTenantTrial,
    addTenantUser,
    updateTenantUser,
    toggleTenantUserStatus,
    resetTenantUserPin,
    deleteTenantUser,
    updateBroadcastMessage,
    exportSaaSBackup,
    showToast
  } = useApp();

  // Navigation Sub-Tabs: 'tenants' | 'users' | 'billing' | 'broadcast' | 'infra'
  const [activeSubTab, setActiveSubTab] = useState('tenants');

  // Filters for Tenants
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filters for Users
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterStore, setUserFilterStore] = useState('All');
  const [userFilterRole, setUserFilterRole] = useState('All');

  // Filters for Billing
  const [billingSearchQuery, setBillingSearchQuery] = useState('');

  // Modals
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [viewingTenant, setViewingTenant] = useState(null);
  const [paymentModalTenant, setPaymentModalTenant] = useState(null);
  const [resetPinTenant, setResetPinTenant] = useState(null);
  const [newPinValue, setNewPinValue] = useState('1234');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Forms State
  const [createStoreForm, setCreateStoreForm] = useState({
    name: '',
    subtitle: 'Agriculture & Crop Protection Store',
    ownerName: '',
    username: '',
    email: '',
    phone: '',
    city: 'Sargodha',
    plan: 'Pro Enterprise Plan',
    monthlyFee: '12000',
    maxBranches: '5',
    adminPin: '1234',
    ntn: '',
    address: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 12000,
    months: 1,
    method: 'Meezan Bank Raast / IBFT',
    ref: ''
  });

  const [newUserForm, setNewUserForm] = useState({
    tenantId: tenants[0]?.id || 'tenant-1',
    name: '',
    username: '',
    role: 'Cashier / POS',
    phone: '',
    pin: '0000'
  });

  const [announcementText, setAnnouncementText] = useState(
    broadcastMessage?.text || '🌾 Welcome to AgriSol SaaS v2.0 - Offline-First Hybrid Architecture Active.'
  );
  const [announcementActive, setAnnouncementActive] = useState(broadcastMessage?.active ?? true);

  // Calculate SaaS Global Metrics
  const metrics = useMemo(() => {
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(t => t.status === 'Active').length;
    const trialTenants = tenants.filter(t => t.status === 'Trial' || t.status === 'Trial Active').length;
    const suspendedTenants = tenants.filter(t => t.status === 'Suspended').length;
    const totalMRR = tenants
      .filter(t => t.status === 'Active' || t.status === 'Trial')
      .reduce((sum, t) => sum + (t.monthlyFee || 0), 0);
    const totalARR = totalMRR * 12;
    const totalBranches = tenants.reduce((sum, t) => sum + (t.activeBranchesCount || 1), 0);
    const totalInvoices = tenants.reduce((sum, t) => sum + (t.totalInvoicesCount || 0), 0);
    const totalUsersCount = tenantUsers.length;
    const totalCollectedRevenue = saasBilling.reduce((sum, b) => sum + (b.amount || 0), 0);

    // Expiring soon (within 15 days)
    const now = new Date();
    const expiringSoonTenants = tenants.filter(t => {
      if (!t.renewalDate) return false;
      const rDate = new Date(t.renewalDate);
      const diffDays = Math.ceil((rDate - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 15;
    });

    return {
      totalTenants,
      activeTenants,
      trialTenants,
      suspendedTenants,
      totalMRR,
      totalARR,
      totalBranches,
      totalInvoices,
      totalUsersCount,
      totalCollectedRevenue,
      expiringSoonCount: expiringSoonTenants.length
    };
  }, [tenants, tenantUsers, saasBilling]);

  // Filtered tenants list
  const filteredTenants = useMemo(() => {
    const now = new Date();
    return tenants.filter(t => {
      if (filterPlan !== 'All' && !t.plan?.toLowerCase().includes(filterPlan.toLowerCase())) return false;
      if (filterStatus === 'Active' && t.status !== 'Active') return false;
      if (filterStatus === 'Trial' && !t.status.includes('Trial')) return false;
      if (filterStatus === 'Suspended' && t.status !== 'Suspended') return false;
      if (filterStatus === 'ExpiringSoon') {
        if (!t.renewalDate) return false;
        const diffDays = Math.ceil((new Date(t.renewalDate) - now) / (1000 * 60 * 60 * 24));
        if (diffDays < 0 || diffDays > 15) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name?.toLowerCase().includes(q);
        const matchOwner = t.ownerName?.toLowerCase().includes(q);
        const matchCity = t.city?.toLowerCase().includes(q);
        const matchPhone = t.phone?.includes(q);
        const matchEmail = t.email?.toLowerCase().includes(q);
        if (!matchName && !matchOwner && !matchCity && !matchPhone && !matchEmail) return false;
      }
      return true;
    });
  }, [tenants, filterPlan, filterStatus, searchQuery]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return tenantUsers.filter(u => {
      if (userFilterStore !== 'All' && u.tenantId !== userFilterStore) return false;
      if (userFilterRole !== 'All' && u.role !== userFilterRole) return false;
      if (userSearchQuery.trim()) {
        const q = userSearchQuery.toLowerCase();
        const mName = u.name.toLowerCase().includes(q);
        const mUser = u.username.toLowerCase().includes(q);
        const mPhone = u.phone.includes(q);
        const mStore = u.tenantName?.toLowerCase().includes(q);
        if (!mName && !mUser && !mPhone && !mStore) return false;
      }
      return true;
    });
  }, [tenantUsers, userFilterStore, userFilterRole, userSearchQuery]);

  // Filtered billing list
  const filteredBilling = useMemo(() => {
    return saasBilling.filter(b => {
      if (billingSearchQuery.trim()) {
        const q = billingSearchQuery.toLowerCase();
        const mStore = b.tenantName?.toLowerCase().includes(q);
        const mRef = b.transactionRef?.toLowerCase().includes(q);
        const mMethod = b.method?.toLowerCase().includes(q);
        if (!mStore && !mRef && !mMethod) return false;
      }
      return true;
    });
  }, [saasBilling, billingSearchQuery]);

  // Handle Create Store
  const handleCreateStoreSubmit = (e) => {
    e.preventDefault();
    if (!createStoreForm.name.trim() || !createStoreForm.ownerName.trim()) {
      alert('Business name and owner name are mandatory.');
      return;
    }
    const cleanU = (createStoreForm.username || '').trim().toLowerCase();
    if (!cleanU) {
      alert('Store Login Username is required for logging into the store.');
      return;
    }
    if (cleanU === 'superadmin' || cleanU.startsWith('superadmin_')) {
      alert('Cannot use "superadmin" as a store username.');
      return;
    }
    if (cleanU === 'staff' || cleanU.startsWith('staff_') || cleanU.startsWith('counter_')) {
      alert('Store admin username cannot start with "staff" or "counter".');
      return;
    }
    if (tenants.some(t => t.username && t.username.toLowerCase() === cleanU)) {
      alert(`Username "${cleanU}" is already taken by another store. Please choose a unique username.`);
      return;
    }
    const created = createTenant({ ...createStoreForm, username: cleanU });
    setShowCreateStoreModal(false);
    setCreateStoreForm({
      name: '',
      subtitle: 'Agriculture & Crop Protection Store',
      ownerName: '',
      username: '',
      email: '',
      phone: '',
      city: 'Sargodha',
      plan: 'Pro Enterprise Plan',
      monthlyFee: '12000',
      maxBranches: '5',
      adminPin: '1234',
      ntn: '',
      address: ''
    });
  };

  // Handle Edit Store
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingTenant) return;
    updateTenant(editingTenant.id, editingTenant);
    setEditingTenant(null);
  };

  // Handle Reset Pin
  const handleResetPinSubmit = (e) => {
    e.preventDefault();
    if (!resetPinTenant) return;
    resetTenantAdminPin(resetPinTenant.id, newPinValue);
    setResetPinTenant(null);
  };

  // Handle Subscription Payment
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentModalTenant) return;
    recordSubscriptionPayment(
      paymentModalTenant.id,
      paymentForm.amount,
      paymentForm.months,
      paymentForm.method,
      paymentForm.ref
    );
    setPaymentModalTenant(null);
  };

  // Handle Add User
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim()) {
      alert('User name is required.');
      return;
    }
    addTenantUser(newUserForm);
    setShowAddUserModal(false);
    setNewUserForm({
      tenantId: tenants[0]?.id || 'tenant-1',
      name: '',
      username: '',
      role: 'Cashier / POS',
      phone: '',
      pin: '0000'
    });
  };

  // Open WhatsApp Link helper
  const openWhatsAppToOwner = (tenant) => {
    const rawPhone = tenant.phone?.replace(/[^0-9]/g, '') || '';
    const formattedPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
    const message = encodeURIComponent(
      `Assalam-o-Alaikum ${tenant.ownerName} sb, this is the AgriSol SaaS Support Desk regarding your ${tenant.name} store portal. How can we assist your business today?`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="page-body">
      {/* =========================================================================
          EXECUTIVE HERO HEADER & SaaS MRR RIBBON
          ========================================================================= */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #091325 0%, #172554 45%, #1e1b4b 100%)',
          color: '#ffffff',
          marginBottom: '20px',
          padding: '24px 28px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
              }}
            >
              🛡️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>
                  AgriSol SaaS Master Super Admin Console
                </h1>
                <span
                  style={{
                    background: 'rgba(52, 211, 153, 0.2)',
                    color: '#34d399',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  LIVE v2.0 PRO
                </span>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>
                Centralized multi-tenant management for Pakistan Agriculture dealers, subscription billing, and branch networks.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: '12px' }}
              onClick={exportSaaSBackup}
              title="Download entire SaaS database snapshot as JSON"
            >
              <span>📥 Export SaaS Backup</span>
            </button>
            <button
              type="button"
              className="btn btn-accent"
              style={{ fontWeight: 700, padding: '9px 18px', fontSize: '13px', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}
              onClick={() => setShowCreateStoreModal(true)}
            >
              <span>+ Register New SaaS Store</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginTop: '22px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', opacity: 0.75 }}>
              Total SaaS Dealer Stores
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '2px' }}>
              {metrics.totalTenants} Stores
            </div>
            <div style={{ fontSize: '11.5px', opacity: 0.85, marginTop: '2px' }}>
              <span style={{ color: '#34d399', fontWeight: 700 }}>{metrics.activeTenants} Active</span> &bull; {metrics.trialTenants} Trial
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', opacity: 0.75 }}>
              Monthly Recurring Revenue (MRR)
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#fcd34d', marginTop: '2px' }}>
              {formatCurrency(metrics.totalMRR)}
            </div>
            <div style={{ fontSize: '11.5px', opacity: 0.85, marginTop: '2px' }}>
              ARR Run-Rate: <b>{formatCurrency(metrics.totalARR)}</b>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', opacity: 0.75 }}>
              Connected Store Terminals
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '2px' }}>
              {metrics.totalBranches} Locations
            </div>
            <div style={{ fontSize: '11.5px', opacity: 0.85, marginTop: '2px' }}>
              {metrics.totalUsersCount} Operators &bull; Multi-Godowns
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', opacity: 0.75 }}>
              Renewals Due (Next 15 Days)
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: metrics.expiringSoonCount > 0 ? '#fb923c' : '#34d399', marginTop: '2px' }}>
              {metrics.expiringSoonCount} Stores
            </div>
            <div style={{ fontSize: '11.5px', opacity: 0.85, marginTop: '2px' }}>
              {metrics.expiringSoonCount > 0 ? 'Reminders ready to dispatch' : 'All subscriptions up to date'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', opacity: 0.75 }}>
              Cloud &amp; Offline Sync Health
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
              99.98% Uptime
            </div>
            <div style={{ fontSize: '11.5px', opacity: 0.85, marginTop: '2px' }}>
              SQLite &bull; 18ms Cloud Sync Latency
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION SUB-TABS BAR
          ========================================================================= */}
      <div className="filter-bar" style={{ justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className="segmented-control" style={{ overflowX: 'auto', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`segmented-btn ${activeSubTab === 'tenants' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('tenants')}
          >
            🏢 SaaS Tenant Stores ({tenants.length})
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeSubTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('users')}
          >
            👥 Store Operators Directory ({tenantUsers.length})
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeSubTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('billing')}
          >
            💳 Subscription Billing &amp; Renewals ({saasBilling.length})
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeSubTab === 'broadcast' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('broadcast')}
          >
            📢 Global Announcements
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeSubTab === 'infra' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('infra')}
          >
            ☁️ Cloud Server &amp; Database Health
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: SAAS TENANT STORES DIRECTORY
          ========================================================================= */}
      {activeSubTab === 'tenants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search & Filtering Row */}
          <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
              <div className="search-input-wrapper" style={{ minWidth: '260px', flex: 1 }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Search store name, owner, city, phone, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="select"
                style={{ width: 'auto' }}
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
              >
                <option value="All">All Plans</option>
                <option value="Pro Enterprise">Pro Enterprise</option>
                <option value="Growth">Growth</option>
                <option value="Starter">Starter</option>
              </select>

              <select
                className="select"
                style={{ width: 'auto' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active Stores</option>
                <option value="Trial">Trial Stores</option>
                <option value="ExpiringSoon">Expiring Within 15 Days</option>
                <option value="Suspended">Suspended Stores</option>
              </select>
            </div>

            <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
              Showing {filteredTenants.length} of {tenants.length} Stores
            </span>
          </div>

          {/* Tenants Data Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STORE &amp; OWNER</th>
                    <th>CITY / REGION</th>
                    <th>PHONE / WHATSAPP</th>
                    <th>SUBSCRIPTION PLAN</th>
                    <th>MONTHLY FEE</th>
                    <th style={{ textAlign: 'center' }}>BRANCHES</th>
                    <th>RENEWAL DATE</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>SUPER ADMIN ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                        No stores found matching your search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map(t => {
                      const isSuspended = t.status === 'Suspended';
                      const isTrial = t.status.includes('Trial');
                      const renewalDateObj = t.renewalDate ? new Date(t.renewalDate) : null;
                      const now = new Date();
                      const daysLeft = renewalDateObj ? Math.ceil((renewalDateObj - now) / (1000 * 60 * 60 * 24)) : 0;
                      const isUrgent = daysLeft >= 0 && daysLeft <= 7;

                      return (
                        <tr key={t.id} style={{ opacity: isSuspended ? 0.65 : 1 }}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                                onClick={() => setViewingTenant(t)}
                              >
                                <span style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--primary)' }}>
                                  {t.name}
                                </span>
                              </button>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span>Owner: <b>{t.ownerName}</b></span>
                              <span>&bull;</span>
                              <span style={{ background: 'var(--bg-hover)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                                @{t.username || 'admin'}
                              </span>
                              <span>&bull;</span>
                              <span>PIN: <code>{t.adminPin || '1234'}</code></span>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{t.city}</div>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{t.address ? t.address.slice(0, 30) + '...' : ''}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 600 }}>{t.phone}</span>
                              <button
                                type="button"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a' }}
                                onClick={() => openWhatsAppToOwner(t)}
                                title="Open WhatsApp Chat with Owner"
                              >
                                💬
                              </button>
                            </div>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{t.email}</div>
                          </td>
                          <td>
                            <span className="badge badge-info" style={{ fontWeight: 700 }}>
                              {t.plan}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {formatCurrency(t.monthlyFee)}/mo
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                              {t.activeBranchesCount || 1} / {t.maxBranches || 3}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: isUrgent ? '#dc2626' : 'var(--text-main)' }}>
                              {formatDate(t.renewalDate)}
                            </div>
                            <div style={{ fontSize: '10.5px', color: isUrgent ? '#dc2626' : 'var(--text-muted)' }}>
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                            </div>
                          </td>
                          <td>
                            {isSuspended ? (
                              <span className="badge badge-danger">Suspended</span>
                            ) : isTrial ? (
                              <span className="badge badge-warning">Trial</span>
                            ) : (
                              <span className="badge badge-success">Active</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {/* Impersonate / Enter Store Button */}
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ fontSize: '11px', padding: '4px 10px', fontWeight: 700 }}
                                onClick={() => impersonateTenant(t.id)}
                                title="Enter Store Workspace as Super Admin"
                              >
                                🚀 Enter Store
                              </button>

                              {/* Record Subscription Payment */}
                              <button
                                type="button"
                                className="btn btn-accent"
                                style={{ fontSize: '11px', padding: '4px 8px', fontWeight: 700 }}
                                onClick={() => {
                                  setPaymentModalTenant(t);
                                  setPaymentForm({
                                    amount: t.monthlyFee || 12000,
                                    months: 1,
                                    method: 'Meezan Bank Raast / IBFT',
                                    ref: ''
                                  });
                                }}
                                title="Record Subscription Payment"
                              >
                                💳 Renew
                              </button>

                              {/* Edit Store Quotas */}
                              <button
                                type="button"
                                className="btn btn-outline btn-icon-only"
                                title="Edit Plan & Quotas"
                                onClick={() => setEditingTenant({ ...t })}
                              >
                                ✏️
                              </button>

                              {/* Reset Store Admin PIN */}
                              <button
                                type="button"
                                className="btn btn-outline btn-icon-only"
                                title="Reset Store Admin PIN"
                                onClick={() => {
                                  setResetPinTenant(t);
                                  setNewPinValue(t.adminPin || '1234');
                                }}
                              >
                                🔑
                              </button>

                              {/* Suspend / Activate Toggle */}
                              <button
                                type="button"
                                className="btn btn-outline btn-icon-only"
                                style={{ color: isSuspended ? '#16a34a' : '#d97706' }}
                                title={isSuspended ? 'Reactivate Store' : 'Suspend Store'}
                                onClick={() => toggleTenantStatus(t.id)}
                              >
                                {isSuspended ? '▶️' : '⏸️'}
                              </button>

                              {/* Delete Tenant */}
                              <button
                                type="button"
                                className="btn btn-outline btn-icon-only"
                                style={{ color: '#ef4444' }}
                                title="Delete Tenant"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to completely remove ${t.name}?`)) {
                                    deleteTenant(t.id);
                                  }
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: STORE OPERATORS & USER ACCOUNTS DIRECTORY
          ========================================================================= */}
      {activeSubTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
              <div className="search-input-wrapper" style={{ minWidth: '240px', flex: 1 }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Search operator name, username, phone..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="select"
                style={{ width: 'auto' }}
                value={userFilterStore}
                onChange={(e) => setUserFilterStore(e.target.value)}
              >
                <option value="All">All Dealer Stores</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <select
                className="select"
                style={{ width: 'auto' }}
                value={userFilterRole}
                onChange={(e) => setUserFilterRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Store Admin">Store Admin</option>
                <option value="Cashier / POS">Cashier / POS</option>
                <option value="Inventory Manager">Inventory Manager</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
              onClick={() => setShowAddUserModal(true)}
            >
              + Create Operator Account
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>OPERATOR NAME</th>
                    <th>ASSIGNED STORE</th>
                    <th>ROLE &amp; PRIVILEGES</th>
                    <th>PHONE NUMBER</th>
                    <th>ACCESS PIN</th>
                    <th>LAST LOGIN / ACTIVE</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No operators found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const isDisabled = u.status === 'Disabled';
                      return (
                        <tr key={u.id} style={{ opacity: isDisabled ? 0.6 : 1 }}>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{u.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{u.username}</div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{u.tenantName}</span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                u.role.includes('Admin')
                                  ? 'badge-primary'
                                  : u.role.includes('Cashier')
                                  ? 'badge-warning'
                                  : 'badge-info'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td>{u.phone || 'N/A'}</td>
                          <td>
                            <code style={{ background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '1px' }}>
                              {u.pin}
                            </code>
                          </td>
                          <td style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{u.lastActive}</td>
                          <td>
                            <span className={`badge ${isDisabled ? 'badge-danger' : 'badge-success'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '4px' }}>
                              <button
                                type="button"
                                className="btn btn-outline btn-icon-only"
                                title={isDisabled ? 'Enable Operator' : 'Disable Operator'}
                                onClick={() => toggleTenantUserStatus(u.id)}
                              >
                                {isDisabled ? '▶️' : '⏸️'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-icon-only"
                                title="Reset Operator PIN"
                                onClick={() => {
                                  const p = prompt(`Enter new PIN for ${u.name}:`, u.pin);
                                  if (p && p.trim()) resetTenantUserPin(u.id, p.trim());
                                }}
                              >
                                🔑
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-icon-only"
                                style={{ color: '#ef4444' }}
                                title="Delete Operator"
                                onClick={() => {
                                  if (confirm(`Delete user ${u.name}?`)) deleteTenantUser(u.id);
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SUBSCRIPTION BILLING & RENEWALS QUEUE
          ========================================================================= */}
      {activeSubTab === 'billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Quick Metrics Bar */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">TOTAL COLLECTED SUBSCRIPTIONS</span></div>
              <div className="kpi-value" style={{ color: '#16a34a' }}>
                {formatCurrency(metrics.totalCollectedRevenue)}
              </div>
              <div className="kpi-subtext"><span>All settled franchise fees</span></div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">PROJECTED ANNUAL RUN-RATE (ARR)</span></div>
              <div className="kpi-value" style={{ color: 'var(--primary)' }}>
                {formatCurrency(metrics.totalARR)}
              </div>
              <div className="kpi-subtext"><span>Based on current active subscriptions</span></div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">RENEWAL REMINDERS PENDING</span></div>
              <div className="kpi-value" style={{ color: metrics.expiringSoonCount > 0 ? '#ea580c' : '#16a34a' }}>
                {metrics.expiringSoonCount} Stores
              </div>
              <div className="kpi-subtext"><span>Due within next 15 days</span></div>
            </div>
          </div>

          {/* Billing Ledger */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Franchise Subscription Receipts &amp; Ledger</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Raast, Bank Transfer, and Direct Deposits from dealer accounts</p>
              </div>

              <div className="search-input-wrapper" style={{ minWidth: '220px' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Filter billing records..."
                  value={billingSearchQuery}
                  onChange={(e) => setBillingSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>RECEIPT ID</th>
                    <th>DATE</th>
                    <th>DEALER STORE</th>
                    <th>PLAN TIER</th>
                    <th>DURATION</th>
                    <th>AMOUNT (PKR)</th>
                    <th>PAYMENT METHOD / REF</th>
                    <th>EXTENDED UNTIL</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBilling.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No billing receipts recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredBilling.map(b => (
                      <tr key={b.id}>
                        <td style={{ fontWeight: 700 }}>{b.id}</td>
                        <td>{formatDate(b.date)}</td>
                        <td style={{ fontWeight: 700 }}>{b.tenantName}</td>
                        <td><span className="badge badge-info">{b.plan}</span></td>
                        <td>{b.months} Month(s)</td>
                        <td style={{ fontWeight: 800, color: '#16a34a' }}>
                          {formatCurrency(b.amount)}
                        </td>
                        <td>
                          <div>{b.method}</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Ref: {b.transactionRef}</div>
                        </td>
                        <td style={{ fontWeight: 700 }}>{formatDate(b.renewalDate)}</td>
                        <td><span className="badge badge-success">{b.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: GLOBAL BROADCAST ANNOUNCEMENTS
          ========================================================================= */}
      {activeSubTab === 'broadcast' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>
              Publish Global System Announcement
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              This announcement banner appears prominently across all connected store billing counters, godowns, and tablets in Pakistan.
            </p>

            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label className="input-label">Announcement Banner Text</label>
              <textarea
                className="input"
                rows={3}
                style={{ height: 'auto', padding: '12px', fontSize: '13.5px' }}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Scheduled Cloud Maintenance on Sunday 2:00 AM PKT..."
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="announcementActiveCheck"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="announcementActiveCheck" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Display this announcement banner to all stores right now
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontWeight: 700, padding: '10px 20px' }}
                onClick={() => updateBroadcastMessage(announcementText, announcementActive)}
              >
                📢 Broadcast to All Stores
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setAnnouncementActive(false);
                  updateBroadcastMessage(announcementText, false);
                }}
              >
                Disable Banner
              </button>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-hover)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
              Live Store Terminal Preview
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              This is how cashiers and dealers see your message at the top of their workspace:
            </p>

            {announcementActive ? (
              <div
                style={{
                  background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <span>📢</span>
                <span>{announcementText || '(No message typed)'}</span>
              </div>
            ) : (
              <div
                style={{
                  padding: '16px',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  textAlign: 'center'
                }}
              >
                Banner is currently disabled. Stores do not see any broadcast.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CLOUD INFRASTRUCTURE & DATABASE HEALTH
          ========================================================================= */}
      {activeSubTab === 'infra' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">PRIMARY CLOUD DATABASE</span></div>
              <div className="kpi-value" style={{ color: '#16a34a' }}>PostgreSQL 16 &bull; Multi-AZ Cluster</div>
              <div className="kpi-subtext"><span>Encrypted SSL &bull; Auto-failover ready</span></div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">LOCAL OFFLINE TERMINAL ENGINE</span></div>
              <div className="kpi-value" style={{ color: 'var(--primary)' }}>Capacitor &bull; SQLite Hybrid</div>
              <div className="kpi-subtext"><span>Full rural offline-first POS support</span></div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">CLOUD STORAGE QUOTA</span></div>
              <div className="kpi-value">450 MB / 50 GB</div>
              <div className="kpi-subtext"><span>0.9% tenant storage consumed</span></div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Store Tenant Storage Footprint &amp; Sync Status</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Realtime health metrics of all replicated tenant databases</p>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => showToast('Flushed Redis session cache across all cluster nodes!', 'success')}
              >
                🔄 Purge Cache &amp; Re-sync Nodes
              </button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>TENANT STORE</th>
                    <th>DATABASE ROWS</th>
                    <th>STORAGE CONSUMED</th>
                    <th>LAST CLOUD BACKUP</th>
                    <th>SYNC LATENCY</th>
                    <th>ENCRYPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700 }}>{t.name}</td>
                      <td>{t.totalInvoicesCount * 8 + 42} records</td>
                      <td>{t.storageUsedMb || 45} MB</td>
                      <td>{formatDate(new Date())} (Automated)</td>
                      <td><span className="badge badge-success">18 ms</span></td>
                      <td><span className="badge badge-neutral">AES-256</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: REGISTER NEW SAAS STORE
          ========================================================================= */}
      {showCreateStoreModal && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Register New SaaS Store Tenant</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowCreateStoreModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateStoreSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">Business / Store Name <span className="req">*</span></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Al-Rehman Agro Center"
                      value={createStoreForm.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        const autoUser = val.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 20);
                        setCreateStoreForm(prev => ({
                          ...prev,
                          name: val,
                          username: (!prev.username || prev.username === prev.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 20))
                            ? autoUser
                            : prev.username
                        }));
                      }}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Store Login Username <span className="req">*</span></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. alrehman_agro"
                      value={createStoreForm.username}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                      required
                    />
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Admin will use this username to log in to this store portal
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">Owner / Managing Partner <span className="req">*</span></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Malik Muhammad Afzal"
                      value={createStoreForm.ownerName}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, ownerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Store Admin Master PIN <span className="req">*</span></label>
                    <input
                      type="text"
                      maxLength={6}
                      className="input"
                      placeholder="e.g. 1234"
                      value={createStoreForm.adminPin}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, adminPin: e.target.value })}
                      required
                    />
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Security PIN used with the username for login
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">Phone / WhatsApp Number</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="0300-1234567"
                      value={createStoreForm.phone}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input
                      type="email"
                      className="input"
                      placeholder="dealer@agristore.pk"
                      value={createStoreForm.email}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">Subscription Tier</label>
                    <select
                      className="select"
                      value={createStoreForm.plan}
                      onChange={(e) => {
                        const plan = e.target.value;
                        let fee = '6500';
                        let maxBr = '3';
                        if (plan === 'Pro Enterprise Plan') { fee = '12000'; maxBr = '5'; }
                        else if (plan === 'Starter Plan') { fee = '3500'; maxBr = '1'; }
                        setCreateStoreForm({ ...createStoreForm, plan, monthlyFee: fee, maxBranches: maxBr });
                      }}
                    >
                      <option value="Starter Plan">Starter Plan (Rs 3,500/mo)</option>
                      <option value="Growth Plan">Growth Plan (Rs 6,500/mo)</option>
                      <option value="Pro Enterprise Plan">Pro Enterprise Plan (Rs 12,000/mo)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Monthly Fee (Rs)</label>
                    <input
                      type="number"
                      className="input"
                      value={createStoreForm.monthlyFee}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, monthlyFee: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Allowed Branches</label>
                    <input
                      type="number"
                      className="input"
                      value={createStoreForm.maxBranches}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, maxBranches: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="input-group">
                    <label className="input-label">City / Mandi Location</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Sahiwal"
                      value={createStoreForm.city}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, city: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">NTN / Tax Number</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 1234567-8"
                      value={createStoreForm.ntn}
                      onChange={(e) => setCreateStoreForm({ ...createStoreForm, ntn: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreateStoreModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ minWidth: '160px' }}>
                  Register SaaS Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: RECORD SUBSCRIPTION PAYMENT & EXTEND RENEWAL
          ========================================================================= */}
      {paymentModalTenant && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Record Subscription Payment &bull; {paymentModalTenant.name}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setPaymentModalTenant(null)}>&times;</button>
            </div>
            <form onSubmit={handlePaymentSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Recording payment automatically extends license renewal date and generates a digital receipt.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Payment Amount (PKR)</label>
                    <input
                      type="number"
                      className="input"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Renewal Extension</label>
                    <select
                      className="select"
                      value={paymentForm.months}
                      onChange={(e) => setPaymentForm({ ...paymentForm, months: Number(e.target.value) })}
                    >
                      <option value={1}>+1 Month (30 Days)</option>
                      <option value={3}>+3 Months (90 Days)</option>
                      <option value={6}>+6 Months (180 Days)</option>
                      <option value={12}>+1 Year (365 Days)</option>
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label className="input-label">Payment Method</label>
                  <select
                    className="select"
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  >
                    <option value="Meezan Bank Raast / IBFT">Meezan Bank Raast / IBFT</option>
                    <option value="HBL Direct Deposit">HBL Direct Deposit</option>
                    <option value="Bank AL Habib Raast">Bank AL Habib Raast</option>
                    <option value="JazzCash / EasyPaisa">JazzCash / EasyPaisa</option>
                    <option value="Cash Handover to Area Rep">Cash Handover to Area Rep</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Bank Transaction / Raast Reference ID</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. RZ-9918234"
                    value={paymentForm.ref}
                    onChange={(e) => setPaymentForm({ ...paymentForm, ref: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setPaymentModalTenant(null)}>Cancel</button>
                <button type="submit" className="btn btn-accent" style={{ fontWeight: 700 }}>
                  Confirm Payment &amp; Renew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: EDIT STORE QUOTAS & PLAN
          ========================================================================= */}
      {editingTenant && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Store Quotas: {editingTenant.name}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setEditingTenant(null)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Store Name</label>
                    <input
                      type="text"
                      className="input"
                      value={editingTenant.name}
                      onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Store Login Username</label>
                    <input
                      type="text"
                      className="input"
                      value={editingTenant.username || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Plan Tier</label>
                    <select
                      className="select"
                      value={editingTenant.plan}
                      onChange={(e) => setEditingTenant({ ...editingTenant, plan: e.target.value })}
                    >
                      <option value="Starter Plan">Starter Plan</option>
                      <option value="Growth Plan">Growth Plan</option>
                      <option value="Pro Enterprise Plan">Pro Enterprise Plan</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Status</label>
                    <select
                      className="select"
                      value={editingTenant.status}
                      onChange={(e) => setEditingTenant({ ...editingTenant, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Trial">Trial</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Monthly Fee (Rs)</label>
                    <input
                      type="number"
                      className="input"
                      value={editingTenant.monthlyFee}
                      onChange={(e) => setEditingTenant({ ...editingTenant, monthlyFee: Number(e.target.value) })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Branch Limit</label>
                    <input
                      type="number"
                      className="input"
                      value={editingTenant.maxBranches}
                      onChange={(e) => setEditingTenant({ ...editingTenant, maxBranches: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditingTenant(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: ADD STORE OPERATOR / USER ACCOUNT
          ========================================================================= */}
      {showAddUserModal && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Create Store Operator Account</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddUserModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddUserSubmit}>
              <div className="modal-body">
                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label className="input-label">Assign to Store Tenant</label>
                  <select
                    className="select"
                    value={newUserForm.tenantId}
                    onChange={(e) => {
                      const t = tenants.find(item => item.id === e.target.value);
                      setNewUserForm({
                        ...newUserForm,
                        tenantId: e.target.value,
                        tenantName: t?.name || ''
                      });
                    }}
                  >
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Operator Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Asad Ali"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Role</label>
                    <select
                      className="select"
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    >
                      <option value="Cashier / POS">Cashier / POS</option>
                      <option value="Inventory Manager">Inventory Manager</option>
                      <option value="Store Admin">Store Admin / Partner</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Phone Number</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="0300-1122334"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">4-Digit Access PIN</label>
                    <input
                      type="password"
                      maxLength={6}
                      className="input"
                      value={newUserForm.pin}
                      onChange={(e) => setNewUserForm({ ...newUserForm, pin: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Operator</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: RESET STORE ADMIN PIN
          ========================================================================= */}
      {resetPinTenant && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Reset Admin PIN &bull; {resetPinTenant.name}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setResetPinTenant(null)}>&times;</button>
            </div>
            <form onSubmit={handleResetPinSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Emergency PIN reset for dealer <b>{resetPinTenant.ownerName}</b>.
                </p>
                <div className="input-group">
                  <label className="input-label">New 4-digit PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    className="input"
                    value={newPinValue}
                    onChange={(e) => setNewPinValue(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setResetPinTenant(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Store PIN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: VIEW STORE DOSSIER
          ========================================================================= */}
      {viewingTenant && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Store Dossier &bull; {viewingTenant.name}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setViewingTenant(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Store Owner</div>
                  <div style={{ fontWeight: 700 }}>{viewingTenant.ownerName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>City / Location</div>
                  <div style={{ fontWeight: 700 }}>{viewingTenant.city}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Phone / WhatsApp</div>
                  <div style={{ fontWeight: 700 }}>{viewingTenant.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Email</div>
                  <div style={{ fontWeight: 700 }}>{viewingTenant.email || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Subscription Plan</div>
                  <div style={{ fontWeight: 700 }} className="badge badge-info">{viewingTenant.plan}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Monthly Billing</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(viewingTenant.monthlyFee)}/mo</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Store Login Username</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>@{viewingTenant.username || 'admin'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Master Admin PIN</div>
                  <div style={{ fontWeight: 700 }}><code>{viewingTenant.adminPin || '1234'}</code></div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NTN Tax Number</div>
                  <div style={{ fontWeight: 600 }}>{viewingTenant.ntn || 'Pending'}</div>
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '6px', fontSize: '12px' }}>
                <div><b>Complete Address:</b> {viewingTenant.address || 'Grain & Fertilizer Market, Punjab'}</div>
                <div style={{ marginTop: '6px' }}><b>Renewal Date:</b> {formatDate(viewingTenant.renewalDate)}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  extendTenantTrial(viewingTenant.id, 14);
                  setViewingTenant(null);
                }}
              >
                +14 Days Trial Extension
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  impersonateTenant(viewingTenant.id);
                  setViewingTenant(null);
                }}
              >
                🚀 Enter Store Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
