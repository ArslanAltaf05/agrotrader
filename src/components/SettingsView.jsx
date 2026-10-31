'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';

export default function SettingsView() {
  const {
    storeProfile,
    setStoreProfile,
    theme,
    setTheme,
    branches,
    activeBranchId,
    switchBranch,
    saasPlan,
    auth,
    staffPermissions,
    updateStaffPermissions,
    resetPin,
    resetAllData,
    showToast
  } = useApp();

  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'superadmin';

  const [profileForm, setProfileForm] = useState({ ...storeProfile });
  const [adminPinInput, setAdminPinInput] = useState(auth.adminPin || '1234');
  const [staffPinInput, setStaffPinInput] = useState(auth.staffPin || '0000');

  const handleUpdateAdminPin = (e) => {
    e.preventDefault();
    if (!adminPinInput.trim() || adminPinInput.length < 4) {
      showToast('Admin PIN must be at least 4 digits.', 'warning');
      return;
    }
    resetPin(adminPinInput.trim(), 'admin');
  };

  const handleUpdateStaffPin = (e) => {
    e.preventDefault();
    if (!staffPinInput.trim() || staffPinInput.length < 4) {
      showToast('Staff PIN must be at least 4 digits.', 'warning');
      return;
    }
    resetPin(staffPinInput.trim(), 'staff');
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Access Denied: Only Store Administrators can edit bill profile & header info.', 'warning');
      return;
    }
    setStoreProfile(profileForm);
    showToast('Store profile & bill header updated successfully!', 'success');
  };

  const handleExportBackup = () => {
    const backupData = localStorage.getItem('agrotrader_live_production_v1') || '{}';
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgroTrader_Live_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database backup downloaded!', 'success');
  };

  return (
    <div className="page-body">
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* SaaS Subscription & Desktop / Mobile Software Downloads Card */}
        <div className="card" style={{ background: 'var(--primary-gradient)', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '20px' }}>🌾</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{saasPlan.name} (Production Edition)</h3>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                  {saasPlan.status}
                </span>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>
                Production-ready offline &amp; cloud ERP with Windows Desktop EXE and Android Mobile APK support.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href="/downloads/AgroTrader_Setup_v2.0.exe"
                download="AgroTrader_Setup_v2.0.exe"
                className="btn btn-sm"
                style={{
                  background: '#ffffff',
                  color: '#1e3a8a',
                  fontWeight: 800,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <span>💻</span>
                <span>Download Windows .EXE</span>
              </a>

              <a
                href="/downloads/AgroTrader_v2.0.apk"
                download="AgroTrader_v2.0.apk"
                className="btn btn-sm"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.4)'
                }}
              >
                <span>📱</span>
                <span>Download Android .APK</span>
              </a>
            </div>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
            <span>Offline-First Windows App: <code>AgroTrader_Setup_v2.0.exe</code> &bull; Android APK: <code>AgroTrader_v2.0.apk</code></span>
            <span style={{ color: '#fde68a' }}>Cloud Sync Active &bull; Zero Demo Records</span>
          </div>
        </div>

        {/* Theme Settings (New Theme Requirement) */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span dangerouslySetInnerHTML={{ __html: icons.palette }} />
              <span>Theme & Visual Styling</span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            The software comes with modern custom themes. The default theme has been upgraded to <b>Modern Sapphire & Golden Harvest</b>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {/* Theme 1: Sapphire & Gold (Default New Theme) */}
            <div
              style={{
                border: theme === 'theme-sapphire' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                cursor: 'pointer',
                background: '#ffffff',
                boxShadow: theme === 'theme-sapphire' ? 'var(--shadow-md)' : 'none'
              }}
              onClick={() => setTheme('theme-sapphire')}
            >
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1d4ed8', display: 'inline-block' }} />
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#091325', display: 'inline-block' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '13.5px' }}>✨ Modern Sapphire & Gold</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                (New Theme - Clean & Premium)
              </div>
            </div>

            {/* Theme 2: Emerald Classic */}
            <div
              style={{
                border: theme === 'theme-emerald' ? '2px solid #065f46' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                cursor: 'pointer',
                background: '#ffffff'
              }}
              onClick={() => setTheme('theme-emerald')}
            >
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#065f46', display: 'inline-block' }} />
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#eef7f2', display: 'inline-block' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '13.5px' }}>🌲 Emerald Forest</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Classic Screenshot Look
              </div>
            </div>

            {/* Theme 3: Obsidian Dark */}
            <div
              style={{
                border: theme === 'theme-obsidian' ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                cursor: 'pointer',
                background: '#1e293b',
                color: '#fff'
              }}
              onClick={() => setTheme('theme-obsidian')}
            >
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#0b0f19', display: 'inline-block' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '13.5px' }}>🌑 Obsidian Dark Cockpit</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Night / Dim Ambient Lighting
              </div>
            </div>

            {/* Theme 4: Arctic Slate */}
            <div
              style={{
                border: theme === 'theme-arctic' ? '2px solid #6366f1' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                cursor: 'pointer',
                background: '#ffffff'
              }}
              onClick={() => setTheme('theme-arctic')}
            >
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#475569', display: 'inline-block' }} />
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f8fafc', display: 'inline-block' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '13.5px' }}>❄️ Arctic Clean Slate</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                High-Contrast Daylight
              </div>
            </div>
          </div>
        </div>

        {/* Store Profile Settings */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title">
              <span dangerouslySetInnerHTML={{ __html: icons.settings }} />
              <span>Store Profile &amp; Bill Header Info</span>
            </div>
            <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-warning'}`}>
              {isAdmin ? 'Admin Editable' : '🔒 Locked (Admin Only)'}
            </span>
          </div>

          {!isAdmin && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12.5px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🔒</span>
              <span>
                <strong>Access Restricted:</strong> Bill profile, store details, and receipt header info are protected. Only Administrators can modify billing credentials and legal headers.
              </span>
            </div>
          )}

          <form onSubmit={handleProfileSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="input-group">
                <label className="input-label">Store / Business Name</label>
                <input
                  type="text"
                  className="input"
                  disabled={!isAdmin}
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Business Subtitle</label>
                <input
                  type="text"
                  className="input"
                  disabled={!isAdmin}
                  value={profileForm.subtitle}
                  onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="input-group">
                <label className="input-label">Phone / WhatsApp</label>
                <input
                  type="text"
                  className="input"
                  disabled={!isAdmin}
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Website</label>
                <input
                  type="text"
                  className="input"
                  disabled={!isAdmin}
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Tax / NTN Registration</label>
                <input
                  type="text"
                  className="input"
                  disabled={!isAdmin}
                  value={profileForm.ntn}
                  onChange={(e) => setProfileForm({ ...profileForm, ntn: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label className="input-label">Market Address</label>
              <input
                type="text"
                className="input"
                disabled={!isAdmin}
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label className="input-label">Receipt Tagline</label>
              <input
                type="text"
                className="input"
                disabled={!isAdmin}
                value={profileForm.tagline}
                onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
              />
            </div>

            {isAdmin ? (
              <button type="submit" className="btn btn-primary">
                Save Store Profile &amp; Bill Header
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-neutral" style={{ padding: '8px 14px', fontSize: '12px' }}>
                  🔒 Locked &bull; Read-Only for Staff
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Staff Roles & Access Control Permissions (ADMIN ONLY) */}
        {isAdmin && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title">
              <span>🛡️</span>
              <span>Staff Access Control &amp; Role Permissions</span>
            </div>
            <span className="badge badge-primary">Admin Control Active</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Configure granular permissions for counter staff, cashiers, and godown operators. Only Store Administrators can modify these settings.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Permission 1: View Logs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: staffPermissions?.canViewLogs ? 'rgba(22, 163, 74, 0.08)' : 'var(--bg-hover)',
                border: `1px solid ${staffPermissions?.canViewLogs ? '#86efac' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📋 Allow Staff to View System Activity Logs</span>
                  {staffPermissions?.canViewLogs && <span className="badge badge-success">Enabled</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  When disabled, only Admins can view audit logs. When enabled, counter staff can view terminal audit trails.
                </div>
              </div>

              <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input
                  type="checkbox"
                  disabled={!isAdmin}
                  checked={staffPermissions?.canViewLogs || false}
                  onChange={(e) => updateStaffPermissions({ canViewLogs: e.target.checked })}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: isAdmin ? 'pointer' : 'not-allowed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: staffPermissions?.canViewLogs ? 'var(--primary)' : '#cbd5e1',
                    borderRadius: '24px',
                    transition: '0.2s'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: staffPermissions?.canViewLogs ? '23px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.2s'
                    }}
                  />
                </span>
              </label>
            </div>

            {/* Permission 2: View Financial Reports */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: staffPermissions?.canViewReports ? 'rgba(22, 163, 74, 0.08)' : 'var(--bg-hover)',
                border: `1px solid ${staffPermissions?.canViewReports ? '#86efac' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📊 Allow Staff to View Financial P&amp;L Reports</span>
                  {staffPermissions?.canViewReports && <span className="badge badge-success">Enabled</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Restricts executive profit/loss and product margins from unauthorized counter personnel.
                </div>
              </div>

              <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input
                  type="checkbox"
                  disabled={!isAdmin}
                  checked={staffPermissions?.canViewReports || false}
                  onChange={(e) => updateStaffPermissions({ canViewReports: e.target.checked })}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: isAdmin ? 'pointer' : 'not-allowed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: staffPermissions?.canViewReports ? 'var(--primary)' : '#cbd5e1',
                    borderRadius: '24px',
                    transition: '0.2s'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: staffPermissions?.canViewReports ? '23px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.2s'
                    }}
                  />
                </span>
              </label>
            </div>

            {/* Permission 3: Edit Base Prices in POS */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: staffPermissions?.canEditPrices ? 'rgba(22, 163, 74, 0.08)' : 'var(--bg-hover)',
                border: `1px solid ${staffPermissions?.canEditPrices ? '#86efac' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🏷️ Allow Staff to Modify Unit Prices in Cart</span>
                  {staffPermissions?.canEditPrices && <span className="badge badge-success">Enabled</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  When disabled, prices are locked to default catalog rates and cannot be overridden by staff.
                </div>
              </div>

              <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input
                  type="checkbox"
                  disabled={!isAdmin}
                  checked={staffPermissions?.canEditPrices || false}
                  onChange={(e) => updateStaffPermissions({ canEditPrices: e.target.checked })}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: isAdmin ? 'pointer' : 'not-allowed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: staffPermissions?.canEditPrices ? 'var(--primary)' : '#cbd5e1',
                    borderRadius: '24px',
                    transition: '0.2s'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: staffPermissions?.canEditPrices ? '23px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.2s'
                    }}
                  />
                </span>
              </label>
            </div>
          </div>
        </div>
        )}

        {/* Role Segregation & Security Middleware Settings (Admin Only) */}
        {isAdmin && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <span>🛡️</span>
                <span>Role Segregation &amp; Security Middleware</span>
              </div>
              <span className="badge badge-success">Middleware Active</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Strict role separation guarantees that Admin and Staff cannot enter each other&apos;s portals, access restricted views, or cross-authenticate using each other&apos;s credentials.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {/* Admin Portal PIN */}
              <div style={{ padding: '16px', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>👑</span>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Admin Master PIN</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Used to enter Admin Portal (Full store control, settings, audit trails, and financial reports).
                </div>
                <form onSubmit={handleUpdateAdminPin} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    maxLength={6}
                    className="input"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    style={{ letterSpacing: '3px', fontWeight: 700 }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Save Admin PIN
                  </button>
                </form>
              </div>

              {/* Staff Counter PIN */}
              <div style={{ padding: '16px', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>👤</span>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Counter Staff PIN</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Used for counter personnel. Locked to assigned station with restricted privileges.
                </div>
                <form onSubmit={handleUpdateStaffPin} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    maxLength={6}
                    className="input"
                    value={staffPinInput}
                    onChange={(e) => setStaffPinInput(e.target.value)}
                    style={{ letterSpacing: '3px', fontWeight: 700 }}
                    required
                  />
                  <button type="submit" className="btn btn-accent" style={{ whiteSpace: 'nowrap' }}>
                    Save Staff PIN
                  </button>
                </form>
              </div>
            </div>

            {/* Enforced Middleware Rules List */}
            <div style={{ padding: '14px 16px', borderRadius: '8px', background: 'rgba(22, 163, 74, 0.05)', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#15803d', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔒</span>
                <span>Active Middleware Safeguards</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <li><b>Credential Boundary:</b> Staff credentials cannot log into Admin Portal, and Admin credentials cannot log into Staff Counter.</li>
                <li><b>Navigation Guard:</b> Staff accounts attempting to access Settings, Logs, or Reports are redirected to Dashboard with security alerts.</li>
                <li><b>Branch Isolation:</b> Staff members are permanently locked to their assigned store branch and cannot access other branch data.</li>
                <li><b>Action Protection:</b> Inventory product deletion, sales invoice voiding, and system resets are restricted to Administrator only.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Database Backup & Reset */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span>💾</span>
              <span>Data Security &amp; Backup</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleExportBackup}
            >
              📥 Download Complete Database Backup (JSON)
            </button>

            {isAdmin && (
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: '#ef4444' }}
                onClick={() => {
                  if (confirm('Initialize clean production database? This will clear all transactions, products, and customer khata to start fresh.')) {
                    resetAllData();
                  }
                }}
              >
                🧹 Initialize Clean Database (Fresh Start)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
