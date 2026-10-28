// Formatting Helpers for Currency, Dates, SKU, and Barcodes

export function formatCurrency(amount, hideAmounts = false) {
  if (hideAmounts) {
    return 'Rs ••••••';
  }
  const num = Number(amount) || 0;
  return 'Rs ' + num.toLocaleString('en-PK', {
    maximumFractionDigits: 0
  });
}

export function formatNumber(amount, hideAmounts = false) {
  if (hideAmounts) {
    return '••••';
  }
  const num = Number(amount) || 0;
  return num.toLocaleString('en-PK');
}

export function formatDate(dateInput = new Date()) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateShort(dateInput = new Date()) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(dateInput = new Date()) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).toLowerCase();
}

export function generateSKU(category = 'GEN') {
  const prefix = (category.slice(0, 4) || 'AGRI').toUpperCase();
  const rand = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${rand}`;
}

export function generateBarcode() {
  let code = '890';
  for (let i = 0; i < 9; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

export function generateBatchNumber() {
  const d = new Date();
  const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
  const seq = String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0');
  return `${dateStr}-${seq}`;
}
