'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';

export default function LoginView() {
  const { login, storeProfile, resetPin } = useApp();

  const [role, setRole] = useState('admin'); // 'admin' | 'staff' | 'superadmin'
  const [username, setUsername] = useState('admin');
  const [pin, setPin] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [newResetPin, setNewResetPin] = useState('');

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
    if (!newResetPin.trim() || newResetPin.length < 4) {
      alert('Please enter at least 4 digits for PIN.');
      return;
    }
    resetPin(newResetPin, role);
    setPin(newResetPin);
    setShowForgotModal(false);
    alert(`PIN successfully reset to ${newResetPin}!`);
  };

  return (
    <div className="login-wrapper">
      {/* Left Hero Banner matching Screenshot 1 & 3 */}
      <div className="login-left-hero">
        <div className="login-hero-header">
          <div className="login-hero-logo">
            <span dangerouslySetInnerHTML={{ __html: icons.leaf }} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{storeProfile.name}</h2>
            <p style={{ fontSize: '12px', opacity: 0.9 }}>{storeProfile.subtitle}</p>
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
            <div style={{ fontWeight: 700 }}>AgriSol SaaS Pro</div>
            <div style={{ opacity: 0.85 }}>Website: {storeProfile.website} &bull; Phone: {storeProfile.phone}</div>
          </div>
        </div>
      </div>

      {/* Right Login Panel matching Screenshot 1 & 3 */}
      <div className="login-right-panel">
        <div className="login-card">
          {/* Header store badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: role === 'superadmin' ? 'linear-gradient(135deg, #1e3a8a 0%, #d97706 100%)' : 'var(--primary-light)', color: role === 'superadmin' ? '#fff' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              {role === 'superadmin' ? '🛡️' : <span dangerouslySetInnerHTML={{ __html: icons.lock }} />}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>
                {role === 'superadmin' ? 'AgriSol SaaS Master Portal' : storeProfile.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {role === 'superadmin' ? 'Cloud Multi-Tenant Management' : storeProfile.subtitle}
              </div>
            </div>
          </div>

          {/* Role Switch Tabs */}
          <div className="login-role-tabs">
            <div
              className={`login-role-tab ${role === 'admin' ? 'active' : ''}`}
              onClick={() => {
                setRole('admin');
                setUsername('admin');
                setPin('1234');
                setErrorMsg('');
              }}
            >
              Admin PIN
            </div>
            <div
              className={`login-role-tab ${role === 'staff' ? 'active' : ''}`}
              onClick={() => {
                setRole('staff');
                setUsername('staff');
                setPin('0000');
                setErrorMsg('');
              }}
            >
              Staff
            </div>
            <div
              className={`login-role-tab ${role === 'superadmin' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              onClick={() => {
                setRole('superadmin');
                setUsername('superadmin');
                setPin('9999');
                setErrorMsg('');
              }}
            >
              <span>🛡️</span>
              <span>Super Admin</span>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
            {role === 'superadmin' ? 'Super Admin Portal' : role === 'admin' ? 'Admin Login' : 'Staff Login'}
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
            {role === 'superadmin'
              ? 'Master administrator access to manage all SaaS dealer stores.'
              : `Enter your ${role} credentials to access this terminal.`}
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
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
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
              <span>&rarr; Login as {role === 'superadmin' ? 'Super Admin' : role}</span>
            </button>
          </form>

          {/* Quick Fill Demo Helper */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1, fontSize: '10.5px', padding: '6px 4px' }}
              onClick={() => { setRole('admin'); setUsername('admin'); setPin('1234'); }}
            >
              Admin (1234)
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1, fontSize: '10.5px', padding: '6px 4px' }}
              onClick={() => { setRole('staff'); setUsername('staff'); setPin('0000'); }}
            >
              Staff (0000)
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1.2, fontSize: '10.5px', padding: '6px 4px', borderColor: '#d97706', color: '#b45309', fontWeight: 700 }}
              onClick={() => { setRole('superadmin'); setUsername('superadmin'); setPin('9999'); }}
            >
              🛡️ Super (9999)
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setShowForgotModal(true)}
            >
              Forgot PIN? Reset on this device
            </button>
          </div>
        </div>
      </div>

      {/* Forgot PIN Modal */}
      {showForgotModal && (
        <div className="modal-overlay active">
          <div className="modal-dialog" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Device Security &bull; Reset PIN</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowForgotModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleResetSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Since this software is running on your authorized store terminal, you can reset the master {role} PIN here.
                </p>
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
                <button type="submit" className="btn btn-primary">Save New PIN</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
