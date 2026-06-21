/* app.js - Client-Side App Engine for Onion Supply Ledger */

// App State Management
const State = {
  theme: 'light',
  currentView: 'dashboard-view',
  shops: {},
  transactions: [],
  payments: [],
  trips: [],
  purchases: [],
  wholesalePayments: [],
  activeLedgerShopId: null
};

// --- DATA CONSTANTS & DEMO SYSTEM ---
const DEMO_DATA = {
  version: "1.0.0",
  shops: {
    "shop-1": { id: "shop-1", name: "Rajesh Onion Agency", owner: "Rajesh Kumar", phone: "9876543210", address: "APMC Market, G-Block, Shop 12", createdAt: "2026-05-01", type: "Customer" },
    "shop-2": { id: "shop-2", name: "Patel Vegetable Traders", owner: "Kirit Patel", phone: "9812345678", address: "Subhash Mandi, Shop 4B", createdAt: "2026-05-10", type: "Customer" },
    "shop-3": { id: "shop-3", name: "Star Hoteliers & Suppliers", owner: "Anil Deshmukh", phone: "9001122334", address: "Industrial Zone, Warehouse 9", createdAt: "2026-05-15", type: "Customer" },
    "shop-4": { id: "shop-4", name: "Nashik Wholesale Farm", owner: "Shivaji Rao", phone: "9422012345", address: "Lasalgaon Mandi, Nashik", createdAt: "2026-05-20", type: "Supplier" }
  },
  transactions: [
    { id: "tx-1", shopId: "shop-1", date: "2026-06-01", ratePerKg: 28.50, bagWeights: [45.2, 46.8, 48.0, 42.5, 51.0, 44.0, 45.5, 47.1, 48.2, 49.0], totalBags: 10, totalWeight: 467.3, totalAmount: 13318.05, notes: "Grade-A Onions" },
    { id: "tx-2", shopId: "shop-1", date: "2026-06-05", ratePerKg: 29.00, bagWeights: [50.5, 51.2, 49.8, 52.0, 48.6, 50.1, 51.3, 47.8, 49.5, 51.0, 52.2, 49.1, 50.4, 51.0, 50.5], totalBags: 15, totalWeight: 755.0, totalAmount: 21895.00, notes: "Truck MH-15-EG-4567" },
    { id: "tx-3", shopId: "shop-2", date: "2026-06-08", ratePerKg: 31.00, bagWeights: [41.2, 42.0, 40.5, 43.1, 44.5, 42.8, 43.0, 41.9, 42.2, 40.8], totalBags: 10, totalWeight: 422.0, totalAmount: 13082.00, notes: "Medium Size bags" },
    { id: "tx-4", shopId: "shop-3", date: "2026-06-12", ratePerKg: 26.50, bagWeights: [52.0, 53.5, 54.1, 51.8, 52.9, 50.5, 55.0, 53.8, 52.4, 53.0, 51.9, 52.2, 54.0, 53.1, 52.8, 51.0, 50.8, 52.2, 53.0, 52.1], totalBags: 20, totalWeight: 1052.1, totalAmount: 27880.65, notes: "Hotel Jumbo Size Grade" },
    { id: "tx-5", shopId: "shop-1", date: "2026-06-18", ratePerKg: 30.00, bagWeights: [45.0, 46.2, 48.0, 44.5, 47.1, 48.3, 49.0, 45.8, 46.0, 47.2, 48.1, 46.5], totalBags: 12, totalWeight: 561.7, totalAmount: 16851.00, notes: "APMC Delivery" }
  ],
  payments: [
    { id: "pay-1", shopId: "shop-1", date: "2026-06-03", amount: 10000, mode: "Bank Transfer", reference: "UPI9876543", notes: "Advance payment", type: "Received" },
    { id: "pay-2", shopId: "shop-1", date: "2026-06-10", amount: 20000, mode: "Cash", reference: "Handed to self", notes: "Part payment", type: "Received" },
    { id: "pay-3", shopId: "shop-2", date: "2026-06-15", amount: 8000, mode: "GPay/PhonePe", reference: "GP7748291", notes: "Against invoice 0608", type: "Received" },
    { id: "pay-4", shopId: "shop-3", date: "2026-06-17", amount: 15000, mode: "Cheque", reference: "CHQ#909281", notes: "State Bank of India", type: "Received" },
    { id: "pay-5", shopId: "shop-4", date: "2026-06-20", amount: 50000, mode: "Bank Transfer", reference: "TXN1029384", notes: "Bulk Purchase Advance", type: "Paid" }
  ],
  trips: [
    { id: "trip-1", date: "2026-06-01", fuelCost: 1200, totalBags: 10, notes: "MH-15-EG-4567, Rajesh Onion" },
    { id: "trip-2", date: "2026-06-05", fuelCost: 1500, totalBags: 15, notes: "MH-15-EG-4567, Rajesh Onion" },
    { id: "trip-3", date: "2026-06-08", fuelCost: 800, totalBags: 10, notes: "MH-12-AB-3456, Patel Traders" },
    { id: "trip-4", date: "2026-06-12", fuelCost: 2000, totalBags: 20, notes: "MH-15-EG-1234, Star Hoteliers" },
    { id: "trip-5", date: "2026-06-18", fuelCost: 1100, totalBags: 12, notes: "MH-15-EG-4567, Rajesh Onion" },
    { id: "trip-6", date: "2026-06-20", fuelCost: 2500, totalBags: 100, notes: "Bulk Onion Transport MH-15-QQ-9999" }
  ],
  purchases: [
    { id: "pur-1", supplierId: "shop-4", date: "2026-06-20", rate: 18.00, rateUnit: "per Kg", totalBags: 100, totalWeight: 4500, totalAmount: 81000, notes: "Lasalgaon APMC, Grade-A" }
  ]
};

// --- INITIALIZATION & ROUTING ---
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  loadData();
  setupUI();
  setupRouting();
  setupFormHandlers();
  setupBagParser();
  setupTheme();
  setupBackupHandlers();
  
  // Render views based on current state
  navigate(State.currentView);
  showToast("Application loaded successfully", "success");
}

// State Persistence
function loadData() {
  try {
    const raw = localStorage.getItem('onion_ledger_db');
    if (raw) {
      const parsed = JSON.parse(raw);
      State.shops = parsed.shops || {};
      // Backfill default shop types
      Object.keys(State.shops).forEach(id => {
        if (!State.shops[id].type) {
          State.shops[id].type = 'Customer';
        }
      });
      State.transactions = parsed.transactions || [];
      State.payments = parsed.payments || [];
      // Backfill default payment types
      State.payments.forEach(p => {
        if (!p.type) {
          p.type = 'Received';
        }
      });
      State.trips = parsed.trips || [];
      State.purchases = parsed.purchases || [];
      State.wholesalePayments = parsed.wholesalePayments || [];
    } else {
      // First-time load: Seed with sample demo data
      loadDemoData(false);
    }
  } catch (err) {
    console.error("Error loading data from LocalStorage:", err);
    showToast("Error reading storage. Starting fresh.", "danger");
  }
}

function saveData() {
  try {
    const payload = {
      version: "1.0.0",
      shops: State.shops,
      transactions: State.transactions,
      payments: State.payments,
      trips: State.trips,
      purchases: State.purchases,
      wholesalePayments: State.wholesalePayments
    };
    localStorage.setItem('onion_ledger_db', JSON.stringify(payload));
  } catch (err) {
    console.error("Error writing to LocalStorage:", err);
    showToast("Failed to save data. Check browser storage space.", "danger");
  }
}

function loadDemoData(notifyUser = true) {
  State.shops = JSON.parse(JSON.stringify(DEMO_DATA.shops));
  State.transactions = JSON.parse(JSON.stringify(DEMO_DATA.transactions));
  State.payments = JSON.parse(JSON.stringify(DEMO_DATA.payments));
  State.trips = JSON.parse(JSON.stringify(DEMO_DATA.trips));
  State.purchases = JSON.parse(JSON.stringify(DEMO_DATA.purchases));
  State.wholesalePayments = [];
  saveData();
  refreshAllViews();
  if (notifyUser) {
    showToast("Demo data loaded successfully!", "success");
  }
}

function eraseAllData() {
  State.shops = {};
  State.transactions = [];
  State.payments = [];
  State.trips = [];
  State.purchases = [];
  State.wholesalePayments = [];
  saveData();
  refreshAllViews();
  showToast("All data erased. Fresh database created.", "warning");
}

// Routing & Tabs Setup
function setupRouting() {
  const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-target');
      
      // Update sidebar highlight
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      navigate(target);
    });
  });
}

function navigate(viewId) {
  State.currentView = viewId;
  
  // Hide all sections, show active
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const activeSec = document.getElementById(viewId);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  // Update Page Title in header
  const titleMap = {
    'dashboard-view': 'Dashboard Overview',
    'shops-view': 'Shops & Outstanding Accounts',
    'supply-view': 'Record Onion Supply Entry',
    'trips-view': 'Trips & Fuel Log',
    'sourcing-view': 'Wholesale Purchases',
    'payment-view': 'Record Payment Received',
    'backup-view': 'Backup & Data Management'
  };
  document.getElementById('current-view-title').textContent = titleMap[viewId] || 'Onion Ledger';

  // Load view-specific content
  if (viewId === 'dashboard-view') {
    renderDashboard();
  } else if (viewId === 'shops-view') {
    renderShops();
  } else if (viewId === 'supply-view') {
    populateShopDropdowns('supply-shop-select', 'Customer');
    resetSupplyForm();
  } else if (viewId === 'trips-view') {
    renderTripsView();
  } else if (viewId === 'sourcing-view') {
    renderSourcingView();
  } else if (viewId === 'payment-view') {
    const payType = document.getElementById('payment-type') ? document.getElementById('payment-type').value : 'Received';
    populateShopDropdowns('payment-shop-select', payType === 'Paid' ? 'Supplier' : 'Customer');
    resetPaymentForm();
  }
}

function refreshAllViews() {
  if (State.currentView === 'dashboard-view') {
    renderDashboard();
  } else if (State.currentView === 'shops-view') {
    renderShops();
  } else if (State.currentView === 'sourcing-view') {
    renderSourcingTable();
  }
  populateShopDropdowns('supply-shop-select', 'Customer');
  const payType = document.getElementById('payment-type') ? document.getElementById('payment-type').value : 'Received';
  populateShopDropdowns('payment-shop-select', payType === 'Paid' ? 'Supplier' : 'Customer');
  populateShopDropdowns('sourcing-supplier-select', 'Supplier');
}

// --- SETUP GENERAL UI (Theme, Toasts, Date) ---
function setupUI() {
  // Set current date in header
  const today = new Date();
  const formatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  document.getElementById('today-date-badge').innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height:14px; margin-right:6px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    ${today.toLocaleDateString('en-US', formatOptions)}
  `;
}

function setupTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('onion_ledger_theme') || 'light';
  State.theme = storedTheme;
  document.documentElement.setAttribute('data-theme', storedTheme);

  toggleBtn.addEventListener('click', () => {
    const nextTheme = State.theme === 'light' ? 'dark' : 'light';
    State.theme = nextTheme;
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('onion_ledger_theme', nextTheme);
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Decide icon based on type
  let icon = '';
  if (type === 'success') {
    icon = `<svg style="width:18px;height:18px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  } else if (type === 'danger') {
    icon = `<svg style="width:18px;height:18px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  } else {
    icon = `<svg style="width:18px;height:18px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
  }

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// Helpers for calculations
function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(val);
}

function calculateShopBalance(shopId) {
  const shop = State.shops[shopId];
  const isSupplier = shop && shop.type === 'Supplier';

  if (isSupplier) {
    // Total Purchases from Standalone Sourcing (Debits for supplier balance)
    const totalDebits = State.purchases
      .filter(pur => pur.supplierId === shopId)
      .reduce((sum, pur) => sum + (pur.totalAmount || 0), 0);

    // Total Payments paid to supplier (Credits for supplier balance)
    const totalCredits = State.payments
      .filter(p => p.shopId === shopId && p.type === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      debits: totalDebits,
      credits: totalCredits,
      balance: totalDebits - totalCredits // positive means we owe them
    };
  } else {
    // Customer
    // Total Supplies (Debits)
    const totalDebits = State.transactions
      .filter(tx => tx.shopId === shopId)
      .reduce((sum, tx) => sum + tx.totalAmount, 0);

    // Total Payments received from customer (Credits)
    const totalCredits = State.payments
      .filter(p => p.shopId === shopId && (p.type || 'Received') === 'Received')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      debits: totalDebits,
      credits: totalCredits,
      balance: totalDebits - totalCredits // positive means they owe us
    };
  }
}

// Dropdown utility
function populateShopDropdowns(elementId, filterType = null) {
  const select = document.getElementById(elementId);
  if (!select) return;
  
  // Clear but keep first item
  const placeholder = select.querySelector('option[value=""]') || document.createElement('option');
  placeholder.value = "";
  if (filterType === 'Supplier') {
    placeholder.textContent = '-- Choose Supplier --';
  } else {
    placeholder.textContent = '-- Choose a Shop --';
  }
  select.innerHTML = '';
  select.appendChild(placeholder);

  // For sourcing dropdown: always add the two fixed supplier options first
  if (elementId === 'sourcing-supplier-select') {
    const cheriyava = document.createElement('option');
    cheriyava.value = 'CHERIYAVA_NAS';
    cheriyava.textContent = 'CHERIYAVA NAS';
    select.appendChild(cheriyava);
    const noushad = document.createElement('option');
    noushad.value = 'NOUSHAD_NAS';
    noushad.textContent = 'NOUSHAD NAS';
    select.appendChild(noushad);
  }
  
  // Add options from State.shops
  const shopList = Object.values(State.shops)
    .filter(shop => !filterType || shop.type === filterType)
    .sort((a, b) => a.name.localeCompare(b.name));
    
  shopList.forEach(shop => {
    const balData = calculateShopBalance(shop.id);
    const bal = balData.balance;
    const isSupplier = shop.type === 'Supplier';
    const label = isSupplier ? 'Owed: ₹' : 'Due: ₹';
    const suffix = bal > 0 ? ` (${label}${bal.toFixed(2)})` : '';
    const option = document.createElement('option');
    option.value = shop.id;
    option.textContent = `${shop.name} - ${shop.owner}${suffix}`;
    select.appendChild(option);
  });
}


// --- DASHBOARD CONTROLLER ---
function renderDashboard() {
  const shopCount = Object.keys(State.shops).length;
  
  // Calculate Totals
  let totalBags = 0;
  let totalWeight = 0;
  let totalSales = 0;
  let totalPaid = 0;

  State.transactions.forEach(tx => {
    totalBags += tx.totalBags;
    totalWeight += tx.totalWeight;
    totalSales += tx.totalAmount;
  });

  State.payments.forEach(p => {
    if ((p.type || 'Received') === 'Received') {
      totalPaid += p.amount;
    }
  });

  const totalOutstanding = totalSales - totalPaid;

  // Calculate Amount to Give (net owed to all wholesale suppliers)
  // Step 1: Total cost of all purchases (includes CHERIYAVA_NAS, NOUSHAD_NAS, and shop-based suppliers)
  const totalPurchaseCost = State.purchases.reduce((sum, pur) => sum + (pur.totalAmount || 0), 0);

  // Step 2: Total payments already given to wholesalers
  const totalWholesalePaid = State.wholesalePayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    + State.payments.filter(p => p.type === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  const totalOwedToSuppliers = Math.max(0, totalPurchaseCost - totalWholesalePaid);
  const totalPaymentsToSuppliers = totalWholesalePaid;

  // Set KPIs text
  document.getElementById('kpi-shops-val').textContent = shopCount;
  document.getElementById('kpi-bags-val').textContent = totalBags;
  document.getElementById('kpi-bags-sub').textContent = `${(totalWeight / 1000).toFixed(2)} Tons Total Weight`;
  document.getElementById('kpi-sales-val').textContent = formatCurrency(totalSales);
  document.getElementById('kpi-due-val').textContent = formatCurrency(totalOutstanding);
  document.getElementById('kpi-due-sub').textContent = `Total paid: ${formatCurrency(totalPaid)}`;
  
  const kpiGiveVal = document.getElementById('kpi-give-val');
  if (kpiGiveVal) kpiGiveVal.textContent = formatCurrency(totalOwedToSuppliers);
  const kpiGiveSub = document.getElementById('kpi-give-sub');
  if (kpiGiveSub) kpiGiveSub.textContent = `Purchased: ${formatCurrency(totalPurchaseCost)} | Paid: ${formatCurrency(totalPaymentsToSuppliers)}`;

  // Calculate Logistics metrics
  let weeklyTrips = 0;
  let weeklyFuel = 0;
  let totalTrips = State.trips.length;
  let totalTripBags = 0;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  State.trips.forEach(trip => {
    const tripBags = trip.totalBags || 0;
    const tripFuel = trip.fuelCost || 0;
    totalTripBags += tripBags;

    const tripDate = new Date(trip.date);
    if (tripDate >= oneWeekAgo) {
      weeklyTrips += 1;
      weeklyFuel += tripFuel;
    }
  });

  const avgBagsPerTrip = totalTrips > 0 ? (totalTripBags / totalTrips) : 0;
  let totalFuelCost = State.trips.reduce((sum, trip) => sum + (trip.fuelCost || 0), 0);

  // Update Logistics UI Elements
  document.getElementById('logistics-trips-val').textContent = totalTrips;
  document.getElementById('logistics-trips-sub').textContent = `${weeklyTrips} trips made this week`;
  
  document.getElementById('logistics-fuel-val').textContent = formatCurrency(totalFuelCost);
  document.getElementById('logistics-fuel-sub').textContent = `${formatCurrency(weeklyFuel)} spent this week`;

  document.getElementById('logistics-avg-bags-val').textContent = avgBagsPerTrip.toFixed(1);

  // Set dashboard recent supplies rows
  const recentList = [...State.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const tbody = document.getElementById('dashboard-recent-supplies');
  tbody.innerHTML = '';

  if (recentList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); font-style: italic;">No supply entries recorded yet.</td></tr>`;
  } else {
    recentList.forEach(tx => {
      const shop = State.shops[tx.shopId] || { name: "Unknown Shop" };
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${tx.date}</td>
        <td style="font-weight: 600;">${shop.name}</td>
        <td class="text-right">${tx.totalBags}</td>
        <td class="text-right">${tx.totalWeight.toFixed(1)}</td>
        <td class="text-right">₹${tx.ratePerKg.toFixed(2)}</td>
        <td class="text-right text-success" style="font-weight:700;">${formatCurrency(tx.totalAmount)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Draw Charts
  drawSalesChart();
  drawOutstandingChart();
}

// Generate Dynamic SVG Bar Charts for Dashboard (Sales & Payments flow)
function drawSalesChart() {
  const chartContainer = document.getElementById('sales-chart-container');
  if (!chartContainer) return;
  chartContainer.innerHTML = ''; // Clear

  // 1. Group transactions & payments by month for last 6 months
  const months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      sales: 0,
      payments: 0
    });
  }

  State.transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    months.forEach(m => {
      if (txDate.getFullYear() === m.year && txDate.getMonth() === m.month) {
        m.sales += tx.totalAmount;
      }
    });
  });

  State.payments.forEach(p => {
    if ((p.type || 'Received') === 'Received') {
      const pDate = new Date(p.date);
      months.forEach(m => {
        if (pDate.getFullYear() === m.year && pDate.getMonth() === m.month) {
          m.payments += p.amount;
        }
      });
    }
  });

  // Calculate scaling factors
  const maxVal = Math.max(...months.map(m => Math.max(m.sales, m.payments)), 10000);
  const chartHeight = 200;
  const paddingBottom = 25;
  const paddingTop = 20;
  const usableHeight = chartHeight - paddingBottom - paddingTop;

  // Build SVG Content
  let barsHtml = '';
  const barWidth = 25;
  const groupSpacing = 45;
  const svgWidth = months.length * (barWidth * 2 + groupSpacing) + 20;

  months.forEach((m, idx) => {
    const xGroup = idx * (barWidth * 2 + groupSpacing) + 30;
    
    // Scale bar heights
    const salesHeight = (m.sales / maxVal) * usableHeight;
    const paymentsHeight = (m.payments / maxVal) * usableHeight;

    const ySales = chartHeight - paddingBottom - salesHeight;
    const yPayments = chartHeight - paddingBottom - paymentsHeight;

    // SVG elements: Green bar for Sales, Teal for Payments
    barsHtml += `
      <!-- Sales Bar (Green) -->
      <rect class="bar-chart-rect" x="${xGroup}" y="${ySales}" width="${barWidth}" height="${salesHeight}" rx="4" fill="var(--primary)" data-tooltip="Sales: ₹${m.sales.toFixed(0)}"></rect>
      <!-- Payments Bar (Teal) -->
      <rect class="bar-chart-rect" x="${xGroup + barWidth + 4}" y="${yPayments}" width="${barWidth}" height="${paymentsHeight}" rx="4" fill="var(--accent)" data-tooltip="Paid: ₹${m.payments.toFixed(0)}"></rect>
      <!-- Month Label -->
      <text x="${xGroup + barWidth}" y="${chartHeight - 6}" font-size="10" font-family="var(--font-heading)" font-weight="600" text-anchor="middle" fill="var(--text-secondary)">${m.label}</text>
    `;
  });

  // SVG grid lines and outline
  const svgWrapper = `
    <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${chartHeight}" style="overflow: visible;">
      <!-- Grid lines -->
      <line x1="10" y1="${chartHeight - paddingBottom}" x2="${svgWidth}" y2="${chartHeight - paddingBottom}" stroke="var(--border-color)" stroke-width="1"></line>
      <line x1="10" y1="${chartHeight - paddingBottom - usableHeight / 2}" x2="${svgWidth}" y2="${chartHeight - paddingBottom - usableHeight / 2}" stroke="var(--border-color)" stroke-dasharray="4,4" stroke-width="1"></line>
      <line x1="10" y1="${paddingTop}" x2="${svgWidth}" y2="${paddingTop}" stroke="var(--border-color)" stroke-dasharray="4,4" stroke-width="1"></line>
      
      <!-- Max limit label -->
      <text x="10" y="${paddingTop - 5}" font-size="9" fill="var(--text-muted)" font-weight="600">Max: ₹${(maxVal/1000).toFixed(0)}K</text>
      
      ${barsHtml}
    </svg>
    <div class="chart-tooltip" id="sales-tooltip"></div>
    <div style="display: flex; gap: 15px; font-size:11px; margin-top:10px; justify-content:center;">
      <span style="display:flex; align-items:center; gap:5px;"><span style="width:10px; height:10px; border-radius:3px; background:var(--primary); display:inline-block;"></span> Sales</span>
      <span style="display:flex; align-items:center; gap:5px;"><span style="width:10px; height:10px; border-radius:3px; background:var(--accent); display:inline-block;"></span> Payments</span>
    </div>
  `;

  chartContainer.innerHTML = svgWrapper;

  // Add Tooltips listeners
  setupChartTooltips(chartContainer, '#sales-tooltip');
}

function drawOutstandingChart() {
  const container = document.getElementById('pie-chart-container');
  if (!container) return;
  container.innerHTML = '';

  // Get top 5 customer shops with highest balances
  const balancesList = Object.values(State.shops)
    .filter(shop => shop.type !== 'Supplier')
    .map(shop => {
      return {
        name: shop.name,
        balance: calculateShopBalance(shop.id).balance
      };
    }).filter(b => b.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5);

  if (balancesList.length === 0) {
    container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color: var(--text-muted); font-style:italic;">
        <svg style="width:48px; height:48px; opacity:0.4; margin-bottom:10px;" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
        All accounts fully settled! No due balances.
      </div>`;
    return;
  }

  // Draw a horizontal bar summary listing the top balances cleanly
  let barsHtml = '';
  const totalSum = balancesList.reduce((sum, item) => sum + item.balance, 0);

  balancesList.forEach((item, idx) => {
    const percentage = totalSum > 0 ? (item.balance / totalSum) * 100 : 0;
    barsHtml += `
      <div style="margin-bottom: 14px; width: 100%">
        <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; margin-bottom:4px;">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;">${item.name}</span>
          <span class="text-danger" style="font-weight:700;">₹${item.balance.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
        </div>
        <div style="width: 100%; height: 8px; background: var(--border-color); border-radius:4px; overflow:hidden;">
          <div style="width: ${percentage}%; height:100%; background: linear-gradient(90deg, var(--danger), #ff8787); border-radius:4px;"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = `<div style="width:100%; display:flex; flex-direction:column; justify-content:center;">${barsHtml}</div>`;
}

function setupChartTooltips(chartContainer, tooltipSelector) {
  const tooltip = chartContainer.querySelector(tooltipSelector);
  const rects = chartContainer.querySelectorAll('.bar-chart-rect');

  rects.forEach(rect => {
    rect.addEventListener('mouseenter', (e) => {
      const tipText = rect.getAttribute('data-tooltip');
      tooltip.textContent = tipText;
      tooltip.style.opacity = 1;
    });

    rect.addEventListener('mousemove', (e) => {
      const containerRect = chartContainer.getBoundingClientRect();
      const x = e.clientX - containerRect.left + 10;
      const y = e.clientY - containerRect.top - 40;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });

    rect.addEventListener('mouseleave', () => {
      tooltip.style.opacity = 0;
    });
  });
}


// --- SHOPS ACCOUNTING VIEW ---
function renderShops() {
  const searchInput = document.getElementById('shop-search');
  const sortSelect = document.getElementById('shop-filter-sort');
  const container = document.getElementById('shops-list-container');
  if (!container) return;

  const q = searchInput.value.toLowerCase().trim();
  const sortOption = sortSelect.value;

  // Filter shops
  let filtered = Object.values(State.shops).filter(shop => {
    return shop.name.toLowerCase().includes(q) || shop.owner.toLowerCase().includes(q) || shop.phone.includes(q);
  });

  // Calculate balance for each shop for sorting
  const shopsWithBalances = filtered.map(shop => {
    const balData = calculateShopBalance(shop.id);
    return { ...shop, ...balData };
  });

  // Sort shops
  shopsWithBalances.sort((a, b) => {
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    if (sortOption === 'balance-desc') return b.balance - a.balance;
    if (sortOption === 'balance-asc') return a.balance - b.balance;
    return 0;
  });

  // Render Grid
  container.innerHTML = '';
  
  if (shopsWithBalances.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--border-radius-md); border:1px solid var(--border-color);">
        <p style="font-size:14px; font-style:italic;">No shops found matching your filters.</p>
        <button class="btn btn-primary btn-sm" id="btn-create-first-shop" style="margin-top:12px;">Add New Shop</button>
      </div>`;
    
    // Quick handle for nested action
    const btn = document.getElementById('btn-create-first-shop');
    if (btn) btn.addEventListener('click', openAddShopModal);
    return;
  }

  shopsWithBalances.forEach(shop => {
    const card = document.createElement('div');
    
    // Conditional styling depending on debt and shop type
    const isSupplier = shop.type === 'Supplier';
    const isDue = shop.balance > 0;
    
    let balanceClass = '';
    let balanceLabel = '';
    
    if (isSupplier) {
      balanceClass = isDue ? 'warning-bg' : 'success-bg';
      balanceLabel = isDue ? 'Balance Owed' : 'Advance Paid';
      card.className = `shop-card is-supplier`;
    } else {
      balanceClass = isDue ? 'danger-bg' : 'success-bg';
      balanceLabel = isDue ? 'Balance Due' : 'Advance Credit';
      card.className = `shop-card ${isDue ? 'has-balance' : ''}`;
    }
    
    card.innerHTML = `
      <div class="shop-card-header">
        <div>
          <div class="shop-card-name">
            ${shop.name}
            ${isSupplier ? '<span class="badge badge-warning" style="font-size: 9px; padding: 2px 6px; margin-left: 6px; vertical-align: middle;">Supplier</span>' : ''}
          </div>
          <div class="shop-card-owner">Owner: ${shop.owner}</div>
        </div>
        <button class="btn btn-secondary btn-sm edit-shop-btn" data-id="${shop.id}" style="padding:4px 8px; font-size:10px;">Edit</button>
      </div>
      
      <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-direction:column; gap:4px; margin-top:8px;">
        <span style="display:flex; align-items:center; gap:6px;">
          <svg style="width:13px; height:13px;" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 9.24v3z"></path></svg>
          ${shop.phone || 'N/A'}
        </span>
        <span style="display:flex; align-items:center; gap:6px;">
          <svg style="width:13px; height:13px;" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${shop.address || 'APMC Market'}
        </span>
      </div>

      <div class="shop-card-balance ${balanceClass}">
        <span>${balanceLabel}</span>
        <span class="balance-value">${formatCurrency(Math.abs(shop.balance))}</span>
      </div>

      <div class="shop-card-footer">
        <button class="btn btn-primary btn-sm view-ledger-btn" style="flex-grow:1; justify-content:center;" data-id="${shop.id}">
          <svg style="width:12px;height:12px;" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Statement Ledger
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Assign Event Handlers
  container.querySelectorAll('.view-ledger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openShopLedgerModal(btn.getAttribute('data-id'));
    });
  });

  container.querySelectorAll('.edit-shop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditShopModal(btn.getAttribute('data-id'));
    });
  });
}


// Toggle Payment tab helper
function togglePaymentTypeTab(type) {
  document.getElementById('payment-type').value = type;
  const btnRec = document.getElementById('tab-payment-received');
  const btnPaid = document.getElementById('tab-payment-paid');
  const shopLabel = document.getElementById('payment-shop-label');
  const dateLabel = document.getElementById('payment-date-label');
  const amountLabel = document.getElementById('payment-amount-label');
  
  if (type === 'Paid') {
    btnRec.classList.remove('active');
    btnPaid.classList.add('active');
    if (shopLabel) shopLabel.textContent = 'Select Supplier Shop';
    if (dateLabel) dateLabel.textContent = 'Date Paid';
    if (amountLabel) amountLabel.textContent = 'Amount Paid (₹)';
    populateShopDropdowns('payment-shop-select', 'Supplier');
  } else {
    btnRec.classList.add('active');
    btnPaid.classList.remove('active');
    if (shopLabel) shopLabel.textContent = 'Select Customer Shop';
    if (dateLabel) dateLabel.textContent = 'Date Received';
    if (amountLabel) amountLabel.textContent = 'Amount Received (₹)';
    populateShopDropdowns('payment-shop-select', 'Customer');
  }
  document.getElementById('payment-due-warning').style.display = 'none';
  document.getElementById('payment-entry-form').reset();
  document.getElementById('payment-type').value = type;
  const localToday = new Date().toISOString().split('T')[0];
  document.getElementById('payment-date').value = localToday;
}

// --- FORM HANDLERS (SHOPS, SUPPLIES, PAYMENTS) ---
function setupFormHandlers() {
  // 1. Add Shop Form Trigger
  document.getElementById('btn-add-shop').addEventListener('click', openAddShopModal);
  document.getElementById('btn-close-shop-modal').addEventListener('click', closeShopModal);
  document.getElementById('btn-cancel-shop-modal').addEventListener('click', closeShopModal);
  
  // Submit new/edit shop details
  document.getElementById('shop-details-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('edit-shop-id').value;
    const name = document.getElementById('shop-name').value.trim();
    const owner = document.getElementById('shop-owner').value.trim();
    const type = document.getElementById('shop-type').value;
    const phone = document.getElementById('shop-phone').value.trim();
    const address = document.getElementById('shop-address').value.trim();

    if (!name || !owner) {
      showToast("Shop name and Owner name are required", "warning");
      return;
    }

    if (editId) {
      // Edit shop Mode
      State.shops[editId].name = name;
      State.shops[editId].owner = owner;
      State.shops[editId].type = type;
      State.shops[editId].phone = phone;
      State.shops[editId].address = address;
      showToast("Shop details updated", "success");
    } else {
      // Create new shop Mode
      const newId = `shop-${Date.now()}`;
      State.shops[newId] = {
        id: newId,
        name,
        owner,
        type,
        phone,
        address,
        createdAt: new Date().toISOString().split('T')[0]
      };
      showToast("New shop registered", "success");
    }
    
    saveData();
    closeShopModal();
    renderShops();
  });

  // Search & Filter change events
  document.getElementById('shop-search').addEventListener('input', renderShops);
  document.getElementById('shop-filter-sort').addEventListener('change', renderShops);

  // 2. Supply Entry Form Submit
  document.getElementById('supply-entry-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const shopId = document.getElementById('supply-shop-select').value;
    const date = document.getElementById('supply-date').value;
    const rate = parseFloat(document.getElementById('supply-rate').value);
    const weightsString = document.getElementById('supply-weights').value;
    const notes = document.getElementById('supply-notes').value.trim();

    if (!shopId) {
      showToast("Please choose a valid shop account", "warning");
      return;
    }

    // Parse weights
    const parsed = parseWeightsString(weightsString);
    if (parsed.bagWeights.length === 0) {
      showToast("Please enter at least one bag weight", "warning");
      return;
    }

    const txId = `tx-${Date.now()}`;
    const newTx = {
      id: txId,
      shopId,
      date,
      ratePerKg: rate,
      bagWeights: parsed.bagWeights,
      totalBags: parsed.totalBags,
      totalWeight: parsed.totalWeight,
      totalAmount: parsed.totalWeight * rate,
      notes
    };

    State.transactions.push(newTx);
    saveData();
    showToast(`Recorded: ${parsed.totalBags} bags supplied successfully`, "success");
    navigate('dashboard-view');
  });

  document.getElementById('btn-reset-supply').addEventListener('click', resetSupplyForm);

  // 3. Payment Entry Form Tabs and Form Submit
  const tabRec = document.getElementById('tab-payment-received');
  const tabPaid = document.getElementById('tab-payment-paid');
  if (tabRec && tabPaid) {
    tabRec.addEventListener('click', () => togglePaymentTypeTab('Received'));
    tabPaid.addEventListener('click', () => togglePaymentTypeTab('Paid'));
  }

  document.getElementById('payment-entry-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const shopId = document.getElementById('payment-shop-select').value;
    const date = document.getElementById('payment-date').value;
    const amount = parseFloat(document.getElementById('payment-amount').value);
    const mode = document.getElementById('payment-mode').value;
    const reference = document.getElementById('payment-reference').value.trim();
    const notes = document.getElementById('payment-notes').value.trim();
    const type = document.getElementById('payment-type').value || 'Received';

    if (!shopId) {
      showToast("Please select a shop account", "warning");
      return;
    }

    if (amount <= 0) {
      showToast("Payment amount must be greater than zero", "warning");
      return;
    }

    const payId = `pay-${Date.now()}`;
    const newPay = {
      id: payId,
      shopId,
      date,
      amount,
      mode,
      reference,
      notes,
      type
    };

    State.payments.push(newPay);
    saveData();
    const actionWord = type === 'Paid' ? 'paid to' : 'received from';
    showToast(`Payment of ₹${amount} recorded as ${actionWord} shop`, "success");
    navigate('dashboard-view');
  });

  // Dynamic alert for pending outstanding on Payment Page
  document.getElementById('payment-shop-select').addEventListener('change', (e) => {
    const shopId = e.target.value;
    const warningLabel = document.getElementById('payment-due-warning');
    if (!shopId) {
      warningLabel.style.display = 'none';
      return;
    }
    const shop = State.shops[shopId];
    const isSupplier = shop && shop.type === 'Supplier';
    const balData = calculateShopBalance(shopId);
    if (balData.balance > 0) {
      warningLabel.textContent = isSupplier 
        ? `Outstanding balance owed: ₹${balData.balance.toFixed(2)}`
        : `Outstanding balance due: ₹${balData.balance.toFixed(2)}`;
      warningLabel.className = 'text-danger';
      warningLabel.style.display = 'block';
    } else if (balData.balance < 0) {
      warningLabel.textContent = isSupplier
        ? `Advance Paid: ₹${Math.abs(balData.balance).toFixed(2)}`
        : `Advance Credit: ₹${Math.abs(balData.balance).toFixed(2)}`;
      warningLabel.className = 'text-success';
      warningLabel.style.display = 'block';
    } else {
      warningLabel.textContent = `All settled! Balance is ₹0.00`;
      warningLabel.className = 'text-success';
      warningLabel.style.display = 'block';
    }
  });

  document.getElementById('btn-reset-payment').addEventListener('click', resetPaymentForm);

  // 3.5 Trip Entry Form Submit
  const tripForm = document.getElementById('trip-entry-form');
  if (tripForm) {
    tripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('trip-date').value;
      const fuelCost = parseFloat(document.getElementById('trip-fuel-cost').value) || 0;
      const totalBags = parseInt(document.getElementById('trip-bags').value) || 0;
      const notes = document.getElementById('trip-notes').value.trim();

      const tripId = `trip-${Date.now()}`;
      const newTrip = {
        id: tripId,
        date,
        fuelCost,
        totalBags,
        notes
      };

      State.trips.push(newTrip);
      saveData();
      showToast(`Recorded delivery trip with ${totalBags} bags`, "success");
      navigate('dashboard-view');
    });
  }

  // 3.7 Wholesale Sourcing Form Submit & Previews (Rapid Textarea Mode)
  const sourcingForm = document.getElementById('sourcing-entry-form');
  if (sourcingForm) {

    // Helper: parse the weights textarea and return array of valid numbers
    function parseSourcingWeights() {
      const raw = (document.getElementById('sourcing-weights') || {}).value || '';
      return raw.split(/[\s,\n]+/).map(v => parseFloat(v)).filter(v => !isNaN(v) && v > 0);
    }

    // Real-time update of stats panel as user types weights or changes rate
    function updateSourcingStats() {
      const weights = parseSourcingWeights();
      const rate = parseFloat(document.getElementById('sourcing-rate').value) || 0;
      const unit = document.getElementById('sourcing-rate-unit').value;
      const count = weights.length;
      const totalWeight = weights.reduce((s, w) => s + w, 0);
      const avgWeight = count > 0 ? totalWeight / count : 0;
      const totalCost = unit === 'per Kg' ? totalWeight * rate : count * rate;

      // Update stat boxes
      const el = id => document.getElementById(id);
      if (el('sourcing-stat-bag-count')) el('sourcing-stat-bag-count').textContent = count;
      if (el('sourcing-stat-total-weight')) el('sourcing-stat-total-weight').textContent = totalWeight.toFixed(2) + ' Kg';
      if (el('sourcing-stat-avg-weight')) el('sourcing-stat-avg-weight').textContent = avgWeight.toFixed(2) + ' Kg';
      if (el('sourcing-stat-total-amount')) el('sourcing-stat-total-amount').textContent = formatCurrency(totalCost);

      // Render bag chips preview
      const preview = el('sourcing-parsed-bags-preview');
      if (preview) {
        if (count === 0) {
          preview.innerHTML = '<span style="color: var(--text-muted); font-size: 12px; font-style: italic;">Weights preview will appear here...</span>';
        } else {
          preview.innerHTML = weights.map((w, i) =>
            `<span class="bag-chip">Bag ${i + 1}: ${w} Kg</span>`
          ).join('');
        }
      }
    }

    sourcingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const supplierVal = document.getElementById('sourcing-supplier-select').value;
      const date = document.getElementById('sourcing-date').value;
      const rate = parseFloat(document.getElementById('sourcing-rate').value) || 0;
      const rateUnit = document.getElementById('sourcing-rate-unit').value;
      const notes = document.getElementById('sourcing-notes').value.trim();
      const weights = parseSourcingWeights();

      if (!supplierVal) {
        showToast("Please choose a valid supplier shop", "warning");
        return;
      }
      if (weights.length === 0) {
        showToast("Please enter at least one bag weight", "warning");
        return;
      }
      if (rate <= 0) {
        showToast("Please enter a valid purchase rate", "warning");
        return;
      }

      const totalBags = weights.length;
      const totalWeight = weights.reduce((s, w) => s + w, 0);
      const totalAmount = rateUnit === 'per Kg' ? totalWeight * rate : totalBags * rate;

      // Resolve supplierId: use value directly (could be shop ID or hardcoded key)
      const supplierId = supplierVal;

      const newPur = {
        id: `pur-${Date.now()}`,
        supplierId,
        supplierName: supplierVal === 'CHERIYAVA_NAS' ? 'CHERIYAVA NAS' :
                      supplierVal === 'NOUSHAD_NAS' ? 'NOUSHAD NAS' :
                      (State.shops[supplierVal] ? State.shops[supplierVal].name : supplierVal),
        date,
        rate,
        rateUnit,
        totalBags,
        totalWeight: parseFloat(totalWeight.toFixed(2)),
        bagWeights: weights,
        totalAmount,
        notes
      };

      State.purchases.push(newPur);
      saveData();
      showToast(`Recorded wholesale purchase of ${totalBags} bags (${totalWeight.toFixed(1)} Kg)`, "success");
      navigate('dashboard-view');
    });

    // Attach live listeners
    const weightsTA = document.getElementById('sourcing-weights');
    if (weightsTA) weightsTA.addEventListener('input', updateSourcingStats);
    const rateInput = document.getElementById('sourcing-rate');
    if (rateInput) rateInput.addEventListener('input', updateSourcingStats);
    const rateUnitSel = document.getElementById('sourcing-rate-unit');
    if (rateUnitSel) rateUnitSel.addEventListener('change', updateSourcingStats);

    const btnResetSourcing = document.getElementById('btn-reset-sourcing');
    if (btnResetSourcing) {
      btnResetSourcing.addEventListener('click', resetSourcingForm);
    }
  }

  // 3.8 Wholesale Payment Form (Pay to Wholesaler)
  const wpayForm = document.getElementById('wholesale-payment-form');
  if (wpayForm) {
    const SUPPLIER_NAMES = { CHERIYAVA_NAS: 'CHERIYAVA NAS', NOUSHAD_NAS: 'NOUSHAD NAS' };

    wpayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const supplierId = document.getElementById('wpay-supplier-select').value;
      const date = document.getElementById('wpay-date').value;
      const amount = parseFloat(document.getElementById('wpay-amount').value) || 0;
      const mode = document.getElementById('wpay-mode').value;
      const notes = document.getElementById('wpay-notes').value.trim();

      if (!supplierId) { showToast('Please choose a supplier', 'warning'); return; }
      if (amount <= 0) { showToast('Please enter a valid amount', 'warning'); return; }

      const supplierName = SUPPLIER_NAMES[supplierId] ||
        (State.shops[supplierId] ? State.shops[supplierId].name : supplierId);

      State.wholesalePayments.push({
        id: `wpay-${Date.now()}`,
        supplierId,
        supplierName,
        date,
        amount,
        mode,
        notes
      });
      saveData();
      showToast(`Payment of ${formatCurrency(amount)} to ${supplierName} recorded`, 'success');
      wpayForm.reset();
      document.getElementById('wpay-date').value = new Date().toISOString().split('T')[0];
      renderWholesalePaymentsTable();
      renderDashboard();
    });

    const btnResetWpay = document.getElementById('btn-reset-wpay');
    if (btnResetWpay) {
      btnResetWpay.addEventListener('click', () => {
        wpayForm.reset();
        document.getElementById('wpay-date').value = new Date().toISOString().split('T')[0];
      });
    }
  }

  const btnResetTrip = document.getElementById('btn-reset-trip');
  if (btnResetTrip) {
    btnResetTrip.addEventListener('click', resetTripForm);
  }
}

// Open / Close Shop Dialog Form Modals
function openAddShopModal() {
  document.getElementById('shop-modal-title').textContent = "Add New Shop Account";
  document.getElementById('edit-shop-id').value = "";
  document.getElementById('shop-details-form').reset();
  document.getElementById('shop-type').value = "Customer";
  document.getElementById('shop-form-modal').classList.add('active');
}

function openEditShopModal(shopId) {
  const shop = State.shops[shopId];
  if (!shop) return;
  document.getElementById('shop-modal-title').textContent = "Edit Shop Details";
  document.getElementById('edit-shop-id').value = shop.id;
  document.getElementById('shop-name').value = shop.name;
  document.getElementById('shop-owner').value = shop.owner;
  document.getElementById('shop-type').value = shop.type || "Customer";
  document.getElementById('shop-phone').value = shop.phone || '';
  document.getElementById('shop-address').value = shop.address || '';
  
  document.getElementById('shop-form-modal').classList.add('active');
}

function closeShopModal() {
  document.getElementById('shop-form-modal').classList.remove('active');
}

// Reset form elements
function resetSupplyForm() {
  document.getElementById('supply-entry-form').reset();
  
  // Set default date to today
  const localToday = new Date().toISOString().split('T')[0];
  document.getElementById('supply-date').value = localToday;

  // Clear parser previews
  document.getElementById('parsed-bags-preview').innerHTML = `<span style="color: var(--text-muted); font-size:12px; font-style:italic;">Weights preview will appear here...</span>`;
  document.getElementById('stat-bag-count').textContent = '0';
  document.getElementById('stat-total-weight').textContent = '0.00 Kg';
  document.getElementById('stat-avg-weight').textContent = '0.00 Kg';
  document.getElementById('stat-total-amount').textContent = '₹0.00';
}

function resetPaymentForm() {
  document.getElementById('payment-entry-form').reset();
  const localToday = new Date().toISOString().split('T')[0];
  document.getElementById('payment-date').value = localToday;
  document.getElementById('payment-due-warning').style.display = 'none';
}


// --- RAPID BAG WEIGHT ENTRY PARSER ENGINE ---
function setupBagParser() {
  const textarea = document.getElementById('supply-weights');
  const rateInput = document.getElementById('supply-rate');
  
  const parseTrigger = () => {
    const rawText = textarea.value;
    const rate = parseFloat(rateInput.value) || 0;
    const result = parseWeightsString(rawText);

    updateParserUI(result, rate);
  };

  textarea.addEventListener('input', parseTrigger);
  rateInput.addEventListener('input', parseTrigger);
}

// Clean and parse weight numbers from messy user strings (spaces, commas, tabs, lines)
function parseWeightsString(text) {
  if (!text) {
    return { bagWeights: [], totalBags: 0, totalWeight: 0, avgWeight: 0 };
  }

  // Regex matches positive decimal/integer numbers (e.g. 45, 48.5)
  // Split on symbols/whitespace, filter valid positive float numbers
  const tokens = text.match(/[+-]?(?:\d+(?:\.\d*)?|\.\d+)/g) || [];
  const bagWeights = [];
  let totalWeight = 0;

  tokens.forEach(t => {
    const num = parseFloat(t);
    if (!isNaN(num) && num > 0) {
      bagWeights.push(num);
      totalWeight += num;
    }
  });

  const totalBags = bagWeights.length;
  const avgWeight = totalBags > 0 ? (totalWeight / totalBags) : 0;

  return {
    bagWeights,
    totalBags,
    totalWeight,
    avgWeight
  };
}

function updateParserUI(parsed, rate) {
  const previewDiv = document.getElementById('parsed-bags-preview');
  const countSpan = document.getElementById('stat-bag-count');
  const totalWeightSpan = document.getElementById('stat-total-weight');
  const avgWeightSpan = document.getElementById('stat-avg-weight');
  const totalAmountSpan = document.getElementById('stat-total-amount');

  // Preview Grid Generation
  if (parsed.bagWeights.length === 0) {
    previewDiv.innerHTML = `<span style="color: var(--text-muted); font-size:12px; font-style:italic;">Weights preview will appear here...</span>`;
  } else {
    previewDiv.innerHTML = '';
    parsed.bagWeights.forEach((wt, index) => {
      const badge = document.createElement('span');
      badge.className = 'bag-badge';
      badge.innerHTML = `<span class="bag-badge-index">#${index+1}</span> ${wt} Kg`;
      previewDiv.appendChild(badge);
    });
  }

  // Summary Metrics updating
  countSpan.textContent = parsed.totalBags;
  totalWeightSpan.textContent = `${parsed.totalWeight.toFixed(1)} Kg`;
  avgWeightSpan.textContent = `${parsed.avgWeight.toFixed(1)} Kg`;
  
  const totalAmount = parsed.totalWeight * rate;
  totalAmountSpan.textContent = formatCurrency(totalAmount);
}


// --- DETAILED SHOP STATEMENT MODAL ---
function openShopLedgerModal(shopId) {
  const shop = State.shops[shopId];
  if (!shop) return;
  State.activeLedgerShopId = shopId;

  // Build Shop Details Header
  const headerDiv = document.getElementById('modal-ledger-header');
  const balData = calculateShopBalance(shopId);
  const isDue = balData.balance >= 0;
  
  const isSupplier = shop.type === 'Supplier';
  const label = isSupplier 
    ? (balData.balance >= 0 ? 'Total Outstanding Owed' : 'Total Advance Paid')
    : (balData.balance >= 0 ? 'Total Outstanding Due' : 'Total Advance Credit');
  const subtext = isSupplier
    ? `Total Purchases: ${formatCurrency(balData.debits)} | Total Paid: ${formatCurrency(balData.credits)}`
    : `Total Sales: ${formatCurrency(balData.debits)} | Total Received: ${formatCurrency(balData.credits)}`;

  headerDiv.innerHTML = `
    <div class="ledger-header-info">
      <h3>${shop.name}</h3>
      <p><b>Owner:</b> ${shop.owner}</p>
      <p><b>Phone:</b> ${shop.phone || 'N/A'} | <b>Mandi Address:</b> ${shop.address || 'N/A'}</p>
      <p>Account Registered: ${shop.createdAt || 'N/A'}</p>
    </div>
    <div class="ledger-header-totals">
      <div style="font-size: 11px; text-transform: uppercase; font-weight:600; opacity:0.8;">${label}</div>
      <div class="ledger-total-due" style="color: ${isSupplier ? 'var(--warning)' : (isDue ? '#ff6b6b' : '#2ec4b6')}">
        ${formatCurrency(Math.abs(balData.balance))}
      </div>
      <div style="font-size: 11px; margin-top:5px; opacity:0.9;">
        ${subtext}
      </div>
    </div>
  `;

  // Dynamically set tab buttons text content
  const suppliesTabBtn = document.querySelector('.detail-tabs button[data-pane="tab-pane-supplies"]');
  const paymentsTabBtn = document.querySelector('.detail-tabs button[data-pane="tab-pane-payments"]');
  
  if (isSupplier) {
    if (suppliesTabBtn) suppliesTabBtn.textContent = 'Purchases History';
    if (paymentsTabBtn) paymentsTabBtn.textContent = 'Payments Paid';
  } else {
    if (suppliesTabBtn) suppliesTabBtn.textContent = 'Supplies History';
    if (paymentsTabBtn) paymentsTabBtn.textContent = 'Payments Received';
  }

  // Populate dynamic table headers
  const suppliesHeaders = document.getElementById('ledger-supplies-headers');
  const paymentsHeaders = document.getElementById('ledger-payments-headers');
  const statementHeaders = document.getElementById('ledger-statement-headers');

  if (isSupplier) {
    if (suppliesHeaders) {
      suppliesHeaders.innerHTML = `
        <th>Date</th>
        <th class="text-right">Bags Sourced</th>
        <th class="text-right">Rate</th>
        <th>Unit</th>
        <th class="text-right">Weight (Kg)</th>
        <th class="text-right">Total Cost</th>
        <th>Notes</th>
        <th>Action</th>
      `;
    }
    if (paymentsHeaders) {
      paymentsHeaders.innerHTML = `
        <th>Date</th>
        <th>Mode</th>
        <th>Reference / Notes</th>
        <th class="text-right">Amount Paid</th>
        <th>Action</th>
      `;
    }
    if (statementHeaders) {
      statementHeaders.innerHTML = `
        <th>Date</th>
        <th>Transaction Details</th>
        <th class="text-right">Purchase (Debit)</th>
        <th class="text-right">Payment (Credit)</th>
        <th class="text-right">Balance Owed</th>
      `;
    }
  } else {
    if (suppliesHeaders) {
      suppliesHeaders.innerHTML = `
        <th>Date</th>
        <th class="text-right">Trips</th>
        <th class="text-right">Bags</th>
        <th>Bag Weights</th>
        <th class="text-right">Total Weight</th>
        <th class="text-right">Rate / Kg</th>
        <th class="text-right">Total Amount</th>
        <th class="text-right">Fuel Cost</th>
        <th>Notes</th>
        <th>Action</th>
      `;
    }
    if (paymentsHeaders) {
      paymentsHeaders.innerHTML = `
        <th>Date</th>
        <th>Mode</th>
        <th>Reference / Notes</th>
        <th class="text-right">Amount Received</th>
        <th>Action</th>
      `;
    }
    if (statementHeaders) {
      statementHeaders.innerHTML = `
        <th>Date</th>
        <th>Transaction Details</th>
        <th class="text-right">Debit (Charges)</th>
        <th class="text-right">Credit (Payments)</th>
        <th class="text-right">Balance Due</th>
      `;
    }
  }

  // Render Tabs list
  renderLedgerSuppliesTable(shopId);
  renderLedgerPaymentsTable(shopId);
  renderLedgerStatementRunningTable(shopId);

  // Setup tab toggling inside the ledger
  const tabs = document.querySelectorAll('.detail-tabs .detail-tab');
  const panes = document.querySelectorAll('.tab-pane');
  
  tabs.forEach(tab => {
    // Reset active state
    tab.classList.remove('active');
    if (tab.getAttribute('data-pane') === 'tab-pane-supplies') {
      tab.classList.add('active');
    }

    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const paneId = tab.getAttribute('data-pane');
      document.getElementById(paneId).classList.add('active');
    };
  });

  // Reset panes active states
  panes.forEach(p => p.classList.remove('active'));
  document.getElementById('tab-pane-supplies').classList.add('active');

  // Trigger Print Logic
  document.getElementById('btn-print-statement').onclick = () => {
    window.print();
  };

  // Assign close events
  document.getElementById('btn-close-ledger-modal').onclick = closeShopLedgerModal;
  document.getElementById('btn-close-ledger-footer').onclick = closeShopLedgerModal;

  // Open modal
  document.getElementById('shop-ledger-modal').classList.add('active');
}

function closeShopLedgerModal() {
  document.getElementById('shop-ledger-modal').classList.remove('active');
  State.activeLedgerShopId = null;
}

// Ledger Modal Tab 1: supplies view
function renderLedgerSuppliesTable(shopId) {
  const shop = State.shops[shopId];
  if (!shop) return;
  const isSupplier = shop.type === 'Supplier';
  const tbody = document.getElementById('modal-ledger-supplies-rows');
  tbody.innerHTML = '';

  if (isSupplier) {
    const supplierPurchases = State.purchases
      .filter(p => p.supplierId === shopId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (supplierPurchases.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-secondary); font-style:italic;">No purchase records registered.</td></tr>`;
      return;
    }

    supplierPurchases.forEach(pur => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pur.date}</td>
        <td class="text-right" style="font-weight:600;">${pur.totalBags} bags</td>
        <td class="text-right">₹${(pur.rate || 0).toFixed(2)}</td>
        <td>${pur.rateUnit || 'per Kg'}</td>
        <td class="text-right">${pur.totalWeight ? pur.totalWeight.toFixed(1) + ' Kg' : '-'}</td>
        <td class="text-right" style="font-weight:700; color:var(--primary)">${formatCurrency(pur.totalAmount || 0)}</td>
        <td>${pur.notes || '-'}</td>
        <td>
          <button class="btn btn-danger btn-sm delete-purchase-btn" style="padding: 4px 8px; font-size:10px;" data-id="${pur.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.delete-purchase-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const entryId = btn.getAttribute('data-id');
        if (confirm("Are you sure you want to delete this purchase record? This will adjust the balance.")) {
          State.purchases = State.purchases.filter(p => p.id !== entryId);
          saveData();
          showToast("Wholesale purchase deleted", "warning");
          openShopLedgerModal(shopId);
          renderShops();
        }
      });
    });
  } else {
    const shopTxs = State.transactions
      .filter(tx => tx.shopId === shopId)
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // chronological

    if (shopTxs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color: var(--text-secondary); font-style:italic;">No supply records registered.</td></tr>`;
      return;
    }

    shopTxs.forEach(tx => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${tx.date}</td>
        <td class="text-right" style="font-weight:600;">${tx.trips || 1}</td>
        <td class="text-right" style="font-weight:600;">${tx.totalBags}</td>
        <td style="max-width: 180px; font-size:11px; color: var(--text-secondary); word-break:break-all;">
          ${tx.bagWeights.join(', ')}
        </td>
        <td class="text-right">${tx.totalWeight.toFixed(1)} Kg</td>
        <td class="text-right">₹${tx.ratePerKg.toFixed(2)}</td>
        <td class="text-right" style="font-weight:700; color:var(--primary)">${formatCurrency(tx.totalAmount)}</td>
        <td class="text-right text-danger" style="font-weight:600;">${tx.fuelCost ? formatCurrency(tx.fuelCost) : '₹0.00'}</td>
        <td>${tx.notes || '-'}</td>
        <td>
          <button class="btn btn-danger btn-sm delete-entry-btn" style="padding: 4px 8px; font-size:10px;" data-type="tx" data-id="${tx.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.delete-entry-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const entryId = btn.getAttribute('data-id');
        if (confirm("Are you sure you want to delete this supply entry? This will adjust the balance.")) {
          State.transactions = State.transactions.filter(t => t.id !== entryId);
          saveData();
          showToast("Supply entry deleted", "warning");
          openShopLedgerModal(shopId); // reload modal content
          renderShops(); // reload background views
        }
      });
    });
  }
}

// Ledger Modal Tab 2: payments view
function renderLedgerPaymentsTable(shopId) {
  const shop = State.shops[shopId];
  if (!shop) return;
  const isSupplier = shop.type === 'Supplier';
  const tbody = document.getElementById('modal-ledger-payments-rows');
  tbody.innerHTML = '';

  const shopPays = State.payments
    .filter(p => p.shopId === shopId && (isSupplier ? p.type === 'Paid' : (p.type || 'Received') === 'Received'))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (shopPays.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-secondary); font-style:italic;">No payment records registered.</td></tr>`;
    return;
  }

  shopPays.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.date}</td>
      <td><span class="badge badge-success">${p.mode}</span></td>
      <td>
        <span style="font-weight:500;">Ref: ${p.reference || 'None'}</span>
        ${p.notes ? `<div style="font-size:11px; color:var(--text-secondary);">${p.notes}</div>` : ''}
      </td>
      <td class="text-right text-success" style="font-weight:700;">${formatCurrency(p.amount)}</td>
      <td>
        <button class="btn btn-danger btn-sm delete-entry-btn" style="padding: 4px 8px; font-size:10px;" data-type="pay" data-id="${p.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Bind Delete buttons
  tbody.querySelectorAll('.delete-entry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const entryId = btn.getAttribute('data-id');
      if (confirm("Are you sure you want to delete this payment record? This will adjust the balance.")) {
        State.payments = State.payments.filter(p => p.id !== entryId);
        saveData();
        showToast("Payment record deleted", "warning");
        openShopLedgerModal(shopId); // reload modal
        renderShops();
      }
    });
  });
}

// Ledger Modal Tab 3: detailed running sheet
function renderLedgerStatementRunningTable(shopId) {
  const shop = State.shops[shopId];
  if (!shop) return;
  const isSupplier = shop.type === 'Supplier';
  const tbody = document.getElementById('modal-ledger-statement-rows');
  tbody.innerHTML = '';

  let ledgerItems = [];

  if (isSupplier) {
    const purchases = State.purchases
      .filter(p => p.supplierId === shopId)
      .map(p => ({
        date: p.date,
        desc: `Bulk Onion Sourced (${p.totalBags} bags, ${p.totalWeight ? p.totalWeight.toFixed(1) + ' Kg' : ''} @ ₹${(p.rate || 0).toFixed(2)}/${p.rateUnit === 'per Kg' ? 'Kg' : 'Bag'})`,
        debit: p.totalAmount || 0,
        credit: 0
      }));

    const payments = State.payments
      .filter(p => p.shopId === shopId && p.type === 'Paid')
      .map(p => ({
        date: p.date,
        desc: `Payment Paid (${p.mode}${p.reference ? ' - Ref: ' + p.reference : ''})`,
        debit: 0,
        credit: p.amount
      }));

    ledgerItems = [...purchases, ...payments].sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    // Customer
    const supplies = State.transactions
      .filter(tx => tx.shopId === shopId)
      .map(tx => ({
        date: tx.date,
        desc: `Onion Supply (${tx.totalBags} bags, ${tx.totalWeight.toFixed(1)} Kg @ ₹${tx.ratePerKg.toFixed(2)}/Kg)`,
        debit: tx.totalAmount,
        credit: 0
      }));

    const payments = State.payments
      .filter(p => p.shopId === shopId && (p.type || 'Received') === 'Received')
      .map(p => ({
        date: p.date,
        desc: `Payment Recd (${p.mode}${p.reference ? ' - Ref: ' + p.reference : ''})`,
        debit: 0,
        credit: p.amount
      }));

    ledgerItems = [...supplies, ...payments].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  if (ledgerItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-secondary); font-style:italic;">No transactions registered to generate ledger sheet.</td></tr>`;
    return;
  }

  let runningBalance = 0;
  ledgerItems.forEach(item => {
    runningBalance += item.debit - item.credit;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.date}</td>
      <td style="font-weight: 500;">${item.desc}</td>
      <td class="text-right" style="color: ${item.debit > 0 ? 'var(--text-primary)' : 'var(--text-muted)'}">${item.debit > 0 ? formatCurrency(item.debit) : '-'}</td>
      <td class="text-right" style="color: ${item.credit > 0 ? 'var(--success)' : 'var(--text-muted)'}; font-weight: ${item.credit > 0 ? '600' : 'normal'}">${item.credit > 0 ? formatCurrency(item.credit) : '-'}</td>
      <td class="text-right" style="font-weight: 700; color: ${runningBalance > 0 ? 'var(--danger)' : 'var(--success)'}">${formatCurrency(runningBalance)}</td>
    `;
    tbody.appendChild(tr);
  });
}


// --- BACKUP, IMPORT, EXPORT EXCEL SYSTEM ---
function setupBackupHandlers() {
  // Helper: trigger CSV download
  function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function esc(str) {
    return `"${String(str || '').replace(/"/g, '""')}"`;
  }

  const dateStr = () => new Date().toISOString().split('T')[0];

  // Show last backup date
  function updateLastBackupInfo() {
    const lastBackup = localStorage.getItem('onion_last_backup');
    const el = document.getElementById('last-backup-info');
    if (el) {
      if (lastBackup) {
        const d = new Date(lastBackup);
        const diffDays = Math.floor((Date.now() - d) / 86400000);
        const color = diffDays >= 7 ? 'var(--danger)' : diffDays >= 3 ? 'var(--warning)' : 'var(--success)';
        el.style.color = color;
        el.textContent = `Last backup: ${d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}${diffDays > 0 ? ` (${diffDays} day${diffDays>1?'s':''} ago)` : ' (today)'}`;
      } else {
        el.style.color = 'var(--danger)';
        el.textContent = '⚠️ No backup made yet! Please download a backup now.';
      }
    }
  }
  updateLastBackupInfo();

  // 1. Download JSON Backup
  document.getElementById('btn-download-backup').addEventListener('click', () => {
    const dataStr = localStorage.getItem('onion_ledger_db') || '{}';
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nas_onion_ledger_backup_${dateStr()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    localStorage.setItem('onion_last_backup', new Date().toISOString());
    updateLastBackupInfo();
    showToast('✅ Backup file downloaded successfully!', 'success');
  });

  // 2. Restore JSON Backup
  const fileInput = document.getElementById('backup-file-input');
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && typeof parsed === 'object' && parsed.shops && Array.isArray(parsed.transactions) && Array.isArray(parsed.payments)) {
          State.shops = parsed.shops;
          Object.keys(State.shops).forEach(id => {
            if (!State.shops[id].type) State.shops[id].type = 'Customer';
          });
          State.transactions = parsed.transactions;
          State.payments = parsed.payments;
          State.payments.forEach(p => { if (!p.type) p.type = 'Received'; });
          State.trips = parsed.trips || [];
          State.purchases = parsed.purchases || [];
          State.wholesalePayments = parsed.wholesalePayments || [];
          saveData();
          refreshAllViews();
          showToast('✅ Data restored successfully from backup file!', 'success');
        } else {
          showToast('Invalid backup file. Please use a valid .json backup.', 'danger');
        }
      } catch (err) {
        showToast('Error reading backup file.', 'danger');
      }
      fileInput.value = '';
    };
    reader.readAsText(file);
  });

  // 3. Export Accounts Summary CSV
  document.getElementById('btn-export-excel').addEventListener('click', () => {
    let csv = '\uFEFF';
    csv += 'Shop Name,Owner,Account Type,Phone,Address,Total Supplies/Purchases (Rs),Total Payments (Rs),Outstanding Balance (Rs)\n';
    Object.values(State.shops).forEach(shop => {
      const b = calculateShopBalance(shop.id);
      csv += `${esc(shop.name)},${esc(shop.owner)},${esc(shop.type||'Customer')},${esc(shop.phone)},${esc(shop.address)},${b.debits.toFixed(2)},${b.credits.toFixed(2)},${b.balance.toFixed(2)}\n`;
    });
    downloadCSV(csv, `nas_accounts_summary_${dateStr()}.csv`);
    showToast('Accounts CSV exported', 'success');
  });

  // 4. Export Delivery Trips CSV
  const exportTripsBtn = document.getElementById('btn-export-trips');
  if (exportTripsBtn) {
    exportTripsBtn.addEventListener('click', () => {
      let csv = '\uFEFF';
      csv += 'Trip Date,Bags Carried,Fuel Cost (Rs),Notes/Vehicle/Route\n';
      [...State.trips].sort((a,b) => new Date(a.date)-new Date(b.date)).forEach(trip => {
        csv += `${trip.date},${trip.totalBags},${trip.fuelCost.toFixed(2)},${esc(trip.notes)}\n`;
      });
      downloadCSV(csv, `nas_delivery_trips_${dateStr()}.csv`);
      showToast('Delivery Trips CSV exported', 'success');
    });
  }

  // 5. Export Wholesale Purchases CSV
  const exportSourcingBtn = document.getElementById('btn-export-sourcing');
  if (exportSourcingBtn) {
    exportSourcingBtn.addEventListener('click', () => {
      let csv = '\uFEFF';
      csv += 'Purchase Date,Supplier,Bags Bought,Total Weight (Kg),Rate (Rs),Rate Unit,Total Cost (Rs),Notes\n';
      [...State.purchases].sort((a,b) => new Date(a.date)-new Date(b.date)).forEach(pur => {
        const supplierName = pur.supplierName ||
          (State.shops[pur.supplierId] ? State.shops[pur.supplierId].name : pur.supplierId || 'Unknown');
        csv += `${pur.date},${esc(supplierName)},${pur.totalBags},${pur.totalWeight?pur.totalWeight.toFixed(2):''},${pur.rate.toFixed(2)},${esc(pur.rateUnit)},${pur.totalAmount.toFixed(2)},${esc(pur.notes)}\n`;
      });
      downloadCSV(csv, `nas_wholesale_purchases_${dateStr()}.csv`);
      showToast('Wholesale Purchases CSV exported', 'success');
    });
  }

  // 6. Export Wholesaler Payments CSV
  const exportWpayBtn = document.getElementById('btn-export-wpay');
  if (exportWpayBtn) {
    exportWpayBtn.addEventListener('click', () => {
      let csv = '\uFEFF';
      csv += 'Payment Date,Supplier,Amount Paid (Rs),Payment Mode,Notes/Reference\n';
      [...State.wholesalePayments].sort((a,b) => new Date(a.date)-new Date(b.date)).forEach(p => {
        csv += `${p.date},${esc(p.supplierName)},${p.amount.toFixed(2)},${esc(p.mode)},${esc(p.notes)}\n`;
      });
      downloadCSV(csv, `nas_wholesaler_payments_${dateStr()}.csv`);
      showToast('Wholesaler Payments CSV exported', 'success');
    });
  }

  // 7. Export Complete Business Report (All Sheets in one CSV)
  const exportAllBtn = document.getElementById('btn-export-all');
  if (exportAllBtn) {
    exportAllBtn.addEventListener('click', () => {
      const d = dateStr();
      let csv = '\uFEFF';

      // === SECTION 1: Accounts Summary ===
      csv += '=== ACCOUNTS SUMMARY ===\n';
      csv += 'Shop Name,Owner,Type,Phone,Total Supplies/Purchases (Rs),Total Payments (Rs),Balance (Rs)\n';
      Object.values(State.shops).forEach(shop => {
        const b = calculateShopBalance(shop.id);
        csv += `${esc(shop.name)},${esc(shop.owner)},${esc(shop.type||'Customer')},${esc(shop.phone)},${b.debits.toFixed(2)},${b.credits.toFixed(2)},${b.balance.toFixed(2)}\n`;
      });

      // === SECTION 2: Wholesale Purchases ===
      csv += '\n=== WHOLESALE PURCHASES LOG ===\n';
      csv += 'Date,Supplier,Bags,Weight (Kg),Rate (Rs),Rate Unit,Total Cost (Rs),Notes\n';
      const totalPurchaseCost = State.purchases.reduce((s,p)=>s+(p.totalAmount||0),0);
      [...State.purchases].sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(pur => {
        const sn = pur.supplierName || (State.shops[pur.supplierId]?State.shops[pur.supplierId].name:pur.supplierId||'Unknown');
        csv += `${pur.date},${esc(sn)},${pur.totalBags},${pur.totalWeight?pur.totalWeight.toFixed(2):''},${pur.rate.toFixed(2)},${esc(pur.rateUnit)},${pur.totalAmount.toFixed(2)},${esc(pur.notes)}\n`;
      });
      csv += `TOTAL,,,,,, ${totalPurchaseCost.toFixed(2)},\n`;

      // === SECTION 3: Wholesaler Payments ===
      csv += '\n=== WHOLESALER PAYMENTS LOG ===\n';
      csv += 'Date,Supplier,Amount Paid (Rs),Mode,Notes\n';
      const totalWpaid = State.wholesalePayments.reduce((s,p)=>s+(p.amount||0),0);
      [...State.wholesalePayments].sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(p => {
        csv += `${p.date},${esc(p.supplierName)},${p.amount.toFixed(2)},${esc(p.mode)},${esc(p.notes)}\n`;
      });
      csv += `TOTAL,,${totalWpaid.toFixed(2)},,\n`;
      csv += `BALANCE STILL TO GIVE,,${Math.max(0,totalPurchaseCost-totalWpaid).toFixed(2)},,\n`;

      // === SECTION 4: Delivery Trips ===
      csv += '\n=== DELIVERY TRIPS LOG ===\n';
      csv += 'Date,Bags Carried,Fuel Cost (Rs),Notes\n';
      [...State.trips].sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(t => {
        csv += `${t.date},${t.totalBags},${t.fuelCost.toFixed(2)},${esc(t.notes)}\n`;
      });

      downloadCSV(csv, `nas_complete_business_report_${d}.csv`);
      localStorage.setItem('onion_last_backup', new Date().toISOString());
      updateLastBackupInfo();
      showToast('✅ Complete Business Report exported!', 'success');
    });
  }

  // 7.5 Download Last 2 Weeks Report
  const twoWeeksBtn = document.getElementById('btn-export-2weeks');
  if (twoWeeksBtn) {
    twoWeeksBtn.addEventListener('click', () => {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 14);
      const after = (d) => new Date(d) >= cutoff;
      let csv = '\uFEFF';
      csv += `=== LAST 2 WEEKS REPORT (${cutoff.toISOString().split('T')[0]} to ${dateStr()}) ===\n\n`;

      const recentTx = State.transactions.filter(t => after(t.date));
      if (recentTx.length) {
        csv += '--- SALES TO CUSTOMERS ---\nDate,Shop,Bags,Weight (Kg),Rate,Total (Rs),Notes\n';
        recentTx.forEach(tx => {
          const sn = State.shops[tx.shopId] ? State.shops[tx.shopId].name : tx.shopId;
          csv += `${tx.date},${esc(sn)},${tx.totalBags},${tx.totalWeight.toFixed(2)},${tx.ratePerKg},${tx.totalAmount.toFixed(2)},${esc(tx.notes)}\n`;
        });
      }
      const recentPay = State.payments.filter(p => after(p.date));
      if (recentPay.length) {
        csv += '\n--- PAYMENTS RECEIVED/PAID ---\nDate,Shop,Type,Amount (Rs),Mode,Reference,Notes\n';
        recentPay.forEach(p => {
          const sn = State.shops[p.shopId] ? State.shops[p.shopId].name : p.shopId;
          csv += `${p.date},${esc(sn)},${p.type||'Received'},${p.amount.toFixed(2)},${esc(p.mode)},${esc(p.reference)},${esc(p.notes)}\n`;
        });
      }
      const recentPur = State.purchases.filter(p => after(p.date));
      if (recentPur.length) {
        csv += '\n--- WHOLESALE PURCHASES ---\nDate,Supplier,Bags,Weight,Rate,Total (Rs),Notes\n';
        recentPur.forEach(p => {
          const sn = p.supplierName||(State.shops[p.supplierId]?State.shops[p.supplierId].name:'Unknown');
          csv += `${p.date},${esc(sn)},${p.totalBags},${p.totalWeight?p.totalWeight.toFixed(2):''},${p.rate.toFixed(2)},${p.totalAmount.toFixed(2)},${esc(p.notes)}\n`;
        });
      }
      const recentWp = State.wholesalePayments.filter(p => after(p.date));
      if (recentWp.length) {
        csv += '\n--- WHOLESALER PAYMENTS ---\nDate,Supplier,Amount (Rs),Mode,Notes\n';
        recentWp.forEach(p => { csv += `${p.date},${esc(p.supplierName)},${p.amount.toFixed(2)},${esc(p.mode)},${esc(p.notes)}\n`; });
      }
      const recentTrips = State.trips.filter(t => after(t.date));
      if (recentTrips.length) {
        csv += '\n--- DELIVERY TRIPS ---\nDate,Bags,Fuel (Rs),Notes\n';
        recentTrips.forEach(t => { csv += `${t.date},${t.totalBags},${t.fuelCost.toFixed(2)},${esc(t.notes)}\n`; });
      }
      downloadCSV(csv, `nas_2weeks_report_${dateStr()}.csv`);
      showToast('✅ Last 2 weeks report downloaded!', 'success');
    });
  }

  // 8. Load Demo & Erase Buttons
  document.getElementById('btn-load-demo').addEventListener('click', () => {
    if (confirm('Load sample demo data? Current data will be replaced.')) {
      loadDemoData(true);
    }
  });

  document.getElementById('btn-clear-all').addEventListener('click', () => {
    if (confirm('Are you SURE you want to erase ALL records? This CANNOT BE UNDONE. Download a backup first!')) {
      eraseAllData();
    }
  });
}

// --- TRIPS LOG SECTION HELPERS ---
function renderTripsView() {
  resetTripForm();
  renderTripsTable();
}

function resetTripForm() {
  const form = document.getElementById('trip-entry-form');
  if (form) form.reset();
  const localToday = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('trip-date');
  if (dateInput) dateInput.value = localToday;
}

function renderTripsTable() {
  const tbody = document.getElementById('trips-history-rows');
  if (!tbody) return;
  tbody.innerHTML = '';

  const sortedTrips = [...State.trips].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedTrips.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-secondary); font-style:italic;">No trips recorded yet.</td></tr>`;
    return;
  }

  sortedTrips.forEach(trip => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${trip.date}</td>
      <td class="text-right" style="font-weight:600;">${trip.totalBags} bags</td>
      <td class="text-right text-danger" style="font-weight:600;">${formatCurrency(trip.fuelCost)}</td>
      <td>
        <div>${trip.notes || '-'}</div>
      </td>
      <td>
        <button class="btn btn-danger btn-sm delete-trip-btn" style="padding: 4px 8px; font-size:10px;" data-id="${trip.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.delete-trip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tripId = btn.getAttribute('data-id');
      if (confirm("Are you sure you want to delete this trip record?")) {
        State.trips = State.trips.filter(t => t.id !== tripId);
        saveData();
        showToast("Trip record deleted", "warning");
        renderTripsView();
      }
    });
  });
}

// --- WHOLESALE PURCHASES SECTION HELPERS ---
function renderSourcingView() {
  populateShopDropdowns('sourcing-supplier-select', 'Supplier');
  resetSourcingForm();
  renderSourcingTable();
  renderWholesalePaymentsTable();
  // Set today's date in the payment form
  const wpayDate = document.getElementById('wpay-date');
  if (wpayDate && !wpayDate.value) {
    wpayDate.value = new Date().toISOString().split('T')[0];
  }
}

function resetSourcingForm() {
  const form = document.getElementById('sourcing-entry-form');
  if (form) form.reset();
  const localToday = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('sourcing-date');
  if (dateInput) dateInput.value = localToday;

  // Reset rapid textarea stat boxes
  const el = id => document.getElementById(id);
  if (el('sourcing-stat-bag-count')) el('sourcing-stat-bag-count').textContent = '0';
  if (el('sourcing-stat-total-weight')) el('sourcing-stat-total-weight').textContent = '0.00 Kg';
  if (el('sourcing-stat-avg-weight')) el('sourcing-stat-avg-weight').textContent = '0.00 Kg';
  if (el('sourcing-stat-total-amount')) el('sourcing-stat-total-amount').textContent = '₹0.00';
  const preview = el('sourcing-parsed-bags-preview');
  if (preview) preview.innerHTML = '<span style="color: var(--text-muted); font-size: 12px; font-style: italic;">Weights preview will appear here...</span>';
}

function renderSourcingTable() {
  const tbody = document.getElementById('sourcing-history-rows');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const sortedPurchases = [...State.purchases].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sortedPurchases.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-secondary); font-style:italic;">No wholesale purchases recorded yet.</td></tr>`;
    return;
  }
  
  sortedPurchases.forEach(pur => {
    const supplierName = pur.supplierName ||
      (State.shops[pur.supplierId] ? State.shops[pur.supplierId].name : pur.supplierId || 'Unknown Supplier');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${pur.date}</td>
      <td style="font-weight:600;">${supplierName}</td>
      <td class="text-right">${pur.totalBags}</td>
      <td class="text-right">${pur.totalWeight ? pur.totalWeight.toFixed(1) : '-'}</td>
      <td class="text-right">₹${pur.rate.toFixed(2)} / ${pur.rateUnit === 'per Kg' ? 'Kg' : 'Bag'}</td>
      <td class="text-right text-success" style="font-weight:700;">${formatCurrency(pur.totalAmount)}</td>
      <td>${pur.notes || '-'}</td>
      <td>
        <button class="btn btn-danger btn-sm delete-purchase-btn" style="padding: 4px 8px; font-size:10px;" data-id="${pur.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  tbody.querySelectorAll('.delete-purchase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const purId = btn.getAttribute('data-id');
      if (confirm("Are you sure you want to delete this purchase record?")) {
        State.purchases = State.purchases.filter(p => p.id !== purId);
        saveData();
        showToast("Purchase record deleted", "warning");
        renderSourcingTable();
        renderDashboard();
      }
    });
  });
}

function renderWholesalePaymentsTable() {
  const tbody = document.getElementById('wpay-history-rows');
  if (!tbody) return;
  tbody.innerHTML = '';

  const sorted = [...State.wholesalePayments].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); font-style:italic;">No payments recorded yet.</td></tr>`;
    return;
  }

  sorted.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.date}</td>
      <td style="font-weight:600;">${p.supplierName}</td>
      <td class="text-right text-success" style="font-weight:700;">${formatCurrency(p.amount)}</td>
      <td>${p.mode || '-'}</td>
      <td>${p.notes || '-'}</td>
      <td>
        <button class="btn btn-danger btn-sm delete-wpay-btn" style="padding:4px 8px;font-size:10px;" data-id="${p.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.delete-wpay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm("Delete this payment record?")) {
        State.wholesalePayments = State.wholesalePayments.filter(p => p.id !== id);
        saveData();
        showToast("Payment record deleted", "warning");
        renderWholesalePaymentsTable();
        renderDashboard();
      }
    });
  });
}
