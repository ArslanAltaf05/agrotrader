'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function DownloadAppModal({ isOpen, onClose }) {
  const { storeProfile } = useApp();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', width: '100%', padding: '0', overflow: 'hidden' }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091325 0%, #1e3a8a 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px'
              }}
            >
              🚀
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                Download AgroTrader Pro ERP Software
              </h3>
              <p style={{ fontSize: '12px', opacity: 0.85, margin: '2px 0 0 0' }}>
                Offline Desktop ERP for Windows &amp; Mobile POS App for Android
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-icon-only"
            style={{ color: '#fff', background: 'rgba(255,255,255,0.15)', border: 'none' }}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '78vh', overflowY: 'auto' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Choose your device platform to download the dedicated native client. All clients sync with your store&apos;s cloud database in real-time.
          </div>

          {/* 2 Platform Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Windows Desktop .EXE Card */}
            <div
              style={{
                border: '2px solid #3b82f6',
                borderRadius: '10px',
                padding: '20px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.08)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '28px' }}>💻</div>
                  <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                    Windows 64-bit
                  </span>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0' }}>
                  AgroTrader Desktop ERP
                </h4>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Version 2.0.0 &bull; Standalone Setup (36 MB)
                </div>

                <ul style={{ fontSize: '12px', paddingLeft: '18px', margin: '0 0 16px 0', color: 'var(--text-color)', lineHeight: '1.6' }}>
                  <li><b>100% Offline Support</b>: Works without internet</li>
                  <li><b>Thermal Printer Driver</b>: 80mm &amp; 58mm ESC/POS</li>
                  <li><b>Hardware Barcode Scanner</b>: USB &amp; Bluetooth</li>
                  <li><b>Background Cloud Sync</b>: Auto-replicates to cloud</li>
                  <li><b>Local SQLite DB</b>: High-speed counter checkout</li>
                </ul>
              </div>

              <div>
                <a
                  href="/downloads/AgroTrader_Setup_v2.0.exe"
                  download="AgroTrader_Setup_v2.0.exe"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    textDecoration: 'none'
                  }}
                >
                  <span>⬇️</span>
                  <span>Download .EXE for Windows</span>
                </a>
                <div style={{ textAlign: 'center', fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Compatible with Windows 10 &amp; 11
                </div>
              </div>
            </div>

            {/* Android Mobile .APK Card */}
            <div
              style={{
                border: '2px solid #16a34a',
                borderRadius: '10px',
                padding: '20px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '28px' }}>📱</div>
                  <span className="badge badge-success" style={{ fontSize: '11px' }}>
                    Android Mobile
                  </span>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0' }}>
                  AgroTrader Mobile POS
                </h4>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Version 2.0.0 &bull; Native Android APK (4.3 MB)
                </div>

                <ul style={{ fontSize: '12px', paddingLeft: '18px', margin: '0 0 16px 0', color: 'var(--text-color)', lineHeight: '1.6' }}>
                  <li><b>Camera Barcode Scanner</b>: Scan crop inputs</li>
                  <li><b>WhatsApp Billing</b>: Send invoice directly</li>
                  <li><b>Field Khata Recovery</b>: On-the-go recovery</li>
                  <li><b>Bluetooth Thermal Printer</b>: Mobile printing</li>
                  <li><b>Touch-Friendly Mobile UI</b>: Fast counter billing</li>
                </ul>
              </div>

              <div>
                <a
                  href="/downloads/AgroTrader_v2.0.apk"
                  download="AgroTrader_v2.0.apk"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    background: '#16a34a'
                  }}
                >
                  <span>📱</span>
                  <span>Download .APK for Android</span>
                </a>
                <div style={{ textAlign: 'center', fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Compatible with Android 8.0 to 15+
                </div>
              </div>
            </div>
          </div>

          {/* Setup / Installation Instructions */}
          <div style={{ background: 'var(--bg-subtle, #f8fafc)', borderRadius: '8px', padding: '16px', border: '1px solid var(--border-color)' }}>
            <h5 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px 0' }}>
              Quick Installation Instructions:
            </h5>
            <ol style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><b>Windows:</b> Click &quot;Download .EXE&quot;, run <code>AgroTrader_Setup_v2.0.exe</code>, and follow the on-screen installer wizard. A desktop shortcut will be placed automatically.</li>
              <li><b>Android:</b> Download <code>AgroTrader_v2.0.apk</code> directly on your phone or tablet. Allow &quot;Install from unknown sources&quot; when prompted and tap Install.</li>
              <li><b>Cloud Sync:</b> Upon launch, enter your Store Credentials or PIN ({storeProfile.name}) to link the device to your live cloud database.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
