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

export function getExpiryDetails(expiryDate) {
  if (!expiryDate) return null;
  const exp = new Date(expiryDate);
  if (isNaN(exp.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'expired',
      daysLeft: diffDays,
      isExpired: true,
      isExpiringSoon: false,
      isCritical: true,
      label: `Expired ${Math.abs(diffDays)}d ago`,
      badgeClass: 'badge-danger',
      color: '#dc2626',
      bg: '#fee2e2'
    };
  }
  if (diffDays === 0) {
    return {
      status: 'today',
      daysLeft: 0,
      isExpired: false,
      isExpiringSoon: true,
      isCritical: true,
      label: 'Expires Today!',
      badgeClass: 'badge-danger',
      color: '#dc2626',
      bg: '#fee2e2'
    };
  }
  if (diffDays === 1) {
    return {
      status: 'tomorrow',
      daysLeft: 1,
      isExpired: false,
      isExpiringSoon: true,
      isCritical: true,
      label: 'Expires Tomorrow',
      badgeClass: 'badge-warning',
      color: '#ea580c',
      bg: '#ffedd5'
    };
  }
  if (diffDays <= 7) {
    return {
      status: 'week',
      daysLeft: diffDays,
      isExpired: false,
      isExpiringSoon: true,
      isCritical: true,
      label: `Expires in ${diffDays} days`,
      badgeClass: 'badge-warning',
      color: '#d97706',
      bg: '#fef3c7'
    };
  }
  if (diffDays <= 30) {
    return {
      status: 'month',
      daysLeft: diffDays,
      isExpired: false,
      isExpiringSoon: false,
      isCritical: false,
      label: `Expires in ${diffDays} days`,
      badgeClass: 'badge-info',
      color: '#2563eb',
      bg: '#eff6ff'
    };
  }
  return {
    status: 'safe',
    daysLeft: diffDays,
    isExpired: false,
    isExpiringSoon: false,
    isCritical: false,
    label: `${diffDays} days left`,
    badgeClass: 'badge-success',
    color: '#16a34a',
    bg: '#dcfce7'
  };
}
