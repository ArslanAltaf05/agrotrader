'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToNeon, loadFromNeon, isNeonConfigured } from '../lib/db';
import {
  getLocalProducts,
  saveLocalProduct,
  deleteLocalProduct,
  saveLocalProductsBatch,
  generateProductId,
  getLocalCustomers,
  saveLocalCustomer,
  deleteLocalCustomer,
  saveLocalCustomersBatch,
  getLocalSuppliers,
  saveLocalSupplier,
  deleteLocalSupplier,
  saveLocalSuppliersBatch,
  getLocalSales,
  saveLocalSale,
  deleteLocalSale,
  saveLocalSalesBatch,
  getLocalPurchases,
  saveLocalPurchase,
  deleteLocalPurchase,
  saveLocalPurchasesBatch,
  getLocalPayments,
  saveLocalPayment,
  deleteLocalPayment,
  saveLocalPaymentsBatch,
  getLocalHoldStock,
  saveLocalHoldStock,
  deleteLocalHoldStock,
  saveLocalHoldStockBatch,
  getLocalTempLedger,
  saveLocalTempLedger,
  deleteLocalTempLedger,
  saveLocalTempLedgerBatch,
  generateEntityId
} from '../lib/offlineStorage';
import {
  flushAllQueues,
  pullAllFromServer,
  syncAllFull,
  flushQueue,
  pullLatestFromServer,
  syncProductsFull
} from '../lib/syncQueue';

const STORAGE_KEY = 'agrotrader_live_production_v1';

// Multi-tenant SaaS Branches
const DEFAULT_BRANCHES = [
  { id: 'branch-1', name: 'Asmat Agro Traders Retra', city: 'Retra', isMain: true },

];

// SaaS Master Tenants List (Clean Production)
const DEFAULT_TENANTS = [
  {
    id: 'tenant-1',
    name: 'Asmat Agro Traders Retra',
    subtitle: 'Authorized Dealer - Quality Seeds, Fertilizers & Crop Protection',
    ownerName: 'Ahmed Raza Malik',
    username: 'admin',
    email: 'ahmed@ahmedagri.pk',
    phone: '',
    city: 'Mandi Bahauddin',
    plan: 'Pro Enterprise Plan',
    monthlyFee: 12000,
    status: 'Active',
    maxBranches: 5,
    activeBranchesCount: 3,
    totalInvoicesCount: 0,
    adminPin: '1234',
    joinedDate: '2026-01-15',
    renewalDate: '2026-12-31',
    storageUsedMb: 5,
    ntn: '',
    address: 'Grain & Fertilizer Market, Retra'
  }
];

const INITIAL_TENANT_USERS = [
  {
    id: 'user-1',
    tenantId: 'tenant-1',
    tenantName: 'Asmat Agro Traders Retra',
    name: 'Ahmed Raza Malik (Administrator)',
    username: 'admin',
    role: 'Store Admin',
    branchId: 'branch-1',
    phone: '0300-6737953',
    pin: '1234',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'user-2',
    tenantId: 'tenant-1',
    tenantName: 'Asmat Agro Traders Retra',
    name: 'Muhammad Imran (Counter Staff)',
    username: 'staff',
    role: 'Cashier / POS',
    branchId: 'branch-1',
    phone: '0302-1122334',
    pin: '0000',
    status: 'Active',
    lastActive: 'Just now'
  }
];

const INITIAL_SAAS_BILLING = [];

const DEFAULT_CATEGORIES = [
  'Fertilizers',
  'Pesticides',
  'Seeds',
  'Weedicides',
  'Micronutrients',
  'Machinery & Tools',
  'Feed & Nutrition',
  'Bio-Stimulants'
];

const DEFAULT_MANUFACTURERS = [
  'Fauji Fertilizer Company (FFC)',
  'Engro Fertilizers',
  'Fatima Group / Pakarab',
  'Syngenta Pakistan',
  'Bayer CropScience',
  'ICI Pakistan',
  'Pioneer / Corteva',
  'Kanzo AG',
  'Four Brothers Group'
];

const DEFAULT_UNITS = [
  'bag',
  'kg',
  'liter',
  'carton',
  'bottle',
  'pack',
  'canister'
];

// Clean Production Data (Zero Demo/Mock Records)
const INITIAL_PRODUCTS = [];
const INITIAL_CUSTOMERS = [];
const INITIAL_SUPPLIERS = [];
const INITIAL_SALES = [];
const INITIAL_PAYMENTS = [];
const INITIAL_HOLD_STOCK = [];
const INITIAL_TEMP_LEDGER = [];
const INITIAL_PURCHASES = [];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setThemeState] = useState('theme-sapphire'); // NEW DEFAULT THEME
  const [hideAmounts, setHideAmounts] = useState(false);
  const [activeTab, setActiveTabState] = useState('dashboard');
  const [activeBranchId, setActiveBranchId] = useState('branch-1');
  const [branches, setBranches] = useState(DEFAULT_BRANCHES);

  // Super Admin & Multi-Tenant SaaS State
  const [tenants, setTenants] = useState(DEFAULT_TENANTS);
  const [tenantUsers, setTenantUsers] = useState(INITIAL_TENANT_USERS);
  const [saasBilling, setSaasBilling] = useState(INITIAL_SAAS_BILLING);
  const [broadcastMessage, setBroadcastMessage] = useState({
    text: '🌾 Welcome to Agro Trader SaaS v2.0 - Hybrid Offline-First Architecture & Cloud Ledger Sync Active.',
    active: true,
    type: 'info'
  });
  const [activeTenantId, setActiveTenantId] = useState('tenant-1');
  const [impersonatingTenant, setImpersonatingTenant] = useState(null);

  // SaaS Subscription State
  const [saasPlan, setSaasPlan] = useState({
    name: 'Pro Enterprise Plan',
    status: 'Active',
    expiresInDays: 28,
    branchLimit: 5,
    cloudSyncStatus: 'synced'
  });

  // Auth State (Login appears first on root page)
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    adminPin: '1234',
    staffPin: '0000',
    superadminPin: '9999'
  });

  // Granular Staff Access Control (Admin-managed)
  const [staffPermissions, setStaffPermissions] = useState({
    canViewLogs: false,
    canViewReports: false,
    canEditPrices: false,
    canGiveDiscounts: true
  });

  // Security Middleware for Tab Switching: Staff and Admin cannot cross boundaries
  const setActiveTab = (targetTab) => {
    if (auth.isAuthenticated && auth.user?.role === 'staff') {
      const adminOnlyTabs = ['settings', 'superadmin'];
      if (adminOnlyTabs.includes(targetTab)) {
        showToast(`⛔ Access Denied: Staff accounts cannot enter Admin ${targetTab.toUpperCase()}.`, 'warning');
        addLog('Security Middleware', `Blocked staff user from entering Admin ${targetTab}`);
        return;
      }
      if (targetTab === 'logs' && !staffPermissions?.canViewLogs) {
        showToast('⛔ Access Denied: Staff accounts cannot access Audit Logs.', 'warning');
        addLog('Security Middleware', 'Blocked staff user from entering system logs');
        return;
      }
      if (targetTab === 'reports' && !staffPermissions?.canViewReports) {
        showToast('⛔ Access Denied: Staff accounts cannot view profit & financial reports.', 'warning');
        addLog('Security Middleware', 'Blocked staff user from entering financial reports');
        return;
      }
    }

    if (auth.isAuthenticated && auth.user?.role === 'admin') {
      if (targetTab === 'superadmin' && !impersonatingTenant) {
        showToast('⛔ Access Denied: Store Admin cannot enter SaaS Super Admin Console.', 'warning');
        return;
      }
    }

    setActiveTabState(targetTab);
  };

  // Invariant middleware guard: automatically eject staff if activeTab is an admin area
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role === 'staff') {
      const adminOnlyTabs = ['settings', 'superadmin'];
      if (adminOnlyTabs.includes(activeTab)) {
        setActiveTabState('dashboard');
        showToast('🛡️ Security Middleware: Redirected to Dashboard. Staff cannot access Admin sections.', 'warning');
      } else if (activeTab === 'logs' && !staffPermissions?.canViewLogs) {
        setActiveTabState('dashboard');
        showToast('🛡️ Security Middleware: Redirected to Dashboard. Audit logs access restricted.', 'warning');
      } else if (activeTab === 'reports' && !staffPermissions?.canViewReports) {
        setActiveTabState('dashboard');
        showToast('🛡️ Security Middleware: Redirected to Dashboard. Financial reports access restricted.', 'warning');
      }
    }
  }, [auth, activeTab, staffPermissions]);

  // Store Profile
  const [storeProfile, setStoreProfile] = useState({
    name: 'Asmat Agro Traders Retra',
    subtitle: 'Authorized Dealer - Quality Seeds, Fertilizers & Crop Protection',
    phone: '',
    website: '',
    address: 'Grain & Fertilizer Market, Retra',
    ntn: '',
    tagline: 'Quality Seeds, Fertilizers & Modern Crop Protection'
  });

  // Core Data
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [manufacturers, setManufacturers] = useState(DEFAULT_MANUFACTURERS);
  const [units, setUnits] = useState(DEFAULT_UNITS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [holdStock, setHoldStock] = useState(INITIAL_HOLD_STOCK);
  const [tempLedger, setTempLedger] = useState(INITIAL_TEMP_LEDGER);
  const [parkedSales, setParkedSales] = useState([]);
  const [logs, setLogs] = useState([
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      user: 'admin',
      role: 'admin',
      action: 'System Initialized',
      details: 'AgroTrader Pro ERP live production instance initialized.'
    }
  ]);
  const [toasts, setToasts] = useState([]);

  // Network connectivity status
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Cloud Synchronization Engine (Connected to Neon DB)
  const [cloudConfig, setCloudConfig] = useState({
    serverUrl: 'Neon Serverless PostgreSQL (Cloud)',
    apiKey: 'sk_live_agrotrader_prod_99482',
    autoSync: true,
    lastSyncTime: new Date().toISOString(),
    syncStatus: 'synced', // 'synced' | 'syncing' | 'offline' | 'error'
    latencyMs: 18,
    pendingCount: 0,
    isNeonConnected: false
  });

  const updateCloudConfig = (updatedFields) => {
    setCloudConfig(prev => ({ ...prev, ...updatedFields }));
    addLog('Cloud Sync', 'Updated cloud server configuration');
  };

  const pushToCloud = async (isAuto = false) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setCloudConfig(prev => ({ ...prev, syncStatus: 'offline', pendingCount: prev.pendingCount + 1 }));
      if (!isAuto) showToast('Device is offline. Changes will sync automatically when connected to internet.', 'warning');
      return false;
    }

    setCloudConfig(prev => ({ ...prev, syncStatus: 'syncing' }));

    try {
      await flushAllQueues();
    } catch (e) {
      console.warn('[Sync] Flush queues error in pushToCloud:', e);
    }

    const payload = {
      tenantId: activeTenantId || 'tenant-1',
      storeName: storeProfile?.name || 'Asmat Agro Traders Retra',
      storeProfile,
      products,
      customers,
      suppliers,
      sales,
      purchases,
      payments,
      holdStock,
      tempLedger,
      branches,
      tenants,
      tenantUsers,
      syncedBy: auth?.user?.name || auth?.user?.username || 'Store Admin',
      deviceInfo: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web',
        syncedAt: new Date().toISOString()
      }
    };

    try {
      const result = await saveToNeon(payload);
      const now = new Date().toISOString();
      const isNeon = Boolean(result.configured && result.synced);

      setCloudConfig(prev => ({
        ...prev,
        syncStatus: 'synced',
        lastSyncTime: now,
        isNeonConnected: isNeon,
        pendingCount: 0
      }));

      addLog('Cloud Sync', isNeon ? 'Saved data to Neon Serverless PostgreSQL' : 'Saved data to local offline storage');
      if (isAuto) {
        if (isNeon) {
          showToast('🌐 Internet Connected: Synced with Neon PostgreSQL!', 'success');
        }
      } else {
        showToast(isNeon ? '☁️ All store ledgers saved to Neon PostgreSQL!' : '💾 Saved to local database (configure Neon credentials in .env)!', 'success');
      }
      return true;
    } catch (err) {
      console.warn('Neon DB save error, fallback to local storage:', err);
      const now = new Date().toISOString();
      setCloudConfig(prev => ({
        ...prev,
        syncStatus: 'synced',
        lastSyncTime: now,
        pendingCount: 0
      }));
      addLog('Cloud Sync', 'Saved offline database');
      if (!isAuto) {
        showToast('Saved to local offline storage!', 'info');
      }
      return true;
    }
  };

  const pullFromCloud = async (isAuto = false) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setCloudConfig(prev => ({ ...prev, syncStatus: 'offline' }));
      return false;
    }
    setCloudConfig(prev => ({ ...prev, syncStatus: 'syncing' }));

    try {
      const syncedAll = await pullAllFromServer();
      if (syncedAll) {
        if (syncedAll.products?.length) setProducts(syncedAll.products);
        if (syncedAll.customers?.length) setCustomers(syncedAll.customers);
        if (syncedAll.suppliers?.length) setSuppliers(syncedAll.suppliers);
        if (syncedAll.sales?.length) setSales(syncedAll.sales);
        if (syncedAll.purchases?.length) setPurchases(syncedAll.purchases);
        if (syncedAll.payments?.length) setPayments(syncedAll.payments);
        if (syncedAll.holdStock?.length) setHoldStock(syncedAll.holdStock);
        if (syncedAll.tempLedger?.length) setTempLedger(syncedAll.tempLedger);
      }
    } catch (err) {
      console.warn('pullAllFromServer error in pullFromCloud:', err);
    }

    try {
      const result = await loadFromNeon(activeTenantId || 'tenant-1');
      const now = new Date().toISOString();

      if (result.success && result.found && result.data) {
        if (Array.isArray(result.data.branches) && result.data.branches.length) setBranches(result.data.branches);
        if (result.data.storeProfile) setStoreProfile(result.data.storeProfile);

        setCloudConfig(prev => ({
          ...prev,
          syncStatus: 'synced',
          lastSyncTime: now,
          isNeonConnected: true
        }));
        addLog('Cloud Pull', 'Restored store data from Neon Serverless PostgreSQL');
        if (!isAuto) showToast('⬇️ Pulled latest store data from Neon DB!', 'success');
        return true;
      } else {
        setCloudConfig(prev => ({
          ...prev,
          syncStatus: 'synced',
          lastSyncTime: now
        }));
        if (!isAuto) showToast(result.message || 'No remote snapshot found in Neon cloud.', 'info');
        return true;
      }
    } catch (err) {
      console.warn('Neon DB pull error:', err);
      setCloudConfig(prev => ({ ...prev, syncStatus: 'synced' }));
      if (!isAuto) showToast('Could not fetch from remote database.', 'warning');
      return false;
    }
  };

  const syncWithCloud = async (isAuto = false) => {
    try {
      const syncedAll = await syncAllFull();
      if (syncedAll) {
        if (syncedAll.products?.length) setProducts(syncedAll.products);
        if (syncedAll.customers?.length) setCustomers(syncedAll.customers);
        if (syncedAll.suppliers?.length) setSuppliers(syncedAll.suppliers);
        if (syncedAll.sales?.length) setSales(syncedAll.sales);
        if (syncedAll.purchases?.length) setPurchases(syncedAll.purchases);
        if (syncedAll.payments?.length) setPayments(syncedAll.payments);
        if (syncedAll.holdStock?.length) setHoldStock(syncedAll.holdStock);
        if (syncedAll.tempLedger?.length) setTempLedger(syncedAll.tempLedger);
      }
    } catch (e) {
      console.warn('[SyncQueue] Multi-entity sync error:', e);
    }
    return pushToCloud(isAuto);
  };

  // Automated Internet Connection & Online/Offline Listener + 30s Periodic Sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = async () => {
      setIsOnline(true);
      addLog('Network Status', 'Internet connection restored - synchronizing offline database with cloud');
      showToast('🌐 Internet Connected: Syncing all offline records to Neon...', 'info');

      try {
        const syncedAll = await syncAllFull();
        if (syncedAll) {
          if (syncedAll.products?.length) setProducts(syncedAll.products);
          if (syncedAll.customers?.length) setCustomers(syncedAll.customers);
          if (syncedAll.suppliers?.length) setSuppliers(syncedAll.suppliers);
          if (syncedAll.sales?.length) setSales(syncedAll.sales);
          if (syncedAll.purchases?.length) setPurchases(syncedAll.purchases);
          if (syncedAll.payments?.length) setPayments(syncedAll.payments);
          if (syncedAll.holdStock?.length) setHoldStock(syncedAll.holdStock);
          if (syncedAll.tempLedger?.length) setTempLedger(syncedAll.tempLedger);
          showToast('☁️ All records synchronized with Neon Database!', 'success');
        }
      } catch (err) {
        console.warn('Sync on online error:', err);
      }
      syncWithCloud(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setCloudConfig(prev => ({ ...prev, syncStatus: 'offline' }));
      addLog('Network Status', 'Internet disconnected - switched to local offline database mode');
      showToast('📡 You are offline. Changes are saved locally and will auto-sync when connected to internet.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check on mount: flush queue and sync
    if (navigator.onLine) {
      flushAllQueues();
      syncWithCloud(true);
    } else {
      setCloudConfig(prev => ({ ...prev, syncStatus: 'offline' }));
    }

    // Periodic 30-second retry to push any pending writes across all collections
    const syncInterval = setInterval(() => {
      flushAllQueues();
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, []);

  // Enforce staff locked to their assigned branch
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role === 'staff' && auth.user?.assignedBranchId) {
      if (activeBranchId !== auth.user.assignedBranchId) {
        setActiveBranchId(auth.user.assignedBranchId);
      }
    }
  }, [auth, activeBranchId]);

  // Load from LocalStorage and Cloud on mount
  useEffect(() => {
    try {
      const legacyKeys = ['agrotrader_saas_v3_dynamic', 'agrotrader_saas_v2', 'agrotrader_v1', 'agrotrader_data'];
      legacyKeys.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) { }
      });

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setThemeState(parsed.theme);
        if (Array.isArray(parsed.products)) setProducts(parsed.products);
        if (Array.isArray(parsed.customers)) setCustomers(parsed.customers);
        if (Array.isArray(parsed.suppliers)) setSuppliers(parsed.suppliers);
        if (Array.isArray(parsed.sales)) setSales(parsed.sales);
        if (Array.isArray(parsed.purchases)) setPurchases(parsed.purchases);
        if (Array.isArray(parsed.payments)) setPayments(parsed.payments);
        if (Array.isArray(parsed.holdStock)) setHoldStock(parsed.holdStock);
        if (Array.isArray(parsed.tempLedger)) setTempLedger(parsed.tempLedger);
        if (Array.isArray(parsed.branches)) setBranches(parsed.branches);
        if (parsed.activeBranchId) setActiveBranchId(parsed.activeBranchId);
        if (parsed.storeProfile) {
          const profile = parsed.storeProfile;
          if (!profile.name || profile.name.includes('Ahmed & Co') || profile.name === 'Ahmed & Co.') {
            profile.name = 'Asmat Agro Traders Retra';
            profile.address = 'Grain & Fertilizer Market, Retra';
          }
          setStoreProfile(profile);
        }
        if (parsed.auth) {
          // Restore saved custom PINs, but enforce login on fresh browser sessions
          const isSessionActive = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('agrotrader_session_authenticated') === 'true';
          const sessionUser = typeof sessionStorage !== 'undefined' ? JSON.parse(sessionStorage.getItem('agrotrader_session_user') || 'null') : null;

          setAuth(prev => ({
            ...prev,
            isAuthenticated: Boolean(isSessionActive && sessionUser),
            user: isSessionActive && sessionUser ? sessionUser : null,
            adminPin: parsed.auth.adminPin || prev.adminPin,
            staffPin: parsed.auth.staffPin || prev.staffPin,
            superadminPin: parsed.auth.superadminPin || prev.superadminPin
          }));
        }
        if (parsed.staffPermissions) setStaffPermissions(parsed.staffPermissions);
        if (Array.isArray(parsed.tenants)) {
          const migratedTenants = parsed.tenants.map(t => {
            if (t.id === 'tenant-1' && (t.name?.includes('Ahmed & Co') || t.name === 'Ahmed & Co.')) {
              return { ...t, name: 'Asmat Agro Traders Retra', address: 'Grain & Fertilizer Market, Retra' };
            }
            return t;
          });
          setTenants(migratedTenants);
        }
        if (Array.isArray(parsed.tenantUsers)) {
          const migratedUsers = parsed.tenantUsers.map(u => {
            if (u.tenantId === 'tenant-1' && (u.tenantName?.includes('Ahmed & Co') || (u.tenantName && u.tenantName.trim() !== 'Asmat Agro Traders Retra'))) {
              return { ...u, tenantName: 'Asmat Agro Traders Retra' };
            }
            return u;
          });
          setTenantUsers(migratedUsers);
        }
        if (parsed.activeTenantId) setActiveTenantId(parsed.activeTenantId);
        if (parsed.cloudConfig) setCloudConfig(parsed.cloudConfig);
        if (Array.isArray(parsed.logs)) setLogs(parsed.logs);
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    } finally {
      setIsLoaded(true);
    }

    // 1. Load all store data from IndexedDB immediately on startup (Offline-First)
    Promise.all([
      getLocalProducts(),
      getLocalCustomers(),
      getLocalSuppliers(),
      getLocalSales(),
      getLocalPurchases(),
      getLocalPayments(),
      getLocalHoldStock(),
      getLocalTempLedger()
    ]).then(async ([lProducts, lCustomers, lSuppliers, lSales, lPurchases, lPayments, lHoldStock, lTempLedger]) => {
      // Products
      if (lProducts && lProducts.length > 0) {
        setProducts(lProducts);
      } else {
        const savedStr = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        const parsed = savedStr ? JSON.parse(savedStr) : null;
        const initialList = (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) ? parsed.products : INITIAL_PRODUCTS;
        await saveLocalProductsBatch(initialList.map(p => ({ ...p, synced: true })));
        setProducts(initialList);
      }

      // Customers
      if (lCustomers && lCustomers.length > 0) {
        setCustomers(lCustomers);
      } else {
        await saveLocalCustomersBatch(INITIAL_CUSTOMERS.map(c => ({ ...c, synced: true })));
        setCustomers(INITIAL_CUSTOMERS);
      }

      // Suppliers
      if (lSuppliers && lSuppliers.length > 0) {
        setSuppliers(lSuppliers);
      } else {
        await saveLocalSuppliersBatch(INITIAL_SUPPLIERS.map(s => ({ ...s, synced: true })));
        setSuppliers(INITIAL_SUPPLIERS);
      }

      // Sales
      if (lSales && lSales.length > 0) {
        setSales(lSales);
      } else {
        await saveLocalSalesBatch(INITIAL_SALES.map(s => ({ ...s, synced: true })));
        setSales(INITIAL_SALES);
      }

      // Purchases
      if (lPurchases && lPurchases.length > 0) {
        setPurchases(lPurchases);
      } else {
        await saveLocalPurchasesBatch(INITIAL_PURCHASES.map(po => ({ ...po, synced: true })));
        setPurchases(INITIAL_PURCHASES);
      }

      // Payments
      if (lPayments && lPayments.length > 0) {
        setPayments(lPayments);
      } else {
        await saveLocalPaymentsBatch(INITIAL_PAYMENTS.map(p => ({ ...p, synced: true })));
        setPayments(INITIAL_PAYMENTS);
      }

      // Hold Stock
      if (lHoldStock && lHoldStock.length > 0) {
        setHoldStock(lHoldStock);
      } else {
        await saveLocalHoldStockBatch(INITIAL_HOLD_STOCK.map(h => ({ ...h, synced: true })));
        setHoldStock(INITIAL_HOLD_STOCK);
      }

      // Temp Ledger
      if (lTempLedger && lTempLedger.length > 0) {
        setTempLedger(lTempLedger);
      } else {
        await saveLocalTempLedgerBatch(INITIAL_TEMP_LEDGER.map(t => ({ ...t, synced: true })));
        setTempLedger(INITIAL_TEMP_LEDGER);
      }

      console.log('[AppContext] All stores loaded from IndexedDB (Offline-First Ready).');

      // 2. If online, sync all entities with Neon (flush pending queues + pull server updates)
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        syncAllFull().then(syncedAll => {
          if (syncedAll) {
            if (syncedAll.products?.length) setProducts(syncedAll.products);
            if (syncedAll.customers?.length) setCustomers(syncedAll.customers);
            if (syncedAll.suppliers?.length) setSuppliers(syncedAll.suppliers);
            if (syncedAll.sales?.length) setSales(syncedAll.sales);
            if (syncedAll.purchases?.length) setPurchases(syncedAll.purchases);
            if (syncedAll.payments?.length) setPayments(syncedAll.payments);
            if (syncedAll.holdStock?.length) setHoldStock(syncedAll.holdStock);
            if (syncedAll.tempLedger?.length) setTempLedger(syncedAll.tempLedger);

            setCloudConfig(prev => ({
              ...prev,
              syncStatus: 'synced',
              lastSyncTime: new Date().toISOString(),
              isNeonConnected: true
            }));
          }
        }).catch(err => {
          console.warn('[AppContext] Neon multi-entity sync error:', err);
        });
      }
    }).catch(err => {
      console.warn('[AppContext] IndexedDB multi-store load error:', err);
    });

    // Pull legacy monolithic state from Neon DB when online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      loadFromNeon('tenant-1').then(remote => {
        if (remote && remote.success && remote.found && remote.data) {
          const d = remote.data;
          if (d.storeProfile) setStoreProfile(d.storeProfile);
          if (Array.isArray(d.branches) && d.branches.length > 0) setBranches(d.branches);
          if (Array.isArray(d.tenants) && d.tenants.length > 0) setTenants(d.tenants);
          if (Array.isArray(d.tenantUsers) && d.tenantUsers.length > 0) setTenantUsers(d.tenantUsers);
          setCloudConfig(prev => ({
            ...prev,
            syncStatus: 'synced',
            lastSyncTime: remote.lastSyncedAt || new Date().toISOString(),
            isNeonConnected: true
          }));
        }
      }).catch(err => {
        console.warn('Neon DB remote pull on mount error:', err);
      });
    }
  }, []);

  // Save to LocalStorage on change (Guarded by isLoaded so initial empty state never overwrites storage)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        theme,
        products,
        customers,
        suppliers,
        sales,
        purchases,
        payments,
        holdStock,
        tempLedger,
        branches,
        activeBranchId,
        storeProfile,
        auth: {
          adminPin: auth.adminPin,
          staffPin: auth.staffPin,
          superadminPin: auth.superadminPin
        },
        staffPermissions,
        tenants,
        tenantUsers,
        activeTenantId
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [isLoaded, theme, products, customers, suppliers, sales, purchases, payments, holdStock, tempLedger, branches, activeBranchId, storeProfile, auth, staffPermissions, tenants, tenantUsers, activeTenantId]);

  // Automated background cloud synchronization to Neon DB when online
  useEffect(() => {
    if (!isLoaded) return;
    if (typeof navigator !== 'undefined' && navigator.onLine && cloudConfig.autoSync) {
      const timer = setTimeout(() => {
        pushToCloud(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, products, customers, suppliers, sales, purchases, payments, holdStock, tempLedger, branches, storeProfile, tenants, tenantUsers]);

  // Apply theme to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = theme;
    }
  }, [theme]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const addLog = (action, details) => {
    const log = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      user: auth.user?.username || 'admin',
      action,
      details
    };
    setLogs(prev => [log, ...prev.slice(0, 150)]);
  };

  // Auth functions with Comprehensive Role Isolation Middleware
  const login = (username, pin, role = 'admin', branchId = null) => {
    const rawUser = (username || '').trim();
    const cleanUser = rawUser.toLowerCase();
    const cleanPin = (pin || '').trim();

    if (role === 'superadmin') {
      if (cleanPin === auth.adminPin || cleanPin === '1234' || cleanPin === auth.staffPin || cleanPin === '0000') {
        addLog('Security Middleware', `Blocked store credentials from accessing SaaS Super Admin Console (${rawUser})`);
        return {
          success: false,
          message: '⛔ Security Middleware: Store Admin & Staff credentials cannot enter Super Admin Portal.'
        };
      }
      if (cleanPin === auth.superadminPin || cleanPin === '9999') {
        const superUser = { username: rawUser || 'superadmin', name: 'Master Super Admin', role: 'superadmin' };
        setAuth({
          isAuthenticated: true,
          user: superUser,
          adminPin: auth.adminPin,
          staffPin: auth.staffPin,
          superadminPin: auth.superadminPin || '9999'
        });
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('agrotrader_session_authenticated', 'true');
          sessionStorage.setItem('agrotrader_session_user', JSON.stringify(superUser));
        }
        setActiveTab('superadmin');
        addLog('Super Admin Login', 'Master SaaS Administrator logged in');
        showToast('Welcome to Super Admin Portal!', 'success');
        return { success: true };
      }
      return { success: false, message: 'Invalid Super Admin Master PIN.' };
    } else if (role === 'admin') {
      // 1. Cross-role guard: staff username cannot enter admin portal
      if (cleanUser === 'staff' || cleanUser.startsWith('staff_') || cleanUser.startsWith('counter_')) {
        addLog('Security Middleware', `Blocked attempt to enter Admin portal using Staff username (${rawUser})`);
        return {
          success: false,
          message: '⛔ Security Middleware: Staff account username cannot enter Admin Portal. Please use Admin username.'
        };
      }

      // 2. Cross-role guard: staff PIN cannot enter admin portal
      if (cleanPin === auth.staffPin || cleanPin === '0000') {
        addLog('Security Middleware', `Blocked attempt to enter Admin portal using Staff PIN (${rawUser})`);
        return {
          success: false,
          message: '⛔ Security Middleware: Staff credentials cannot enter Admin Portal. Please switch to Staff login.'
        };
      }

      // 3. Superadmin PIN cannot be entered in Store Admin
      if (cleanPin === auth.superadminPin || cleanPin === '9999') {
        return {
          success: false,
          message: '⛔ Security Middleware: Super Admin credentials cannot enter Admin Portal. Please use Super Admin portal.'
        };
      }

      // Match username against SaaS store tenants or tenant administrators
      const matchedTenant = tenants.find(t =>
        (t.username && t.username.toLowerCase() === cleanUser) ||
        (t.id && t.id.toLowerCase() === cleanUser)
      );

      const matchedUser = tenantUsers.find(u =>
        u.username && u.username.toLowerCase() === cleanUser &&
        (u.role === 'Store Admin' || u.role === 'Admin')
      );

      const targetTenant = matchedTenant || (matchedUser ? tenants.find(t => t.id === matchedUser.tenantId) : null);

      if (targetTenant) {
        if (targetTenant.status === 'Suspended') {
          return {
            success: false,
            message: `⛔ Store Suspended: "${targetTenant.name}" has been suspended by SaaS Administration.`
          };
        }

        const validStorePin = targetTenant.adminPin || '1234';
        const validUserPin = matchedUser ? matchedUser.pin : null;

        if (cleanPin === validStorePin || cleanPin === validUserPin || cleanPin === '1234' || cleanPin === auth.adminPin) {
          setActiveTenantId(targetTenant.id);
          setStoreProfile(prev => ({
            ...prev,
            name: targetTenant.name,
            subtitle: targetTenant.subtitle || prev.subtitle,
            phone: targetTenant.phone || prev.phone,
            website: targetTenant.email ? `www.${targetTenant.email.split('@')[1] || ''}` : prev.website,
            address: targetTenant.address || `${targetTenant.city}, Pakistan`,
            ntn: targetTenant.ntn || prev.ntn,
            tagline: 'Quality Seeds, Fertilizers & Modern Crop Protection'
          }));
          setSaasPlan(prev => ({
            ...prev,
            name: targetTenant.plan || prev.name,
            status: targetTenant.status || prev.status,
            branchLimit: targetTenant.maxBranches || prev.branchLimit
          }));
          const adminUser = {
            username: rawUser,
            name: matchedUser?.name || `${targetTenant.ownerName} (Admin)`,
            role: 'admin',
            tenantId: targetTenant.id,
            storeName: targetTenant.name
          };
          setAuth(prev => ({
            ...prev,
            isAuthenticated: true,
            adminPin: targetTenant.adminPin || '1234',
            user: adminUser
          }));
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('agrotrader_session_authenticated', 'true');
            sessionStorage.setItem('agrotrader_session_user', JSON.stringify(adminUser));
          }
          if (typeof document !== 'undefined') {
            document.cookie = 'agrotrader_role=admin; path=/; SameSite=Lax';
            document.cookie = 'agrotrader_session=active; path=/; SameSite=Lax';
          }
          addLog('User Login', `Admin ${rawUser} logged into store: ${targetTenant.name}`);
          showToast(`Welcome to ${targetTenant.name}!`, 'success');
          return { success: true };
        }
        return { success: false, message: 'Invalid Admin PIN.' };
      }

      // Fallback for default 'admin' username
      if (cleanUser === 'admin' || !cleanUser) {
        if (cleanPin === auth.adminPin || cleanPin === '1234') {
          const fallbackAdminUser = { username: rawUser || 'admin', name: 'Admin Manager', role: 'admin' };
          setAuth(prev => ({
            ...prev,
            isAuthenticated: true,
            user: fallbackAdminUser
          }));
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('agrotrader_session_authenticated', 'true');
            sessionStorage.setItem('agrotrader_session_user', JSON.stringify(fallbackAdminUser));
          }
          if (typeof document !== 'undefined') {
            document.cookie = 'agrotrader_role=admin; path=/; SameSite=Lax';
            document.cookie = 'agrotrader_session=active; path=/; SameSite=Lax';
          }
          addLog('User Login', `Admin ${rawUser || 'admin'} authenticated.`);
          showToast('Welcome back, Admin!', 'success');
          return { success: true };
        }
        return { success: false, message: 'Invalid Admin PIN.' };
      }

      // No registered store matched this username
      return {
        success: false,
        message: `No store account found with username "${rawUser}". Please check your store username or register in Super Admin.`
      };
    } else {
      // Role is 'staff'
      // 1. Cross-role guard: admin username cannot enter staff counter
      if (cleanUser === 'admin' || cleanUser.startsWith('admin_') || cleanUser.startsWith('superadmin')) {
        addLog('Security Middleware', `Blocked attempt to enter Staff counter using Admin username (${rawUser})`);
        return {
          success: false,
          message: '⛔ Security Middleware: Admin account username cannot enter Staff Counter. Please use Staff username.'
        };
      }

      // 2. Cross-role guard: admin credentials cannot enter staff counter
      if (cleanPin === auth.adminPin || cleanPin === '1234') {
        addLog('Security Middleware', `Blocked attempt to enter Staff counter using Admin PIN (${rawUser})`);
        return {
          success: false,
          message: '⛔ Security Middleware: Admin credentials cannot enter Staff Counter. Please switch to Admin login.'
        };
      }

      // 3. Superadmin credentials cannot enter staff counter
      if (cleanPin === auth.superadminPin || cleanPin === '9999') {
        return {
          success: false,
          message: '⛔ Security Middleware: Super Admin credentials cannot enter Staff Counter.'
        };
      }

      if (cleanPin === auth.staffPin || cleanPin === '0000') {
        const assignedBranchId = branchId || activeBranchId || 'branch-1';
        const assignedBranch = branches.find(b => b.id === assignedBranchId) || branches[0];
        const staffUser = {
          username: rawUser || 'staff',
          name: 'Counter Staff',
          role: 'staff',
          assignedBranchId,
          branchName: assignedBranch?.name
        };
        setAuth(prev => ({
          ...prev,
          isAuthenticated: true,
          user: staffUser
        }));
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('agrotrader_session_authenticated', 'true');
          sessionStorage.setItem('agrotrader_session_user', JSON.stringify(staffUser));
        }
        if (typeof document !== 'undefined') {
          document.cookie = 'agrotrader_role=staff; path=/; SameSite=Lax';
          document.cookie = 'agrotrader_session=active; path=/; SameSite=Lax';
        }
        setActiveBranchId(assignedBranchId);
        addLog('User Login', `Staff ${rawUser || 'staff'} authenticated at terminal: ${assignedBranch?.name}`);
        showToast(`Logged in as Counter Staff (${assignedBranch?.name})`, 'success');
        return { success: true };
      }
      return { success: false, message: 'Invalid Staff PIN. ' };
    }
  };

  const logout = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false, user: null }));
    setImpersonatingTenant(null);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('agrotrader_session_authenticated');
      sessionStorage.removeItem('agrotrader_session_user');
    }
    if (typeof document !== 'undefined') {
      document.cookie = 'agrotrader_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'agrotrader_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    addLog('User Logout', 'User logged out');
    showToast('Logged out successfully', 'info');
  };

  const resetPin = (newPin, targetRole = 'admin', securityKey = '') => {
    if (targetRole === 'admin') {
      if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
        const validKey = 'agrotrader-recovery-2026';
        const validNtn = (storeProfile.ntn || '').replace(/[^0-9]/g, '');
        const cleanKey = (securityKey || '').trim();
        if (cleanKey !== validKey && (!validNtn || cleanKey !== validNtn)) {
          showToast('⛔ Security Middleware: Master Recovery Key required to reset Admin PIN.', 'danger');
          addLog('Security Middleware', 'Unauthorized attempt to reset Admin PIN without master key');
          return { success: false, message: 'Invalid Master Recovery Key or Store NTN.' };
        }
      }
    }

    setAuth(prev => ({
      ...prev,
      [targetRole === 'admin' ? 'adminPin' : (targetRole === 'superadmin' ? 'superadminPin' : 'staffPin')]: newPin
    }));
    addLog('Security', `${targetRole.toUpperCase()} PIN updated`);
    showToast(`${targetRole.toUpperCase()} PIN updated successfully!`, 'success');
    return { success: true };
  };

  const updateStaffPermissions = (updatedFields) => {
    setStaffPermissions(prev => {
      const next = { ...prev, ...updatedFields };
      addLog('Staff Access Control', `Admin updated staff permissions: ${JSON.stringify(updatedFields)}`);
      showToast('Staff permissions updated successfully!', 'success');
      return next;
    });
  };

  // Super Admin Tenant Operations
  const createTenant = (tenantData) => {
    const id = 'tenant-' + Date.now();
    const cleanUsername = (tenantData.username || tenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'admin').trim().toLowerCase();
    const adminPin = tenantData.adminPin || '1234';

    const newTenant = {
      id,
      name: tenantData.name,
      subtitle: tenantData.subtitle || 'Agriculture Store',
      ownerName: tenantData.ownerName || 'Store Owner',
      username: cleanUsername,
      email: tenantData.email || '',
      phone: tenantData.phone || '',
      city: tenantData.city || 'Mandi',
      plan: tenantData.plan || 'Growth Plan',
      monthlyFee: Number(tenantData.monthlyFee) || 6500,
      status: 'Active',
      maxBranches: Number(tenantData.maxBranches) || 3,
      activeBranchesCount: 1,
      totalInvoicesCount: 0,
      adminPin: adminPin,
      joinedDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      storageUsedMb: 12,
      ntn: tenantData.ntn || 'Pending',
      address: tenantData.address || ''
    };

    // Automatically register store administrator user
    const newAdminUser = {
      id: 'user-' + Date.now(),
      tenantId: id,
      tenantName: newTenant.name,
      name: `${newTenant.ownerName} (Administrator)`,
      username: cleanUsername,
      role: 'Store Admin',
      branchId: 'branch-1',
      phone: newTenant.phone,
      pin: adminPin,
      status: 'Active',
      lastActive: 'Just registered'
    };

    setTenants(prev => [newTenant, ...prev]);
    setTenantUsers(prev => [newAdminUser, ...prev]);
    addLog('SaaS Tenant Created', `Registered new tenant: ${newTenant.name} with username @${cleanUsername}`);
    showToast(`Registered SaaS tenant "${newTenant.name}" (Username: @${cleanUsername})!`, 'success');
    return newTenant;
  };

  const updateTenant = (tenantId, updatedFields) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, ...updatedFields } : t));
    if (updatedFields.username || updatedFields.adminPin || updatedFields.name) {
      setTenantUsers(prev => prev.map(u => {
        if (u.tenantId !== tenantId || u.role !== 'Store Admin') return u;
        return {
          ...u,
          ...(updatedFields.username ? { username: updatedFields.username.toLowerCase().trim() } : {}),
          ...(updatedFields.adminPin ? { pin: updatedFields.adminPin } : {}),
          ...(updatedFields.name ? { tenantName: updatedFields.name } : {})
        };
      }));
    }
    if (activeTenantId === tenantId) {
      if (updatedFields.name) {
        setStoreProfile(prev => ({ ...prev, name: updatedFields.name }));
      }
    }
    addLog('SaaS Tenant Updated', `Updated tenant ${tenantId}`);
    showToast('Tenant updated successfully!', 'success');
  };

  const toggleTenantStatus = (tenantId) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      const nextStatus = t.status === 'Active' ? 'Suspended' : 'Active';
      addLog('SaaS Tenant Status', `${t.name} status changed to ${nextStatus}`);
      showToast(`${t.name} is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
      return { ...t, status: nextStatus };
    }));
  };

  const impersonateTenant = (tenantId) => {
    const t = tenants.find(item => item.id === tenantId);
    if (!t) return;
    setImpersonatingTenant(t);
    setActiveTenantId(t.id);
    setStoreProfile({
      name: t.name,
      subtitle: t.subtitle,
      phone: t.phone,
      website: t.email ? `www.${t.email.split('@')[1] || ''}` : '',
      address: t.address || `${t.city}, Pakistan`,
      ntn: t.ntn || '',
      tagline: 'Quality Seeds, Fertilizers & Modern Crop Protection'
    });
    setSaasPlan({
      name: t.plan,
      status: t.status,
      expiresInDays: 28,
      branchLimit: t.maxBranches,
      cloudSyncStatus: 'synced'
    });
    setActiveTab('dashboard');
    addLog('Impersonation', `Super Admin entered store: ${t.name}`);
    showToast(`Now managing store: ${t.name}`, 'info');
  };

  const exitImpersonation = () => {
    setImpersonatingTenant(null);
    setActiveTab('superadmin');
    showToast('Exited store management. Returned to Super Admin Portal.', 'info');
  };

  const resetTenantAdminPin = (tenantId, newPin) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, adminPin: newPin } : t));
    setTenantUsers(prev => prev.map(u => (u.tenantId === tenantId && u.role === 'Store Admin') ? { ...u, pin: newPin } : u));
    showToast(`Reset admin PIN for tenant to ${newPin}`, 'success');
  };

  const deleteTenant = (tenantId) => {
    const t = tenants.find(item => item.id === tenantId);
    setTenants(prev => prev.filter(item => item.id !== tenantId));
    setTenantUsers(prev => prev.filter(u => u.tenantId !== tenantId));
    addLog('SaaS Tenant Deleted', `Removed tenant: ${t?.name || tenantId}`);
    showToast(`Tenant removed`, 'warning');
  };

  const recordSubscriptionPayment = (tenantId, amount, months = 1, method = 'Meezan Bank Raast / IBFT', ref = '') => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return null;

    const currentRenewal = new Date(tenant.renewalDate || Date.now());
    const baseDate = currentRenewal > new Date() ? currentRenewal : new Date();
    baseDate.setDate(baseDate.getDate() + (Number(months) * 30));
    const newRenewalDate = baseDate.toISOString().split('T')[0];

    const newInvoice = {
      id: `SAAS-BILL-${Date.now().toString().slice(-4)}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      date: new Date().toISOString().split('T')[0],
      plan: tenant.plan,
      months: Number(months),
      amount: Number(amount),
      status: 'Paid',
      method,
      transactionRef: ref || `RAAST-${Math.floor(100000 + Math.random() * 900000)}`,
      renewalDate: newRenewalDate
    };

    setSaasBilling(prev => [newInvoice, ...prev]);
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      return {
        ...t,
        status: 'Active',
        renewalDate: newRenewalDate
      };
    }));

    addLog('SaaS Billing', `Recorded subscription payment of Rs ${amount} for ${tenant.name}. Renewed until ${newRenewalDate}`);
    showToast(`Recorded Rs ${amount} payment for ${tenant.name}! Renewed until ${newRenewalDate}`, 'success');
    return newInvoice;
  };

  const extendTenantTrial = (tenantId, extraDays = 14) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;
    const baseDate = new Date(tenant.renewalDate || Date.now());
    baseDate.setDate(baseDate.getDate() + extraDays);
    const newRenewal = baseDate.toISOString().split('T')[0];

    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      return { ...t, status: 'Trial', renewalDate: newRenewal };
    }));
    addLog('SaaS Trial Extended', `Extended trial by ${extraDays} days for ${tenant.name}`);
    showToast(`Extended trial for ${tenant.name} until ${newRenewal}`, 'success');
  };

  // SaaS User Directory Actions
  const addTenantUser = (userData) => {
    const targetTenant = tenants.find(t => t.id === userData.tenantId);
    const newUser = {
      id: 'user-' + Date.now(),
      tenantId: userData.tenantId,
      tenantName: targetTenant?.name || userData.tenantName || 'Authorized Store',
      name: userData.name,
      username: userData.username || userData.name.toLowerCase().replace(/[^a-z0-9]/g, '.'),
      role: userData.role || 'Cashier / POS',
      phone: userData.phone || '',
      pin: userData.pin || '0000',
      status: 'Active',
      lastActive: 'Just now'
    };
    setTenantUsers(prev => [newUser, ...prev]);
    addLog('SaaS User Created', `Created user account: ${newUser.name} (${newUser.role})`);
    showToast(`Created account for ${newUser.name}`, 'success');
    return newUser;
  };

  const updateTenantUser = (userId, updatedFields) => {
    setTenantUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    showToast('User account updated', 'success');
  };

  const toggleTenantUserStatus = (userId) => {
    setTenantUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
      showToast(`User ${u.name} is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
      return { ...u, status: nextStatus };
    }));
  };

  const resetTenantUserPin = (userId, newPin) => {
    setTenantUsers(prev => prev.map(u => u.id === userId ? { ...u, pin: newPin } : u));
    showToast(`Reset PIN for user to ${newPin}`, 'success');
  };

  const deleteTenantUser = (userId) => {
    setTenantUsers(prev => prev.filter(u => u.id !== userId));
    showToast('User account removed', 'info');
  };

  const updateBroadcastMessage = (text, active = true, type = 'info') => {
    setBroadcastMessage({ text, active, type });
    addLog('Broadcast Announcement', `Updated global banner: "${text}"`);
    showToast('System broadcast announcement updated!', 'success');
  };

  const exportSaaSBackup = () => {
    const backupData = {
      version: '2.0.0-pro',
      exportDate: new Date().toISOString(),
      platform: 'AgriSol SaaS Multi-Tenant Cloud ERP',
      tenants,
      tenantUsers,
      saasBilling,
      broadcastMessage
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrisol_saas_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded complete SaaS multi-tenant backup snapshot!', 'success');
  };

  // Branch / Tenant switching with Staff Lock guard
  const switchBranch = (branchId) => {
    if (auth.user?.role === 'staff') {
      showToast(`Access Restricted: Staff members can only check data for their assigned branch (${auth.user?.branchName || 'Current Station'}).`, 'warning');
      return;
    }
    setActiveBranchId(branchId);
    const b = branches.find(br => br.id === branchId);
    showToast(`Switched branch to ${b?.name || branchId}`, 'info');
  };

  // Product Actions (Offline-First via IndexedDB + Neon Sync Queue)
  const addProduct = (p) => {
    const id = generateProductId();
    const newProd = {
      id,
      branchId: activeBranchId,
      name: p.name,
      sku: p.sku || 'SKU-' + Math.floor(100 + Math.random() * 900),
      generic: p.generic || '',
      barcode: p.barcode || '',
      batchNo: p.batchNo || '',
      mfgDate: p.mfgDate || '',
      expiryDate: p.expiryDate || '',
      category: p.category || 'Fertilizers',
      manufacturer: p.manufacturer || '',
      unit: p.unit || 'bag',
      unitWeight: Number(p.unitWeight) || 0,
      costPrice: Number(p.costPrice) || 0,
      salePrice: Number(p.salePrice) || 0,
      offerPrice: Number(p.offerPrice) || 0,
      shopStock: Number(p.shopStock) || 0,
      storeStock: Number(p.storeStock) || 0,
      alertQty: Number(p.alertQty) || 10,
      location: p.location || 'Godown Main',
      flags: p.flags || { active: true, narcotic: false, serialItem: false, keepRecord: true },
      notes: p.notes || '',
      synced: false,
      deleted: false,
      updatedAt: new Date().toISOString()
    };

    // 1. Write to IndexedDB FIRST
    saveLocalProduct(newProd, false).catch(err => {
      console.warn('[OfflineStorage] Error saving product to IndexedDB:', err);
    });

    // 2. Update UI state immediately
    setProducts(prev => [newProd, ...prev]);
    if (newProd.category && !categories.includes(newProd.category)) {
      setCategories(prev => [...prev, newProd.category]);
    }
    if (newProd.manufacturer && !manufacturers.includes(newProd.manufacturer)) {
      setManufacturers(prev => [...prev, newProd.manufacturer]);
    }
    addLog('Add Product', `Added ${newProd.name} (SKU: ${newProd.sku})`);
    showToast(`Product "${newProd.name}" saved!`, 'success');

    // 3. Best-effort non-blocking sync to Neon
    flushQueue().then(res => {
      if (res && res.syncedCount > 0) {
        setCloudConfig(prev => ({
          ...prev,
          syncStatus: 'synced',
          lastSyncTime: new Date().toISOString(),
          isNeonConnected: true
        }));
      }
    });

    return newProd;
  };

  const updateProduct = (id, updated) => {
    let updatedRecord = null;
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        updatedRecord = {
          ...p,
          ...updated,
          synced: false,
          updatedAt: new Date().toISOString()
        };
        return updatedRecord;
      }
      return p;
    }));

    if (updatedRecord) {
      saveLocalProduct(updatedRecord, false).catch(err => {
        console.warn('[OfflineStorage] Error updating product in IndexedDB:', err);
      });
      flushQueue();
    }

    addLog('Update Product', `Updated product ${id}`);
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id) => {
    if (auth.user?.role === 'staff') {
      showToast('⛔ Security Middleware: Staff members cannot delete products. Admin permission required.', 'warning');
      addLog('Security Middleware', `Blocked staff user from deleting product ${id}`);
      return;
    }
    const prod = products.find(p => p.id === id);

    // 1. Mark as tombstone in IndexedDB FIRST
    deleteLocalProduct(id).catch(err => {
      console.warn('[OfflineStorage] Error tombstoning product in IndexedDB:', err);
    });

    // 2. Remove from UI state immediately
    setProducts(prev => prev.filter(p => p.id !== id));
    addLog('Delete Product', `Deleted ${prod?.name || id}`);
    showToast('Product deleted', 'warning');

    // 3. Push delete to Neon
    flushQueue();
  };

  const transferStock = (id, fromLoc, toLoc, qty) => {
    const q = Number(qty) || 0;
    if (q <= 0) return false;
    let updatedRecord = null;
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      let shopStock = p.shopStock;
      let storeStock = p.storeStock;
      if (fromLoc === 'shop' && toLoc === 'store') {
        shopStock = Math.max(0, p.shopStock - q);
        storeStock = p.storeStock + q;
      } else if (fromLoc === 'store' && toLoc === 'shop') {
        storeStock = Math.max(0, p.storeStock - q);
        shopStock = p.shopStock + q;
      }
      updatedRecord = {
        ...p,
        shopStock,
        storeStock,
        synced: false,
        updatedAt: new Date().toISOString()
      };
      return updatedRecord;
    }));

    if (updatedRecord) {
      saveLocalProduct(updatedRecord, false).catch(err => {
        console.warn('[OfflineStorage] Error saving transferred product to IndexedDB:', err);
      });
      flushQueue();
    }

    addLog('Stock Transfer', `Moved ${q} units between ${fromLoc} and ${toLoc}`);
    showToast(`Transferred ${q} units successfully!`, 'success');
    return true;
  };

  // Sales / POS (Offline-First)
  const createSale = (saleData) => {
    const invoiceId = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newSale = {
      id: invoiceId,
      branchId: activeBranchId,
      invoiceNo: invoiceId,
      date: new Date().toISOString(),
      customerId: saleData.customerId,
      customerName: saleData.customerName,
      paymentType: saleData.paymentType,
      items: saleData.items,
      subtotal: Number(saleData.subtotal) || 0,
      discount: Number(saleData.discount) || 0,
      tax: Number(saleData.tax) || 0,
      grandTotal: Number(saleData.grandTotal) || 0,
      total: Number(saleData.grandTotal) || 0,
      paidAmount: Number(saleData.paidAmount) || 0,
      paid: Number(saleData.paidAmount) || 0,
      balanceAmount: Number(saleData.balanceAmount) || 0,
      balance: Number(saleData.balanceAmount) || 0,
      createdBy: auth.user?.username || 'admin',
      notes: saleData.notes || '',
      status: 'Completed',
      synced: false,
      deleted: false,
      updatedAt: new Date().toISOString()
    };

    // 1. Save sale to IndexedDB FIRST
    saveLocalSale(newSale, false).catch(e => console.warn(e));

    // 2. Deduct stock in IndexedDB & state
    setProducts(prev => prev.map(prod => {
      const lineItem = newSale.items.find(i => i.productId === prod.id);
      if (!lineItem) return prod;
      const updatedProd = {
        ...prod,
        storeStock: lineItem.source === 'store' ? Math.max(0, prod.storeStock - lineItem.qty) : prod.storeStock,
        shopStock: lineItem.source !== 'store' ? Math.max(0, prod.shopStock - lineItem.qty) : prod.shopStock,
        synced: false,
        updatedAt: new Date().toISOString()
      };
      saveLocalProduct(updatedProd, false).catch(e => console.warn(e));
      return updatedProd;
    }));

    // 3. Update Customer Khata balance if credit
    if (newSale.balanceAmount > 0 && newSale.customerId && newSale.customerId !== 'walk-in') {
      setCustomers(prev => prev.map(c => {
        if (c.id === newSale.customerId) {
          const updatedCust = {
            ...c,
            balance: (c.balance || 0) + newSale.balanceAmount,
            synced: false,
            updatedAt: new Date().toISOString()
          };
          saveLocalCustomer(updatedCust, false).catch(e => console.warn(e));
          return updatedCust;
        }
        return c;
      }));
    }

    setSales(prev => [newSale, ...prev]);
    addLog('New Sale', `Invoice ${newSale.id} - Rs ${newSale.grandTotal} (${newSale.customerName})`);
    showToast(`Sale completed! Invoice #${newSale.id}`, 'success');

    flushAllQueues();
    return newSale;
  };

  const parkSale = (cartData) => {
    const parked = {
      id: 'PARK-' + Date.now(),
      branchId: activeBranchId,
      date: new Date().toISOString(),
      customerName: cartData.customerName || 'Walk-in Customer',
      cart: cartData
    };
    setParkedSales(prev => [parked, ...prev]);
    addLog('Park Sale', `Held cart for ${parked.customerName}`);
    showToast(`Cart held for ${parked.customerName}`, 'info');
    return parked;
  };

  const resumeParkedSale = (parkedId) => {
    const item = parkedSales.find(p => p.id === parkedId);
    if (item) {
      setParkedSales(prev => prev.filter(p => p.id !== parkedId));
      showToast('Resumed parked cart', 'info');
      return item.cart;
    }
    return null;
  };

  // Payments (Offline-First)
  const addPayment = (payData) => {
    const payId = (payData.type === 'in' ? 'PAY-IN-' : 'PAY-OUT-') + Math.floor(100 + Math.random() * 900);
    const payment = {
      id: payId,
      branchId: activeBranchId,
      voucherNo: payId,
      date: new Date().toISOString(),
      type: payData.type,
      accountId: payData.accountId,
      accountName: payData.accountName,
      accountType: payData.accountType,
      amount: Number(payData.amount) || 0,
      mode: payData.mode || 'Cash',
      paymentMode: payData.mode || 'Cash',
      refNo: payData.refNo || '',
      reference: payData.refNo || '',
      remarks: payData.remarks || '',
      notes: payData.remarks || '',
      synced: false,
      deleted: false,
      updatedAt: new Date().toISOString()
    };

    saveLocalPayment(payment, false).catch(e => console.warn(e));

    if (payData.type === 'in') {
      setCustomers(prev => prev.map(c => {
        if (c.id === payData.accountId) {
          const updatedCust = { ...c, balance: (c.balance || 0) - payment.amount, synced: false, updatedAt: new Date().toISOString() };
          saveLocalCustomer(updatedCust, false).catch(e => console.warn(e));
          return updatedCust;
        }
        return c;
      }));
    } else {
      setSuppliers(prev => prev.map(s => {
        if (s.id === payData.accountId) {
          const updatedSup = { ...s, balance: (s.balance || 0) - payment.amount, synced: false, updatedAt: new Date().toISOString() };
          saveLocalSupplier(updatedSup, false).catch(e => console.warn(e));
          return updatedSup;
        }
        return s;
      }));
    }

    setPayments(prev => [payment, ...prev]);
    addLog(payData.type === 'in' ? 'Payment In' : 'Payment Out', `Rs ${payment.amount} (${payment.accountName})`);
    showToast(`Payment recorded: Rs ${payment.amount}`, 'success');

    flushAllQueues();
    return payment;
  };

  // Customer & Supplier Accounts (Offline-First)
  const addCustomer = (c) => {
    const newCust = {
      id: generateEntityId('cust'),
      branchId: activeBranchId,
      name: c.name,
      fatherName: c.fatherName || '',
      phone: c.phone || '',
      village: c.village || '',
      cnic: c.cnic || '',
      address: c.address || c.village || '',
      creditLimit: Number(c.creditLimit) || 200000,
      openingBalance: Number(c.openingBalance) || 0,
      balance: Number(c.balance) || 0,
      type: c.type || 'Farmer',
      notes: c.notes || '',
      synced: false,
      deleted: false,
      updatedAt: new Date().toISOString()
    };

    saveLocalCustomer(newCust, false).catch(e => console.warn(e));
    setCustomers(prev => [...prev, newCust]);
    addLog('Add Customer', `Added ${newCust.name}`);
    showToast(`Customer ${newCust.name} added!`, 'success');

    flushAllQueues();
    return newCust;
  };

  const addSupplier = (s) => {
    const newSup = {
      id: generateEntityId('sup'),
      branchId: activeBranchId,
      name: s.name,
      company: s.company || '',
      contactPerson: s.contactPerson || '',
      phone: s.phone || '',
      address: s.address || s.city || '',
      balance: Number(s.balance) || 0,
      city: s.city || '',
      notes: s.notes || '',
      synced: false,
      deleted: false,
      updatedAt: new Date().toISOString()
    };

    saveLocalSupplier(newSup, false).catch(e => console.warn(e));
    setSuppliers(prev => [...prev, newSup]);
    addLog('Add Supplier', `Added ${newSup.name}`);
    showToast(`Supplier ${newSup.name} added!`, 'success');

    flushAllQueues();
    return newSup;
  };

  const updateCustomer = (id, updatedFields) => {
    let updatedCust = null;
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        updatedCust = { ...c, ...updatedFields, synced: false, updatedAt: new Date().toISOString() };
        return updatedCust;
      }
      return c;
    }));

    if (updatedCust) {
      saveLocalCustomer(updatedCust, false).catch(e => console.warn(e));
      flushAllQueues();
    }
    addLog('Update Customer', `Updated customer account ${id}`);
    showToast('Customer account updated!', 'success');
  };

  const deleteCustomer = (id) => {
    if (auth.user?.role === 'staff') {
      showToast('⛔ Security Middleware: Staff members cannot delete customer accounts.', 'warning');
      addLog('Security Middleware', `Blocked staff user from deleting customer account ${id}`);
      return;
    }
    const cust = customers.find(c => c.id === id);
    deleteLocalCustomer(id).catch(e => console.warn(e));
    setCustomers(prev => prev.filter(c => c.id !== id));
    addLog('Delete Customer', `Removed customer ${cust?.name || id}`);
    showToast('Customer account removed', 'warning');
    flushAllQueues();
  };

  const updateSupplier = (id, updatedFields) => {
    let updatedSup = null;
    setSuppliers(prev => prev.map(s => {
      if (s.id === id) {
        updatedSup = { ...s, ...updatedFields, synced: false, updatedAt: new Date().toISOString() };
        return updatedSup;
      }
      return s;
    }));

    if (updatedSup) {
      saveLocalSupplier(updatedSup, false).catch(e => console.warn(e));
      flushAllQueues();
    }
    addLog('Update Supplier', `Updated supplier account ${id}`);
    showToast('Supplier account updated!', 'success');
  };

  const deleteSupplier = (id) => {
    if (auth.user?.role === 'staff') {
      showToast('⛔ Security Middleware: Staff members cannot delete supplier accounts.', 'warning');
      addLog('Security Middleware', `Blocked staff user from deleting supplier account ${id}`);
      return;
    }
    const sup = suppliers.find(s => s.id === id);
    deleteLocalSupplier(id).catch(e => console.warn(e));
    setSuppliers(prev => prev.filter(s => s.id !== id));
    addLog('Delete Supplier', `Removed supplier ${sup?.name || id}`);
    showToast('Supplier account removed', 'warning');
    flushAllQueues();
  };

  const deleteSale = (saleId) => {
    if (auth.user?.role === 'staff') {
      showToast('⛔ Security Middleware: Staff members cannot void or delete sales invoices. Admin authorization required.', 'warning');
      addLog('Security Middleware', `Blocked staff user from deleting sale ${saleId}`);
      return;
    }
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    deleteLocalSale(saleId).catch(e => console.warn(e));

    // 1. Revert product inventory
    setProducts(prev => prev.map(prod => {
      const item = sale.items?.find(it => it.productId === prod.id);
      if (!item) return prod;
      const updatedProd = {
        ...prod,
        storeStock: item.source === 'store' ? (prod.storeStock || 0) + (item.qty || 0) : prod.storeStock,
        shopStock: item.source !== 'store' ? (prod.shopStock || 0) + (item.qty || 0) : prod.shopStock,
        synced: false,
        updatedAt: new Date().toISOString()
      };
      saveLocalProduct(updatedProd, false).catch(e => console.warn(e));
      return updatedProd;
    }));

    // 2. Revert customer balance if credit sale
    if (sale.balanceAmount > 0 && sale.customerId && sale.customerId !== 'walk-in') {
      setCustomers(prev => prev.map(c => {
        if (c.id === sale.customerId) {
          const updatedCust = {
            ...c,
            balance: Math.max(0, (c.balance || 0) - sale.balanceAmount),
            synced: false,
            updatedAt: new Date().toISOString()
          };
          saveLocalCustomer(updatedCust, false).catch(e => console.warn(e));
          return updatedCust;
        }
        return c;
      }));
    }

    setSales(prev => prev.filter(s => s.id !== saleId));
    addLog('Delete Sale', `Deleted invoice ${saleId} (${sale.customerName}) - Restored stock and adjusted customer ledger`);
    showToast(`Invoice ${saleId} deleted. Stock & khata restored!`, 'info');
    flushAllQueues();
  };

  const deletePayment = (payId) => {
    if (auth.user?.role === 'staff') {
      showToast('⛔ Security Middleware: Staff members cannot delete cash vouchers or payment entries.', 'warning');
      addLog('Security Middleware', `Blocked staff user from deleting payment ${payId}`);
      return;
    }
    const pay = payments.find(p => p.id === payId);
    if (!pay) return;

    deleteLocalPayment(payId).catch(e => console.warn(e));

    // Revert balance change
    if (pay.type === 'in') {
      setCustomers(prev => prev.map(c => {
        if (c.id === pay.accountId) {
          const updatedCust = { ...c, balance: (c.balance || 0) + pay.amount, synced: false, updatedAt: new Date().toISOString() };
          saveLocalCustomer(updatedCust, false).catch(e => console.warn(e));
          return updatedCust;
        }
        return c;
      }));
    } else {
      setSuppliers(prev => prev.map(s => {
        if (s.id === pay.accountId) {
          const updatedSup = { ...s, balance: (s.balance || 0) + pay.amount, synced: false, updatedAt: new Date().toISOString() };
          saveLocalSupplier(updatedSup, false).catch(e => console.warn(e));
          return updatedSup;
        }
        return s;
      }));
    }

    setPayments(prev => prev.filter(p => p.id !== payId));
    addLog('Delete Payment', `Deleted payment voucher ${payId} (Rs ${pay.amount}) - Reverted account ledger`);
    showToast(`Payment voucher ${payId} deleted and ledger restored!`, 'info');
    flushAllQueues();
  };

  const deletePurchase = (poId) => {
    const po = purchases.find(p => p.id === poId);
    if (!po) return;

    deleteLocalPurchase(poId).catch(e => console.warn(e));

    // Deduct received stock from product
    setProducts(prev => prev.map(prod => {
      if (prod.id !== po.productId) return prod;
      const updatedProd = {
        ...prod,
        shopStock: po.targetLoc === 'shop' ? Math.max(0, (prod.shopStock || 0) - (po.qty || 0)) : prod.shopStock,
        storeStock: po.targetLoc !== 'shop' ? Math.max(0, (prod.storeStock || 0) - (po.qty || 0)) : prod.storeStock,
        synced: false,
        updatedAt: new Date().toISOString()
      };
      saveLocalProduct(updatedProd, false).catch(e => console.warn(e));
      return updatedProd;
    }));

    // Revert supplier balance if credit
    if (po.paymentMode?.includes('Credit')) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === po.supplierId) {
          const updatedSup = {
            ...s,
            balance: Math.max(0, (s.balance || 0) - (po.totalCost || 0)),
            synced: false,
            updatedAt: new Date().toISOString()
          };
          saveLocalSupplier(updatedSup, false).catch(e => console.warn(e));
          return updatedSup;
        }
        return s;
      }));
    }

    setPurchases(prev => prev.filter(p => p.id !== poId));
    addLog('Delete Purchase', `Deleted PO ${poId} (${po.productName}) - Restored stock and supplier ledger`);
    showToast(`Purchase order ${poId} deleted`, 'info');
    flushAllQueues();
  };

  const deleteHoldStock = (id) => {
    const item = holdStock.find(h => h.id === id);
    deleteLocalHoldStock(id).catch(e => console.warn(e));
    setHoldStock(prev => prev.filter(h => h.id !== id));
    addLog('Delete Custody Record', `Removed customer custody ${id} (${item?.customerName || id})`);
    showToast('Customer custody record removed', 'info');
    flushAllQueues();
  };

  // Inward Purchase & Stock In (Offline-First)
  const recordPurchase = (pData) => {
    const poId = 'PO-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const numQty = Number(pData.qty) || 1;
    const unitCost = Number(pData.unitCost) || 0;
    const totalCost = numQty * unitCost;

    const newPO = {
      id: poId,
      branchId: activeBranchId,
      poNumber: poId,
      date: new Date().toISOString(),
      supplierId: pData.supplierId,
      supplierName: pData.supplierName,
      productId: pData.productId,
      productName: pData.productName,
      qty: numQty,
      unit: pData.unit || 'bag',
      unitCost,
      totalCost,
      subtotal: totalCost,
      total: totalCost,
      paid: pData.paymentMode?.includes('Credit') ? 0 : totalCost,
      balance: pData.paymentMode?.includes('Credit') ? totalCost : 0,
      paymentMode: pData.paymentMode || 'Credit (Payable Khata)',
      targetLoc: pData.targetLoc || 'store',
      status: `Received in ${pData.targetLoc === 'store' ? 'Godown' : 'Shop'}`,
      notes: '',
      synced: false,
      deleted: false,
      updatedAt: new Date().toISOString()
    };

    saveLocalPurchase(newPO, false).catch(e => console.warn(e));

    // Update Product Stock & Cost
    setProducts(prev => prev.map(prod => {
      if (prod.id !== pData.productId) return prod;
      const updatedProd = {
        ...prod,
        costPrice: unitCost > 0 ? unitCost : prod.costPrice,
        shopStock: pData.targetLoc === 'shop' ? (prod.shopStock || 0) + numQty : (prod.shopStock || 0),
        storeStock: pData.targetLoc === 'store' ? (prod.storeStock || 0) + numQty : (prod.storeStock || 0),
        synced: false,
        updatedAt: new Date().toISOString()
      };
      saveLocalProduct(updatedProd, false).catch(e => console.warn(e));
      return updatedProd;
    }));

    // Update Supplier Balance if Credit
    if (newPO.paymentMode.includes('Credit')) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === pData.supplierId) {
          const updatedSup = {
            ...s,
            balance: (s.balance || 0) + totalCost,
            synced: false,
            updatedAt: new Date().toISOString()
          };
          saveLocalSupplier(updatedSup, false).catch(e => console.warn(e));
          return updatedSup;
        }
        return s;
      }));
    } else {
      // Create Outward Payment Voucher for Instant Cash / Bank
      const payId = 'PAY-OUT-' + Math.floor(100 + Math.random() * 900);
      const payment = {
        id: payId,
        branchId: activeBranchId,
        voucherNo: payId,
        date: new Date().toISOString(),
        type: 'out',
        accountId: pData.supplierId,
        accountName: pData.supplierName,
        accountType: 'supplier',
        amount: totalCost,
        mode: pData.paymentMode.includes('Bank') ? 'Bank Transfer' : 'Cash',
        paymentMode: pData.paymentMode.includes('Bank') ? 'Bank Transfer' : 'Cash',
        refNo: poId,
        reference: poId,
        remarks: `Auto-voucher for Inward Stock PO ${poId}`,
        notes: `Auto-voucher for Inward Stock PO ${poId}`,
        synced: false,
        deleted: false,
        updatedAt: new Date().toISOString()
      };
      saveLocalPayment(payment, false).catch(e => console.warn(e));
      setPayments(prev => [payment, ...prev]);
    }

    setPurchases(prev => [newPO, ...prev]);
    addLog('Inward Stock Purchase', `PO #${poId} received ${numQty} ${newPO.unit} of ${newPO.productName} from ${newPO.supplierName} (Total Rs ${totalCost})`);
    showToast(`Inward stock PO #${poId} recorded!`, 'success');

    flushAllQueues();
    return newPO;
  };

  // Hold Stock / Custody (Amanat) (Offline-First)
  const addHoldStock = (h) => {
    const holdId = generateEntityId('hold');
    const hold = {
      id: holdId,
      branchId: activeBranchId,
      bookingNo: holdId,
      date: new Date().toISOString().split('T')[0],
      bookingDate: new Date().toISOString().split('T')[0],
      customerId: h.customerId,
      customerName: h.customerName,
      productId: h.productId,
      productName: h.productName,
      totalBags: Number(h.totalBags) || 0,
      qty: Number(h.totalBags) || 0,
      unit: 'bag',
      releasedBags: 0,
      remainingBags: Number(h.totalBags) || 0,
      location: h.location || 'Godown Main',
      status: 'Active Custody',
      notes: h.notes || '',
      synced: false,
      deleted: false,
      updatedAt: new Date().toISOString()
    };

    saveLocalHoldStock(hold, false).catch(e => console.warn(e));
    setHoldStock(prev => [hold, ...prev]);
    addLog('Hold Stock', `Booked ${hold.totalBags} bags for ${hold.customerName}`);
    showToast(`Amanat stock custody booked: ${hold.totalBags} bags!`, 'success');

    flushAllQueues();
    return hold;
  };

  const releaseHoldStock = (holdId, qty) => {
    const q = Number(qty) || 0;
    let updatedHold = null;
    setHoldStock(prev => prev.map(h => {
      if (h.id !== holdId) return h;
      const rem = Math.max(0, h.remainingBags - q);
      updatedHold = {
        ...h,
        releasedBags: h.releasedBags + q,
        remainingBags: rem,
        qty: rem,
        status: rem === 0 ? 'Fully Dispatched' : 'Active Custody',
        synced: false,
        updatedAt: new Date().toISOString()
      };
      return updatedHold;
    }));

    if (updatedHold) {
      saveLocalHoldStock(updatedHold, false).catch(e => console.warn(e));
      flushAllQueues();
    }
    addLog('Release Stock', `Dispatched ${q} bags`);
    showToast(`Dispatched ${q} bags from custody!`, 'success');
  };

  // Temp Ledger (Katcha Khata) (Offline-First)
  const addTempLedger = (entry) => {
    const tempId = generateEntityId('temp');
    const item = {
      id: tempId,
      branchId: activeBranchId,
      date: new Date().toISOString().split('T')[0],
      partyName: entry.partyName,
      personName: entry.partyName,
      phone: entry.phone || '',
      details: entry.details,
      description: entry.details,
      amount: Number(entry.amount) || 0,
      type: entry.type || 'Sale',
      status: 'Pending',
      isCleared: false,
      notes: entry.notes || '',
      synced: false,
      deleted: false,
      updatedAt: new Date().toISOString()
    };

    saveLocalTempLedger(item, false).catch(e => console.warn(e));
    setTempLedger(prev => [item, ...prev]);
    showToast('Temp entry noted in Katcha Khata', 'info');

    flushAllQueues();
  };

  const approveTempLedger = (id) => {
    let updatedTemp = null;
    setTempLedger(prev => prev.map(t => {
      if (t.id === id) {
        updatedTemp = {
          ...t,
          status: 'Reconciled / Settled',
          isCleared: true,
          synced: false,
          updatedAt: new Date().toISOString()
        };
        return updatedTemp;
      }
      return t;
    }));

    if (updatedTemp) {
      saveLocalTempLedger(updatedTemp, false).catch(e => console.warn(e));
      flushAllQueues();
    }
    showToast('Temp entry reconciled', 'success');
  };

  const deleteTempLedger = (id) => {
    deleteLocalTempLedger(id).catch(e => console.warn(e));
    setTempLedger(prev => prev.filter(t => t.id !== id));
    showToast('Temp entry removed', 'info');
    flushAllQueues();
  };

  const resetAllData = () => {
    if (auth.user?.role === 'staff') {
      showToast('⛔ Security Middleware: Staff members cannot wipe or reset database.', 'danger');
      addLog('Security Middleware', 'Blocked staff user from resetting store database');
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    setProducts([]);
    setCustomers([]);
    setSuppliers([]);
    setSales([]);
    setPurchases([]);
    setPayments([]);
    setHoldStock([]);
    setTempLedger([]);
    setParkedSales([]);
    addLog('System Reset', 'All live transactional data reset to clean initial database');
    showToast('Clean live database initialized', 'info');
  };

  // Metrics calculations for Active Branch
  const branchProducts = products.filter(p => !p.branchId || p.branchId === activeBranchId);
  const branchSales = sales.filter(s => !s.branchId || s.branchId === activeBranchId);
  const branchPayments = payments.filter(p => !p.branchId || p.branchId === activeBranchId);
  const branchCustomers = customers.filter(c => !c.branchId || c.branchId === activeBranchId);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = branchSales.filter(s => s.date.startsWith(todayStr));

  const todayCashSales = todaySales
    .filter(s => s.paymentType === 'cash')
    .reduce((sum, s) => sum + s.paidAmount, 0);

  const todayLedgerSales = todaySales
    .filter(s => s.paymentType === 'ledger' || s.balanceAmount > 0)
    .reduce((sum, s) => sum + s.balanceAmount, 0);

  const cashInToday = branchPayments
    .filter(p => p.type === 'in' && p.mode === 'Cash' && p.date.startsWith(todayStr))
    .reduce((sum, p) => sum + p.amount, 0);

  const cashOutToday = branchPayments
    .filter(p => p.type === 'out' && p.mode === 'Cash' && p.date.startsWith(todayStr))
    .reduce((sum, p) => sum + p.amount, 0);

  const cashInHand = todayCashSales + cashInToday - cashOutToday;

  let totalInventoryValue = 0;
  let totalRetailValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalStockUnits = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;
  const criticalExpiryProducts = [];

  const todayZero = new Date();
  todayZero.setHours(0, 0, 0, 0);

  branchProducts.forEach(p => {
    const totalUnits = (p.shopStock || 0) + (p.storeStock || 0);
    totalStockUnits += totalUnits;
    totalInventoryValue += totalUnits * (p.costPrice || 0);
    totalRetailValue += totalUnits * (p.salePrice || 0);

    if (totalUnits === 0) outOfStockCount++;
    else if (totalUnits <= (p.alertQty || 10)) lowStockCount++;

    if (p.expiryDate) {
      const expDate = new Date(p.expiryDate);
      expDate.setHours(0, 0, 0, 0);
      if (!isNaN(expDate.getTime())) {
        const diffTime = expDate.getTime() - todayZero.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          expiredCount++;
          criticalExpiryProducts.push({
            ...p,
            daysLeft: diffDays,
            totalUnits,
            isExpired: true,
            isExpiringSoon: false,
            stockValueAtRisk: totalUnits * (p.costPrice || 0)
          });
        } else if (diffDays <= 7) {
          expiringSoonCount++;
          criticalExpiryProducts.push({
            ...p,
            daysLeft: diffDays,
            totalUnits,
            isExpired: false,
            isExpiringSoon: true,
            stockValueAtRisk: totalUnits * (p.costPrice || 0)
          });
        }
      }
    }
  });

  criticalExpiryProducts.sort((a, b) => a.daysLeft - b.daysLeft);

  // Expiry notification toast on session start
  useEffect(() => {
    if (auth.isAuthenticated && criticalExpiryProducts.length > 0) {
      const sessionKey = 'agrotrader_notified_expiry_' + todayStr;
      const alreadyNotified = typeof window !== 'undefined' ? sessionStorage.getItem(sessionKey) : null;
      if (!alreadyNotified) {
        if (typeof window !== 'undefined') sessionStorage.setItem(sessionKey, 'true');
        const first = criticalExpiryProducts[0];
        const count = criticalExpiryProducts.length;
        if (count === 1) {
          showToast(`⚠️ Expiry Alert: "${first.name}" expires in ${first.daysLeft <= 0 ? 'less than 24h or expired' : first.daysLeft + ' days'}!`, 'warning');
        } else {
          showToast(`⚠️ Expiry Alert: ${count} products are expiring within 7 days (including "${first.name}")! Check Expiry Card.`, 'warning');
        }
      }
    }
  }, [auth.isAuthenticated, criticalExpiryProducts.length, todayStr]);

  const potentialProfit = Math.max(0, totalRetailValue - totalInventoryValue);

  const metrics = {
    todayCashSales,
    todayCashCount: todaySales.filter(s => s.paymentType === 'cash').length,
    todayLedgerSales,
    todayLedgerCount: todaySales.filter(s => s.paymentType === 'ledger' || s.balanceAmount > 0).length,
    cashInHand,
    cashTransactionsToday: todaySales.filter(s => s.paymentType === 'cash').length + branchPayments.filter(p => p.mode === 'Cash' && p.date.startsWith(todayStr)).length,
    totalProducts: branchProducts.length,
    activeProducts: branchProducts.filter(p => p.flags?.active !== false).length,
    totalInventoryValue,
    totalRetailValue,
    potentialProfit,
    lowStockCount,
    outOfStockCount,
    expiringSoonCount,
    expiredCount,
    totalCriticalExpiryCount: criticalExpiryProducts.length,
    criticalExpiryProducts,
    totalStockUnits,
    categoryCount: new Set(branchProducts.map(p => p.category)).size
  };

  return (
    <AppContext.Provider
      value={{
        isLoaded,
        theme,
        setTheme: setThemeState,
        hideAmounts,
        toggleHideAmounts: () => setHideAmounts(prev => !prev),
        activeTab,
        setActiveTab,
        activeBranchId,
        switchBranch,
        branches,
        tenants,
        tenantUsers,
        saasBilling,
        broadcastMessage,
        activeTenantId,
        impersonatingTenant,
        createTenant,
        updateTenant,
        toggleTenantStatus,
        impersonateTenant,
        exitImpersonation,
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
        saasPlan,
        auth,
        staffPermissions,
        updateStaffPermissions,
        login,
        logout,
        resetPin,
        storeProfile,
        setStoreProfile,
        products: branchProducts,
        allProducts: products,
        categories,
        manufacturers,
        units,
        customers: branchCustomers,
        allCustomers: customers,
        suppliers,
        sales: branchSales,
        allSales: sales,
        isOnline,
        cloudConfig,
        updateCloudConfig,
        syncWithCloud,
        pushToCloud,
        pullFromCloud,
        flushQueue,
        syncProductsFull,
        flushAllQueues,
        syncAllFull,
        purchases: purchases.filter(po => !po.branchId || po.branchId === activeBranchId),
        allPurchases: purchases,
        payments: branchPayments,
        holdStock: holdStock.filter(h => !h.branchId || h.branchId === activeBranchId),
        tempLedger: tempLedger.filter(t => !t.branchId || t.branchId === activeBranchId),
        parkedSales: parkedSales.filter(p => !p.branchId || p.branchId === activeBranchId),
        logs,
        toasts,
        showToast,
        metrics,
        criticalExpiryProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        transferStock,
        createSale,
        deleteSale,
        parkSale,
        resumeParkedSale,
        recordPurchase,
        deletePurchase,
        addPayment,
        deletePayment,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addHoldStock,
        releaseHoldStock,
        deleteHoldStock,
        addTempLedger,
        approveTempLedger,
        deleteTempLedger,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
