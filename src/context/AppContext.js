'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'agrotrader_saas_v3_dynamic';

// Multi-tenant SaaS Branches
const DEFAULT_BRANCHES = [
  { id: 'branch-1', name: 'Ahmed & Co. (Mandi Bahauddin - Main Branch)', city: 'Mandi Bahauddin', isMain: true },
  { id: 'branch-2', name: 'Ahmed & Co. (Bhalwal Regional Hub)', city: 'Bhalwal', isMain: false },
  { id: 'branch-3', name: 'Kisan Care Agri Center (Sillanwali)', city: 'Sillanwali', isMain: false }
];

// SaaS Master Tenants List
const DEFAULT_TENANTS = [
  {
    id: 'tenant-1',
    name: 'Ahmed & Co. Agriculture Store',
    subtitle: 'Authorized Dealer - FFC, Engro & FMC',
    ownerName: 'Ahmed Raza Malik',
    email: 'ahmed@ahmedagri.pk',
    phone: '0300-6737953',
    city: 'Mandi Bahauddin / Sargodha',
    plan: 'Pro Enterprise Plan',
    monthlyFee: 12000,
    status: 'Active',
    maxBranches: 5,
    activeBranchesCount: 3,
    totalInvoicesCount: 142,
    adminPin: '1234',
    joinedDate: '2026-01-15',
    renewalDate: '2026-11-15',
    storageUsedMb: 140,
    ntn: '4829104-7',
    address: 'Grain & Fertilizer Market, Mandi Bahauddin Road, Sargodha'
  },
  {
    id: 'tenant-2',
    name: 'Kisan Khidmat Markaz',
    subtitle: 'Modern Crop Inputs & Seeds Center',
    ownerName: 'Chaudhry Tariq Mehmood',
    email: 'tariq@kisankhidmat.com',
    phone: '0301-8765432',
    city: 'Faisalabad',
    plan: 'Growth Plan',
    monthlyFee: 6500,
    status: 'Active',
    maxBranches: 3,
    activeBranchesCount: 2,
    totalInvoicesCount: 98,
    adminPin: '2233',
    joinedDate: '2026-02-10',
    renewalDate: '2026-11-10',
    storageUsedMb: 85,
    ntn: '3109281-2',
    address: 'Jhang Road, Near New Grain Market, Faisalabad'
  },
  {
    id: 'tenant-3',
    name: 'Al-Madina Agro Traders',
    subtitle: 'Wholesale Fertilizer & Cotton Protection Hub',
    ownerName: 'Haji Muhammad Aslam',
    email: 'aslam@almadinaagro.com',
    phone: '0321-4433221',
    city: 'Multan',
    plan: 'Pro Enterprise Plan',
    monthlyFee: 12000,
    status: 'Active',
    maxBranches: 5,
    activeBranchesCount: 4,
    totalInvoicesCount: 215,
    adminPin: '4455',
    joinedDate: '2025-11-01',
    renewalDate: '2026-11-01',
    storageUsedMb: 195,
    ntn: '5920194-9',
    address: 'Bosan Road, Chowk Nagshah, Multan'
  },
  {
    id: 'tenant-4',
    name: 'Chenab Fertilizer & Seed Depot',
    subtitle: 'Grain & Wheat Sowing Specialist',
    ownerName: 'Mian Nawazish Ali',
    email: 'nawazish@chenabagri.pk',
    phone: '0345-7788990',
    city: 'Jhang',
    plan: 'Starter Plan',
    monthlyFee: 3500,
    status: 'Trial',
    maxBranches: 1,
    activeBranchesCount: 1,
    totalInvoicesCount: 34,
    adminPin: '1122',
    joinedDate: '2026-10-01',
    renewalDate: '2026-10-31',
    storageUsedMb: 30,
    ntn: '1820493-4',
    address: 'Mandi Road, Gojra Mor, Jhang'
  }
];

const INITIAL_TENANT_USERS = [
  {
    id: 'user-1',
    tenantId: 'tenant-1',
    tenantName: 'Ahmed & Co. Agriculture Store',
    name: 'Ahmed Raza Malik',
    username: 'ahmed.admin',
    role: 'Store Admin',
    phone: '0300-6737953',
    pin: '1234',
    status: 'Active',
    lastActive: '2026-10-19 18:45'
  },
  {
    id: 'user-2',
    tenantId: 'tenant-1',
    tenantName: 'Ahmed & Co. Agriculture Store',
    name: 'Muhammad Imran (Counter 1)',
    username: 'imran.cashier',
    role: 'Cashier / POS',
    phone: '0302-1122334',
    pin: '0000',
    status: 'Active',
    lastActive: '2026-10-19 19:10'
  },
  {
    id: 'user-3',
    tenantId: 'tenant-1',
    tenantName: 'Ahmed & Co. Agriculture Store',
    name: 'Naveed Akhtar (Godown Incharge)',
    username: 'naveed.godown',
    role: 'Inventory Manager',
    phone: '0345-9988771',
    pin: '5566',
    status: 'Active',
    lastActive: '2026-10-18 16:30'
  },
  {
    id: 'user-4',
    tenantId: 'tenant-2',
    tenantName: 'Kisan Khidmat Markaz',
    name: 'Chaudhry Tariq Mehmood',
    username: 'tariq.admin',
    role: 'Store Admin',
    phone: '0301-8765432',
    pin: '2233',
    status: 'Active',
    lastActive: '2026-10-19 14:20'
  },
  {
    id: 'user-5',
    tenantId: 'tenant-2',
    tenantName: 'Kisan Khidmat Markaz',
    name: 'Bilal Hassan',
    username: 'bilal.counter',
    role: 'Cashier / POS',
    phone: '0322-8877665',
    pin: '0000',
    status: 'Active',
    lastActive: '2026-10-19 12:05'
  },
  {
    id: 'user-6',
    tenantId: 'tenant-3',
    tenantName: 'Al-Madina Agro Traders',
    name: 'Haji Muhammad Aslam',
    username: 'aslam.admin',
    role: 'Store Admin',
    phone: '0321-4433221',
    pin: '4455',
    status: 'Active',
    lastActive: '2026-10-19 17:50'
  },
  {
    id: 'user-7',
    tenantId: 'tenant-3',
    tenantName: 'Al-Madina Agro Traders',
    name: 'Waseem Abbas',
    username: 'waseem.cashier',
    role: 'Cashier / POS',
    phone: '0300-3344556',
    pin: '0000',
    status: 'Active',
    lastActive: '2026-10-19 15:40'
  },
  {
    id: 'user-8',
    tenantId: 'tenant-4',
    tenantName: 'Chenab Fertilizer & Seed Depot',
    name: 'Mian Nawazish Ali',
    username: 'nawazish.admin',
    role: 'Store Admin',
    phone: '0345-7788990',
    pin: '1122',
    status: 'Trial Active',
    lastActive: '2026-10-19 11:30'
  }
];

const INITIAL_SAAS_BILLING = [
  {
    id: 'SAAS-BILL-1001',
    tenantId: 'tenant-1',
    tenantName: 'Ahmed & Co. Agriculture Store',
    date: '2026-10-15',
    plan: 'Pro Enterprise Plan',
    months: 1,
    amount: 12000,
    status: 'Paid',
    method: 'Meezan Bank Raast / IBFT',
    transactionRef: 'RZ-8891042',
    renewalDate: '2026-11-15'
  },
  {
    id: 'SAAS-BILL-1002',
    tenantId: 'tenant-2',
    tenantName: 'Kisan Khidmat Markaz',
    date: '2026-10-10',
    plan: 'Growth Plan',
    months: 1,
    amount: 6500,
    status: 'Paid',
    method: 'HBL Direct Deposit',
    transactionRef: 'HBL-7740192',
    renewalDate: '2026-11-10'
  },
  {
    id: 'SAAS-BILL-1003',
    tenantId: 'tenant-3',
    tenantName: 'Al-Madina Agro Traders',
    date: '2026-10-01',
    plan: 'Pro Enterprise Plan',
    months: 1,
    amount: 12000,
    status: 'Paid',
    method: 'Bank AL Habib Raast',
    transactionRef: 'BAH-4920194',
    renewalDate: '2026-11-01'
  }
];

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

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    branchId: 'branch-1',
    name: 'Sona DAP 50 KG',
    sku: 'FERT-101',
    generic: 'Diammonium Phosphate (18% Nitrogen, 46% Phosphorus)',
    barcode: '890123456001',
    batchNo: '30062026-0001',
    mfgDate: '2026-01-10',
    expiryDate: '2028-01-10',
    category: 'Fertilizers',
    manufacturer: 'Fauji Fertilizer Company (FFC)',
    unit: 'bag',
    unitWeight: 50,
    costPrice: 16000,
    salePrice: 16200,
    offerPrice: 16100,
    shopStock: 100,
    storeStock: 50,
    alertQty: 15,
    location: 'Godown A, Bay 1',
    flags: { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: 'Premium granule quality, keep protected from moisture.'
  },
  {
    id: 'prod-2',
    branchId: 'branch-1',
    name: 'Sona Urea 50 KG',
    sku: 'FERT-102',
    generic: 'Prilled Urea (46% Nitrogen)',
    barcode: '890123456002',
    batchNo: '30062026-0002',
    mfgDate: '2026-02-15',
    expiryDate: '2028-02-15',
    category: 'Fertilizers',
    manufacturer: 'Fauji Fertilizer Company (FFC)',
    unit: 'bag',
    unitWeight: 50,
    costPrice: 4400,
    salePrice: 4650,
    offerPrice: 4600,
    shopStock: 80,
    storeStock: 220,
    alertQty: 25,
    location: 'Godown A, Bay 2',
    flags: { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: 'High demand in wheat & rice tillering stages.'
  },
  {
    id: 'prod-3',
    branchId: 'branch-1',
    name: 'Engro DAP 50 KG',
    sku: 'FERT-103',
    generic: 'Imported Di-Ammonium Phosphate Granular',
    barcode: '890123456003',
    batchNo: '30062026-0003',
    mfgDate: '2026-01-05',
    expiryDate: '2028-01-05',
    category: 'Fertilizers',
    manufacturer: 'Engro Fertilizers',
    unit: 'bag',
    unitWeight: 50,
    costPrice: 15900,
    salePrice: 16150,
    offerPrice: 16050,
    shopStock: 45,
    storeStock: 100,
    alertQty: 20,
    location: 'Godown B, Bay 1',
    flags: { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: 'Standard root booster for rabi & kharif.'
  },
  {
    id: 'prod-4',
    branchId: 'branch-1',
    name: 'Zorawar Zinc 33% 5 KG',
    sku: 'MICR-201',
    generic: 'Monohydrate Zinc Sulphate 33%',
    barcode: '890123456004',
    batchNo: '30062026-0004',
    mfgDate: '2026-03-01',
    expiryDate: '2029-03-01',
    category: 'Micronutrients',
    manufacturer: 'Fauji Fertilizer Company (FFC)',
    unit: 'pack',
    unitWeight: 5,
    costPrice: 1800,
    salePrice: 2100,
    offerPrice: 2050,
    shopStock: 30,
    storeStock: 50,
    alertQty: 10,
    location: 'Shop Rack C-2',
    flags: { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: 'Crucial for paddy rice nursery & crop color.'
  },
  {
    id: 'prod-5',
    branchId: 'branch-1',
    name: 'Bayer Confidor 250ml',
    sku: 'PEST-301',
    generic: 'Imidacloprid 200 SL Systemic Insecticide',
    barcode: '890123456005',
    batchNo: '30062026-0005',
    mfgDate: '2026-02-20',
    expiryDate: '2028-02-20',
    category: 'Pesticides',
    manufacturer: 'Bayer CropScience',
    unit: 'bottle',
    unitWeight: 0.3,
    costPrice: 2400,
    salePrice: 2750,
    offerPrice: 2700,
    shopStock: 15,
    storeStock: 40,
    alertQty: 10,
    location: 'Chemical Safe Cabinet 1',
    flags: { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: 'Controls jassid, aphids, whiteflies in cotton & vegetables.'
  },
  {
    id: 'prod-6',
    branchId: 'branch-1',
    name: 'Syngenta Karate 1 Liter',
    sku: 'PEST-302',
    generic: 'Lambda-Cyhalothrin 2.5% EC',
    barcode: '890123456006',
    batchNo: '30062026-0006',
    mfgDate: '2026-01-15',
    expiryDate: '2028-01-15',
    category: 'Pesticides',
    manufacturer: 'Syngenta Pakistan',
    unit: 'bottle',
    unitWeight: 1,
    costPrice: 3200,
    salePrice: 3600,
    offerPrice: 3500,
    shopStock: 20,
    storeStock: 35,
    alertQty: 8,
    location: 'Chemical Safe Cabinet 2',
    flags: { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: 'Broad spectrum contact and stomach insecticide.'
  },
  {
    id: 'prod-7',
    branchId: 'branch-1',
    name: 'Pioneer Hybrid Corn 30Y87',
    sku: 'SEED-401',
    generic: 'High Yield Grain & Silage Maize Seed',
    barcode: '890123456007',
    batchNo: '30062026-0007',
    mfgDate: '2026-02-01',
    expiryDate: '2027-02-01',
    category: 'Seeds',
    manufacturer: 'Pioneer / Corteva',
    unit: 'bag',
    unitWeight: 20,
    costPrice: 11500,
    salePrice: 12800,
    offerPrice: 12500,
    shopStock: 18,
    storeStock: 30,
    alertQty: 10,
    location: 'Seed Storage Cool Room',
    flags: { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: 'Premium germination rate above 98%.'
  },
  {
    id: 'prod-8',
    branchId: 'branch-1',
    name: 'Kanzo Ag Tarzan Super',
    sku: 'WEED-501',
    generic: 'Selective Herbicide for Wheat Broadleaf & Grasses',
    barcode: '890123456008',
    batchNo: '30062026-0008',
    mfgDate: '2026-01-18',
    expiryDate: '2028-01-18',
    category: 'Weedicides',
    manufacturer: 'Kanzo AG',
    unit: 'pack',
    unitWeight: 0.5,
    costPrice: 1950,
    salePrice: 2300,
    offerPrice: 2250,
    shopStock: 2,
    storeStock: 1,
    alertQty: 10,
    location: 'Shop Shelf 4',
    flags: { active: true, narcotic: false, serialItem: false, keepRecord: true },
    notes: 'Low stock warning! Order fresh carton.'
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    branchId: 'branch-1',
    name: 'Haji Bashir Ahmad',
    phone: '0301-7654321',
    village: 'Chak 42/JB, Sillanwali',
    cnic: '38403-1234567-1',
    creditLimit: 500000,
    balance: 145000,
    type: 'Farmer / Landlord'
  },
  {
    id: 'cust-2',
    branchId: 'branch-1',
    name: 'Malik Tariq Farms',
    phone: '0300-9876543',
    village: 'Kot Momin Road',
    cnic: '38401-7654321-3',
    creditLimit: 800000,
    balance: 82400,
    type: 'Commercial Orchard Grower'
  },
  {
    id: 'cust-3',
    branchId: 'branch-1',
    name: 'Chaudhry Aslam Gondal',
    phone: '0321-4567890',
    village: 'Bhalwal Farm Area',
    cnic: '38402-9988776-5',
    creditLimit: 300000,
    balance: 0,
    type: 'Farmer'
  },
  {
    id: 'cust-4',
    branchId: 'branch-1',
    name: 'Mian Nawazish Ali',
    phone: '0345-1122334',
    village: 'Chak 12 South',
    cnic: '38403-5544332-1',
    creditLimit: 250000,
    balance: 34000,
    type: 'Farmer'
  }
];

const INITIAL_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Fauji Fertilizer Company (FFC)',
    contactPerson: 'Zahid Mehmood (Area Manager)',
    phone: '0300-8451122',
    balance: 420000,
    city: 'Rawalpindi / Sargodha Depot'
  },
  {
    id: 'sup-2',
    name: 'Engro Fertilizers Ltd',
    contactPerson: 'Adnan Shafiq',
    phone: '0301-8654321',
    balance: 280000,
    city: 'Multan / Bhalwal Warehouse'
  },
  {
    id: 'sup-3',
    name: 'Syngenta Pakistan',
    contactPerson: 'Rashid Khan',
    phone: '0322-5544112',
    balance: 75000,
    city: 'Lahore Logistics Hub'
  },
  {
    id: 'sup-4',
    name: 'Bayer CropScience',
    contactPerson: 'Hamid Raza',
    phone: '0333-6677889',
    balance: 110000,
    city: 'Faisalabad Regional Office'
  }
];

// Helper functions for dynamic realistic relative dates
const getRelativeISO = (daysAgo = 0, hour = 10, minute = 30) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const getRelativeDateStr = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const INITIAL_SALES = [
  {
    id: 'INV-2026-1001',
    branchId: 'branch-1',
    date: getRelativeISO(0, 9, 15),
    customerId: 'cust-1',
    customerName: 'Haji Bashir Ahmad',
    paymentType: 'ledger',
    items: [
      { productId: 'prod-1', name: 'Sona DAP 50 KG', qty: 10, unit: 'bag', price: 16200, total: 162000, source: 'shop' }
    ],
    subtotal: 162000,
    discount: 2000,
    grandTotal: 160000,
    paidAmount: 60000,
    balanceAmount: 100000,
    createdBy: 'admin'
  },
  {
    id: 'INV-2026-1002',
    branchId: 'branch-1',
    date: getRelativeISO(0, 10, 45),
    customerId: 'walk-in',
    customerName: 'Walk-in Cash Customer',
    paymentType: 'cash',
    items: [
      { productId: 'prod-2', name: 'Sona Urea 50 KG', qty: 5, unit: 'bag', price: 4650, total: 23250, source: 'shop' },
      { productId: 'prod-4', name: 'Zorawar Zinc 33% 5 KG', qty: 2, unit: 'pack', price: 2100, total: 4200, source: 'shop' }
    ],
    subtotal: 27450,
    discount: 450,
    grandTotal: 27000,
    paidAmount: 27000,
    balanceAmount: 0,
    createdBy: 'staff'
  },
  {
    id: 'INV-2026-1003',
    branchId: 'branch-1',
    date: getRelativeISO(0, 11, 30),
    customerId: 'cust-2',
    customerName: 'Malik Tariq Farms',
    paymentType: 'ledger',
    items: [
      { productId: 'prod-5', name: 'Bayer Confidor 250ml', qty: 6, unit: 'bottle', price: 2750, total: 16500, source: 'shop' },
      { productId: 'prod-6', name: 'Syngenta Karate 1 Liter', qty: 4, unit: 'bottle', price: 3600, total: 14400, source: 'shop' }
    ],
    subtotal: 30900,
    discount: 900,
    grandTotal: 30000,
    paidAmount: 0,
    balanceAmount: 30000,
    createdBy: 'admin'
  },
  {
    id: 'INV-2026-1004',
    branchId: 'branch-1',
    date: getRelativeISO(0, 14, 15),
    customerId: 'walk-in',
    customerName: 'Walk-in Cash Customer',
    paymentType: 'cash',
    items: [
      { productId: 'prod-7', name: 'Pioneer Hybrid Corn 30Y87', qty: 2, unit: 'bag', price: 12800, total: 25600, source: 'shop' }
    ],
    subtotal: 25600,
    discount: 600,
    grandTotal: 25000,
    paidAmount: 25000,
    balanceAmount: 0,
    createdBy: 'staff'
  },
  {
    id: 'INV-2026-1005',
    branchId: 'branch-1',
    date: getRelativeISO(1, 10, 10),
    customerId: 'cust-3',
    customerName: 'Chaudhry Aslam Gondal',
    paymentType: 'cash',
    items: [
      { productId: 'prod-2', name: 'Sona Urea 50 KG', qty: 15, unit: 'bag', price: 4600, total: 69000, source: 'shop' }
    ],
    subtotal: 69000,
    discount: 0,
    grandTotal: 69000,
    paidAmount: 69000,
    balanceAmount: 0,
    createdBy: 'staff'
  },
  {
    id: 'INV-2026-1006',
    branchId: 'branch-1',
    date: getRelativeISO(1, 15, 30),
    customerId: 'cust-4',
    customerName: 'Mian Nawazish Ali',
    paymentType: 'ledger',
    items: [
      { productId: 'prod-3', name: 'Engro DAP 50 KG', qty: 4, unit: 'bag', price: 16150, total: 64600, source: 'shop' }
    ],
    subtotal: 64600,
    discount: 600,
    grandTotal: 64000,
    paidAmount: 30000,
    balanceAmount: 34000,
    createdBy: 'admin'
  },
  {
    id: 'INV-2026-1007',
    branchId: 'branch-1',
    date: getRelativeISO(2, 11, 0),
    customerId: 'cust-1',
    customerName: 'Haji Bashir Ahmad',
    paymentType: 'ledger',
    items: [
      { productId: 'prod-3', name: 'Engro DAP 50 KG', qty: 8, unit: 'bag', price: 16150, total: 129200, source: 'shop' }
    ],
    subtotal: 129200,
    discount: 1200,
    grandTotal: 128000,
    paidAmount: 43000,
    balanceAmount: 85000,
    createdBy: 'admin'
  },
  {
    id: 'INV-2026-1008',
    branchId: 'branch-1',
    date: getRelativeISO(3, 14, 20),
    customerId: 'cust-2',
    customerName: 'Malik Tariq Farms',
    paymentType: 'ledger',
    items: [
      { productId: 'prod-6', name: 'Syngenta Karate 1 Liter', qty: 10, unit: 'bottle', price: 3600, total: 36000, source: 'shop' },
      { productId: 'prod-4', name: 'Zorawar Zinc 33% 5 KG', qty: 5, unit: 'pack', price: 2050, total: 10250, source: 'shop' }
    ],
    subtotal: 46250,
    discount: 250,
    grandTotal: 46000,
    paidAmount: 0,
    balanceAmount: 46000,
    createdBy: 'admin'
  },
  {
    id: 'INV-2026-1009',
    branchId: 'branch-1',
    date: getRelativeISO(4, 13, 45),
    customerId: 'walk-in',
    customerName: 'Walk-in Cash Customer',
    paymentType: 'cash',
    items: [
      { productId: 'prod-2', name: 'Sona Urea 50 KG', qty: 20, unit: 'bag', price: 4600, total: 92000, source: 'shop' }
    ],
    subtotal: 92000,
    discount: 0,
    grandTotal: 92000,
    paidAmount: 92000,
    balanceAmount: 0,
    createdBy: 'staff'
  },
  {
    id: 'INV-2026-1010',
    branchId: 'branch-1',
    date: getRelativeISO(5, 10, 30),
    customerId: 'cust-3',
    customerName: 'Chaudhry Aslam Gondal',
    paymentType: 'cash',
    items: [
      { productId: 'prod-7', name: 'Pioneer Hybrid Corn 30Y87', qty: 6, unit: 'bag', price: 12500, total: 75000, source: 'shop' }
    ],
    subtotal: 75000,
    discount: 0,
    grandTotal: 75000,
    paidAmount: 75000,
    balanceAmount: 0,
    createdBy: 'staff'
  },
  {
    id: 'INV-2026-1011',
    branchId: 'branch-1',
    date: getRelativeISO(6, 16, 15),
    customerId: 'cust-1',
    customerName: 'Haji Bashir Ahmad',
    paymentType: 'ledger',
    items: [
      { productId: 'prod-1', name: 'Sona DAP 50 KG', qty: 12, unit: 'bag', price: 16200, total: 194400, source: 'shop' }
    ],
    subtotal: 194400,
    discount: 2400,
    grandTotal: 192000,
    paidAmount: 92000,
    balanceAmount: 100000,
    createdBy: 'admin'
  },
  {
    id: 'INV-2026-1012',
    branchId: 'branch-1',
    date: getRelativeISO(12, 11, 0),
    customerId: 'cust-2',
    customerName: 'Malik Tariq Farms',
    paymentType: 'ledger',
    items: [
      { productId: 'prod-2', name: 'Sona Urea 50 KG', qty: 15, unit: 'bag', price: 4600, total: 69000, source: 'shop' }
    ],
    subtotal: 69000,
    discount: 0,
    grandTotal: 69000,
    paidAmount: 20000,
    balanceAmount: 49000,
    createdBy: 'admin'
  },
  {
    id: 'INV-2026-1013',
    branchId: 'branch-1',
    date: getRelativeISO(19, 15, 30),
    customerId: 'walk-in',
    customerName: 'Walk-in Cash Customer',
    paymentType: 'cash',
    items: [
      { productId: 'prod-5', name: 'Bayer Confidor 250ml', qty: 8, unit: 'bottle', price: 2700, total: 21600, source: 'shop' }
    ],
    subtotal: 21600,
    discount: 0,
    grandTotal: 21600,
    paidAmount: 21600,
    balanceAmount: 0,
    createdBy: 'staff'
  },
  {
    id: 'INV-2026-1014',
    branchId: 'branch-1',
    date: getRelativeISO(25, 10, 0),
    customerId: 'cust-4',
    customerName: 'Mian Nawazish Ali',
    paymentType: 'ledger',
    items: [
      { productId: 'prod-3', name: 'Engro DAP 50 KG', qty: 10, unit: 'bag', price: 16000, total: 160000, source: 'shop' }
    ],
    subtotal: 160000,
    discount: 0,
    grandTotal: 160000,
    paidAmount: 60000,
    balanceAmount: 100000,
    createdBy: 'admin'
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'PAY-IN-001',
    branchId: 'branch-1',
    date: getRelativeISO(0, 9, 30),
    type: 'in',
    accountId: 'cust-1',
    accountName: 'Haji Bashir Ahmad',
    accountType: 'customer',
    amount: 50000,
    mode: 'Cash',
    refNo: 'CASH-REC-101',
    remarks: 'Previous harvest recovery cash payment'
  },
  {
    id: 'PAY-OUT-001',
    branchId: 'branch-1',
    date: getRelativeISO(0, 8, 30),
    type: 'out',
    accountId: 'sup-1',
    accountName: 'Fauji Fertilizer Company (FFC)',
    accountType: 'supplier',
    amount: 250000,
    mode: 'Bank Transfer (HBL)',
    refNo: 'FT-994821',
    remarks: 'Advance online transfer for next Urea truck load'
  },
  {
    id: 'PAY-IN-002',
    branchId: 'branch-1',
    date: getRelativeISO(0, 13, 0),
    type: 'in',
    accountId: 'cust-2',
    accountName: 'Malik Tariq Farms',
    accountType: 'customer',
    amount: 20000,
    mode: 'Cash',
    refNo: 'CASH-REC-102',
    remarks: 'Cash recovery payment on orchard spray'
  },
  {
    id: 'PAY-OUT-002',
    branchId: 'branch-1',
    date: getRelativeISO(1, 16, 0),
    type: 'out',
    accountId: 'sup-2',
    accountName: 'Engro Fertilizers Ltd',
    accountType: 'supplier',
    amount: 15000,
    mode: 'Cash',
    refNo: 'CASH-EXP-88',
    remarks: 'Godown freight & labor unloading cash voucher'
  },
  {
    id: 'PAY-IN-003',
    branchId: 'branch-1',
    date: getRelativeISO(3, 11, 0),
    type: 'in',
    accountId: 'cust-4',
    accountName: 'Mian Nawazish Ali',
    accountType: 'customer',
    amount: 40000,
    mode: 'Bank Transfer (Allied)',
    refNo: 'FT-33219',
    remarks: 'Installment payment for wheat planting input'
  }
];

const INITIAL_HOLD_STOCK = [
  {
    id: 'HOLD-001',
    branchId: 'branch-1',
    date: getRelativeDateStr(3),
    customerId: 'cust-1',
    customerName: 'Haji Bashir Ahmad',
    productId: 'prod-1',
    productName: 'Sona DAP 50 KG',
    totalBags: 50,
    releasedBags: 20,
    remainingBags: 30,
    location: 'Store Godown Section 4',
    status: 'Active Custody',
    notes: 'Booked in advance at Rs 16,000/bag. Will collect 30 bags next week.'
  },
  {
    id: 'HOLD-002',
    branchId: 'branch-1',
    date: getRelativeDateStr(5),
    customerId: 'cust-2',
    customerName: 'Malik Tariq Farms',
    productId: 'prod-7',
    productName: 'Pioneer Hybrid Corn 30Y87',
    totalBags: 20,
    releasedBags: 5,
    remainingBags: 15,
    location: 'Seed Storage Cool Room',
    status: 'Active Custody',
    notes: 'Awaiting land preparation before lifting rest.'
  }
];

const INITIAL_TEMP_LEDGER = [
  {
    id: 'TEMP-01',
    branchId: 'branch-1',
    date: getRelativeDateStr(0),
    partyName: 'Nadeem Tractor Driver',
    details: '2 Bags Urea taken on verbal word of Haji Bashir',
    amount: 9300,
    type: 'Sale',
    status: 'Pending'
  },
  {
    id: 'TEMP-02',
    branchId: 'branch-1',
    date: getRelativeDateStr(0),
    partyName: 'Tea & Mandi Refreshment',
    details: 'Daily guest tea, mineral water & snacks',
    amount: 750,
    type: 'Expense',
    status: 'Approved'
  },
  {
    id: 'TEMP-03',
    branchId: 'branch-1',
    date: getRelativeDateStr(1),
    partyName: 'Rana Munawar Tractor Trolley',
    details: '1 bag DAP taken for tubewell repair emergency',
    amount: 16100,
    type: 'Sale',
    status: 'Pending'
  }
];

const INITIAL_PURCHASES = [
  {
    id: 'PO-2026-901',
    branchId: 'branch-1',
    date: getRelativeISO(1, 11, 0),
    supplierId: 'sup-1',
    supplierName: 'Fauji Fertilizer Company (FFC)',
    productId: 'prod-1',
    productName: 'Sona Urea (Prilled) 50 KG',
    qty: 100,
    unit: 'bag',
    unitCost: 4400,
    totalCost: 440000,
    paymentMode: 'Credit (Payable Khata)',
    targetLoc: 'store',
    status: 'Received in Godown'
  },
  {
    id: 'PO-2026-902',
    branchId: 'branch-1',
    date: getRelativeISO(3, 15, 30),
    supplierId: 'sup-2',
    supplierName: 'Engro Fertilizers Ltd',
    productId: 'prod-2',
    productName: 'Engro DAP 50 KG',
    qty: 60,
    unit: 'bag',
    unitCost: 15850,
    totalCost: 951000,
    paymentMode: 'Credit (Payable Khata)',
    targetLoc: 'store',
    status: 'Received in Godown'
  },
  {
    id: 'PO-2026-903',
    branchId: 'branch-1',
    date: getRelativeISO(7, 10, 0),
    supplierId: 'sup-3',
    supplierName: 'Syngenta Pakistan',
    productId: 'prod-6',
    productName: 'Syngenta Karate 1 Liter',
    qty: 40,
    unit: 'bottle',
    unitCost: 3200,
    totalCost: 128000,
    paymentMode: 'Credit (Payable Khata)',
    targetLoc: 'store',
    status: 'Received in Godown'
  }
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setThemeState] = useState('theme-sapphire'); // NEW DEFAULT THEME
  const [hideAmounts, setHideAmounts] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeBranchId, setActiveBranchId] = useState('branch-1');
  const [branches, setBranches] = useState(DEFAULT_BRANCHES);
  
  // Super Admin & Multi-Tenant SaaS State
  const [tenants, setTenants] = useState(DEFAULT_TENANTS);
  const [tenantUsers, setTenantUsers] = useState(INITIAL_TENANT_USERS);
  const [saasBilling, setSaasBilling] = useState(INITIAL_SAAS_BILLING);
  const [broadcastMessage, setBroadcastMessage] = useState({
    text: '🌾 Welcome to AgriSol SaaS v2.0 - Hybrid Offline-First Architecture & Cloud Ledger Sync Active.',
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

  // Auth State
  const [auth, setAuth] = useState({
    isAuthenticated: true,
    user: { username: 'admin', name: 'Admin Manager', role: 'admin' },
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

  // Store Profile
  const [storeProfile, setStoreProfile] = useState({
    name: 'Ahmed & Co.',
    subtitle: 'Agriculture Store',
    phone: '0300-6737953',
    website: 'www.AgriSol.pk',
    address: 'Grain & Fertilizer Market, Mandi Bahauddin Road, Sargodha',
    ntn: '4829104-7',
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
    { id: 'log-1', timestamp: getRelativeISO(0, 8, 15), user: 'admin', action: 'System Login', details: 'Admin logged in from terminal 01' },
    { id: 'log-2', timestamp: getRelativeISO(0, 8, 30), user: 'admin', action: 'Payment Out Voucher', details: 'Paid Rs 250,000 to Fauji Fertilizer Company' },
    { id: 'log-3', timestamp: getRelativeISO(0, 9, 15), user: 'admin', action: 'Invoice Created', details: 'INV-2026-1001 for Haji Bashir Ahmad (Rs 160,000)' },
    { id: 'log-4', timestamp: getRelativeISO(0, 9, 30), user: 'admin', action: 'Payment In Voucher', details: 'Cash recovery Rs 50,000 from Haji Bashir Ahmad' },
    { id: 'log-5', timestamp: getRelativeISO(0, 10, 45), user: 'staff', action: 'Invoice Created', details: 'INV-2026-1002 for Walk-in Cash Customer (Rs 27,000)' }
  ]);
  const [toasts, setToasts] = useState([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setThemeState(parsed.theme);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.suppliers) setSuppliers(parsed.suppliers);
        if (parsed.sales && Array.isArray(parsed.sales)) {
          const todayStr = new Date().toISOString().split('T')[0];
          const hasToday = parsed.sales.some(s => s.date && s.date.startsWith(todayStr));
          // If stored sales are from an older static test and have 0 sales today, use dynamic seed data
          if (!hasToday && parsed.sales.length <= 4) {
            setSales(INITIAL_SALES);
          } else {
            setSales(parsed.sales);
          }
        }
        if (parsed.purchases) setPurchases(parsed.purchases);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.holdStock) setHoldStock(parsed.holdStock);
        if (parsed.tempLedger) setTempLedger(parsed.tempLedger);
        if (parsed.branches) setBranches(parsed.branches);
        if (parsed.activeBranchId) setActiveBranchId(parsed.activeBranchId);
        if (parsed.storeProfile) setStoreProfile(parsed.storeProfile);
        if (parsed.auth) setAuth(parsed.auth);
        if (parsed.staffPermissions) setStaffPermissions(parsed.staffPermissions);
        if (parsed.tenants) setTenants(parsed.tenants);
        if (parsed.activeTenantId) setActiveTenantId(parsed.activeTenantId);
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
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
        auth,
        staffPermissions,
        tenants,
        activeTenantId
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [theme, products, customers, suppliers, sales, purchases, payments, holdStock, tempLedger, branches, activeBranchId, storeProfile, auth, staffPermissions, tenants, activeTenantId]);

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

  // Auth functions
  const login = (username, pin, role = 'admin') => {
    if (role === 'superadmin') {
      if (pin === auth.superadminPin || pin === '9999') {
        setAuth({
          isAuthenticated: true,
          user: { username: username || 'superadmin', name: 'Master Super Admin', role: 'superadmin' },
          adminPin: auth.adminPin,
          staffPin: auth.staffPin,
          superadminPin: auth.superadminPin || '9999'
        });
        setActiveTab('superadmin');
        addLog('Super Admin Login', 'Master SaaS Administrator logged in');
        showToast('Welcome to Super Admin Portal!', 'success');
        return { success: true };
      }
      return { success: false, message: 'Invalid Super Admin Master PIN. (Default PIN: 9999)' };
    } else if (role === 'admin') {
      if (pin === auth.adminPin || pin === '1234') {
        setAuth(prev => ({
          ...prev,
          isAuthenticated: true,
          user: { username: username || 'admin', name: 'Admin Manager', role: 'admin' }
        }));
        addLog('User Login', `Admin ${username || 'admin'} authenticated.`);
        showToast('Welcome back, Admin!', 'success');
        return { success: true };
      }
      return { success: false, message: 'Invalid Admin PIN. (Default PIN: 1234)' };
    } else {
      if (pin === auth.staffPin || pin === '0000') {
        setAuth(prev => ({
          ...prev,
          isAuthenticated: true,
          user: { username: username || 'staff', name: 'Counter Staff', role: 'staff' }
        }));
        addLog('User Login', `Staff ${username || 'staff'} authenticated.`);
        showToast('Logged in as Counter Staff', 'success');
        return { success: true };
      }
      return { success: false, message: 'Invalid Staff PIN. (Default PIN: 0000)' };
    }
  };

  const logout = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    setImpersonatingTenant(null);
    addLog('User Logout', 'User logged out');
    showToast('Logged out successfully', 'info');
  };

  const resetPin = (newPin, role = 'admin') => {
    setAuth(prev => ({
      ...prev,
      [role === 'admin' ? 'adminPin' : (role === 'superadmin' ? 'superadminPin' : 'staffPin')]: newPin
    }));
    addLog('Security', `${role.toUpperCase()} PIN updated`);
    showToast('PIN updated successfully', 'success');
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
    const newTenant = {
      id,
      name: tenantData.name,
      subtitle: tenantData.subtitle || 'Agriculture Store',
      ownerName: tenantData.ownerName || 'Store Owner',
      email: tenantData.email || '',
      phone: tenantData.phone || '',
      city: tenantData.city || 'Mandi',
      plan: tenantData.plan || 'Growth Plan',
      monthlyFee: Number(tenantData.monthlyFee) || 6500,
      status: 'Active',
      maxBranches: Number(tenantData.maxBranches) || 3,
      activeBranchesCount: 1,
      totalInvoicesCount: 0,
      adminPin: tenantData.adminPin || '1234',
      joinedDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      storageUsedMb: 12,
      ntn: tenantData.ntn || 'Pending',
      address: tenantData.address || ''
    };
    setTenants(prev => [newTenant, ...prev]);
    addLog('SaaS Tenant Created', `Registered new tenant: ${newTenant.name}`);
    showToast(`Registered SaaS tenant "${newTenant.name}"!`, 'success');
    return newTenant;
  };

  const updateTenant = (tenantId, updatedFields) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, ...updatedFields } : t));
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
      website: t.email ? `www.${t.email.split('@')[1] || 'agrisol.pk'}` : 'www.AgriSol.pk',
      address: t.address || `${t.city}, Pakistan`,
      ntn: t.ntn || '4829104-7',
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

  // Branch / Tenant switching
  const switchBranch = (branchId) => {
    setActiveBranchId(branchId);
    const b = branches.find(br => br.id === branchId);
    showToast(`Switched branch to ${b?.name || branchId}`, 'info');
  };

  // Product Actions
  const addProduct = (p) => {
    const id = 'prod-' + Date.now();
    const newProd = {
      id,
      branchId: activeBranchId,
      name: p.name,
      sku: p.sku || 'SKU-' + Math.floor(100 + Math.random() * 900),
      generic: p.generic || '',
      barcode: p.barcode || '890' + Math.floor(100000000 + Math.random() * 900000000),
      batchNo: p.batchNo || '30062026-0001',
      mfgDate: p.mfgDate || '',
      expiryDate: p.expiryDate || '',
      category: p.category || 'Fertilizers',
      manufacturer: p.manufacturer || 'Fauji Fertilizer Company (FFC)',
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
      notes: p.notes || ''
    };

    setProducts(prev => [newProd, ...prev]);
    if (newProd.category && !categories.includes(newProd.category)) {
      setCategories(prev => [...prev, newProd.category]);
    }
    if (newProd.manufacturer && !manufacturers.includes(newProd.manufacturer)) {
      setManufacturers(prev => [...prev, newProd.manufacturer]);
    }
    addLog('Add Product', `Added ${newProd.name} (SKU: ${newProd.sku})`);
    showToast(`Product "${newProd.name}" added successfully!`, 'success');
    return newProd;
  };

  const updateProduct = (id, updated) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    addLog('Update Product', `Updated product ${id}`);
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addLog('Delete Product', `Deleted ${prod?.name || id}`);
    showToast('Product deleted', 'warning');
  };

  const transferStock = (id, fromLoc, toLoc, qty) => {
    const q = Number(qty) || 0;
    if (q <= 0) return false;
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (fromLoc === 'shop' && toLoc === 'store') {
        return { ...p, shopStock: Math.max(0, p.shopStock - q), storeStock: p.storeStock + q };
      } else if (fromLoc === 'store' && toLoc === 'shop') {
        return { ...p, storeStock: Math.max(0, p.storeStock - q), shopStock: p.shopStock + q };
      }
      return p;
    }));
    addLog('Stock Transfer', `Moved ${q} units between ${fromLoc} and ${toLoc}`);
    showToast(`Transferred ${q} units successfully!`, 'success');
    return true;
  };

  // Sales / POS
  const createSale = (saleData) => {
    const invoiceId = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newSale = {
      id: invoiceId,
      branchId: activeBranchId,
      date: new Date().toISOString(),
      customerId: saleData.customerId,
      customerName: saleData.customerName,
      paymentType: saleData.paymentType,
      items: saleData.items,
      subtotal: Number(saleData.subtotal) || 0,
      discount: Number(saleData.discount) || 0,
      grandTotal: Number(saleData.grandTotal) || 0,
      paidAmount: Number(saleData.paidAmount) || 0,
      balanceAmount: Number(saleData.balanceAmount) || 0,
      createdBy: auth.user?.username || 'admin',
      notes: saleData.notes || ''
    };

    // Deduct stock
    setProducts(prev => prev.map(prod => {
      const lineItem = newSale.items.find(i => i.productId === prod.id);
      if (!lineItem) return prod;
      if (lineItem.source === 'store') {
        return { ...prod, storeStock: Math.max(0, prod.storeStock - lineItem.qty) };
      } else {
        return { ...prod, shopStock: Math.max(0, prod.shopStock - lineItem.qty) };
      }
    }));

    // Update Customer Khata balance if credit
    if (newSale.balanceAmount > 0 && newSale.customerId && newSale.customerId !== 'walk-in') {
      setCustomers(prev => prev.map(c => {
        if (c.id === newSale.customerId) {
          return { ...c, balance: c.balance + newSale.balanceAmount };
        }
        return c;
      }));
    }

    setSales(prev => [newSale, ...prev]);
    addLog('New Sale', `Invoice ${newSale.id} - Rs ${newSale.grandTotal} (${newSale.customerName})`);
    showToast(`Sale completed! Invoice #${newSale.id}`, 'success');
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

  // Payments
  const addPayment = (payData) => {
    const payId = (payData.type === 'in' ? 'PAY-IN-' : 'PAY-OUT-') + Math.floor(100 + Math.random() * 900);
    const payment = {
      id: payId,
      branchId: activeBranchId,
      date: new Date().toISOString(),
      type: payData.type,
      accountId: payData.accountId,
      accountName: payData.accountName,
      accountType: payData.accountType,
      amount: Number(payData.amount) || 0,
      mode: payData.mode || 'Cash',
      refNo: payData.refNo || '',
      remarks: payData.remarks || ''
    };

    if (payData.type === 'in') {
      setCustomers(prev => prev.map(c => c.id === payData.accountId ? { ...c, balance: c.balance - payment.amount } : c));
    } else {
      setSuppliers(prev => prev.map(s => s.id === payData.accountId ? { ...s, balance: s.balance - payment.amount } : s));
    }

    setPayments(prev => [payment, ...prev]);
    addLog(payData.type === 'in' ? 'Payment In' : 'Payment Out', `Rs ${payment.amount} (${payment.accountName})`);
    showToast(`Payment recorded: Rs ${payment.amount}`, 'success');
    return payment;
  };

  // Customer & Supplier Accounts
  const addCustomer = (c) => {
    const newCust = {
      id: 'cust-' + Date.now(),
      branchId: activeBranchId,
      name: c.name,
      phone: c.phone || '',
      village: c.village || '',
      cnic: c.cnic || '',
      creditLimit: Number(c.creditLimit) || 200000,
      balance: Number(c.balance) || 0,
      type: c.type || 'Farmer'
    };
    setCustomers(prev => [...prev, newCust]);
    addLog('Add Customer', `Added ${newCust.name}`);
    showToast(`Customer ${newCust.name} added!`, 'success');
    return newCust;
  };

  const addSupplier = (s) => {
    const newSup = {
      id: 'sup-' + Date.now(),
      name: s.name,
      contactPerson: s.contactPerson || '',
      phone: s.phone || '',
      balance: Number(s.balance) || 0,
      city: s.city || ''
    };
    setSuppliers(prev => [...prev, newSup]);
    addLog('Add Supplier', `Added ${newSup.name}`);
    showToast(`Supplier ${newSup.name} added!`, 'success');
    return newSup;
  };

  const updateCustomer = (id, updatedFields) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    addLog('Update Customer', `Updated customer account ${id}`);
    showToast('Customer account updated!', 'success');
  };

  const deleteCustomer = (id) => {
    const cust = customers.find(c => c.id === id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    addLog('Delete Customer', `Removed customer ${cust?.name || id}`);
    showToast('Customer account removed', 'warning');
  };

  const updateSupplier = (id, updatedFields) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    addLog('Update Supplier', `Updated supplier account ${id}`);
    showToast('Supplier account updated!', 'success');
  };

  const deleteSupplier = (id) => {
    const sup = suppliers.find(s => s.id === id);
    setSuppliers(prev => prev.filter(s => s.id !== id));
    addLog('Delete Supplier', `Removed supplier ${sup?.name || id}`);
    showToast('Supplier account removed', 'warning');
  };

  const deleteSale = (saleId) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    // 1. Revert product inventory
    setProducts(prev => prev.map(prod => {
      const item = sale.items?.find(it => it.productId === prod.id);
      if (!item) return prod;
      if (item.source === 'store') {
        return { ...prod, storeStock: (prod.storeStock || 0) + (item.qty || 0) };
      } else {
        return { ...prod, shopStock: (prod.shopStock || 0) + (item.qty || 0) };
      }
    }));

    // 2. Revert customer balance if credit sale
    if (sale.balanceAmount > 0 && sale.customerId && sale.customerId !== 'walk-in') {
      setCustomers(prev => prev.map(c => {
        if (c.id === sale.customerId) {
          return { ...c, balance: Math.max(0, (c.balance || 0) - sale.balanceAmount) };
        }
        return c;
      }));
    }

    setSales(prev => prev.filter(s => s.id !== saleId));
    addLog('Delete Sale', `Deleted invoice ${saleId} (${sale.customerName}) - Restored stock and adjusted customer ledger`);
    showToast(`Invoice ${saleId} deleted. Stock & khata restored!`, 'info');
  };

  const deletePayment = (payId) => {
    const pay = payments.find(p => p.id === payId);
    if (!pay) return;

    // Revert balance change
    if (pay.type === 'in') {
      setCustomers(prev => prev.map(c => c.id === pay.accountId ? { ...c, balance: (c.balance || 0) + pay.amount } : c));
    } else {
      setSuppliers(prev => prev.map(s => s.id === pay.accountId ? { ...s, balance: (s.balance || 0) + pay.amount } : s));
    }

    setPayments(prev => prev.filter(p => p.id !== payId));
    addLog('Delete Payment', `Deleted payment voucher ${payId} (Rs ${pay.amount}) - Reverted account ledger`);
    showToast(`Payment voucher ${payId} deleted and ledger restored!`, 'info');
  };

  const deletePurchase = (poId) => {
    const po = purchases.find(p => p.id === poId);
    if (!po) return;

    // Deduct received stock from product
    setProducts(prev => prev.map(prod => {
      if (prod.id !== po.productId) return prod;
      if (po.targetLoc === 'shop') {
        return { ...prod, shopStock: Math.max(0, (prod.shopStock || 0) - (po.qty || 0)) };
      } else {
        return { ...prod, storeStock: Math.max(0, (prod.storeStock || 0) - (po.qty || 0)) };
      }
    }));

    // Revert supplier balance if credit
    if (po.paymentMode?.includes('Credit')) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === po.supplierId) {
          return { ...s, balance: Math.max(0, (s.balance || 0) - (po.totalCost || 0)) };
        }
        return s;
      }));
    }

    setPurchases(prev => prev.filter(p => p.id !== poId));
    addLog('Delete Purchase', `Deleted PO ${poId} (${po.productName}) - Restored stock and supplier ledger`);
    showToast(`Purchase order ${poId} deleted`, 'info');
  };

  const deleteHoldStock = (id) => {
    const item = holdStock.find(h => h.id === id);
    setHoldStock(prev => prev.filter(h => h.id !== id));
    addLog('Delete Custody Record', `Removed customer custody ${id} (${item?.customerName || id})`);
    showToast('Customer custody record removed', 'info');
  };

  // Inward Purchase & Stock In
  const recordPurchase = (pData) => {
    const poId = 'PO-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const numQty = Number(pData.qty) || 1;
    const unitCost = Number(pData.unitCost) || 0;
    const totalCost = numQty * unitCost;

    const newPO = {
      id: poId,
      branchId: activeBranchId,
      date: new Date().toISOString(),
      supplierId: pData.supplierId,
      supplierName: pData.supplierName,
      productId: pData.productId,
      productName: pData.productName,
      qty: numQty,
      unit: pData.unit || 'bag',
      unitCost,
      totalCost,
      paymentMode: pData.paymentMode || 'Credit (Payable Khata)',
      targetLoc: pData.targetLoc || 'store',
      status: `Received in ${pData.targetLoc === 'store' ? 'Godown' : 'Shop'}`
    };

    // Update Product Stock & Cost
    setProducts(prev => prev.map(prod => {
      if (prod.id !== pData.productId) return prod;
      return {
        ...prod,
        costPrice: unitCost > 0 ? unitCost : prod.costPrice,
        shopStock: pData.targetLoc === 'shop' ? (prod.shopStock || 0) + numQty : (prod.shopStock || 0),
        storeStock: pData.targetLoc === 'store' ? (prod.storeStock || 0) + numQty : (prod.storeStock || 0)
      };
    }));

    // Update Supplier Balance if Credit
    if (newPO.paymentMode.includes('Credit')) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === pData.supplierId) {
          return { ...s, balance: (s.balance || 0) + totalCost };
        }
        return s;
      }));
    } else {
      // Create Outward Payment Voucher for Instant Cash / Bank
      const payment = {
        id: 'PAY-OUT-' + Math.floor(100 + Math.random() * 900),
        branchId: activeBranchId,
        date: new Date().toISOString(),
        type: 'out',
        accountId: pData.supplierId,
        accountName: pData.supplierName,
        accountType: 'supplier',
        amount: totalCost,
        mode: pData.paymentMode.includes('Bank') ? 'Bank Transfer' : 'Cash',
        refNo: poId,
        remarks: `Auto-voucher for Inward Stock PO ${poId}`
      };
      setPayments(prev => [payment, ...prev]);
    }

    setPurchases(prev => [newPO, ...prev]);
    addLog('Inward Stock Purchase', `PO #${poId} received ${numQty} ${newPO.unit} of ${newPO.productName} from ${newPO.supplierName} (Total Rs ${totalCost})`);
    showToast(`Inward stock PO #${poId} recorded!`, 'success');
    return newPO;
  };

  // Hold Stock / Custody (Amanat)
  const addHoldStock = (h) => {
    const hold = {
      id: 'HOLD-' + Math.floor(100 + Math.random() * 900),
      branchId: activeBranchId,
      date: new Date().toISOString().split('T')[0],
      customerId: h.customerId,
      customerName: h.customerName,
      productId: h.productId,
      productName: h.productName,
      totalBags: Number(h.totalBags) || 0,
      releasedBags: 0,
      remainingBags: Number(h.totalBags) || 0,
      location: h.location || 'Godown Main',
      status: 'Active Custody',
      notes: h.notes || ''
    };
    setHoldStock(prev => [hold, ...prev]);
    addLog('Hold Stock', `Booked ${hold.totalBags} bags for ${hold.customerName}`);
    showToast(`Amanat stock custody booked: ${hold.totalBags} bags!`, 'success');
    return hold;
  };

  const releaseHoldStock = (holdId, qty) => {
    const q = Number(qty) || 0;
    setHoldStock(prev => prev.map(h => {
      if (h.id !== holdId) return h;
      const rem = Math.max(0, h.remainingBags - q);
      return {
        ...h,
        releasedBags: h.releasedBags + q,
        remainingBags: rem,
        status: rem === 0 ? 'Fully Dispatched' : 'Active Custody'
      };
    }));
    addLog('Release Stock', `Dispatched ${q} bags`);
    showToast(`Dispatched ${q} bags from custody!`, 'success');
  };

  // Temp Ledger (Katcha Khata)
  const addTempLedger = (entry) => {
    const item = {
      id: 'TEMP-' + Math.floor(10 + Math.random() * 90),
      branchId: activeBranchId,
      date: new Date().toISOString().split('T')[0],
      partyName: entry.partyName,
      details: entry.details,
      amount: Number(entry.amount) || 0,
      type: entry.type || 'Sale',
      status: 'Pending'
    };
    setTempLedger(prev => [item, ...prev]);
    showToast('Temp entry noted in Katcha Khata', 'info');
  };

  const approveTempLedger = (id) => {
    setTempLedger(prev => prev.map(t => t.id === id ? { ...t, status: 'Reconciled / Settled' } : t));
    showToast('Temp entry reconciled', 'success');
  };

  const deleteTempLedger = (id) => {
    setTempLedger(prev => prev.filter(t => t.id !== id));
    showToast('Temp entry removed', 'info');
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASES);
    setPayments(INITIAL_PAYMENTS);
    setHoldStock(INITIAL_HOLD_STOCK);
    setTempLedger(INITIAL_TEMP_LEDGER);
    setParkedSales([]);
    showToast('System reset to demo dataset', 'info');
  };

  // Metrics calculations for Active Branch
  const branchProducts = products.filter(p => !p.branchId || p.branchId === activeBranchId);
  const branchSales = sales.filter(s => !s.branchId || s.branchId === activeBranchId);
  const branchPayments = payments.filter(p => !p.branchId || p.branchId === activeBranchId);

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

  branchProducts.forEach(p => {
    const totalUnits = (p.shopStock || 0) + (p.storeStock || 0);
    totalStockUnits += totalUnits;
    totalInventoryValue += totalUnits * (p.costPrice || 0);
    totalRetailValue += totalUnits * (p.salePrice || 0);

    if (totalUnits === 0) outOfStockCount++;
    else if (totalUnits <= (p.alertQty || 10)) lowStockCount++;
  });

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
    totalStockUnits,
    categoryCount: new Set(branchProducts.map(p => p.category)).size
  };

  return (
    <AppContext.Provider
      value={{
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
        customers,
        suppliers,
        sales: branchSales,
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
