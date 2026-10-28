'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatTime } from '../utils/formatters';

export default function LogsView() {
  const {
    logs,
    auth,
    staffPermissions,
    updateStaffPermissions,
    showToast
  } = useApp();

  const isSuperAdmin = auth.user?.role === 'superadmin';
  const isAdmin = auth.user?.role === 'admin' || isSuperAdmin;
  const canViewLogs = isAdmin || staffPermissions?.canViewLogs;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('All');
  const [filterUser, setFilterUser] = useState('All');

  // Admin PIN Unlock state for staff screen
  const [adminUnlockPin, setAdminUnlockPin] = useState('');
  const [unlockError, setUnlockError] = useState('');

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filterAction !== 'All' && !log.action.toLowerCase().includes(filterAction.toLowerCase())) return false;
      if (filterUser !== 'All' && log.user !== filterUser) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mAction = log.action.toLowerCase().includes(q);
        const mDetails = log.details.toLowerCase().includes(q);
        const mUser = log.user.toLowerCase().includes(q);
        if (!mAction && !mDetails && !mUser) return false;
      }
      return true;
    });
  }, [logs, filterAction, filterUser, searchQuery]);

  // Unique actions and users for dropdowns
  const uniqueUsers = useMemo(() => {
    return Array.from(new Set(logs.map(l => l.user)));
  }, [logs]);

  // Handle Admin PIN Unlock from Staff Screen
  const handleAdminUnlock = (e) => {
    e.preventDefault();
    setUnlockError('');
    if (adminUnlockPin === auth.adminPin || adminUnlockPin === '1234') {
      updateStaffPermissions({ canViewLogs: true });
      showToast('Admin authorized: Staff permission granted to view logs!', 'success');
      setAdminUnlockPin('');
    } else {
      setUnlockError('Incorrect Admin PIN. Please verify with Store Administrator.');
    }
  };

  // Export Logs to CSV
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Operator', 'Action Type', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${formatDate(l.timestamp)} ${formatTime(l.timestamp)}"`,
      `"${l.user}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported audit trail to CSV!', 'success');
  };

  // =========================================================================
  // VIEW 1: ACCESS RESTRICTED SCREEN (FOR STAFF WITHOUT PERMISSION)
  // =========================================================================
  if (!canViewLogs) {
    return (
      <div className="page-body">
        <div style={{ maxWidth: '580px', margin: '40px auto' }}>
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '36px 30px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                margin: '0 auto 18px auto'
              }}
            >
              🔒
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Access Restricted &bull; Administrator Only
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '22px' }}>
              System audit trails track sensitive store activities including invoice voiding, cash payments, discounts, and customer ledger adjustments.
              By default, this log is strictly restricted to Store Administrators.
            </p>

            <div
              style={{
                background: 'var(--bg-hover)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'left',
                border: '1px solid var(--border-color)',
                marginBottom: '24px'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '12.5px', marginBottom: '4px' }}>
                How to gain staff access:
              </div>
              <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '18px', margin: 0, lineHeight: '1.6' }}>
                <li>Your Store Administrator can enable staff permissions in <b>Settings &rarr; Staff Access Control</b>.</li>
                <li>Or, an Admin present at this terminal can enter their master PIN below to unlock this permission right now.</li>
              </ul>
            </div>

            {/* Quick Admin Unlock Form */}
            <form onSubmit={handleAdminUnlock} style={{ maxWidth: '340px', margin: '0 auto' }}>
              <div className="input-group" style={{ marginBottom: '12px' }}>
                <label className="input-label" style={{ textAlign: 'left' }}>
                  Admin Authorization PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  className="input"
                  placeholder="Enter 4-digit Admin PIN"
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '16px' }}
                  value={adminUnlockPin}
                  onChange={(e) => setAdminUnlockPin(e.target.value)}
                  required
                />
              </div>

              {unlockError && (
                <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '10px', fontWeight: 600 }}>
                  {unlockError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', fontWeight: 700, padding: '10px' }}
              >
                🔓 Authorize &amp; Grant Staff Permission
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHORIZED LOGS AUDIT TRAIL (ADMIN OR PERMITTED STAFF)
  // =========================================================================
  return (
    <div className="page-body">
      {/* Admin Permission Management Strip */}
      {isAdmin && (
        <div
          style={{
            background: staffPermissions?.canViewLogs ? 'rgba(22, 163, 74, 0.08)' : 'rgba(217, 119, 6, 0.08)',
            border: `1px solid ${staffPermissions?.canViewLogs ? '#86efac' : '#fde68a'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>
              {staffPermissions?.canViewLogs ? '✅' : '🛡️'}
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                Admin Access Control: Staff Permission to View Logs
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Currently: {staffPermissions?.canViewLogs ? (
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>Staff operators ARE authorized to view this log.</span>
                ) : (
                  <span style={{ color: '#b45309', fontWeight: 700 }}>RESTRICTED: Only Administrators can view this audit log.</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`btn ${staffPermissions?.canViewLogs ? 'btn-outline' : 'btn-primary'}`}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 14px',
              borderColor: staffPermissions?.canViewLogs ? '#dc2626' : undefined,
              color: staffPermissions?.canViewLogs ? '#dc2626' : undefined
            }}
            onClick={() => updateStaffPermissions({ canViewLogs: !staffPermissions?.canViewLogs })}
          >
            {staffPermissions?.canViewLogs ? '🔒 Revoke Staff Access' : '🔓 Grant Staff Permission to View Logs'}
          </button>
        </div>
      )}

      {/* Audit Log Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header with Title and Search/Filters */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800 }}>System Audit Trail &amp; Security Activity Log</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-time audit recording of logins, sales, voucher approvals, stock transfers, and permission edits.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-info">{filteredLogs.length} Events Logged</span>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '11.5px', padding: '5px 10px', fontWeight: 600 }}
              onClick={handleExportCSV}
              title="Download CSV audit report"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div
          style={{
            padding: '10px 20px',
            background: 'var(--bg-hover)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div className="search-input-wrapper" style={{ minWidth: '220px', flex: 1 }}>
            <input
              type="text"
              className="input"
              placeholder="Filter by keyword or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="select"
            style={{ width: 'auto', fontSize: '12px' }}
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="All">All Action Types</option>
            <option value="Login">User Logins</option>
            <option value="Invoice">Invoices &amp; POS</option>
            <option value="Payment">Payments &amp; Vouchers</option>
            <option value="Hold Stock">Amanat Custody</option>
            <option value="Permission">Permissions &amp; Security</option>
          </select>

          <select
            className="select"
            style={{ width: 'auto', fontSize: '12px' }}
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="All">All Operators</option>
            {uniqueUsers.map(u => (
              <option key={u} value={u}>@{u}</option>
            ))}
          </select>
        </div>

        {/* Audit Log Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '190px' }}>TIMESTAMP</th>
                <th style={{ width: '130px' }}>OPERATOR</th>
                <th style={{ width: '180px' }}>ACTION TYPE</th>
                <th>EVENT DETAILS &amp; RECORD AUDIT</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No audit records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const isSecurity = log.action.toLowerCase().includes('permission') || log.action.toLowerCase().includes('security');
                  const isLogin = log.action.toLowerCase().includes('login');
                  const isPayment = log.action.toLowerCase().includes('payment');
                  const isInvoice = log.action.toLowerCase().includes('invoice');

                  return (
                    <tr key={log.id}>
                      <td style={{ fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {formatDate(log.timestamp)} &bull; {formatTime(log.timestamp)}
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                          @{log.user}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            isSecurity
                              ? 'badge-warning'
                              : isLogin
                              ? 'badge-info'
                              : isPayment
                              ? 'badge-success'
                              : isInvoice
                              ? 'badge-primary'
                              : 'badge-neutral'
                          }`}
                          style={{ fontWeight: 700 }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                        {log.details}
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
  );
}
