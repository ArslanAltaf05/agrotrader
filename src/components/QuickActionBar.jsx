'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';

export default function QuickActionBar({ onOpenNewSale, onOpenParked, onOpenPaymentIn, onOpenPaymentOut, onOpenHoldStock, onOpenTempLedger }) {
  const { parkedSales, setActiveTab } = useApp();

  return (
    <div className="quick-action-bar">
      {/* New Sale Button */}
      <button
        type="button"
        className="btn-quick btn-quick-new-sale"
        onClick={onOpenNewSale}
      >
        <span dangerouslySetInnerHTML={{ __html: icons.newSale }} />
        <span>New Sale (F1)</span>
      </button>

      {/* Parked Sales */}
      <button
        type="button"
        className="btn-quick btn-quick-parked"
        onClick={onOpenParked}
      >
        <span dangerouslySetInnerHTML={{ __html: icons.parked }} />
        <span>Parked {parkedSales.length > 0 ? `(${parkedSales.length})` : ''}</span>
      </button>

      {/* Payment In */}
      <button
        type="button"
        className="btn-quick btn-quick-pay-in"
        onClick={onOpenPaymentIn}
      >
        <span dangerouslySetInnerHTML={{ __html: icons.paymentIn }} />
        <span>Payment In</span>
      </button>

      {/* Payment Out */}
      <button
        type="button"
        className="btn-quick btn-quick-pay-out"
        onClick={onOpenPaymentOut}
      >
        <span dangerouslySetInnerHTML={{ __html: icons.paymentOut }} />
        <span>Payment Out</span>
      </button>

      {/* Hold Customer Stock */}
      <button
        type="button"
        className="btn-quick btn-quick-hold"
        onClick={onOpenHoldStock || (() => setActiveTab('holdStock'))}
      >
        <span dangerouslySetInnerHTML={{ __html: icons.holdStock }} />
        <span>Hold Customer Stock</span>
      </button>

      {/* Temp Ledger */}
      <button
        type="button"
        className="btn-quick btn-quick-temp"
        onClick={onOpenTempLedger || (() => setActiveTab('tempLedger'))}
      >
        <span dangerouslySetInnerHTML={{ __html: icons.tempLedger }} />
        <span>Temp Ledger</span>
      </button>
    </div>
  );
}
