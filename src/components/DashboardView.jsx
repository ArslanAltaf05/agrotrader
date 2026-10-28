'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { icons } from '../utils/icons';
import { formatCurrency, formatNumber, formatDateShort } from '../utils/formatters';

export default function DashboardView({ onOpenNewSale, onOpenInvoiceView }) {
  const {
    metrics,
    hideAmounts,
    sales,
    products,
    customers,
    suppliers,
    holdStock,
    tempLedger,
    payments,
    setActiveTab,
    activeBranchId
  } = useApp();

  // Controls & Filters
  const [chartMode, setChartMode] = useState('sales'); // 'sales' | 'profit'
  const [timeframe, setTimeframe] = useState('week'); // 'week' | 'month' | 'year'
  const [dateFilter, setDateFilter] = useState('today'); // 'today' | 'yesterday' | 'week' | 'month' | 'all' | 'custom'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [recentSearch, setRecentSearch] = useState('');
  const [recentPaymentFilter, setRecentPaymentFilter] = useState('all'); // 'all' | 'cash' | 'ledger'

  const todayStr = new Date().toISOString().split('T')[0];

  // Step date forward/backward
  const stepDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const newDateStr = d.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    setDateFilter('custom');
  };

  const handleDateFilterSelect = (filterKey) => {
    setDateFilter(filterKey);
    if (filterKey === 'today') {
      setSelectedDate(todayStr);
    } else if (filterKey === 'yesterday') {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      setSelectedDate(y.toISOString().split('T')[0]);
    }
  };

  // Branch-specific sales and payments
  const branchSales = useMemo(() => {
    return sales.filter(s => !s.branchId || s.branchId === activeBranchId);
  }, [sales, activeBranchId]);

  const branchPayments = useMemo(() => {
    return payments.filter(p => !p.branchId || p.branchId === activeBranchId);
  }, [payments, activeBranchId]);

  // Operational Khata & Custody Summaries
  const totalFarmerBalance = useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0);
  }, [customers]);

  const totalSupplierBalance = useMemo(() => {
    return suppliers.reduce((sum, s) => sum + (s.balance > 0 ? s.balance : 0), 0);
  }, [suppliers]);

  const totalHeldBags = useMemo(() => {
    return holdStock.reduce((sum, h) => sum + (h.remainingBags || 0), 0);
  }, [holdStock]);

  const pendingTempCount = useMemo(() => {
    return tempLedger.filter(t => t.status === 'Pending').length;
  }, [tempLedger]);

  const pendingTempAmount = useMemo(() => {
    return tempLedger.filter(t => t.status === 'Pending').reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [tempLedger]);

  // Dynamic calculation for the selected period / date
  const periodSales = useMemo(() => {
    const now = new Date();
    return branchSales.filter(sale => {
      const sDateStr = sale.date.split('T')[0];
      const sDate = new Date(sale.date);

      if (dateFilter === 'today') return sDateStr === todayStr;
      if (dateFilter === 'yesterday') {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        return sDateStr === y.toISOString().split('T')[0];
      }
      if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        return sDate >= weekAgo;
      }
      if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 86400000);
        return sDate >= monthAgo;
      }
      if (dateFilter === 'all') return true;
      if (dateFilter === 'custom') return sDateStr === selectedDate;
      return true;
    });
  }, [branchSales, dateFilter, selectedDate, todayStr]);

  const periodCashSales = useMemo(() => {
    return periodSales
      .filter(s => s.paymentType === 'cash')
      .reduce((sum, s) => sum + (s.paidAmount || 0), 0);
  }, [periodSales]);

  const periodCashCount = useMemo(() => {
    return periodSales.filter(s => s.paymentType === 'cash').length;
  }, [periodSales]);

  const periodLedgerSales = useMemo(() => {
    return periodSales
      .filter(s => s.paymentType === 'ledger' || s.balanceAmount > 0)
      .reduce((sum, s) => sum + (s.balanceAmount || 0), 0);
  }, [periodSales]);

  const periodLedgerCount = useMemo(() => {
    return periodSales.filter(s => s.paymentType === 'ledger' || s.balanceAmount > 0).length;
  }, [periodSales]);

  // Dynamic Chart Generation
  const chartData = useMemo(() => {
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const calculateGrossProfit = (saleList) => {
      return saleList.reduce((sum, s) => {
        const saleProfit = (s.items || []).reduce((itemSum, item) => {
          const prod = products.find(p => p.id === item.productId);
          const cost = prod ? prod.costPrice : (item.price * 0.85);
          return itemSum + Math.max(0, (item.price - cost) * (item.qty || 1));
        }, 0);
        return sum + Math.max(0, saleProfit - (s.discount || 0));
      }, 0);
    };

    if (timeframe === 'week') {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const daySales = branchSales.filter(s => s.date.startsWith(dStr));
        const salesTotal = daySales.reduce((s, it) => s + (it.grandTotal || 0), 0);
        const profitTotal = calculateGrossProfit(daySales);

        days.push({
          label: dayNames[d.getDay()],
          dateLabel: `${d.getDate()} ${monthNames[d.getMonth()]}`,
          dateStr: dStr,
          sales: salesTotal,
          profit: profitTotal,
          invoicesCount: daySales.length,
          isCurrent: dStr === todayStr,
          isSelected: dStr === selectedDate
        });
      }
      return days;
    } else if (timeframe === 'month') {
      const curYear = now.getFullYear();
      const curMonth = now.getMonth();
      const periods = [
        { label: 'W1', sub: `1-7 ${monthNames[curMonth]}`, start: 1, end: 7 },
        { label: 'W2', sub: `8-14 ${monthNames[curMonth]}`, start: 8, end: 14 },
        { label: 'W3', sub: `15-21 ${monthNames[curMonth]}`, start: 15, end: 21 },
        { label: 'W4', sub: `22-31 ${monthNames[curMonth]}`, start: 22, end: 31 }
      ];

      return periods.map(p => {
        const blockSales = branchSales.filter(s => {
          const d = new Date(s.date);
          return d.getFullYear() === curYear && d.getMonth() === curMonth && d.getDate() >= p.start && d.getDate() <= p.end;
        });
        const salesTotal = blockSales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
        const profitTotal = calculateGrossProfit(blockSales);
        const isCur = now.getDate() >= p.start && now.getDate() <= p.end;

        return {
          label: p.label,
          dateLabel: p.sub,
          sales: salesTotal,
          profit: profitTotal,
          invoicesCount: blockSales.length,
          isCurrent: isCur,
          isSelected: false
        };
      });
    } else {
      // Year: 12 months
      const curYear = now.getFullYear();
      return monthNames.map((m, idx) => {
        const mSales = branchSales.filter(s => {
          const d = new Date(s.date);
          return d.getFullYear() === curYear && d.getMonth() === idx;
        });
        const salesTotal = mSales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
        const profitTotal = calculateGrossProfit(mSales);

        return {
          label: m,
          dateLabel: `${curYear}`,
          sales: salesTotal,
          profit: profitTotal,
          invoicesCount: mSales.length,
          isCurrent: now.getMonth() === idx,
          isSelected: false
        };
      });
    }
  }, [branchSales, products, timeframe, todayStr, selectedDate]);

  // Max value for bar scaling
  const maxChartVal = useMemo(() => {
    const vals = chartData.map(d => chartMode === 'sales' ? d.sales : d.profit);
    return Math.max(...vals, 50000);
  }, [chartData, chartMode]);

  const totalChartSales = useMemo(() => chartData.reduce((s, d) => s + d.sales, 0), [chartData]);
  const totalChartProfit = useMemo(() => chartData.reduce((s, d) => s + d.profit, 0), [chartData]);
  const totalChartInvoices = useMemo(() => chartData.reduce((s, d) => s + d.invoicesCount, 0), [chartData]);

  // Filtered recent sales table
  const filteredSalesList = useMemo(() => {
    let list = periodSales;

    if (recentPaymentFilter !== 'all') {
      list = list.filter(s => s.paymentType === recentPaymentFilter);
    }

    if (recentSearch.trim()) {
      const q = recentSearch.toLowerCase();
      list = list.filter(s =>
        s.customerName?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q) ||
        s.items?.some(i => i.name?.toLowerCase().includes(q))
      );
    }

    return list.slice(0, 50);
  }, [periodSales, recentPaymentFilter, recentSearch]);

  const periodLabelText = {
    today: "Today's",
    yesterday: "Yesterday's",
    week: "Last 7 Days'",
    month: "Last 30 Days'",
    all: "All Time",
    custom: formatDateShort(selectedDate)
  }[dateFilter];

  return (
    <div className="page-body">
      {/* Dynamic Date Filter & Period Control Bar */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          marginBottom: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
            📊 Filter Period:
          </span>
          <div className="segmented-control">
            {[
              { key: 'today', label: 'Today' },
              { key: 'yesterday', label: 'Yesterday' },
              { key: 'week', label: 'Last 7 Days' },
              { key: 'month', label: 'This Month' },
              { key: 'all', label: 'All Time' }
            ].map(item => (
              <button
                key={item.key}
                type="button"
                className={`segmented-btn ${dateFilter === item.key ? 'active' : ''}`}
                onClick={() => handleDateFilterSelect(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Day Stepper & Date Picker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 4px'
            }}
          >
            <button
              type="button"
              style={{ border: 'none', background: 'transparent', padding: '4px 8px', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => stepDate(-1)}
              title="Previous Day"
            >
              &lsaquo;
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setDateFilter('custom');
              }}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
                padding: '2px 4px'
              }}
            />
            <button
              type="button"
              style={{ border: 'none', background: 'transparent', padding: '4px 8px', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => stepDate(1)}
              title="Next Day"
            >
              &rsaquo;
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenNewSale}
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            🛒 + New Sale (F1)
          </button>
        </div>
      </div>

      {/* 4 Main Dynamic KPI Cards */}
      <div className="kpi-grid">
        {/* Card 1: Cash Sale */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">{periodLabelText.toUpperCase()} CASH SALE</span>
            <span className="kpi-icon-pill" style={{ background: '#dcfce7', color: '#16a34a' }}>
              💵
            </span>
          </div>
          <div className="kpi-value" style={{ color: '#16a34a' }}>
            {formatCurrency(periodCashSales, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>&uarr;</span>
            <span>{periodCashCount} cash sale receipts ({periodLabelText})</span>
          </div>
        </div>

        {/* Card 2: Ledger Sale */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">{periodLabelText.toUpperCase()} LEDGER SALE</span>
            <span className="kpi-icon-pill" style={{ background: '#eff6ff', color: '#2563eb' }}>
              👥
            </span>
          </div>
          <div className="kpi-value" style={{ color: '#2563eb' }}>
            {formatCurrency(periodLedgerSales, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>&uarr;</span>
            <span>{periodLedgerCount} ledger invoices ({periodLabelText})</span>
          </div>
        </div>

        {/* Card 3: Live Cash in Hand */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">LIVE CASH IN HAND</span>
            <span className="kpi-icon-pill" style={{ background: '#f3e8ff', color: '#9333ea' }}>
              👛
            </span>
          </div>
          <div className="kpi-value" style={{ color: '#9333ea' }}>
            {formatCurrency(metrics.cashInHand, hideAmounts)}
          </div>
          <div className="kpi-subtext">
            <span>&uarr;</span>
            <span>{metrics.cashTransactionsToday} cash register movements today</span>
          </div>
        </div>

        {/* Card 4: Products In Stock */}
        <div
          className="kpi-card"
          onClick={() => setActiveTab('inventory')}
          style={{ cursor: 'pointer' }}
          title="Click to view Stock & Inventory"
        >
          <div className="kpi-header">
            <span className="kpi-title">PRODUCTS IN STOCK</span>
            <span className="kpi-icon-pill" style={{ background: '#fef3c7', color: '#d97706' }}>
              📦
            </span>
          </div>
          <div className="kpi-value">
            {formatNumber(metrics.totalStockUnits, hideAmounts)} / {metrics.totalProducts}
          </div>
          <div className="kpi-subtext" style={{ color: metrics.lowStockCount > 0 ? '#ef4444' : undefined }}>
            <span>{metrics.lowStockCount} items low/out of stock attention</span>
          </div>
        </div>
      </div>

      {/* Operational Khata & Amanat Dynamic Badges Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div
          className="card"
          onClick={() => setActiveTab('accounts')}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            borderLeft: '4px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease'
          }}
          title="Click to view Farmer Khata"
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              🌾 Farmer Khata Receivables
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>
              {formatCurrency(totalFarmerBalance, hideAmounts)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Outstanding recovery</div>
          </div>
          <span style={{ fontSize: '20px' }}>&rsaquo;</span>
        </div>

        <div
          className="card"
          onClick={() => setActiveTab('accounts')}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            borderLeft: '4px solid #d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease'
          }}
          title="Click to view Supplier Payables"
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              🏭 Company Payables
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
              {formatCurrency(totalSupplierBalance, hideAmounts)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due to FFC, Engro, etc.</div>
          </div>
          <span style={{ fontSize: '20px' }}>&rsaquo;</span>
        </div>

        <div
          className="card"
          onClick={() => setActiveTab('holdStock')}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            borderLeft: '4px solid #0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease'
          }}
          title="Click to view Amanat Held Stock"
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              📦 Amanat Custody Held
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
              {totalHeldBags.toLocaleString()} Bags
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Held for farmers in godown</div>
          </div>
          <span style={{ fontSize: '20px' }}>&rsaquo;</span>
        </div>

        <div
          className="card"
          onClick={() => setActiveTab('tempLedger')}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            borderLeft: '4px solid #7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease'
          }}
          title="Click to audit Katcha Khata"
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              📝 Scratchpad Temp Khata
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>
              {pendingTempCount} Pending ({formatCurrency(pendingTempAmount, hideAmounts)})
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Awaiting ledger posting</div>
          </div>
          <span style={{ fontSize: '20px' }}>&rsaquo;</span>
        </div>
      </div>

      {/* Grid: Live Dynamic Sales Overview Chart (Left) & Filtered Sales Table (Right) */}
      <div className="dashboard-grid">
        {/* Sales Overview Chart Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <span dangerouslySetInnerHTML={{ __html: icons.reports }} />
                <span>Sales &amp; Profit Performance</span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {chartMode === 'sales' ? 'Revenue Breakdown' : 'Net Gross Profit Analysis'} &bull; Total: {formatCurrency(chartMode === 'sales' ? totalChartSales : totalChartProfit, hideAmounts)} ({totalChartInvoices} Invoices)
              </p>
            </div>

            <div className="card-controls">
              {/* Sales vs Profit Toggle */}
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${chartMode === 'sales' ? 'active' : ''}`}
                  onClick={() => setChartMode('sales')}
                >
                  Sales (Rs)
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${chartMode === 'profit' ? 'active' : ''}`}
                  onClick={() => setChartMode('profit')}
                >
                  Profit (Rs)
                </button>
              </div>

              {/* Timeframe Toggle */}
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${timeframe === 'week' ? 'active' : ''}`}
                  onClick={() => setTimeframe('week')}
                >
                  7 Days
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${timeframe === 'month' ? 'active' : ''}`}
                  onClick={() => setTimeframe('month')}
                >
                  Month
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${timeframe === 'year' ? 'active' : ''}`}
                  onClick={() => setTimeframe('year')}
                >
                  Year
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Dynamic Chart Canvas */}
          <div style={{ padding: '16px 8px 8px 8px', height: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '190px', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              {chartData.map((d, idx) => {
                const val = chartMode === 'sales' ? d.sales : d.profit;
                const heightPct = Math.max(8, Math.min(100, Math.round((val / maxChartVal) * 100)));
                const isHighlighted = d.isCurrent || d.isSelected;

                return (
                  <div
                    key={idx}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}
                    onClick={() => {
                      if (d.dateStr) {
                        setSelectedDate(d.dateStr);
                        setDateFilter('custom');
                      }
                    }}
                  >
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {val > 0 ? (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val) : '-'}
                    </div>
                    <div
                      style={{
                        width: '80%',
                        maxWidth: '44px',
                        height: `${heightPct}%`,
                        background: isHighlighted
                          ? 'var(--primary)'
                          : val > 0 ? 'rgba(37, 99, 235, 0.45)' : 'var(--border-color)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isHighlighted ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      title={`${d.label} (${d.dateLabel || d.dateStr}):\nSales: ${formatCurrency(d.sales)}\nProfit: ${formatCurrency(d.profit)}\nInvoices: ${d.invoicesCount}\nClick to inspect sales on this date`}
                    />
                    <div
                      style={{
                        fontSize: '11px',
                        marginTop: '6px',
                        fontWeight: isHighlighted ? 700 : 500,
                        color: isHighlighted ? 'var(--primary)' : 'var(--text-muted)',
                        textAlign: 'center'
                      }}
                    >
                      {d.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend & Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div>
                <span>Period Gross Sales: <b>{formatCurrency(totalChartSales, hideAmounts)}</b></span>
                <span style={{ margin: '0 8px' }}>&bull;</span>
                <span>Gross Profit: <b style={{ color: '#16a34a' }}>{formatCurrency(totalChartProfit, hideAmounts)}</b></span>
              </div>
              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '2px', display: 'inline-block' }} />
                  Current / Selected
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '10px', height: '10px', background: 'rgba(37, 99, 235, 0.45)', borderRadius: '2px', display: 'inline-block' }} />
                  Past Days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Recent / Filtered Sales Table Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <span>🕒</span>
                <span>{periodLabelText} Sales ({filteredSalesList.length})</span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Total: {formatCurrency(periodSales.reduce((s, it) => s + (it.grandTotal || 0), 0), hideAmounts)}
              </p>
            </div>

            <div className="card-controls" style={{ flexWrap: 'wrap', gap: '6px' }}>
              {/* Payment Type Pill Filter */}
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${recentPaymentFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setRecentPaymentFilter('all')}
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${recentPaymentFilter === 'cash' ? 'active' : ''}`}
                  onClick={() => setRecentPaymentFilter('cash')}
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                >
                  Cash
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${recentPaymentFilter === 'ledger' ? 'active' : ''}`}
                  onClick={() => setRecentPaymentFilter('ledger')}
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                >
                  Ledger
                </button>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '11px', padding: '4px 8px' }}
                onClick={() => setActiveTab('sales')}
              >
                <span>View all</span>
              </button>
            </div>
          </div>

          {/* Quick Search inside Table */}
          <div style={{ padding: '0 16px 10px 16px' }}>
            <input
              type="text"
              className="input"
              placeholder="🔍 Filter transactions by customer or product..."
              value={recentSearch}
              onChange={(e) => setRecentSearch(e.target.value)}
              style={{ fontSize: '12px', padding: '6px 10px', height: '34px' }}
            />
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: '250px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>CUSTOMER &uarr;</th>
                  <th>TIME &uarr;</th>
                  <th>PRODUCT &uarr;</th>
                  <th>QTY &uarr;</th>
                  <th>AMOUNT &uarr;</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      <div>No sales transactions found for {periodLabelText.toLowerCase()}.</div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: '10px', fontSize: '12px', padding: '6px 14px' }}
                        onClick={onOpenNewSale}
                      >
                        🛒 + Start New Sale Now (F1)
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredSalesList.map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{sale.customerName}</div>
                        <span
                          className={`badge ${sale.paymentType === 'cash' ? 'badge-success' : 'badge-warning'}`}
                          style={{ fontSize: '9.5px', padding: '1px 5px', marginTop: '2px', textTransform: 'uppercase' }}
                        >
                          {sale.paymentType}
                        </span>
                      </td>
                      <td style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        <div>{new Date(sale.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div style={{ fontSize: '10px', opacity: 0.8 }}>{formatDateShort(sale.date)}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px' }}>
                          {sale.items[0]?.name || 'Agri inputs'}
                          {sale.items.length > 1 ? ` (+${sale.items.length - 1} more)` : ''}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">
                          {sale.items.reduce((s, i) => s + (i.qty || 0), 0)} {sale.items[0]?.unit || 'bags'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {formatCurrency(sale.grandTotal, hideAmounts)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline btn-icon-only"
                          title="View & Print Invoice Receipt"
                          onClick={() => onOpenInvoiceView && onOpenInvoiceView(sale)}
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
