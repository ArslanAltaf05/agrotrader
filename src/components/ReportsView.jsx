'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatNumber, formatDate, formatDateShort } from '../utils/formatters';
import { icons } from '../utils/icons';

export default function ReportsView() {
  const { sales, products, customers, suppliers, purchases, payments, holdStock, hideAmounts, metrics, storeProfile, activeBranchId, branches } = useApp();

  // Active Report Section
  const [reportTab, setReportTab] = useState('financial'); // 'financial' | 'products' | 'khata_aging' | 'stock_audit' | 'suppliers'
  
  // Date Filtering
  const [dateFilter, setDateFilter] = useState('all'); // 'today' | 'week' | 'month' | 'year' | 'all' | 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Table Search and Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('revenue');
  const [sortOrder, setSortOrder] = useState('desc');

  const currentBranch = branches.find(b => b.id === activeBranchId) || branches[0];

  // Filter sales by date
  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const saleDateStr = sale.date.split('T')[0];

      if (dateFilter === 'today') {
        return saleDateStr === todayStr;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return saleDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return saleDate >= monthAgo;
      } else if (dateFilter === 'year') {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return saleDate >= yearAgo;
      } else if (dateFilter === 'custom') {
        if (customStartDate && saleDateStr < customStartDate) return false;
        if (customEndDate && saleDateStr > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [sales, dateFilter, customStartDate, customEndDate]);

  // Financial Calculations
  const financialMetrics = useMemo(() => {
    let totalRevenue = 0;
    let totalCOGS = 0; // Cost of goods sold
    let totalDiscount = 0;
    let cashSalesTotal = 0;
    let ledgerSalesTotal = 0;
    let totalBagsSold = 0;

    filteredSales.forEach(sale => {
      totalRevenue += sale.grandTotal || 0;
      totalDiscount += sale.discount || 0;
      if (sale.paymentType === 'cash') {
        cashSalesTotal += sale.paidAmount || 0;
      } else {
        ledgerSalesTotal += sale.balanceAmount || 0;
        cashSalesTotal += sale.paidAmount || 0;
      }

      sale.items.forEach(item => {
        totalBagsSold += item.qty || 0;
        const prod = products.find(p => p.id === item.productId);
        const unitCost = prod ? prod.costPrice : (item.price * 0.9);
        totalCOGS += (item.qty * unitCost);
      });
    });

    const grossProfit = Math.max(0, totalRevenue - totalCOGS);
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';

    return {
      totalRevenue,
      totalCOGS,
      totalDiscount,
      grossProfit,
      profitMargin,
      cashSalesTotal,
      ledgerSalesTotal,
      totalBagsSold,
      invoiceCount: filteredSales.length
    };
  }, [filteredSales, products]);

  // Category breakdown
  const categoryAnalysis = useMemo(() => {
    const cats = {};
    products.forEach(p => {
      if (!cats[p.category]) {
        cats[p.category] = { category: p.category, productCount: 0, shopStock: 0, storeStock: 0, costValue: 0, retailValue: 0, salesRevenue: 0 };
      }
      const totalUnits = (p.shopStock || 0) + (p.storeStock || 0);
      cats[p.category].productCount += 1;
      cats[p.category].shopStock += (p.shopStock || 0);
      cats[p.category].storeStock += (p.storeStock || 0);
      cats[p.category].costValue += (totalUnits * (p.costPrice || 0));
      cats[p.category].retailValue += (totalUnits * (p.salePrice || 0));
    });

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.category || 'Fertilizers';
        if (cats[cat]) {
          cats[cat].salesRevenue += item.total || 0;
        }
      });
    });

    return Object.values(cats);
  }, [products, filteredSales]);

  // Product sales velocity
  const productVelocity = useMemo(() => {
    const map = {};
    products.forEach(p => {
      map[p.id] = {
        id: p.id,
        name: p.name,
        category: p.category,
        manufacturer: p.manufacturer,
        unit: p.unit,
        costPrice: p.costPrice,
        salePrice: p.salePrice,
        currentStock: (p.shopStock || 0) + (p.storeStock || 0),
        unitsSold: 0,
        revenue: 0,
        profit: 0
      };
    });

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (map[item.productId]) {
          map[item.productId].unitsSold += item.qty;
          map[item.productId].revenue += item.total;
          const cost = map[item.productId].costPrice;
          map[item.productId].profit += (item.total - (item.qty * cost));
        }
      });
    });

    let list = Object.values(map);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.manufacturer?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA - valB) : (valB - valA);
    });

    return list;
  }, [products, filteredSales, searchQuery, sortField, sortOrder]);

  // Farmer Khata Aging
  const customerAgingData = useMemo(() => {
    let list = customers.map(c => {
      const custSales = sales.filter(s => s.customerId === c.id);
      const lastSale = custSales.length > 0 ? custSales[0].date : null;
      let daysOverdue = 0;
      if (lastSale) {
        const diffMs = new Date().getTime() - new Date(lastSale).getTime();
        daysOverdue = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      let bucket = 'Current (0-30 Days)';
      let urgencyColor = '#10b981';
      if (daysOverdue > 60) {
        bucket = 'Overdue (60+ Days)';
        urgencyColor = '#ef4444';
      } else if (daysOverdue > 30) {
        bucket = '31-60 Days (Harvest Due)';
        urgencyColor = '#f59e0b';
      }

      const creditUtilization = c.creditLimit > 0 ? Math.min(100, Math.round((c.balance / c.creditLimit) * 100)) : 0;

      return {
        ...c,
        lastSaleDate: lastSale,
        daysOverdue,
        bucket,
        urgencyColor,
        creditUtilization
      };
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.village?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      );
    }

    list.sort((a, b) => b.balance - a.balance);
    return list;
  }, [customers, sales, searchQuery]);

  // Total aging buckets
  const agingTotals = useMemo(() => {
    let current0_30 = 0;
    let mid31_60 = 0;
    let old60Plus = 0;
    customers.forEach(c => {
      if (c.balance > 0) {
        const custSales = sales.filter(s => s.customerId === c.id);
        const lastSale = custSales.length > 0 ? custSales[0].date : null;
        let days = 0;
        if (lastSale) {
          days = Math.floor((new Date().getTime() - new Date(lastSale).getTime()) / (1000 * 60 * 60 * 24));
        }
        if (days > 60) old60Plus += c.balance;
        else if (days > 30) mid31_60 += c.balance;
        else current0_30 += c.balance;
      }
    });
    return { current0_30, mid31_60, old60Plus };
  }, [customers, sales]);

  // Export to CSV handler
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let fileName = `Report_${reportTab}_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportTab === 'financial') {
      headers = ['Category', 'Product Count', 'Shop Stock Units', 'Store Stock Units', 'Cost Value (Rs)', 'Retail Value (Rs)', 'Sales Revenue (Rs)'];
      rows = categoryAnalysis.map(c => [
        `"${c.category}"`,
        c.productCount,
        c.shopStock,
        c.storeStock,
        c.costValue,
        c.retailValue,
        c.salesRevenue
      ]);
    } else if (reportTab === 'products') {
      headers = ['Product Name', 'Category', 'Manufacturer', 'Units Sold', 'Unit', 'Revenue (Rs)', 'Estimated Profit (Rs)', 'Current Stock Remaining'];
      rows = productVelocity.map(p => [
        `"${p.name}"`,
        `"${p.category}"`,
        `"${p.manufacturer}"`,
        p.unitsSold,
        `"${p.unit}"`,
        p.revenue,
        p.profit,
        p.currentStock
      ]);
    } else if (reportTab === 'khata_aging') {
      headers = ['Farmer Name', 'Village / Area', 'Phone', 'Credit Limit (Rs)', 'Outstanding Debit (Rs)', 'Utilization %', 'Aging Bucket', 'Last Activity Date'];
      rows = customerAgingData.map(c => [
        `"${c.name}"`,
        `"${c.village || 'Local'}"`,
        `"${c.phone}"`,
        c.creditLimit,
        c.balance,
        `${c.creditUtilization}%`,
        `"${c.bucket}"`,
        c.lastSaleDate ? formatDateShort(c.lastSaleDate) : 'No recent sale'
      ]);
    } else {
      headers = ['Product Name', 'Category', 'Trade Cost (Rs)', 'Sale Price (Rs)', 'Shop Stock', 'Godown Stock', 'Total Units', 'Inventory Cost Value (Rs)', 'Status'];
      rows = products.map(p => {
        const total = (p.shopStock || 0) + (p.storeStock || 0);
        return [
          `"${p.name}"`,
          `"${p.category}"`,
          p.costPrice,
          p.salePrice,
          p.shopStock || 0,
          p.storeStock || 0,
          total,
          total * p.costPrice,
          total === 0 ? 'Out of Stock' : (total <= p.alertQty ? 'Low Stock' : 'Optimal Stock')
        ];
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-body">
      {/* Top Header Card: Title, Branch Badge & Action Controls */}
      <div className="card" style={{ marginBottom: '18px', padding: '16px 20px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '22px' }}>📊</span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                Executive Intelligence & Agriculture Business Reports
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Branch: <b>{currentBranch.name}</b> &bull; Audited data for Khata recovery, fertilizer inventory velocity, and net margins.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleExportCSV}
              style={{ fontSize: '12.5px', padding: '7px 14px' }}
            >
              📥 Export to Excel / CSV
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.print()}
              style={{ fontSize: '12.5px', padding: '7px 16px' }}
            >
              🖨️ Print Formatted Statement
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          {/* Main Tab Navigation with Icons */}
          <div className="segmented-control" style={{ background: 'var(--bg-hover)', padding: '3px' }}>
            <button
              type="button"
              className={`segmented-btn ${reportTab === 'financial' ? 'active' : ''}`}
              onClick={() => { setReportTab('financial'); setSearchQuery(''); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>💰</span>
              <span>P&amp;L Financials</span>
            </button>
            <button
              type="button"
              className={`segmented-btn ${reportTab === 'products' ? 'active' : ''}`}
              onClick={() => { setReportTab('products'); setSearchQuery(''); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>🔥</span>
              <span>Product Velocity</span>
            </button>
            <button
              type="button"
              className={`segmented-btn ${reportTab === 'khata_aging' ? 'active' : ''}`}
              onClick={() => { setReportTab('khata_aging'); setSearchQuery(''); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>👥</span>
              <span>Farmer Khata Aging</span>
            </button>
            <button
              type="button"
              className={`segmented-btn ${reportTab === 'stock_audit' ? 'active' : ''}`}
              onClick={() => { setReportTab('stock_audit'); setSearchQuery(''); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📦</span>
              <span>Godown Stock Audit</span>
            </button>
            <button
              type="button"
              className={`segmented-btn ${reportTab === 'suppliers' ? 'active' : ''}`}
              onClick={() => { setReportTab('suppliers'); setSearchQuery(''); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>🏢</span>
              <span>Company Payables</span>
            </button>
          </div>

          {/* Date Period Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Period:</span>
            <div className="segmented-control">
              <button type="button" className={`segmented-btn ${dateFilter === 'today' ? 'active' : ''}`} onClick={() => setDateFilter('today')}>Today</button>
              <button type="button" className={`segmented-btn ${dateFilter === 'week' ? 'active' : ''}`} onClick={() => setDateFilter('week')}>7 Days</button>
              <button type="button" className={`segmented-btn ${dateFilter === 'month' ? 'active' : ''}`} onClick={() => setDateFilter('month')}>30 Days</button>
              <button type="button" className={`segmented-btn ${dateFilter === 'year' ? 'active' : ''}`} onClick={() => setDateFilter('year')}>Fiscal Year</button>
              <button type="button" className={`segmented-btn ${dateFilter === 'all' ? 'active' : ''}`} onClick={() => setDateFilter('all')}>All Time</button>
              <button type="button" className={`segmented-btn ${dateFilter === 'custom' ? 'active' : ''}`} onClick={() => setDateFilter('custom')}>Custom</button>
            </div>
          </div>
        </div>

        {/* Custom Date Range Picker if Custom selected */}
        {dateFilter === 'custom' && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px', background: 'var(--bg-hover)', padding: '10px 14px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>From:</label>
              <input type="date" className="input" style={{ width: 'auto', padding: '4px 8px' }} value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>To:</label>
              <input type="date" className="input" style={{ width: 'auto', padding: '4px 8px' }} value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          TAB 1: FINANCIAL P&L & SALES PERFORMANCE
          ========================================================================= */}
      {reportTab === 'financial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive KPI Cards */}
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {/* Total Revenue */}
            <div className="kpi-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div className="kpi-header">
                <span className="kpi-title">GROSS SALES REVENUE</span>
                <span className="kpi-icon-pill" style={{ background: '#eff6ff', color: 'var(--primary)' }}>💵</span>
              </div>
              <div className="kpi-value" style={{ color: 'var(--primary)' }}>
                {formatCurrency(financialMetrics.totalRevenue, hideAmounts)}
              </div>
              <div className="kpi-subtext">
                <span>{financialMetrics.invoiceCount} invoices &bull; {financialMetrics.totalBagsSold} units sold</span>
              </div>
            </div>

            {/* Cost of Goods Sold */}
            <div className="kpi-card" style={{ borderLeft: '4px solid #64748b' }}>
              <div className="kpi-header">
                <span className="kpi-title">COST OF GOODS SOLD (COGS)</span>
                <span className="kpi-icon-pill" style={{ background: '#f1f5f9', color: '#475569' }}>🏷️</span>
              </div>
              <div className="kpi-value">
                {formatCurrency(financialMetrics.totalCOGS, hideAmounts)}
              </div>
              <div className="kpi-subtext">
                <span>Cost basis of delivered products</span>
              </div>
            </div>

            {/* Net Realized Profit */}
            <div className="kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="kpi-header">
                <span className="kpi-title">REALIZED GROSS PROFIT</span>
                <span className="kpi-icon-pill" style={{ background: '#ecfdf5', color: '#059669' }}>📈</span>
              </div>
              <div className="kpi-value" style={{ color: '#059669' }}>
                {formatCurrency(financialMetrics.grossProfit, hideAmounts)}
              </div>
              <div className="kpi-subtext">
                <span style={{ fontWeight: 700, color: '#059669' }}>{financialMetrics.profitMargin}% Profit Margin</span>
              </div>
            </div>

            {/* Cash vs Ledger Split */}
            <div className="kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="kpi-header">
                <span className="kpi-title">CASH VS UDHAAR SPLIT</span>
                <span className="kpi-icon-pill" style={{ background: '#fffbeb', color: '#d97706' }}>⚖️</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Cash Collected:</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(financialMetrics.cashSalesTotal, hideAmounts)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>Added to Khata:</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(financialMetrics.ledgerSalesTotal, hideAmounts)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Financial Breakdown Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Category-Wise Revenue &amp; Stock Value Breakdown</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Analysis across Fertilizers, Pesticides, Seeds, and Micronutrients</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>CATEGORY NAME</th>
                    <th>PRODUCT VARIETIES</th>
                    <th>SHOP STOCK</th>
                    <th>GODOWN STORE STOCK</th>
                    <th>TOTAL STOCK VALUE (COST)</th>
                    <th>TOTAL RETAIL VALUE</th>
                    <th>SALES REVENUE (PERIOD)</th>
                    <th style={{ textAlign: 'right' }}>POTENTIAL YIELD</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryAnalysis.map(cat => {
                    const potentialMargin = Math.max(0, cat.retailValue - cat.costValue);
                    const pct = cat.costValue > 0 ? ((potentialMargin / cat.costValue) * 100).toFixed(1) : 0;
                    return (
                      <tr key={cat.category}>
                        <td style={{ fontWeight: 700, fontSize: '13.5px' }}>{cat.category}</td>
                        <td><span className="badge badge-neutral">{cat.productCount} SKUs</span></td>
                        <td>{formatNumber(cat.shopStock, hideAmounts)}</td>
                        <td>{formatNumber(cat.storeStock, hideAmounts)}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(cat.costValue, hideAmounts)}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(cat.retailValue, hideAmounts)}</td>
                        <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                          {formatCurrency(cat.salesRevenue, hideAmounts)}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                          +{formatCurrency(potentialMargin, hideAmounts)} ({pct}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg-hover)', fontWeight: 800 }}>
                    <td>TOTAL OVERVIEW</td>
                    <td>{products.length} SKUs</td>
                    <td>{formatNumber(categoryAnalysis.reduce((s, c) => s + c.shopStock, 0), hideAmounts)}</td>
                    <td>{formatNumber(categoryAnalysis.reduce((s, c) => s + c.storeStock, 0), hideAmounts)}</td>
                    <td>{formatCurrency(categoryAnalysis.reduce((s, c) => s + c.costValue, 0), hideAmounts)}</td>
                    <td>{formatCurrency(categoryAnalysis.reduce((s, c) => s + c.retailValue, 0), hideAmounts)}</td>
                    <td style={{ color: 'var(--primary)' }}>{formatCurrency(categoryAnalysis.reduce((s, c) => s + c.salesRevenue, 0), hideAmounts)}</td>
                    <td style={{ textAlign: 'right', color: '#16a34a' }}>
                      +{formatCurrency(categoryAnalysis.reduce((s, c) => s + Math.max(0, c.retailValue - c.costValue), 0), hideAmounts)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PRODUCT SALES VELOCITY & PROFITABILITY
          ========================================================================= */}
      {reportTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search and Sort Toolbar */}
          <div className="filter-bar">
            <div className="search-input-wrapper" style={{ maxWidth: '340px' }}>
              <input
                type="text"
                className="input"
                placeholder="Search product, manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Sort By:</span>
              <select
                className="select"
                style={{ width: 'auto', fontSize: '12px', padding: '6px 10px' }}
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="revenue">Highest Sales Revenue</option>
                <option value="unitsSold">Units / Bags Sold</option>
                <option value="profit">Net Profit Generated</option>
                <option value="currentStock">Stock Remaining</option>
              </select>
              <button
                type="button"
                className="btn btn-outline btn-icon-only"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                title="Toggle Sort Order"
              >
                {sortOrder === 'asc' ? '▲' : '▼'}
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>RANK</th>
                    <th>PRODUCT NAME &amp; BRAND</th>
                    <th>CATEGORY</th>
                    <th style={{ textAlign: 'center' }}>UNITS SOLD</th>
                    <th style={{ textAlign: 'right' }}>COST PRICE</th>
                    <th style={{ textAlign: 'right' }}>SALE PRICE</th>
                    <th style={{ textAlign: 'right' }}>TOTAL REVENUE</th>
                    <th style={{ textAlign: 'right' }}>NET MARGIN</th>
                    <th style={{ textAlign: 'center' }}>STOCK IN HAND</th>
                    <th>VELOCITY STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {productVelocity.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No product sales recorded in the selected period.
                      </td>
                    </tr>
                  ) : (
                    productVelocity.map((p, idx) => {
                      const isHighVelocity = p.unitsSold >= 5;
                      const isLowStock = p.currentStock <= 15;
                      return (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 800, color: 'var(--text-muted)' }}>#{idx + 1}</td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{p.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.manufacturer}</div>
                          </td>
                          <td><span className="badge badge-neutral">{p.category}</span></td>
                          <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>
                            {p.unitsSold} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>{p.unit}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>{formatCurrency(p.costPrice, hideAmounts)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(p.salePrice, hideAmounts)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                            {formatCurrency(p.revenue, hideAmounts)}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: p.profit > 0 ? '#16a34a' : 'inherit' }}>
                            +{formatCurrency(p.profit, hideAmounts)}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`badge ${isLowStock ? 'badge-warning' : 'badge-neutral'}`} style={{ fontWeight: 700 }}>
                              {p.currentStock} {p.unit}
                            </span>
                          </td>
                          <td>
                            {isHighVelocity ? (
                              <span className="badge badge-success">🔥 Top Seller</span>
                            ) : p.unitsSold > 0 ? (
                              <span className="badge badge-info">Steady Demand</span>
                            ) : (
                              <span className="badge badge-neutral">No Sales Yet</span>
                            )}
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
          TAB 3: FARMER KHATA AGING & RECOVERY
          ========================================================================= */}
      {reportTab === 'khata_aging' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Khata Aging Buckets KPI Cards */}
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {/* Total Udhaar */}
            <div className="kpi-card" style={{ borderLeft: '4px solid #b91c1c' }}>
              <div className="kpi-header">
                <span className="kpi-title">TOTAL MARKET UDHAAR</span>
                <span className="kpi-icon-pill" style={{ background: '#fee2e2', color: '#b91c1c' }}>👥</span>
              </div>
              <div className="kpi-value" style={{ color: '#b91c1c' }}>
                {formatCurrency(customers.reduce((s, c) => s + (c.balance > 0 ? c.balance : 0), 0), hideAmounts)}
              </div>
              <div className="kpi-subtext">
                <span>Total outstanding farmer balances</span>
              </div>
            </div>

            {/* 0-30 Days Current */}
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">0-30 DAYS (CURRENT CROP)</span>
                <span className="kpi-icon-pill" style={{ background: '#ecfdf5', color: '#059669' }}>🌱</span>
              </div>
              <div className="kpi-value" style={{ color: '#059669' }}>
                {formatCurrency(agingTotals.current0_30, hideAmounts)}
              </div>
              <div className="kpi-subtext">
                <span>Standard seasonal credit window</span>
              </div>
            </div>

            {/* 31-60 Days Approaching Harvest */}
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">31-60 DAYS (HARVEST DUE)</span>
                <span className="kpi-icon-pill" style={{ background: '#fffbeb', color: '#d97706' }}>🌾</span>
              </div>
              <div className="kpi-value" style={{ color: '#d97706' }}>
                {formatCurrency(agingTotals.mid31_60, hideAmounts)}
              </div>
              <div className="kpi-subtext">
                <span>Due for mandi settlement</span>
              </div>
            </div>

            {/* 60+ Days Overdue */}
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">60+ DAYS (PRIORITY RECOVERY)</span>
                <span className="kpi-icon-pill" style={{ background: '#fee2e2', color: '#dc2626' }}>⚠️</span>
              </div>
              <div className="kpi-value" style={{ color: '#dc2626' }}>
                {formatCurrency(agingTotals.old60Plus, hideAmounts)}
              </div>
              <div className="kpi-subtext">
                <span>Requires dealer personal follow-up</span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="filter-bar">
            <div className="search-input-wrapper" style={{ maxWidth: '340px' }}>
              <input
                type="text"
                className="input"
                placeholder="Search farmer by name, village, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing {customerAgingData.length} Khata Accounts
            </div>
          </div>

          {/* Aging Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>FARMER NAME</th>
                    <th>VILLAGE / LOCATION</th>
                    <th>PHONE / WHATSAPP</th>
                    <th style={{ textAlign: 'right' }}>CREDIT LIMIT</th>
                    <th style={{ textAlign: 'right' }}>OUTSTANDING UDHAAR</th>
                    <th style={{ width: '130px' }}>CREDIT UTILIZATION</th>
                    <th>AGING STATUS</th>
                    <th style={{ textAlign: 'right' }}>RECOVERY ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {customerAgingData.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.type}</div>
                      </td>
                      <td>{c.village || 'Local'}</td>
                      <td>{c.phone}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(c.creditLimit, hideAmounts)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: c.balance > 0 ? '#b91c1c' : '#10b981', fontSize: '14px' }}>
                        {formatCurrency(c.balance, hideAmounts)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ flex: 1, height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${c.creditUtilization}%`, height: '100%', background: c.creditUtilization > 80 ? '#ef4444' : 'var(--primary)' }} />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 600 }}>{c.creditUtilization}%</span>
                        </div>
                      </td>
                      <td>
                        {c.balance > 0 ? (
                          <span className="badge" style={{ background: `${c.urgencyColor}20`, color: c.urgencyColor, border: `1px solid ${c.urgencyColor}40` }}>
                            {c.bucket}
                          </span>
                        ) : (
                          <span className="badge badge-success">Nil / Cleared</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {c.balance > 0 && c.phone ? (
                          <a
                            href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${c.name} sb,\n${storeProfile.name} ki taraf se aap ke khata ka baqaya Rs ${c.balance.toLocaleString()} hai. Meharbani farma kar mandi chakkar lagaiye. Shukriya.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            style={{ fontSize: '11.5px', padding: '4px 10px', color: '#15803d', borderColor: '#bbf7d0' }}
                          >
                            💬 Send Reminder
                          </a>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: GODOWN STOCK & CUSTODY AUDIT
          ========================================================================= */}
      {reportTab === 'stock_audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">TOTAL STOCK IN GODOWN</span></div>
              <div className="kpi-value">{formatNumber(products.reduce((s, p) => s + (p.storeStock || 0), 0), hideAmounts)} Bags</div>
              <div className="kpi-subtext"><span>Main warehouse inventory</span></div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">TOTAL STOCK IN SHOP COUNTER</span></div>
              <div className="kpi-value">{formatNumber(products.reduce((s, p) => s + (p.shopStock || 0), 0), hideAmounts)} Bags</div>
              <div className="kpi-subtext"><span>Available for retail counter billing</span></div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">HELD IN CUSTODY (AMANAT)</span></div>
              <div className="kpi-value" style={{ color: '#c2410c' }}>
                {holdStock.reduce((s, h) => s + h.remainingBags, 0)} Bags
              </div>
              <div className="kpi-subtext"><span>Farmer-owned stock stored in godown</span></div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 800 }}>
              Warehouse &amp; Godown Stock Audit Breakdown
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PRODUCT NAME</th>
                    <th>CATEGORY</th>
                    <th>GODOWN LOCATION</th>
                    <th style={{ textAlign: 'center' }}>SHOP COUNTER</th>
                    <th style={{ textAlign: 'center' }}>GODOWN STORE</th>
                    <th style={{ textAlign: 'center' }}>TOTAL UNITS</th>
                    <th style={{ textAlign: 'right' }}>COST BASIS (RS)</th>
                    <th style={{ textAlign: 'right' }}>TOTAL VALUE</th>
                    <th>RE-ORDER STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const total = (p.shopStock || 0) + (p.storeStock || 0);
                    const isLow = total <= (p.alertQty || 10);
                    const isOut = total === 0;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU: {p.sku}</div>
                        </td>
                        <td><span className="badge badge-neutral">{p.category}</span></td>
                        <td>{p.location || 'Godown Main'}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.shopStock} {p.unit}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.storeStock} {p.unit}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800, fontSize: '13.5px' }}>{total} {p.unit}</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(p.costPrice, hideAmounts)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                          {formatCurrency(total * p.costPrice, hideAmounts)}
                        </td>
                        <td>
                          {isOut ? (
                            <span className="badge badge-danger">Out of Stock</span>
                          ) : isLow ? (
                            <span className="badge badge-warning">Order More ({p.alertQty} min)</span>
                          ) : (
                            <span className="badge badge-success">Optimal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SUPPLIER & COMPANY PAYABLES ANALYSIS
          ========================================================================= */}
      {reportTab === 'suppliers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="kpi-grid">
            <div className="kpi-card" style={{ borderLeft: '4px solid #b45309' }}>
              <div className="kpi-header"><span className="kpi-title">TOTAL COMPANY PAYABLES</span></div>
              <div className="kpi-value" style={{ color: '#b45309' }}>
                {formatCurrency(suppliers.reduce((s, sup) => s + (sup.balance > 0 ? sup.balance : 0), 0), hideAmounts)}
              </div>
              <div className="kpi-subtext"><span>Payable to Fauji Fertilizer, Engro, Bayer, etc.</span></div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-title">TOTAL REGISTERED SUPPLIERS</span></div>
              <div className="kpi-value">{suppliers.length} Companies</div>
              <div className="kpi-subtext"><span>Fertilizer, seed and pesticide manufacturers</span></div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>COMPANY NAME</th>
                    <th>REGIONAL DEPOT / CITY</th>
                    <th>TOTAL PURCHASES</th>
                    <th>TOTAL PAID</th>
                    <th style={{ textAlign: 'right' }}>OUTSTANDING BALANCE</th>
                    <th>SETTLEMENT STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => {
                    const supPurchasesTotal = (purchases || []).filter(po => po.supplierId === s.id).reduce((sum, po) => sum + po.totalCost, 0);
                    const supPaidTotal = payments.filter(p => p.accountId === s.id && p.type === 'out').reduce((sum, p) => sum + p.amount, 0);
                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.contactPerson} &bull; {s.phone}</div>
                        </td>
                        <td>{s.city}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(supPurchasesTotal, hideAmounts)}</td>
                        <td style={{ fontWeight: 600, color: '#16a34a' }}>{formatCurrency(supPaidTotal, hideAmounts)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: s.balance > 0 ? '#b45309' : '#10b981', fontSize: '14px' }}>
                          {formatCurrency(s.balance, hideAmounts)} (Credit)
                        </td>
                        <td>
                          <span className={`badge ${s.balance > 0 ? 'badge-warning' : 'badge-success'}`}>
                            {s.balance > 0 ? 'Pending Payment' : 'Settled / No Dues'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
