'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';

// Auto-detect role from username — no manual tab switching
function detectRoleFromUsername(username) {
  const u = (username || '').trim().toLowerCase();
  if (u === 'superadmin' || u.startsWith('superadmin_')) return 'superadmin';
  if (u === 'staff' || u.startsWith('staff_') || u.startsWith('counter_')) return 'staff';
  return 'admin';
}

const ROLE_META = {
  admin: { label: 'Admin', icon: '👑', badge: 'badge-info', desc: 'Enter your admin credentials to access the store portal.' },
  staff: { label: 'Staff', icon: '👤', badge: 'badge-accent', desc: 'Enter your staff credentials to access the counter terminal.' },
  superadmin: { label: 'Super Admin', icon: '🛡️', badge: 'badge-warning', desc: 'Master administrator access to manage all SaaS dealer stores.' },
};

export default function LoginView() {
  const { login, storeProfile, resetPin } = useApp();

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [newResetPin, setNewResetPin] = useState('');
  const [masterRecoveryKey, setMasterRecoveryKey] = useState('');

  // Role is derived purely from username — no state needed
  const role = detectRoleFromUsername(username);
  const meta = ROLE_META[role];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(username, pin, role);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (role === 'staff') {
      alert('Staff PIN cannot be reset from the login terminal. Please ask your Store Administrator to update Staff PIN in Settings.');
      setShowForgotModal(false);
      return;
    }

    if (!newResetPin.trim() || newResetPin.length < 4) {
      alert('Please enter at least 4 digits for PIN.');
      return;
    }

    const res = resetPin(newResetPin, role, masterRecoveryKey);
    if (res && !res.success) {
      alert(res.message);
      return;
    }

    setPin(newResetPin);
    setShowForgotModal(false);
    setMasterRecoveryKey('');
    setNewResetPin('');
    alert(`PIN successfully reset to ${newResetPin}!`);
  };

  return (
    <div className="login-wrapper">
      {/* Left Hero Banner */}
      <div className="login-left-hero">
        <div className="login-hero-header">
          <div className="login-hero-logo">
            <span dangerouslySetInnerHTML={{ __html: icons.leaf }} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Agro Trader SaaS</h2>
            <p style={{ fontSize: '12px', opacity: 0.9 }}>The complete solution for agro business management</p>
          </div>
        </div>

        <div className="login-hero-content">
          <h1>Secure business data starts here.</h1>
          <p>
            Sign in to access inventory, ledgers, purchases, sales, and recovery tools.
          </p>
        </div>

        <div className="login-hero-footer-card">
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            🌾
          </div>
          <div style={{ fontSize: '12px' }}>
            <div style={{ fontWeight: 700 }}>Agro Trader</div>
            <div style={{ opacity: 0.85 }}>Phone: 0312-5236040</div>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="login-right-panel">
        <div className="login-card">

          {/* Store Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span dangerouslySetInnerHTML={{ __html: icons.lock }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Agro Trader SaaS</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>The complete solution for agro business management</div>
            </div>
          </div>

          {/* Auto-detected Role Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>


          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>
            {meta.label === 'Super Admin' ? 'Super Admin Portal' : `${meta.label} Login`}
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
            {meta.desc}
          </p>

          {errorMsg && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', fontSize: '12.5px', marginBottom: '16px', border: '1px solid #fecaca' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label className="input-label">Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} dangerouslySetInnerHTML={{ __html: icons.user }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  value={username}
                  placeholder="e.g. store_username, admin, or staff"
                  onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                  required
                />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Enter your registered store username, admin, or counter staff
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label className="input-label">PIN</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} dangerouslySetInnerHTML={{ __html: icons.lock }} />
                <input
                  type="password"
                  className="input"
                  style={{ paddingLeft: '36px', letterSpacing: '4px', fontSize: '16px' }}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700 }}
            >
              <span>&rarr; Login as {meta.label}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setShowForgotModal(true)}
            >
              Forgot PIN? Security recovery
            </button>
          </div>
        </div>
      </div>

      {/* Forgot PIN Modal */}
      {showForgotModal && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Device Security &bull; PIN Recovery</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowForgotModal(false)}>&times;</button>
            </div>
            {role === 'staff' ? (
              <div className="modal-body" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <span style={{ fontSize: '40px' }}>🛡️</span>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '12px 0 8px' }}>Staff PIN Managed by Admin</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Under Role Isolation Middleware, counter staff PINs cannot be changed from the login terminal.
                  Please ask your Store Administrator to reset or assign your PIN inside <b>Settings &bull; Security &amp; Permissions</b>.
                </p>
                <div style={{ marginTop: '20px' }}>
                  <button type="button" className="btn btn-primary" onClick={() => setShowForgotModal(false)}>
                    Understood
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <div className="modal-body">
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                    To reset the master {role} PIN, please provide the store Master Recovery Key or registered Store NTN.
                  </p>
                  <div className="input-group" style={{ marginBottom: '14px' }}>
                    <label className="input-label">Master Recovery Key or Store NTN</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. "
                      value={masterRecoveryKey}
                      onChange={(e) => setMasterRecoveryKey(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">New 4-digit PIN</label>
                    <input
                      type="password"
                      maxLength={6}
                      className="input"
                      placeholder="e.g. 5566"
                      value={newResetPin}
                      onChange={(e) => setNewResetPin(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowForgotModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Verify &amp; Reset PIN</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
