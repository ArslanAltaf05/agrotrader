(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/SuperAdminView.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SuperAdminView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/formatters.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/icons.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function SuperAdminView() {
    _s();
    const { tenants, tenantUsers, saasBilling, broadcastMessage, createTenant, updateTenant, toggleTenantStatus, impersonateTenant, resetTenantAdminPin, deleteTenant, recordSubscriptionPayment, extendTenantTrial, addTenantUser, updateTenantUser, toggleTenantUserStatus, resetTenantUserPin, deleteTenantUser, updateBroadcastMessage, exportSaaSBackup, showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    // Navigation Sub-Tabs: 'tenants' | 'users' | 'billing' | 'broadcast' | 'infra'
    const [activeSubTab, setActiveSubTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('tenants');
    // Filters for Tenants
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterPlan, setFilterPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('All');
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('All');
    // Filters for Users
    const [userSearchQuery, setUserSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [userFilterStore, setUserFilterStore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('All');
    const [userFilterRole, setUserFilterRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('All');
    // Filters for Billing
    const [billingSearchQuery, setBillingSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Modals
    const [showCreateStoreModal, setShowCreateStoreModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingTenant, setEditingTenant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [viewingTenant, setViewingTenant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [paymentModalTenant, setPaymentModalTenant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resetPinTenant, setResetPinTenant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newPinValue, setNewPinValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('1234');
    const [showAddUserModal, setShowAddUserModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Forms State
    const [createStoreForm, setCreateStoreForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
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
    const [paymentForm, setPaymentForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        amount: 12000,
        months: 1,
        method: 'Meezan Bank Raast / IBFT',
        ref: ''
    });
    const [newUserForm, setNewUserForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tenantId: tenants[0]?.id || 'tenant-1',
        name: '',
        username: '',
        role: 'Cashier / POS',
        phone: '',
        pin: '0000'
    });
    const [announcementText, setAnnouncementText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(broadcastMessage?.text || '🌾 Welcome to AgriSol SaaS v2.0 - Offline-First Hybrid Architecture Active.');
    const [announcementActive, setAnnouncementActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(broadcastMessage?.active ?? true);
    // Calculate SaaS Global Metrics
    const metrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SuperAdminView.useMemo[metrics]": ()=>{
            const totalTenants = tenants.length;
            const activeTenants = tenants.filter({
                "SuperAdminView.useMemo[metrics]": (t)=>t.status === 'Active'
            }["SuperAdminView.useMemo[metrics]"]).length;
            const trialTenants = tenants.filter({
                "SuperAdminView.useMemo[metrics]": (t)=>t.status === 'Trial' || t.status === 'Trial Active'
            }["SuperAdminView.useMemo[metrics]"]).length;
            const suspendedTenants = tenants.filter({
                "SuperAdminView.useMemo[metrics]": (t)=>t.status === 'Suspended'
            }["SuperAdminView.useMemo[metrics]"]).length;
            const totalMRR = tenants.filter({
                "SuperAdminView.useMemo[metrics].totalMRR": (t)=>t.status === 'Active' || t.status === 'Trial'
            }["SuperAdminView.useMemo[metrics].totalMRR"]).reduce({
                "SuperAdminView.useMemo[metrics].totalMRR": (sum, t)=>sum + (t.monthlyFee || 0)
            }["SuperAdminView.useMemo[metrics].totalMRR"], 0);
            const totalARR = totalMRR * 12;
            const totalBranches = tenants.reduce({
                "SuperAdminView.useMemo[metrics].totalBranches": (sum, t)=>sum + (t.activeBranchesCount || 1)
            }["SuperAdminView.useMemo[metrics].totalBranches"], 0);
            const totalInvoices = tenants.reduce({
                "SuperAdminView.useMemo[metrics].totalInvoices": (sum, t)=>sum + (t.totalInvoicesCount || 0)
            }["SuperAdminView.useMemo[metrics].totalInvoices"], 0);
            const totalUsersCount = tenantUsers.length;
            const totalCollectedRevenue = saasBilling.reduce({
                "SuperAdminView.useMemo[metrics].totalCollectedRevenue": (sum, b)=>sum + (b.amount || 0)
            }["SuperAdminView.useMemo[metrics].totalCollectedRevenue"], 0);
            // Expiring soon (within 15 days)
            const now = new Date();
            const expiringSoonTenants = tenants.filter({
                "SuperAdminView.useMemo[metrics].expiringSoonTenants": (t)=>{
                    if (!t.renewalDate) return false;
                    const rDate = new Date(t.renewalDate);
                    const diffDays = Math.ceil((rDate - now) / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 15;
                }
            }["SuperAdminView.useMemo[metrics].expiringSoonTenants"]);
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
        }
    }["SuperAdminView.useMemo[metrics]"], [
        tenants,
        tenantUsers,
        saasBilling
    ]);
    // Filtered tenants list
    const filteredTenants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SuperAdminView.useMemo[filteredTenants]": ()=>{
            const now = new Date();
            return tenants.filter({
                "SuperAdminView.useMemo[filteredTenants]": (t)=>{
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
                }
            }["SuperAdminView.useMemo[filteredTenants]"]);
        }
    }["SuperAdminView.useMemo[filteredTenants]"], [
        tenants,
        filterPlan,
        filterStatus,
        searchQuery
    ]);
    // Filtered users list
    const filteredUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SuperAdminView.useMemo[filteredUsers]": ()=>{
            return tenantUsers.filter({
                "SuperAdminView.useMemo[filteredUsers]": (u)=>{
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
                }
            }["SuperAdminView.useMemo[filteredUsers]"]);
        }
    }["SuperAdminView.useMemo[filteredUsers]"], [
        tenantUsers,
        userFilterStore,
        userFilterRole,
        userSearchQuery
    ]);
    // Filtered billing list
    const filteredBilling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SuperAdminView.useMemo[filteredBilling]": ()=>{
            return saasBilling.filter({
                "SuperAdminView.useMemo[filteredBilling]": (b)=>{
                    if (billingSearchQuery.trim()) {
                        const q = billingSearchQuery.toLowerCase();
                        const mStore = b.tenantName?.toLowerCase().includes(q);
                        const mRef = b.transactionRef?.toLowerCase().includes(q);
                        const mMethod = b.method?.toLowerCase().includes(q);
                        if (!mStore && !mRef && !mMethod) return false;
                    }
                    return true;
                }
            }["SuperAdminView.useMemo[filteredBilling]"]);
        }
    }["SuperAdminView.useMemo[filteredBilling]"], [
        saasBilling,
        billingSearchQuery
    ]);
    // Handle Create Store
    const handleCreateStoreSubmit = (e)=>{
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
        if (tenants.some((t)=>t.username && t.username.toLowerCase() === cleanU)) {
            alert(`Username "${cleanU}" is already taken by another store. Please choose a unique username.`);
            return;
        }
        const created = createTenant({
            ...createStoreForm,
            username: cleanU
        });
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
    const handleEditSubmit = (e)=>{
        e.preventDefault();
        if (!editingTenant) return;
        updateTenant(editingTenant.id, editingTenant);
        setEditingTenant(null);
    };
    // Handle Reset Pin
    const handleResetPinSubmit = (e)=>{
        e.preventDefault();
        if (!resetPinTenant) return;
        resetTenantAdminPin(resetPinTenant.id, newPinValue);
        setResetPinTenant(null);
    };
    // Handle Subscription Payment
    const handlePaymentSubmit = (e)=>{
        e.preventDefault();
        if (!paymentModalTenant) return;
        recordSubscriptionPayment(paymentModalTenant.id, paymentForm.amount, paymentForm.months, paymentForm.method, paymentForm.ref);
        setPaymentModalTenant(null);
    };
    // Handle Add User
    const handleAddUserSubmit = (e)=>{
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
    const openWhatsAppToOwner = (tenant)=>{
        const rawPhone = tenant.phone?.replace(/[^0-9]/g, '') || '';
        const formattedPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
        const message = encodeURIComponent(`Assalam-o-Alaikum ${tenant.ownerName} sb, this is the AgriSol SaaS Support Desk regarding your ${tenant.name} store portal. How can we assist your business today?`);
        window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-body",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                style: {
                    background: 'linear-gradient(135deg, #091325 0%, #172554 45%, #1e1b4b 100%)',
                    color: '#ffffff',
                    marginBottom: '20px',
                    padding: '24px 28px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
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
                                        },
                                        children: "🛡️"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 312,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        style: {
                                                            fontSize: '22px',
                                                            fontWeight: 800,
                                                            letterSpacing: '-0.3px',
                                                            margin: 0
                                                        },
                                                        children: "AgriSol SaaS Master Super Admin Console"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 330,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            background: 'rgba(52, 211, 153, 0.2)',
                                                            color: '#34d399',
                                                            border: '1px solid rgba(52, 211, 153, 0.4)',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '11px',
                                                            fontWeight: 700
                                                        },
                                                        children: "LIVE v2.0 PRO"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 333,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 329,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '13px',
                                                    opacity: 0.85,
                                                    marginTop: '4px'
                                                },
                                                children: "Centralized multi-tenant management for Pakistan Agriculture dealers, subscription billing, and branch networks."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 328,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "btn btn-outline",
                                        style: {
                                            color: '#fff',
                                            borderColor: 'rgba(255,255,255,0.3)',
                                            fontWeight: 600,
                                            fontSize: '12px'
                                        },
                                        onClick: exportSaaSBackup,
                                        title: "Download entire SaaS database snapshot as JSON",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "📥 Export SaaS Backup"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 361,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 354,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "btn btn-accent",
                                        style: {
                                            fontWeight: 700,
                                            padding: '9px 18px',
                                            fontSize: '13px',
                                            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
                                        },
                                        onClick: ()=>setShowCreateStoreModal(true),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "+ Register New SaaS Store"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 369,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 363,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '16px',
                            marginTop: '22px',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(255,255,255,0.12)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.6px',
                                            opacity: 0.75
                                        },
                                        children: "Total SaaS Dealer Stores"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 386,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '26px',
                                            fontWeight: 800,
                                            marginTop: '2px'
                                        },
                                        children: [
                                            metrics.totalTenants,
                                            " Stores"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 389,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11.5px',
                                            opacity: 0.85,
                                            marginTop: '2px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#34d399',
                                                    fontWeight: 700
                                                },
                                                children: [
                                                    metrics.activeTenants,
                                                    " Active"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 393,
                                                columnNumber: 15
                                            }, this),
                                            " • ",
                                            metrics.trialTenants,
                                            " Trial"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 392,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 385,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.6px',
                                            opacity: 0.75
                                        },
                                        children: "Monthly Recurring Revenue (MRR)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '26px',
                                            fontWeight: 800,
                                            color: '#fcd34d',
                                            marginTop: '2px'
                                        },
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(metrics.totalMRR)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11.5px',
                                            opacity: 0.85,
                                            marginTop: '2px'
                                        },
                                        children: [
                                            "ARR Run-Rate: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(metrics.totalARR)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 405,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 404,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 397,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.6px',
                                            opacity: 0.75
                                        },
                                        children: "Connected Store Terminals"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 410,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '26px',
                                            fontWeight: 800,
                                            marginTop: '2px'
                                        },
                                        children: [
                                            metrics.totalBranches,
                                            " Locations"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 413,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11.5px',
                                            opacity: 0.85,
                                            marginTop: '2px'
                                        },
                                        children: [
                                            metrics.totalUsersCount,
                                            " Operators • Multi-Godowns"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 416,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 409,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.6px',
                                            opacity: 0.75
                                        },
                                        children: "Renewals Due (Next 15 Days)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 422,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '26px',
                                            fontWeight: 800,
                                            color: metrics.expiringSoonCount > 0 ? '#fb923c' : '#34d399',
                                            marginTop: '2px'
                                        },
                                        children: [
                                            metrics.expiringSoonCount,
                                            " Stores"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 425,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11.5px',
                                            opacity: 0.85,
                                            marginTop: '2px'
                                        },
                                        children: metrics.expiringSoonCount > 0 ? 'Reminders ready to dispatch' : 'All subscriptions up to date'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 428,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 421,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.6px',
                                            opacity: 0.75
                                        },
                                        children: "Cloud & Offline Sync Health"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 434,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '26px',
                                            fontWeight: 800,
                                            color: '#34d399',
                                            marginTop: '2px'
                                        },
                                        children: "99.98% Uptime"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11.5px',
                                            opacity: 0.85,
                                            marginTop: '2px'
                                        },
                                        children: "SQLite • 18ms Cloud Sync Latency"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 440,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 433,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "filter-bar",
                style: {
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "segmented-control",
                    style: {
                        overflowX: 'auto',
                        flexWrap: 'wrap'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: `segmented-btn ${activeSubTab === 'tenants' ? 'active' : ''}`,
                            onClick: ()=>setActiveSubTab('tenants'),
                            children: [
                                "🏢 SaaS Tenant Stores (",
                                tenants.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 452,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: `segmented-btn ${activeSubTab === 'users' ? 'active' : ''}`,
                            onClick: ()=>setActiveSubTab('users'),
                            children: [
                                "👥 Store Operators Directory (",
                                tenantUsers.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 459,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: `segmented-btn ${activeSubTab === 'billing' ? 'active' : ''}`,
                            onClick: ()=>setActiveSubTab('billing'),
                            children: [
                                "💳 Subscription Billing & Renewals (",
                                saasBilling.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 466,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: `segmented-btn ${activeSubTab === 'broadcast' ? 'active' : ''}`,
                            onClick: ()=>setActiveSubTab('broadcast'),
                            children: "📢 Global Announcements"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 473,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: `segmented-btn ${activeSubTab === 'infra' ? 'active' : ''}`,
                            onClick: ()=>setActiveSubTab('infra'),
                            children: "☁️ Cloud Server & Database Health"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 480,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SuperAdminView.jsx",
                    lineNumber: 451,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 450,
                columnNumber: 7
            }, this),
            activeSubTab === 'tenants' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-bar",
                        style: {
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    flex: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "search-input-wrapper",
                                        style: {
                                            minWidth: '260px',
                                            flex: 1
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: "input",
                                            placeholder: "Search store name, owner, city, phone, email...",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 499,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 498,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "select",
                                        style: {
                                            width: 'auto'
                                        },
                                        value: filterPlan,
                                        onChange: (e)=>setFilterPlan(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All Plans"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 514,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Pro Enterprise",
                                                children: "Pro Enterprise"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 515,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Growth",
                                                children: "Growth"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 516,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Starter",
                                                children: "Starter"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 517,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 508,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "select",
                                        style: {
                                            width: 'auto'
                                        },
                                        value: filterStatus,
                                        onChange: (e)=>setFilterStatus(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All Status"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 526,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Active",
                                                children: "Active Stores"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 527,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Trial",
                                                children: "Trial Stores"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 528,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "ExpiringSoon",
                                                children: "Expiring Within 15 Days"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 529,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Suspended",
                                                children: "Suspended Stores"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 530,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 520,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 497,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "badge badge-neutral",
                                style: {
                                    fontWeight: 700
                                },
                                children: [
                                    "Showing ",
                                    filteredTenants.length,
                                    " of ",
                                    tenants.length,
                                    " Stores"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 534,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 496,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: {
                            padding: 0,
                            overflow: 'hidden'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "table-responsive",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "data-table",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "STORE & OWNER"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 545,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "CITY / REGION"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 546,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "PHONE / WHATSAPP"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 547,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "SUBSCRIPTION PLAN"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 548,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "MONTHLY FEE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 549,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        textAlign: 'center'
                                                    },
                                                    children: "BRANCHES"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 550,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "RENEWAL DATE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 551,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "STATUS"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 552,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        textAlign: 'right'
                                                    },
                                                    children: "SUPER ADMIN ACTIONS"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 553,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 544,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 543,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: filteredTenants.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 9,
                                                style: {
                                                    textAlign: 'center',
                                                    padding: '48px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "No stores found matching your search and filter criteria."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 559,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 558,
                                            columnNumber: 21
                                        }, this) : filteredTenants.map((t)=>{
                                            const isSuspended = t.status === 'Suspended';
                                            const isTrial = t.status.includes('Trial');
                                            const renewalDateObj = t.renewalDate ? new Date(t.renewalDate) : null;
                                            const now = new Date();
                                            const daysLeft = renewalDateObj ? Math.ceil((renewalDateObj - now) / (1000 * 60 * 60 * 24)) : 0;
                                            const isUrgent = daysLeft >= 0 && daysLeft <= 7;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    opacity: isSuspended ? 0.65 : 1
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    style: {
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        padding: 0,
                                                                        textAlign: 'left',
                                                                        cursor: 'pointer'
                                                                    },
                                                                    onClick: ()=>setViewingTenant(t),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontWeight: 800,
                                                                            fontSize: '13.5px',
                                                                            color: 'var(--primary)'
                                                                        },
                                                                        children: t.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                        lineNumber: 581,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 576,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 575,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '11px',
                                                                    color: 'var(--text-muted)',
                                                                    marginTop: '2px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    flexWrap: 'wrap'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "Owner: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                                children: t.ownerName
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                                lineNumber: 587,
                                                                                columnNumber: 44
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                        lineNumber: 587,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                        lineNumber: 588,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            background: 'var(--bg-hover)',
                                                                            padding: '1px 6px',
                                                                            borderRadius: '4px',
                                                                            fontFamily: 'monospace',
                                                                            fontWeight: 600,
                                                                            color: 'var(--primary)'
                                                                        },
                                                                        children: [
                                                                            "@",
                                                                            t.username || 'admin'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                        lineNumber: 589,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                        lineNumber: 592,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "PIN: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                                children: t.adminPin || '1234'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                                lineNumber: 593,
                                                                                columnNumber: 42
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                        lineNumber: 593,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 586,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 574,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 600
                                                                },
                                                                children: t.city
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 597,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '10.5px',
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: t.address ? t.address.slice(0, 30) + '...' : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 598,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 596,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontWeight: 600
                                                                        },
                                                                        children: t.phone
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                        lineNumber: 602,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        style: {
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            cursor: 'pointer',
                                                                            color: '#16a34a'
                                                                        },
                                                                        onClick: ()=>openWhatsAppToOwner(t),
                                                                        title: "Open WhatsApp Chat with Owner",
                                                                        children: "💬"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                        lineNumber: 603,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 601,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '10.5px',
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: t.email
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 612,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 600,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "badge badge-info",
                                                            style: {
                                                                fontWeight: 700
                                                            },
                                                            children: t.plan
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 615,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 614,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            fontWeight: 700,
                                                            color: 'var(--primary)'
                                                        },
                                                        children: [
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(t.monthlyFee),
                                                            "/mo"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 619,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            textAlign: 'center'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "badge badge-neutral",
                                                            style: {
                                                                fontWeight: 700
                                                            },
                                                            children: [
                                                                t.activeBranchesCount || 1,
                                                                " / ",
                                                                t.maxBranches || 3
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 623,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 622,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 700,
                                                                    color: isUrgent ? '#dc2626' : 'var(--text-main)'
                                                                },
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(t.renewalDate)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 628,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '10.5px',
                                                                    color: isUrgent ? '#dc2626' : 'var(--text-muted)'
                                                                },
                                                                children: daysLeft > 0 ? `${daysLeft} days left` : 'Expired'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 631,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 627,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: isSuspended ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "badge badge-danger",
                                                            children: "Suspended"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 637,
                                                            columnNumber: 31
                                                        }, this) : isTrial ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "badge badge-warning",
                                                            children: "Trial"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 639,
                                                            columnNumber: 31
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "badge badge-success",
                                                            children: "Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 641,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 635,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            textAlign: 'right'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'inline-flex',
                                                                gap: '4px',
                                                                flexWrap: 'wrap',
                                                                justifyContent: 'flex-end'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-primary",
                                                                    style: {
                                                                        fontSize: '11px',
                                                                        padding: '4px 10px',
                                                                        fontWeight: 700
                                                                    },
                                                                    onClick: ()=>impersonateTenant(t.id),
                                                                    title: "Enter Store Workspace as Super Admin",
                                                                    children: "🚀 Enter Store"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 647,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-accent",
                                                                    style: {
                                                                        fontSize: '11px',
                                                                        padding: '4px 8px',
                                                                        fontWeight: 700
                                                                    },
                                                                    onClick: ()=>{
                                                                        setPaymentModalTenant(t);
                                                                        setPaymentForm({
                                                                            amount: t.monthlyFee || 12000,
                                                                            months: 1,
                                                                            method: 'Meezan Bank Raast / IBFT',
                                                                            ref: ''
                                                                        });
                                                                    },
                                                                    title: "Record Subscription Payment",
                                                                    children: "💳 Renew"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 658,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-outline btn-icon-only",
                                                                    title: "Edit Plan & Quotas",
                                                                    onClick: ()=>setEditingTenant({
                                                                            ...t
                                                                        }),
                                                                    children: "✏️"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 677,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-outline btn-icon-only",
                                                                    title: "Reset Store Admin PIN",
                                                                    onClick: ()=>{
                                                                        setResetPinTenant(t);
                                                                        setNewPinValue(t.adminPin || '1234');
                                                                    },
                                                                    children: "🔑"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 687,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-outline btn-icon-only",
                                                                    style: {
                                                                        color: isSuspended ? '#16a34a' : '#d97706'
                                                                    },
                                                                    title: isSuspended ? 'Reactivate Store' : 'Suspend Store',
                                                                    onClick: ()=>toggleTenantStatus(t.id),
                                                                    children: isSuspended ? '▶️' : '⏸️'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 700,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-outline btn-icon-only",
                                                                    style: {
                                                                        color: '#ef4444'
                                                                    },
                                                                    title: "Delete Tenant",
                                                                    onClick: ()=>{
                                                                        if (confirm(`Are you sure you want to completely remove ${t.name}?`)) {
                                                                            deleteTenant(t.id);
                                                                        }
                                                                    },
                                                                    children: "🗑️"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 711,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 645,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 644,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, t.id, true, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 573,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 556,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 542,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 541,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 540,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 494,
                columnNumber: 9
            }, this),
            activeSubTab === 'users' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-bar",
                        style: {
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    flex: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "search-input-wrapper",
                                        style: {
                                            minWidth: '240px',
                                            flex: 1
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: "input",
                                            placeholder: "Search operator name, username, phone...",
                                            value: userSearchQuery,
                                            onChange: (e)=>setUserSearchQuery(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 745,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 744,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "select",
                                        style: {
                                            width: 'auto'
                                        },
                                        value: userFilterStore,
                                        onChange: (e)=>setUserFilterStore(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All Dealer Stores"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 760,
                                                columnNumber: 17
                                            }, this),
                                            tenants.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: t.id,
                                                    children: t.name
                                                }, t.id, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 762,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 754,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "select",
                                        style: {
                                            width: 'auto'
                                        },
                                        value: userFilterRole,
                                        onChange: (e)=>setUserFilterRole(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All Roles"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 772,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Store Admin",
                                                children: "Store Admin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 773,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Cashier / POS",
                                                children: "Cashier / POS"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 774,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Inventory Manager",
                                                children: "Inventory Manager"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 775,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 766,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 743,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "btn btn-primary",
                                style: {
                                    fontWeight: 700
                                },
                                onClick: ()=>setShowAddUserModal(true),
                                children: "+ Create Operator Account"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 779,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 742,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: {
                            padding: 0,
                            overflow: 'hidden'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "table-responsive",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "data-table",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "OPERATOR NAME"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 794,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "ASSIGNED STORE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 795,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "ROLE & PRIVILEGES"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 796,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "PHONE NUMBER"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 797,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "ACCESS PIN"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 798,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "LAST LOGIN / ACTIVE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 799,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "STATUS"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 800,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        textAlign: 'right'
                                                    },
                                                    children: "ACTIONS"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 801,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 793,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 792,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: filteredUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 8,
                                                style: {
                                                    textAlign: 'center',
                                                    padding: '40px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "No operators found matching the criteria."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 807,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 806,
                                            columnNumber: 21
                                        }, this) : filteredUsers.map((u)=>{
                                            const isDisabled = u.status === 'Disabled';
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    opacity: isDisabled ? 0.6 : 1
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 700,
                                                                    fontSize: '13.5px'
                                                                },
                                                                children: u.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 817,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '11px',
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: [
                                                                    "@",
                                                                    u.username
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 818,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 816,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontWeight: 600
                                                            },
                                                            children: u.tenantName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 821,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 820,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `badge ${u.role.includes('Admin') ? 'badge-primary' : u.role.includes('Cashier') ? 'badge-warning' : 'badge-info'}`,
                                                            children: u.role
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 824,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 823,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: u.phone || 'N/A'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 836,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                            style: {
                                                                background: 'var(--bg-hover)',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                letterSpacing: '1px'
                                                            },
                                                            children: u.pin
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 838,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 837,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            fontSize: '11.5px',
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: u.lastActive
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 842,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `badge ${isDisabled ? 'badge-danger' : 'badge-success'}`,
                                                            children: u.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 844,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 843,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            textAlign: 'right'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'inline-flex',
                                                                gap: '4px'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-outline btn-icon-only",
                                                                    title: isDisabled ? 'Enable Operator' : 'Disable Operator',
                                                                    onClick: ()=>toggleTenantUserStatus(u.id),
                                                                    children: isDisabled ? '▶️' : '⏸️'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 850,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-outline btn-icon-only",
                                                                    title: "Reset Operator PIN",
                                                                    onClick: ()=>{
                                                                        const p = prompt(`Enter new PIN for ${u.name}:`, u.pin);
                                                                        if (p && p.trim()) resetTenantUserPin(u.id, p.trim());
                                                                    },
                                                                    children: "🔑"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 858,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-outline btn-icon-only",
                                                                    style: {
                                                                        color: '#ef4444'
                                                                    },
                                                                    title: "Delete Operator",
                                                                    onClick: ()=>{
                                                                        if (confirm(`Delete user ${u.name}?`)) deleteTenantUser(u.id);
                                                                    },
                                                                    children: "🗑️"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 869,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 849,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 848,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, u.id, true, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 815,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 804,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 791,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 790,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 789,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 741,
                columnNumber: 9
            }, this),
            activeSubTab === 'billing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kpi-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "kpi-title",
                                            children: "TOTAL COLLECTED SUBSCRIPTIONS"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 901,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 901,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        style: {
                                            color: '#16a34a'
                                        },
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(metrics.totalCollectedRevenue)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 902,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-subtext",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "All settled franchise fees"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 905,
                                            columnNumber: 44
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 905,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 900,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "kpi-title",
                                            children: "PROJECTED ANNUAL RUN-RATE (ARR)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 909,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 909,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        style: {
                                            color: 'var(--primary)'
                                        },
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(metrics.totalARR)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 910,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-subtext",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Based on current active subscriptions"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 913,
                                            columnNumber: 44
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 913,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 908,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "kpi-title",
                                            children: "RENEWAL REMINDERS PENDING"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 917,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 917,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        style: {
                                            color: metrics.expiringSoonCount > 0 ? '#ea580c' : '#16a34a'
                                        },
                                        children: [
                                            metrics.expiringSoonCount,
                                            " Stores"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 918,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-subtext",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Due within next 15 days"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 921,
                                            columnNumber: 44
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 921,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 916,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 899,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: {
                            padding: 0,
                            overflow: 'hidden'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '16px 20px',
                                    borderBottom: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: '15px',
                                                    fontWeight: 800
                                                },
                                                children: "Franchise Subscription Receipts & Ledger"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 929,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '12px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "Verified Raast, Bank Transfer, and Direct Deposits from dealer accounts"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 930,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 928,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "search-input-wrapper",
                                        style: {
                                            minWidth: '220px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: "input",
                                            placeholder: "Filter billing records...",
                                            value: billingSearchQuery,
                                            onChange: (e)=>setBillingSearchQuery(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 934,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 933,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 927,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "table-responsive",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "data-table",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "RECEIPT ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 948,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "DATE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 949,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "DEALER STORE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 950,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "PLAN TIER"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 951,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "DURATION"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 952,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "AMOUNT (PKR)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 953,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "PAYMENT METHOD / REF"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 954,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "EXTENDED UNTIL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 955,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "STATUS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 956,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 947,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 946,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: filteredBilling.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 9,
                                                    style: {
                                                        textAlign: 'center',
                                                        padding: '36px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "No billing receipts recorded yet."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 962,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 961,
                                                columnNumber: 21
                                            }, this) : filteredBilling.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                fontWeight: 700
                                                            },
                                                            children: b.id
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 969,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(b.date)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 970,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                fontWeight: 700
                                                            },
                                                            children: b.tenantName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 971,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "badge badge-info",
                                                                children: b.plan
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 972,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 972,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                b.months,
                                                                " Month(s)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 973,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                fontWeight: 800,
                                                                color: '#16a34a'
                                                            },
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(b.amount)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 974,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: b.method
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 978,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: '10.5px',
                                                                        color: 'var(--text-muted)'
                                                                    },
                                                                    children: [
                                                                        "Ref: ",
                                                                        b.transactionRef
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 979,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 977,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                fontWeight: 700
                                                            },
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(b.renewalDate)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 981,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "badge badge-success",
                                                                children: b.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 982,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 982,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, b.id, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 968,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 959,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 945,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 944,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 926,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 897,
                columnNumber: 9
            }, this),
            activeSubTab === 'broadcast' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '20px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '16px',
                                    fontWeight: 800,
                                    marginBottom: '6px'
                                },
                                children: "Publish Global System Announcement"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 999,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '12.5px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '18px'
                                },
                                children: "This announcement banner appears prominently across all connected store billing counters, godowns, and tablets in Pakistan."
                            }, void 0, false, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1002,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "input-group",
                                style: {
                                    marginBottom: '16px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "input-label",
                                        children: "Announcement Banner Text"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1007,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "input",
                                        rows: 3,
                                        style: {
                                            height: 'auto',
                                            padding: '12px',
                                            fontSize: '13.5px'
                                        },
                                        value: announcementText,
                                        onChange: (e)=>setAnnouncementText(e.target.value),
                                        placeholder: "e.g. Scheduled Cloud Maintenance on Sunday 2:00 AM PKT..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1008,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1006,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        id: "announcementActiveCheck",
                                        checked: announcementActive,
                                        onChange: (e)=>setAnnouncementActive(e.target.checked),
                                        style: {
                                            width: '16px',
                                            height: '16px',
                                            cursor: 'pointer'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1019,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "announcementActiveCheck",
                                        style: {
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        },
                                        children: "Display this announcement banner to all stores right now"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1026,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1018,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "btn btn-primary",
                                        style: {
                                            fontWeight: 700,
                                            padding: '10px 20px'
                                        },
                                        onClick: ()=>updateBroadcastMessage(announcementText, announcementActive),
                                        children: "📢 Broadcast to All Stores"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1032,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "btn btn-outline",
                                        onClick: ()=>{
                                            setAnnouncementActive(false);
                                            updateBroadcastMessage(announcementText, false);
                                        },
                                        children: "Disable Banner"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1040,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1031,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 998,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: {
                            background: 'var(--bg-hover)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    marginBottom: '12px'
                                },
                                children: "Live Store Terminal Preview"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1054,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '16px'
                                },
                                children: "This is how cashiers and dealers see your message at the top of their workspace:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1057,
                                columnNumber: 13
                            }, this),
                            announcementActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
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
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "📢"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1076,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: announcementText || '(No message typed)'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1077,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1062,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '16px',
                                    border: '1px dashed var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-muted)',
                                    fontSize: '12px',
                                    textAlign: 'center'
                                },
                                children: "Banner is currently disabled. Stores do not see any broadcast."
                            }, void 0, false, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1080,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 1053,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 997,
                columnNumber: 9
            }, this),
            activeSubTab === 'infra' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kpi-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "kpi-title",
                                            children: "PRIMARY CLOUD DATABASE"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1104,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1104,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        style: {
                                            color: '#16a34a'
                                        },
                                        children: "PostgreSQL 16 • Multi-AZ Cluster"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1105,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-subtext",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Encrypted SSL • Auto-failover ready"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1106,
                                            columnNumber: 44
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1106,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1103,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "kpi-title",
                                            children: "LOCAL OFFLINE TERMINAL ENGINE"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1110,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1110,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        style: {
                                            color: 'var(--primary)'
                                        },
                                        children: "Capacitor • SQLite Hybrid"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1111,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-subtext",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Full rural offline-first POS support"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1112,
                                            columnNumber: 44
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1112,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "kpi-title",
                                            children: "CLOUD STORAGE QUOTA"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1116,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1116,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        children: "450 MB / 50 GB"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1117,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-subtext",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "0.9% tenant storage consumed"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1118,
                                            columnNumber: 44
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1118,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1115,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 1102,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '14px',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    fontSize: '15px',
                                                    fontWeight: 800
                                                },
                                                children: "Store Tenant Storage Footprint & Sync Status"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 1125,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '12px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "Realtime health metrics of all replicated tenant databases"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 1126,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1124,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "btn btn-outline",
                                        onClick: ()=>showToast('Flushed Redis session cache across all cluster nodes!', 'success'),
                                        children: "🔄 Purge Cache & Re-sync Nodes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                        lineNumber: 1129,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1123,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "table-responsive",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "data-table",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "TENANT STORE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 1142,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "DATABASE ROWS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 1143,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "STORAGE CONSUMED"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 1144,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "LAST CLOUD BACKUP"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 1145,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "SYNC LATENCY"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 1146,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "ENCRYPTION"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 1147,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                lineNumber: 1141,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1140,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: tenants.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                fontWeight: 700
                                                            },
                                                            children: t.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1153,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                t.totalInvoicesCount * 8 + 42,
                                                                " records"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1154,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                t.storageUsedMb || 45,
                                                                " MB"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1155,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date()),
                                                                " (Automated)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1156,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "badge badge-success",
                                                                children: "18 ms"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 1157,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1157,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "badge badge-neutral",
                                                                children: "AES-256"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                lineNumber: 1158,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1158,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, t.id, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1152,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1150,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1139,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/SuperAdminView.jsx",
                                lineNumber: 1138,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SuperAdminView.jsx",
                        lineNumber: 1122,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 1101,
                columnNumber: 9
            }, this),
            showCreateStoreModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay active",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-dialog",
                    style: {
                        maxWidth: '640px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "modal-title",
                                    children: "Register New SaaS Store Tenant"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1175,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "modal-close-btn",
                                    onClick: ()=>setShowCreateStoreModal(false),
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1176,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1174,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleCreateStoreSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-body",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '14px',
                                                marginBottom: '14px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: [
                                                                "Business / Store Name ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "req",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1182,
                                                                    columnNumber: 74
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1182,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            placeholder: "e.g. Al-Rehman Agro Center",
                                                            value: createStoreForm.name,
                                                            onChange: (e)=>{
                                                                const val = e.target.value;
                                                                const autoUser = val.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 20);
                                                                setCreateStoreForm((prev)=>({
                                                                        ...prev,
                                                                        name: val,
                                                                        username: !prev.username || prev.username === prev.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 20) ? autoUser : prev.username
                                                                    }));
                                                            },
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1183,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1181,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: [
                                                                "Store Login Username ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "req",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1204,
                                                                    columnNumber: 73
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1204,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            placeholder: "e.g. alrehman_agro",
                                                            value: createStoreForm.username,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    username: e.target.value.toLowerCase().replace(/\s+/g, '_')
                                                                }),
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1205,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '11px',
                                                                color: 'var(--text-muted)',
                                                                marginTop: '4px'
                                                            },
                                                            children: "Admin will use this username to log in to this store portal"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1213,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1203,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1180,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '14px',
                                                marginBottom: '14px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: [
                                                                "Owner / Managing Partner ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "req",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1221,
                                                                    columnNumber: 77
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1221,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            placeholder: "e.g. Malik Muhammad Afzal",
                                                            value: createStoreForm.ownerName,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    ownerName: e.target.value
                                                                }),
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1222,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1220,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: [
                                                                "Store Admin Master PIN ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "req",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1233,
                                                                    columnNumber: 75
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1233,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            maxLength: 6,
                                                            className: "input",
                                                            placeholder: "e.g. 1234",
                                                            value: createStoreForm.adminPin,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    adminPin: e.target.value
                                                                }),
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1234,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '11px',
                                                                color: 'var(--text-muted)',
                                                                marginTop: '4px'
                                                            },
                                                            children: "Security PIN used with the username for login"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1243,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1232,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1219,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '14px',
                                                marginBottom: '14px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Phone / WhatsApp Number"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1251,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            placeholder: "0300-1234567",
                                                            value: createStoreForm.phone,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    phone: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1252,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1250,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Email Address"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1262,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            className: "input",
                                                            placeholder: "dealer@agristore.pk",
                                                            value: createStoreForm.email,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    email: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1263,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1261,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1249,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1.2fr 1fr 1fr',
                                                gap: '12px',
                                                marginBottom: '14px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Subscription Tier"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1275,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: "select",
                                                            value: createStoreForm.plan,
                                                            onChange: (e)=>{
                                                                const plan = e.target.value;
                                                                let fee = '6500';
                                                                let maxBr = '3';
                                                                if (plan === 'Pro Enterprise Plan') {
                                                                    fee = '12000';
                                                                    maxBr = '5';
                                                                } else if (plan === 'Starter Plan') {
                                                                    fee = '3500';
                                                                    maxBr = '1';
                                                                }
                                                                setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    plan,
                                                                    monthlyFee: fee,
                                                                    maxBranches: maxBr
                                                                });
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Starter Plan",
                                                                    children: "Starter Plan (Rs 3,500/mo)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1288,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Growth Plan",
                                                                    children: "Growth Plan (Rs 6,500/mo)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1289,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Pro Enterprise Plan",
                                                                    children: "Pro Enterprise Plan (Rs 12,000/mo)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1290,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1276,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1274,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Monthly Fee (Rs)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1295,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input",
                                                            value: createStoreForm.monthlyFee,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    monthlyFee: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1296,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1294,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Allowed Branches"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1305,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input",
                                                            value: createStoreForm.maxBranches,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    maxBranches: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1306,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1304,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1273,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '14px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "City / Mandi Location"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1317,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            placeholder: "e.g. Sahiwal",
                                                            value: createStoreForm.city,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    city: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1318,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1316,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "NTN / Tax Number"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1328,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            placeholder: "e.g. 1234567-8",
                                                            value: createStoreForm.ntn,
                                                            onChange: (e)=>setCreateStoreForm({
                                                                    ...createStoreForm,
                                                                    ntn: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1329,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1327,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1315,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1179,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-footer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-outline",
                                            onClick: ()=>setShowCreateStoreModal(false),
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1340,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "btn btn-primary",
                                            style: {
                                                minWidth: '160px'
                                            },
                                            children: "Register SaaS Store"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1341,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1339,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1178,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SuperAdminView.jsx",
                    lineNumber: 1173,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 1172,
                columnNumber: 9
            }, this),
            paymentModalTenant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay active",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-dialog",
                    style: {
                        maxWidth: '500px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "modal-title",
                                    children: [
                                        "Record Subscription Payment • ",
                                        paymentModalTenant.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1357,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "modal-close-btn",
                                    onClick: ()=>setPaymentModalTenant(null),
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1358,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1356,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handlePaymentSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-body",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '13px',
                                                color: 'var(--text-muted)',
                                                marginBottom: '14px'
                                            },
                                            children: "Recording payment automatically extends license renewal date and generates a digital receipt."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1362,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1.2fr 1fr',
                                                gap: '12px',
                                                marginBottom: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Payment Amount (PKR)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1368,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input",
                                                            value: paymentForm.amount,
                                                            onChange: (e)=>setPaymentForm({
                                                                    ...paymentForm,
                                                                    amount: e.target.value
                                                                }),
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1369,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1367,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Renewal Extension"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1379,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: "select",
                                                            value: paymentForm.months,
                                                            onChange: (e)=>setPaymentForm({
                                                                    ...paymentForm,
                                                                    months: Number(e.target.value)
                                                                }),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: 1,
                                                                    children: "+1 Month (30 Days)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1385,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: 3,
                                                                    children: "+3 Months (90 Days)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1386,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: 6,
                                                                    children: "+6 Months (180 Days)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1387,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: 12,
                                                                    children: "+1 Year (365 Days)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1388,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1380,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1378,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1366,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "input-group",
                                            style: {
                                                marginBottom: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "input-label",
                                                    children: "Payment Method"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1394,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "select",
                                                    value: paymentForm.method,
                                                    onChange: (e)=>setPaymentForm({
                                                            ...paymentForm,
                                                            method: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "Meezan Bank Raast / IBFT",
                                                            children: "Meezan Bank Raast / IBFT"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1400,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "HBL Direct Deposit",
                                                            children: "HBL Direct Deposit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1401,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "Bank AL Habib Raast",
                                                            children: "Bank AL Habib Raast"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1402,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "JazzCash / EasyPaisa",
                                                            children: "JazzCash / EasyPaisa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1403,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "Cash Handover to Area Rep",
                                                            children: "Cash Handover to Area Rep"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1404,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1395,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1393,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "input-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "input-label",
                                                    children: "Bank Transaction / Raast Reference ID"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1409,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    className: "input",
                                                    placeholder: "e.g. RZ-9918234",
                                                    value: paymentForm.ref,
                                                    onChange: (e)=>setPaymentForm({
                                                            ...paymentForm,
                                                            ref: e.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1410,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1408,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1361,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-footer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-outline",
                                            onClick: ()=>setPaymentModalTenant(null),
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1420,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "btn btn-accent",
                                            style: {
                                                fontWeight: 700
                                            },
                                            children: "Confirm Payment & Renew"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1421,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1419,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1360,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SuperAdminView.jsx",
                    lineNumber: 1355,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 1354,
                columnNumber: 9
            }, this),
            editingTenant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay active",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-dialog",
                    style: {
                        maxWidth: '540px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "modal-title",
                                    children: [
                                        "Edit Store Quotas: ",
                                        editingTenant.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1437,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "modal-close-btn",
                                    onClick: ()=>setEditingTenant(null),
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1438,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1436,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleEditSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-body",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '12px',
                                                marginBottom: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Store Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1444,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            value: editingTenant.name,
                                                            onChange: (e)=>setEditingTenant({
                                                                    ...editingTenant,
                                                                    name: e.target.value
                                                                }),
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1445,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1443,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Store Login Username"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1455,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            value: editingTenant.username || '',
                                                            onChange: (e)=>setEditingTenant({
                                                                    ...editingTenant,
                                                                    username: e.target.value.toLowerCase().replace(/\s+/g, '_')
                                                                }),
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1456,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1454,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1442,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '12px',
                                                marginBottom: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Plan Tier"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1468,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: "select",
                                                            value: editingTenant.plan,
                                                            onChange: (e)=>setEditingTenant({
                                                                    ...editingTenant,
                                                                    plan: e.target.value
                                                                }),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Starter Plan",
                                                                    children: "Starter Plan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1474,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Growth Plan",
                                                                    children: "Growth Plan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1475,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Pro Enterprise Plan",
                                                                    children: "Pro Enterprise Plan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1476,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1469,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1467,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1481,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: "select",
                                                            value: editingTenant.status,
                                                            onChange: (e)=>setEditingTenant({
                                                                    ...editingTenant,
                                                                    status: e.target.value
                                                                }),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Active",
                                                                    children: "Active"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1487,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Trial",
                                                                    children: "Trial"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1488,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Suspended",
                                                                    children: "Suspended"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1489,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1482,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1480,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1466,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Monthly Fee (Rs)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1496,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input",
                                                            value: editingTenant.monthlyFee,
                                                            onChange: (e)=>setEditingTenant({
                                                                    ...editingTenant,
                                                                    monthlyFee: Number(e.target.value)
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1497,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1495,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Branch Limit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1506,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input",
                                                            value: editingTenant.maxBranches,
                                                            onChange: (e)=>setEditingTenant({
                                                                    ...editingTenant,
                                                                    maxBranches: Number(e.target.value)
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1507,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1505,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1494,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1441,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-footer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-outline",
                                            onClick: ()=>setEditingTenant(null),
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1517,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "btn btn-primary",
                                            children: "Save Changes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1518,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1516,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1440,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SuperAdminView.jsx",
                    lineNumber: 1435,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 1434,
                columnNumber: 9
            }, this),
            showAddUserModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay active",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-dialog",
                    style: {
                        maxWidth: '480px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "modal-title",
                                    children: "Create Store Operator Account"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1532,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "modal-close-btn",
                                    onClick: ()=>setShowAddUserModal(false),
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1533,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1531,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleAddUserSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-body",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "input-group",
                                            style: {
                                                marginBottom: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "input-label",
                                                    children: "Assign to Store Tenant"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1538,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "select",
                                                    value: newUserForm.tenantId,
                                                    onChange: (e)=>{
                                                        const t = tenants.find((item)=>item.id === e.target.value);
                                                        setNewUserForm({
                                                            ...newUserForm,
                                                            tenantId: e.target.value,
                                                            tenantName: t?.name || ''
                                                        });
                                                    },
                                                    children: tenants.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: t.id,
                                                            children: [
                                                                t.name,
                                                                " (",
                                                                t.city,
                                                                ")"
                                                            ]
                                                        }, t.id, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1552,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1539,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1537,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '12px',
                                                marginBottom: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: [
                                                                "Operator Full Name ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "req",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1559,
                                                                    columnNumber: 71
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1559,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            placeholder: "e.g. Asad Ali",
                                                            value: newUserForm.name,
                                                            onChange: (e)=>setNewUserForm({
                                                                    ...newUserForm,
                                                                    name: e.target.value
                                                                }),
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1560,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1558,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Role"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1571,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: "select",
                                                            value: newUserForm.role,
                                                            onChange: (e)=>setNewUserForm({
                                                                    ...newUserForm,
                                                                    role: e.target.value
                                                                }),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Cashier / POS",
                                                                    children: "Cashier / POS"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1577,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Inventory Manager",
                                                                    children: "Inventory Manager"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1578,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Store Admin",
                                                                    children: "Store Admin / Partner"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                                    lineNumber: 1579,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1572,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1570,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1557,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1.2fr 1fr',
                                                gap: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Phone Number"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1586,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input",
                                                            placeholder: "0300-1122334",
                                                            value: newUserForm.phone,
                                                            onChange: (e)=>setNewUserForm({
                                                                    ...newUserForm,
                                                                    phone: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1587,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1585,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "4-Digit Access PIN"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1597,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "password",
                                                            maxLength: 6,
                                                            className: "input",
                                                            value: newUserForm.pin,
                                                            onChange: (e)=>setNewUserForm({
                                                                    ...newUserForm,
                                                                    pin: e.target.value
                                                                }),
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                                            lineNumber: 1598,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1596,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1584,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1536,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-footer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-outline",
                                            onClick: ()=>setShowAddUserModal(false),
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1610,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "btn btn-primary",
                                            children: "Create Operator"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1611,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1609,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1535,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SuperAdminView.jsx",
                    lineNumber: 1530,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 1529,
                columnNumber: 9
            }, this),
            resetPinTenant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay active",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-dialog",
                    style: {
                        maxWidth: '420px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "modal-title",
                                    children: [
                                        "Reset Admin PIN • ",
                                        resetPinTenant.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1625,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "modal-close-btn",
                                    onClick: ()=>setResetPinTenant(null),
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1626,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1624,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleResetPinSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-body",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '13px',
                                                color: 'var(--text-muted)',
                                                marginBottom: '14px'
                                            },
                                            children: [
                                                "Emergency PIN reset for dealer ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: resetPinTenant.ownerName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1631,
                                                    columnNumber: 50
                                                }, this),
                                                "."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1630,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "input-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "input-label",
                                                    children: "New 4-digit PIN"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1634,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    maxLength: 6,
                                                    className: "input",
                                                    value: newPinValue,
                                                    onChange: (e)=>setNewPinValue(e.target.value),
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1635,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1633,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1629,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-footer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-outline",
                                            onClick: ()=>setResetPinTenant(null),
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1646,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "btn btn-primary",
                                            children: "Update Store PIN"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1647,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1645,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1628,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SuperAdminView.jsx",
                    lineNumber: 1623,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 1622,
                columnNumber: 9
            }, this),
            viewingTenant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay active",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-dialog",
                    style: {
                        maxWidth: '580px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "modal-title",
                                    children: [
                                        "Store Dossier • ",
                                        viewingTenant.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1661,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "modal-close-btn",
                                    onClick: ()=>setViewingTenant(null),
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1662,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1660,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '14px',
                                        marginBottom: '16px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "Store Owner"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1667,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 700
                                                    },
                                                    children: viewingTenant.ownerName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1668,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1666,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "City / Location"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1671,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 700
                                                    },
                                                    children: viewingTenant.city
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1672,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1670,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "Phone / WhatsApp"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1675,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 700
                                                    },
                                                    children: viewingTenant.phone
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1676,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1674,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "Email"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1679,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 700
                                                    },
                                                    children: viewingTenant.email || 'N/A'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1680,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1678,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "Subscription Plan"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1683,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 700
                                                    },
                                                    className: "badge badge-info",
                                                    children: viewingTenant.plan
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1684,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1682,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "Monthly Billing"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1687,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 800,
                                                        color: 'var(--primary)'
                                                    },
                                                    children: [
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(viewingTenant.monthlyFee),
                                                        "/mo"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1688,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1686,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "Store Login Username"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1691,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 700,
                                                        color: 'var(--primary)',
                                                        fontFamily: 'monospace'
                                                    },
                                                    children: [
                                                        "@",
                                                        viewingTenant.username || 'admin'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1692,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1690,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "Master Admin PIN"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1695,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 700
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                        children: viewingTenant.adminPin || '1234'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SuperAdminView.jsx",
                                                        lineNumber: 1696,
                                                        columnNumber: 52
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1696,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1694,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "NTN Tax Number"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1699,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 600
                                                    },
                                                    children: viewingTenant.ntn || 'Pending'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1700,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1698,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1665,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '12px',
                                        background: 'var(--bg-hover)',
                                        borderRadius: '6px',
                                        fontSize: '12px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Complete Address:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1705,
                                                    columnNumber: 22
                                                }, this),
                                                " ",
                                                viewingTenant.address || 'Grain & Fertilizer Market, Punjab'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1705,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '6px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Renewal Date:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                                    lineNumber: 1706,
                                                    columnNumber: 51
                                                }, this),
                                                " ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(viewingTenant.renewalDate)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SuperAdminView.jsx",
                                            lineNumber: 1706,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1704,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1664,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "btn btn-outline",
                                    onClick: ()=>{
                                        extendTenantTrial(viewingTenant.id, 14);
                                        setViewingTenant(null);
                                    },
                                    children: "+14 Days Trial Extension"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1710,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "btn btn-primary",
                                    onClick: ()=>{
                                        impersonateTenant(viewingTenant.id);
                                        setViewingTenant(null);
                                    },
                                    children: "🚀 Enter Store Workspace"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SuperAdminView.jsx",
                                    lineNumber: 1720,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SuperAdminView.jsx",
                            lineNumber: 1709,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SuperAdminView.jsx",
                    lineNumber: 1659,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/SuperAdminView.jsx",
                lineNumber: 1658,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SuperAdminView.jsx",
        lineNumber: 295,
        columnNumber: 5
    }, this);
}
_s(SuperAdminView, "9wtNHRtNzmFc1RyG3LQmkenat4Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = SuperAdminView;
var _c;
__turbopack_context__.k.register(_c, "SuperAdminView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_SuperAdminView_jsx_0t26i-65-eum_._.js.map