/**
 * CampusCash – Student Financial Management System
 * Core Frontend Logic & Interactivity Engine
 */

// ================= INITIAL STATE & DATA =================
const DEFAULT_STATE = {
  activeTab: 'overview',
  activeTheme: 'light',
  selectedMascotIndex: 0,
  semester: {
    name: 'Semester 1 (2025/2026)',
    totalWeeks: 16,
    currentWeek: 4,
    daysRemaining: 84
  },
  wallets: [
    { id: 'w1', name: 'M-Pesa', account: '0712 ••• 890', balance: 8450, tag: 'mpesa-tag', synced: '5m ago', type: 'mobile' },
    { id: 'w2', name: 'Airtel Money', account: '0733 ••• 412', balance: 2100, tag: 'airtel-tag', synced: '1h ago', type: 'mobile' },
    { id: 'w3', name: 'Equity Student Acc', account: '0140 ••• 992', balance: 15000, tag: 'bank-tag', synced: 'HELB Main', type: 'bank' },
    { id: 'w4', name: 'Cash in Pocket', account: 'Physical Notes', balance: 950, tag: 'cash-tag', synced: 'Manual update', type: 'cash' }
  ],
  goals: [
    { id: 'g1', name: 'Next Semester Hostel Rent', target: 16000, saved: 11500, deadline: '2026-11-15', category: 'Hostel & Rent', icon: 'fa-house-user' },
    { id: 'g2', name: '2nd Year Textbooks & Printing', target: 4500, saved: 3200, deadline: '2026-10-30', category: 'Academics & Books', icon: 'fa-book-open' },
    { id: 'g3', name: 'Laptop SSD & RAM Upgrade', target: 7500, saved: 2800, deadline: '2026-12-10', category: 'Tech & Laptop', icon: 'fa-laptop' },
    { id: 'g4', name: 'Emergency Upkeep Cushion', target: 10000, saved: 5000, deadline: '2026-12-20', category: 'Emergency Cushion', icon: 'fa-shield-heart' }
  ],
  transactions: [
    { id: 'tx-1', title: 'HELB Upkeep Disbursement', type: 'income', amount: 30000, category: 'Upkeep / Allowance', wallet: 'Bank', date: '2026-09-01T09:00' },
    { id: 'tx-2', title: 'Monthly Pocket Money from Parents', type: 'income', amount: 10000, category: 'Upkeep / Allowance', wallet: 'M-Pesa', date: '2026-09-15T14:30' },
    { id: 'tx-3', title: 'Freelance Web Design Gig', type: 'income', amount: 5000, category: 'Side Hustle', wallet: 'M-Pesa', date: '2026-09-28T16:45' },
    { id: 'tx-4', title: 'Hostel Accommodation Deposit', type: 'expense', amount: 12000, category: 'Hostel & Rent', wallet: 'Bank', date: '2026-09-03T11:20' },
    { id: 'tx-5', title: 'Student Mess 2-Week Meal Card', type: 'expense', amount: 2400, category: 'Food & Mess', wallet: 'M-Pesa', date: '2026-09-18T12:15' },
    { id: 'tx-6', title: 'Campus Cafeteria Lunches & Snacks', type: 'expense', amount: 1400, category: 'Food & Mess', wallet: 'M-Pesa', date: '2026-09-25T13:40' },
    { id: 'tx-7', title: 'Calculus & Data Structures Printing', type: 'expense', amount: 450, category: 'Academics & Books', wallet: 'Cash', date: '2026-09-29T10:10' },
    { id: 'tx-8', title: 'Safaricom Monthly Student Wi-Fi / Bundles', type: 'expense', amount: 500, category: 'Tech & Bundles', wallet: 'M-Pesa', date: '2026-10-01T08:00' },
    { id: 'tx-9', title: 'Weekend Movie & Pizza Night', type: 'expense', amount: 1250, category: 'Entertainment', wallet: 'Airtel Money', date: '2026-10-03T20:30' },
    { id: 'tx-10', title: 'Matatu Commute to Supermarket', type: 'expense', amount: 300, category: 'Transport', wallet: 'Cash', date: '2026-10-05T15:00' },
    { id: 'tx-11', title: 'Photocopying Past Revision Papers', type: 'expense', amount: 200, category: 'Academics & Books', wallet: 'Cash', date: '2026-10-06T11:45' }
  ],
  notifications: [
    { id: 'n1', title: 'Upkeep Velocity Warning', text: 'You have spent 46% of upkeep in 4 weeks. Slow down dining out!', type: 'warning', time: '1h ago', icon: 'fa-triangle-exclamation' },
    { id: 'n2', title: 'Goal Deadline Approaching', text: 'Textbooks & Printing goal deadline is in 23 days.', type: 'info', time: '1d ago', icon: 'fa-calendar-day' },
    { id: 'n3', title: 'M-Pesa Deposit Received', text: 'KES 5,000 from Freelance Web Design recorded.', type: 'info', time: '2d ago', icon: 'fa-circle-check' }
  ]
};

// 10 Curated Academic Mascot Characters
const MASCOTS = [
  {
    name: 'Ollie the Scholar Owl',
    role: 'Chief Wisdom & Budget Guide',
    avatar: 'logo.jpg',
    icon: '🦉',
    tip: 'Hey Alex! Week 4 is underway. Keep your daily spend under KES 315 to finish the semester strong!',
    personality: 'Analytical, wise, supportive'
  },
  {
    name: 'Penny the Academic Piggy',
    role: 'Savings & Emergency Guardian',
    avatar: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100&auto=format&fit=crop&q=60',
    icon: '🐷',
    tip: 'Oink! Every 50 bob you save on snacks today is 50 bob closer to your laptop RAM goal!',
    personality: 'Cheerful, disciplined, encouraging'
  },
  {
    name: 'Byte the Tech Fox',
    role: 'Campus Side-Hustle Strategist',
    avatar: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=100&auto=format&fit=crop&q=60',
    icon: '🦊',
    tip: 'Clever students don’t just save—they build small gigs between lectures. Check out the Side-Hustle Finder!',
    personality: 'Sharp, entrepreneurial, modern'
  },
  {
    name: 'Chip the Calculator Bot',
    role: 'Automated Math & Runway Engine',
    avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&auto=format&fit=crop&q=60',
    icon: '🤖',
    tip: 'Beep boop! 84 days remaining in Semester 1. Total liquid reserves: KES 26,500. Algorithm stable.',
    personality: 'Precise, robotic-cute, data-driven'
  },
  {
    name: 'Brainy the Capybara',
    role: 'Zen & Stress-Free Budgeter',
    avatar: 'https://images.unsplash.com/photo-1555169062-013468b47731?w=100&auto=format&fit=crop&q=60',
    icon: '🦫',
    tip: 'Stay calm and avoid panic spending before CAT exams. Mindful meal prep saves you peace and cash.',
    personality: 'Chill, relaxed, grounded'
  },
  {
    name: 'Ace the Beaver',
    role: 'Hostel Rent & Project Builder',
    avatar: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?w=100&auto=format&fit=crop&q=60',
    icon: '🪵',
    tip: 'Building your hostel rent dam bit by bit! You are 71% towards your Next Semester Rent target.',
    personality: 'Hardworking, structured, reliable'
  },
  {
    name: 'Sunny the Scholar Bee',
    role: 'Micro-Savings Specialist',
    avatar: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&auto=format&fit=crop&q=60',
    icon: '🐝',
    tip: 'Buzzing with financial energy! Little drops of honey fill the hive—put your loose change in MMFs.',
    personality: 'Energetic, optimistic, buzzing'
  },
  {
    name: 'Rex the Saver Dino',
    role: 'Impulse Buying Defender',
    avatar: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=100&auto=format&fit=crop&q=60',
    icon: '🦖',
    tip: 'Rawrr! My arms are too short to reach into my wallet for unnecessary junk food. You should be too!',
    personality: 'Playful, funny, frugal'
  },
  {
    name: 'Nova the Academic Star',
    role: 'Semester Vision & Goals Coach',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&auto=format&fit=crop&q=60',
    icon: '⭐',
    tip: 'Shine bright in class without financial stress dragging down your GPA. Plan ahead!',
    personality: 'Inspirational, bright, ambitious'
  },
  {
    name: 'Sage the Campus Otter',
    role: 'Smart Deals & Group Purchasing',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop&q=60',
    icon: '🦦',
    tip: 'Otters hold hands so they don’t drift—team up with classmates for bulk grocery shopping in Gikomba/market!',
    personality: 'Friendly, community-minded, crafty'
  }
];

// App State container
let state = loadState();

// USSD State Machine
let ussdState = {
  currentMenu: 'main', // 'main', 'expense_amt', 'expense_cat', 'goal_view', 'statement', 'advice'
  tempExpense: {}
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initMascots();
  initNotifications();
  initEventListeners();
  initUssdSimulator();
  initAiAdvisor();
  renderAll();
});

// Load / Save State from LocalStorage
function loadState() {
  const saved = localStorage.getItem('campuscash_state');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved state, using default', e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveState() {
  localStorage.setItem('campuscash_state', JSON.stringify(state));
  renderAll();
}

// ================= THEME TOGGLE =================
function initTheme() {
  const savedTheme = localStorage.getItem('campuscash_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('campuscash_theme', next);
  updateThemeIcon(next);
  drawIncomeExpenseChart();
  showToast(`Switched to ${next} mode`, 'info');
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// ================= NAVIGATION =================
function initNavigation() {
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      switchTab(tabId);
      // Close mobile sidebar if open
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  // Mobile hamburger
  document.getElementById('openSidebarBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
  });

  document.getElementById('closeSidebarBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });

  // Alert banner close
  document.getElementById('closeAlertBanner')?.addEventListener('click', () => {
    document.getElementById('systemAlertBanner').style.display = 'none';
  });

  // Quick Action Modal Buttons
  document.getElementById('quickAddTxBtn')?.addEventListener('click', () => openNewTxModal());
  document.getElementById('openUssdModalBtn')?.addEventListener('click', () => switchTab('ussd-simulator'));
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('linkAccountModalBtn')?.addEventListener('click', () => switchTab('wallets'));
  document.getElementById('linkNewWalletBtn')?.addEventListener('click', () => openPromptAddWallet());
  document.getElementById('exportTxCsvBtn')?.addEventListener('click', exportToCsv);
  document.getElementById('openAiRunwayTip')?.addEventListener('click', () => {
    switchTab('ai-advisor');
    sendQuickAiQuery('How should I budget my remaining balance to survive the semester?');
  });

  // Period selector in chart
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      drawIncomeExpenseChart();
    });
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });

  // Update Page Title
  const titles = {
    'overview': 'Financial Dashboard',
    'wallets': 'Connected Accounts & Wallets',
    'goals': 'Semester Financial Goals',
    'transactions': 'Income & Expenses Ledger',
    'ai-advisor': 'CampusAI Financial Coach',
    'ussd-simulator': 'Offline USSD (*384*45#) & SMS',
    'reports': 'Financial Reports & Exports'
  };

  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) pageTitle.textContent = titles[tabId] || 'Financial Dashboard';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabId === 'overview' || tabId === 'reports') {
    setTimeout(drawIncomeExpenseChart, 100);
  }
}

// ================= MASCOTS & 10 BRAND LOGO OPTIONS =================
function initMascots() {
  const mascotPickerBtn = document.getElementById('mascotPickerBtn');
  if (mascotPickerBtn) {
    mascotPickerBtn.addEventListener('click', openMascotModal);
  }
  updateActiveMascotUI();
}

function updateActiveMascotUI() {
  const mascot = MASCOTS[state.selectedMascotIndex] || MASCOTS[0];
  
  const sidebarImg = document.getElementById('sidebarMascotImg');
  if (sidebarImg) {
    sidebarImg.src = mascot.avatar;
    sidebarImg.alt = mascot.name;
  }

  const tipText = document.getElementById('mascotTip');
  if (tipText) {
    tipText.textContent = `"${mascot.tip}"`;
  }
}

function openMascotModal() {
  const grid = document.getElementById('mascotSelectionGrid');
  if (!grid) return;

  grid.innerHTML = MASCOTS.map((m, index) => `
    <div class="mascot-select-card ${state.selectedMascotIndex === index ? 'selected' : ''}" onclick="selectMascot(${index})">
      <div class="mascot-icon-display">${m.icon}</div>
      <div class="mascot-select-name">${m.name}</div>
      <div class="mascot-select-role">${m.role}</div>
      <p class="text-sm text-muted mt-2" style="font-size:0.75rem;"><em>"${m.personality}"</em></p>
    </div>
  `).join('');

  openModal('mascotModal');
}

function selectMascot(index) {
  state.selectedMascotIndex = index;
  saveState();
  updateActiveMascotUI();
  openMascotModal(); // re-render selection grid
  showToast(`Mascot changed to ${MASCOTS[index].name}!`, 'success');
}

// ================= NOTIFICATIONS =================
function initNotifications() {
  const notifBtn = document.getElementById('notifBellBtn');
  const notifMenu = document.getElementById('notifMenu');
  const markReadBtn = document.getElementById('markAllReadBtn');

  if (notifBtn && notifMenu) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!notifMenu.contains(e.target) && e.target !== notifBtn) {
        notifMenu.classList.remove('show');
      }
    });
  }

  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      state.notifications = [];
      saveState();
      renderNotifications();
      showToast('All notifications cleared', 'info');
    });
  }

  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  const countBadge = document.getElementById('notifCount');
  if (!list || !countBadge) return;

  countBadge.textContent = state.notifications.length;
  countBadge.style.display = state.notifications.length > 0 ? 'flex' : 'none';

  if (state.notifications.length === 0) {
    list.innerHTML = `<li class="p-3 text-center text-muted" style="padding:1rem;">No new alerts or warnings. Keep up the good work!</li>`;
    return;
  }

  list.innerHTML = state.notifications.map(n => `
    <li class="notif-item">
      <div class="notif-icon ${n.type}">
        <i class="fa-solid ${n.icon}"></i>
      </div>
      <div class="notif-body">
        <p><strong>${n.title}</strong>: ${n.text}</p>
        <span>${n.time}</span>
      </div>
    </li>
  `).join('');
}

// ================= CALCULATIONS & RENDERING =================
function renderAll() {
  renderMetrics();
  renderWallets();
  renderGoals();
  renderTransactions();
  renderCategoryBreakdown();
  renderReport();
  drawIncomeExpenseChart();
}

function renderMetrics() {
  // Total Balance across all wallets
  const totalBalance = state.wallets.reduce((acc, w) => acc + Number(w.balance), 0);
  
  // Total Income
  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // Total Expenses
  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // Safe daily allowance
  const daysLeft = state.semester.daysRemaining || 84;
  const safeDaily = daysLeft > 0 ? (totalBalance / daysLeft) : 0;

  // Update DOM elements
  const balEl = document.getElementById('totalBalanceDisplay');
  const incEl = document.getElementById('totalIncomeDisplay');
  const expEl = document.getElementById('totalExpensesDisplay');
  const runEl = document.getElementById('safeDailyAllowance');

  if (balEl) balEl.textContent = formatMoney(totalBalance);
  if (incEl) incEl.textContent = formatMoney(totalIncome);
  if (expEl) expEl.textContent = formatMoney(totalExpenses);
  if (runEl) runEl.textContent = formatMoney(safeDaily);
}

function renderWallets() {
  // Overview wallets grid
  const overviewGrid = document.getElementById('walletsOverviewGrid');
  if (overviewGrid) {
    overviewGrid.innerHTML = state.wallets.map(w => `
      <div class="wallet-pill-card">
        <div class="wallet-top">
          <div class="wallet-brand">
            <span class="brand-tag ${w.tag}">${w.name}</span>
            <span class="account-num">${w.account}</span>
          </div>
          <i class="fa-solid ${w.type === 'bank' ? 'fa-building-columns' : w.type === 'cash' ? 'fa-hand-holding-dollar' : 'fa-signal wallet-status active'}"></i>
        </div>
        <div class="wallet-balance">
          <span class="curr">KES</span>
          <span class="amt">${formatNumber(w.balance)}</span>
        </div>
        <div class="wallet-bottom">
          <span class="sync-time">${w.synced}</span>
          <button class="btn-micro" onclick="openWalletAction('${w.id}')">${w.type === 'cash' ? 'Adjust' : 'Top-up'}</button>
        </div>
      </div>
    `).join('');
  }

  // Full detailed wallets tab
  const detailedGrid = document.getElementById('walletsDetailedGrid');
  if (detailedGrid) {
    detailedGrid.innerHTML = state.wallets.map(w => `
      <div class="dash-card">
        <div class="card-header">
          <div class="card-title-group">
            <span class="brand-tag ${w.tag}" style="font-size:0.85rem; padding:0.3rem 0.6rem;">${w.name}</span>
            <h4>${w.account}</h4>
          </div>
          <span class="badge-tag tag-income"><i class="fa-solid fa-check"></i> Connected</span>
        </div>
        <div class="wallet-balance my-3">
          <span class="curr" style="font-size:1rem;">KES</span>
          <span class="amt" style="font-size:2rem;">${formatNumber(w.balance)}</span>
        </div>
        <p class="text-sm text-muted mb-3">Sync Status: <strong>${w.synced}</strong> • Linked for Instant Campus Transfers</p>
        <div class="d-flex gap-2" style="display:flex; gap:0.5rem;">
          <button class="btn-primary-gradient btn-sm flex-1" onclick="openDepositToWallet('${w.id}')">
            <i class="fa-solid fa-arrow-down"></i> Deposit
          </button>
          <button class="btn-outline btn-sm flex-1" onclick="openWithdrawFromWallet('${w.id}')">
            <i class="fa-solid fa-arrow-up"></i> Transfer
          </button>
        </div>
      </div>
    `).join('');
  }
}

function renderGoals() {
  const totalTarget = state.goals.reduce((acc, g) => acc + Number(g.target), 0);
  const totalSaved = state.goals.reduce((acc, g) => acc + Number(g.saved), 0);

  const targetEl = document.getElementById('goalsTotalTarget');
  const savedEl = document.getElementById('goalsTotalSaved');
  if (targetEl) targetEl.textContent = formatMoney(totalTarget);
  if (savedEl) savedEl.textContent = formatMoney(totalSaved);

  // Spotlight on dashboard
  const spotlight = document.getElementById('goalsSpotlightList');
  if (spotlight) {
    spotlight.innerHTML = state.goals.slice(0, 3).map(g => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `
        <div class="goal-mini-card">
          <div class="goal-mini-header">
            <span class="goal-mini-title"><i class="fa-solid ${g.icon} text-blue"></i> ${g.name}</span>
            <span class="goal-mini-deadline">Due: ${g.deadline}</span>
          </div>
          <div class="progress-bar-bg mt-2">
            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <div class="goal-progress-meta">
            <span>${formatMoney(g.saved)} of ${formatMoney(g.target)}</span>
            <strong class="text-emerald">${pct}%</strong>
          </div>
        </div>
      `;
    }).join('');
  }

  // Full Goals Grid
  const fullGrid = document.getElementById('goalsFullGrid');
  if (fullGrid) {
    fullGrid.innerHTML = state.goals.map(g => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      const isComplete = pct >= 100;
      return `
        <div class="goal-card">
          <div class="goal-card-header">
            <div>
              <div class="goal-icon-badge"><i class="fa-solid ${g.icon}"></i></div>
              <h3>${g.name}</h3>
              <span class="badge-pill mt-1">${g.category}</span>
            </div>
            <span class="badge-tag ${isComplete ? 'tag-income' : 'status-warning'}">
              ${isComplete ? 'Goal Reached 🎉' : `${pct}% Done`}
            </span>
          </div>

          <div class="goal-amounts">
            <div class="saved">${formatMoney(g.saved)}</div>
            <div class="target">Target: ${formatMoney(g.target)} • Remaining: ${formatMoney(Math.max(0, g.target - g.saved))}</div>
          </div>

          <div class="progress-bar-bg my-2">
            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
          </div>

          <div class="goal-footer">
            <span class="text-sm text-muted"><i class="fa-regular fa-clock"></i> Target Date: ${g.deadline}</span>
            <button class="btn-primary btn-sm" onclick="openAllocateMoneyModal('${g.id}')">
              <i class="fa-solid fa-plus"></i> Add Money
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

function renderTransactions() {
  const recentTable = document.getElementById('recentTransactionsTableBody');
  const allTable = document.getElementById('allTransactionsTableBody');

  const sortedTx = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Dashboard Recent 5
  if (recentTable) {
    recentTable.innerHTML = sortedTx.slice(0, 5).map(tx => `
      <tr>
        <td>
          <div class="tx-icon-pill">
            <i class="fa-solid ${tx.type === 'income' ? 'fa-arrow-down text-emerald' : 'fa-arrow-up text-rose'}"></i>
            <span>${tx.title}</span>
          </div>
        </td>
        <td><span class="badge-pill">${tx.wallet}</span></td>
        <td><span class="badge-pill">${tx.category}</span></td>
        <td class="text-muted text-sm">${formatDate(tx.date)}</td>
        <td class="text-right text-bold ${tx.type === 'income' ? 'text-emerald' : 'text-rose'}">
          ${tx.type === 'income' ? '+' : '-'}${formatMoney(tx.amount)}
        </td>
        <td>
          <button class="btn-icon-sm" onclick="deleteTransaction('${tx.id}')" title="Delete">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // All Transactions with Filters
  if (allTable) {
    const searchVal = (document.getElementById('txSearchInput')?.value || '').toLowerCase();
    const typeVal = document.getElementById('txTypeFilter')?.value || 'all';
    const catVal = document.getElementById('txCategoryFilter')?.value || 'all';
    const wallVal = document.getElementById('txWalletFilter')?.value || 'all';

    const filtered = sortedTx.filter(tx => {
      const matchesSearch = tx.title.toLowerCase().includes(searchVal) || tx.category.toLowerCase().includes(searchVal);
      const matchesType = typeVal === 'all' || tx.type === typeVal;
      const matchesCat = catVal === 'all' || tx.category === catVal;
      const matchesWall = wallVal === 'all' || tx.wallet === wallVal;
      return matchesSearch && matchesType && matchesCat && matchesWall;
    });

    const infoEl = document.getElementById('txCountInfo');
    if (infoEl) infoEl.textContent = `Showing ${filtered.length} of ${state.transactions.length} transactions`;

    if (filtered.length === 0) {
      allTable.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 2rem;">No matching transactions found.</td></tr>`;
      return;
    }

    allTable.innerHTML = filtered.map(tx => `
      <tr>
        <td>
          <div class="tx-icon-pill">
            <i class="fa-solid ${tx.type === 'income' ? 'fa-arrow-down-left text-emerald' : 'fa-arrow-up-right text-rose'}"></i>
            <div>
              <div class="text-bold">${tx.title}</div>
            </div>
          </div>
        </td>
        <td><span class="badge-tag ${tx.type === 'income' ? 'tag-income' : 'tag-expense'}">${tx.type.toUpperCase()}</span></td>
        <td><span class="badge-pill">${tx.category}</span></td>
        <td><strong>${tx.wallet}</strong></td>
        <td class="text-muted text-sm">${formatDateTime(tx.date)}</td>
        <td class="text-right text-bold ${tx.type === 'income' ? 'text-emerald' : 'text-rose'}">
          ${tx.type === 'income' ? '+' : '-'}${formatMoney(tx.amount)}
        </td>
        <td class="text-center">
          <button class="btn-icon-sm" onclick="deleteTransaction('${tx.id}')" title="Delete">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }
}

function renderCategoryBreakdown() {
  const container = document.getElementById('categoryBreakdownList');
  if (!container) return;

  const expenses = state.transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount), 0) || 1;

  const catTotals = {};
  expenses.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + Number(t.amount);
  });

  const categories = Object.keys(catTotals).map(cat => ({
    name: cat,
    amount: catTotals[cat],
    pct: Math.round((catTotals[cat] / totalExpense) * 100)
  })).sort((a, b) => b.amount - a.amount);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e'];

  container.innerHTML = categories.map((cat, idx) => `
    <div class="cat-item">
      <div class="cat-info">
        <span>${cat.name}</span>
        <span>${formatMoney(cat.amount)} (${cat.pct}%)</span>
      </div>
      <div class="cat-bar-bg">
        <div class="cat-bar-fill" style="width: ${cat.pct}%; background-color: ${colors[idx % colors.length]};"></div>
      </div>
    </div>
  `).join('');
}

function renderReport() {
  const grossIncome = state.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const grossExpense = state.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  const netReserves = state.wallets.reduce((acc, w) => acc + Number(w.balance), 0);

  const repInc = document.getElementById('repGrossIncome');
  const repExp = document.getElementById('repGrossExpense');
  const repNet = document.getElementById('repNetReserves');
  if (repInc) repInc.textContent = formatMoney(grossIncome);
  if (repExp) repExp.textContent = formatMoney(grossExpense);
  if (repNet) repNet.textContent = formatMoney(netReserves);

  const reportTable = document.getElementById('reportCategoryTableBody');
  if (reportTable) {
    const expenses = state.transactions.filter(t => t.type === 'expense');
    const catMap = {};
    expenses.forEach(t => {
      if (!catMap[t.category]) catMap[t.category] = { count: 0, sum: 0 };
      catMap[t.category].count += 1;
      catMap[t.category].sum += Number(t.amount);
    });

    reportTable.innerHTML = Object.keys(catMap).map(cat => {
      const data = catMap[cat];
      const pct = grossExpense > 0 ? Math.round((data.sum / grossExpense) * 100) : 0;
      return `
        <tr>
          <td><strong>${cat}</strong></td>
          <td>${data.count} txns</td>
          <td>${formatMoney(data.sum)}</td>
          <td>${pct}%</td>
          <td><span class="badge-tag ${pct > 40 ? 'status-warning' : 'tag-income'}">${pct > 40 ? 'Heavy Outflow' : 'Normal'}</span></td>
        </tr>
      `;
    }).join('');
  }
}

// ================= HTML5 CANVAS DUAL-BAR CHART =================
function drawIncomeExpenseChart() {
  const canvas = document.getElementById('incomeExpenseChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  
  // Set real pixel resolution for high DPI
  const dpr = window.devicePixelRatio || 1;
  canvas.width = (rect.width || 600) * dpr;
  canvas.height = (rect.height || 240) * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width || 600;
  const height = rect.height || 240;

  ctx.clearRect(0, 0, width, height);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';

  // Sample weeks data
  const data = [
    { label: 'Week 1', income: 30000, expense: 12450 },
    { label: 'Week 2', income: 10000, expense: 2800 },
    { label: 'Week 3', income: 0, expense: 1850 },
    { label: 'Week 4', income: 5000, expense: 1400 }
  ];

  const maxVal = 35000;
  const padLeft = 45;
  const padRight = 20;
  const padBottom = 30;
  const padTop = 20;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Draw Horizontal Grid Lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.font = '11px sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'right';

  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = padTop + chartH - (i * (chartH / gridSteps));
    const val = Math.round((maxVal / gridSteps) * i);
    
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();

    ctx.fillText(`${val >= 1000 ? val/1000 + 'k' : val}`, padLeft - 8, y + 4);
  }

  // Draw Bars
  const colWidth = chartW / data.length;
  const barW = Math.min(22, colWidth * 0.28);
  const gap = 4;

  data.forEach((d, idx) => {
    const colCenterX = padLeft + (idx * colWidth) + (colWidth / 2);

    // Income Bar (Emerald)
    const incH = (d.income / maxVal) * chartH;
    const incX = colCenterX - barW - (gap / 2);
    const incY = padTop + chartH - incH;
    
    ctx.fillStyle = '#10b981';
    roundRect(ctx, incX, incY, barW, incH, 4);

    // Expense Bar (Blue)
    const expH = (d.expense / maxVal) * chartH;
    const expX = colCenterX + (gap / 2);
    const expY = padTop + chartH - expH;
    
    ctx.fillStyle = '#3b82f6';
    roundRect(ctx, expX, expY, barW, expH, 4);

    // X-Axis Labels
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(d.label, colCenterX, height - 10);
  });

  // Safe Budget Cap Line (e.g. KES 2,500/week)
  const capY = padTop + chartH - ((2500 / maxVal) * chartH);
  ctx.strokeStyle = '#f43f5e';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padLeft, capY);
  ctx.lineTo(width - padRight, capY);
  ctx.stroke();
  ctx.setLineDash([]);
}

function roundRect(ctx, x, y, width, height, radius) {
  if (height <= 0) return;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// ================= TRANSACTION & GOAL MODAL HANDLERS =================
function initEventListeners() {
  // Search & Filter listeners
  ['txSearchInput', 'txTypeFilter', 'txCategoryFilter', 'txWalletFilter'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', renderTransactions);
    document.getElementById(id)?.addEventListener('change', renderTransactions);
  });

  // STK Push Sim
  document.getElementById('sendStkPushBtn')?.addEventListener('click', () => {
    const phone = document.getElementById('stkPhone').value;
    const amt = document.getElementById('stkAmount').value;
    const wallet = document.getElementById('stkTargetWallet').value;
    triggerStkPushSim(wallet, amt, phone);
  });
}

function openNewTxModal() {
  const dateInput = document.getElementById('txDate');
  if (dateInput) {
    const now = new Date();
    dateInput.value = now.toISOString().slice(0, 16);
  }
  updateCategoryOptions();
  openModal('txModal');
}

function updateCategoryOptions() {
  const type = document.getElementById('txType')?.value || 'expense';
  const catSelect = document.getElementById('txCategory');
  if (!catSelect) return;

  if (type === 'income') {
    catSelect.innerHTML = `
      <option value="Upkeep / Allowance">Upkeep / HELB / Allowance</option>
      <option value="Side Hustle">Side Hustle / Freelance</option>
      <option value="Parent / Sponsor Support">Parent / Sponsor Support</option>
      <option value="Academic Grant / Bursary">Academic Grant / Bursary</option>
      <option value="Savings Withdrawal">Savings Withdrawal</option>
    `;
  } else {
    catSelect.innerHTML = `
      <option value="Food & Mess">Food & Student Mess</option>
      <option value="Hostel & Rent">Hostel & Accommodation Rent</option>
      <option value="Academics & Books">Academics, Handouts & Printing</option>
      <option value="Tech & Bundles">Tech Bundles & Safaricom Wi-Fi</option>
      <option value="Transport">Matatu & Commute</option>
      <option value="Entertainment">Entertainment & Leisure</option>
      <option value="Health & Personal Care">Health & Personal Care</option>
    `;
  }
}

function handleTransactionSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('txType').value;
  const amount = parseFloat(document.getElementById('txAmount').value);
  const title = document.getElementById('txTitle').value.trim();
  const category = document.getElementById('txCategory').value;
  const wallet = document.getElementById('txWallet').value;
  const date = document.getElementById('txDate').value;

  if (!title || isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid title and amount.', 'error');
    return;
  }

  // Update corresponding wallet balance
  const targetWallet = state.wallets.find(w => w.name.includes(wallet) || wallet.includes(w.name));
  if (targetWallet) {
    if (type === 'expense') {
      if (targetWallet.balance < amount) {
        if (!confirm(`Warning: Your ${targetWallet.name} balance is KES ${targetWallet.balance}. Spending KES ${amount} will cause an overdraft. Proceed anyway?`)) {
          return;
        }
      }
      targetWallet.balance -= amount;
    } else {
      targetWallet.balance += amount;
    }
  }

  const newTx = {
    id: `tx-${Date.now()}`,
    title,
    type,
    amount,
    category,
    wallet,
    date: date || new Date().toISOString()
  };

  state.transactions.unshift(newTx);

  // Check for overspending alert trigger
  if (type === 'expense' && amount > 2000) {
    state.notifications.unshift({
      id: `n-${Date.now()}`,
      title: 'High Single Outflow Alert',
      text: `Spent KES ${amount} on ${category} (${title}).`,
      type: 'warning',
      time: 'Just now',
      icon: 'fa-bolt'
    });
  }

  saveState();
  closeModal('txModal');
  document.getElementById('newTxForm').reset();
  showToast(`Transaction "${title}" added successfully!`, 'success');
}

function deleteTransaction(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;

  if (confirm(`Delete transaction "${tx.title}" (KES ${tx.amount})?`)) {
    // Reverse wallet balance impact
    const targetWallet = state.wallets.find(w => w.name.includes(tx.wallet) || tx.wallet.includes(w.name));
    if (targetWallet) {
      if (tx.type === 'expense') targetWallet.balance += Number(tx.amount);
      else targetWallet.balance -= Number(tx.amount);
    }

    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
    showToast('Transaction deleted and balance adjusted.', 'info');
  }
}

// Goal Management
function openNewGoalModal() {
  openModal('goalModal');
}

function handleGoalSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('goalName').value.trim();
  const target = parseFloat(document.getElementById('goalTarget').value);
  const current = parseFloat(document.getElementById('goalCurrent').value) || 0;
  const category = document.getElementById('goalCategory').value;
  const deadline = document.getElementById('goalDeadline').value;

  if (!name || isNaN(target) || target <= 0) {
    showToast('Please enter a valid goal name and target amount.', 'error');
    return;
  }

  const iconMap = {
    'Hostel & Rent': 'fa-house-user',
    'Academics & Books': 'fa-book-open',
    'Tech & Laptop': 'fa-laptop',
    'Emergency Cushion': 'fa-shield-heart',
    'Graduation / Trips': 'fa-graduation-cap'
  };

  const newGoal = {
    id: `g-${Date.now()}`,
    name,
    target,
    saved: current,
    category,
    deadline,
    icon: iconMap[category] || 'fa-bullseye'
  };

  state.goals.push(newGoal);
  saveState();
  closeModal('goalModal');
  document.getElementById('newGoalForm').reset();
  showToast(`Goal "${name}" created!`, 'success');
}

function openAllocateMoneyModal(goalId) {
  const goal = state.goals.find(g => g.id === goalId);
  if (!goal) return;

  document.getElementById('allocateGoalId').value = goalId;
  document.getElementById('allocateGoalTitle').innerHTML = `Depositing to: <span class="text-blue">${goal.name}</span><br/><small class="text-muted">Target: ${formatMoney(goal.target)} • Current: ${formatMoney(goal.saved)}</small>`;
  
  openModal('allocateGoalModal');
}

function handleAllocateGoal(e) {
  e.preventDefault();
  const goalId = document.getElementById('allocateGoalId').value;
  const amount = parseFloat(document.getElementById('allocateAmount').value);
  const walletName = document.getElementById('allocateSourceWallet').value;

  const goal = state.goals.find(g => g.id === goalId);
  const wallet = state.wallets.find(w => w.name.includes(walletName) || walletName.includes(w.name));

  if (!goal || isNaN(amount) || amount <= 0) {
    showToast('Invalid allocation amount.', 'error');
    return;
  }

  if (wallet && wallet.balance < amount) {
    showToast(`Insufficient balance in ${wallet.name} (Available: KES ${wallet.balance})`, 'error');
    return;
  }

  if (wallet) wallet.balance -= amount;
  goal.saved += amount;

  // Record as goal transfer transaction
  state.transactions.unshift({
    id: `tx-${Date.now()}`,
    title: `Allocated to Goal: ${goal.name}`,
    type: 'expense',
    amount: amount,
    category: 'Goal Allocation',
    wallet: wallet ? wallet.name : 'M-Pesa',
    date: new Date().toISOString()
  });

  saveState();
  closeModal('allocateGoalModal');
  document.getElementById('allocateGoalForm').reset();
  showToast(`KES ${amount} saved into ${goal.name}! 🎯`, 'success');
}

// ================= STK PUSH & WALLET ACTIONS =================
function triggerStkPushSim(walletType, amount = 1000, phone = '0712 ••• 890') {
  const preview = document.getElementById('stkStatusText');
  if (preview) {
    preview.innerHTML = `<strong>Sending STK Push to ${phone}...</strong><br/>Please check your mobile phone display.`;
  }

  showToast(`[STK Push] Sent KES ${amount} prompt to ${phone}`, 'info');

  setTimeout(() => {
    const pinEntered = confirm(`[Phone Screen Simulator]\n\nDo you want to pay KES ${amount} to CampusCash Student Wallet via ${walletType}?\n\nEnter M-Pesa PIN: ****\n\nClick OK to authorize deposit.`);
    
    if (pinEntered) {
      const target = state.wallets.find(w => w.name.includes(walletType) || walletType.includes(w.name)) || state.wallets[0];
      target.balance += Number(amount);
      
      state.transactions.unshift({
        id: `tx-${Date.now()}`,
        title: `${walletType} Top-up Deposit`,
        type: 'income',
        amount: Number(amount),
        category: 'Upkeep / Allowance',
        wallet: target.name,
        date: new Date().toISOString()
      });

      saveState();

      if (preview) {
        preview.innerHTML = `<span class="text-emerald"><strong>Success!</strong> KES ${amount} received and credited to ${target.name}.</span>`;
      }
      showToast(`Success! Credited KES ${amount} to ${target.name}`, 'success');
    }
  }, 600);
}

function openDepositToWallet(walletId) {
  const wallet = state.wallets.find(w => w.id === walletId);
  if (!wallet) return;
  const amtStr = prompt(`Deposit money to ${wallet.name} (Enter KES amount):`, '1000');
  if (amtStr) {
    const amt = parseFloat(amtStr);
    if (!isNaN(amt) && amt > 0) {
      triggerStkPushSim(wallet.name, amt, wallet.account);
    }
  }
}

function openWithdrawFromWallet(walletId) {
  const wallet = state.wallets.find(w => w.id === walletId);
  if (!wallet) return;
  const amtStr = prompt(`Transfer / Withdraw from ${wallet.name} (Available: KES ${wallet.balance}):`, '500');
  if (amtStr) {
    const amt = parseFloat(amtStr);
    if (!isNaN(amt) && amt > 0) {
      if (wallet.balance < amt) {
        showToast('Insufficient wallet balance', 'error');
        return;
      }
      wallet.balance -= amt;
      state.transactions.unshift({
        id: `tx-${Date.now()}`,
        title: `Withdrawal / Transfer from ${wallet.name}`,
        type: 'expense',
        amount: amt,
        category: 'Transport',
        wallet: wallet.name,
        date: new Date().toISOString()
      });
      saveState();
      showToast(`KES ${amt} withdrawn from ${wallet.name}`, 'info');
    }
  }
}

function openWalletAction(walletId) {
  const wallet = state.wallets.find(w => w.id === walletId);
  if (!wallet) return;
  if (wallet.type === 'cash') {
    const newBalStr = prompt(`Enter exact cash amount in your wallet/pocket (KES):`, wallet.balance);
    if (newBalStr !== null) {
      const newBal = parseFloat(newBalStr);
      if (!isNaN(newBal) && newBal >= 0) {
        wallet.balance = newBal;
        saveState();
        showToast('Cash balance updated!', 'success');
      }
    }
  } else {
    openDepositToWallet(walletId);
  }
}

function openPromptAddWallet() {
  const name = prompt('Enter New Account / Channel Name (e.g. KCB Student Bank, Co-op, Cash):');
  if (!name) return;
  const acc = prompt('Enter Account or Phone Number:', '0110 ••• 123');
  const bal = parseFloat(prompt('Initial Balance (KES):', '0')) || 0;

  state.wallets.push({
    id: `w-${Date.now()}`,
    name,
    account: acc || 'Custom Channel',
    balance: bal,
    tag: 'bank-tag',
    synced: 'Connected',
    type: 'bank'
  });

  saveState();
  showToast(`Wallet ${name} linked!`, 'success');
}

// ================= OFFLINE USSD SIMULATOR ENGINE (*384*45#) =================
function initUssdSimulator() {
  const sendBtn = document.getElementById('ussdSendBtn');
  const cancelBtn = document.getElementById('ussdCancelBtn');
  const inputEl = document.getElementById('ussdUserInput');

  if (sendBtn) {
    sendBtn.addEventListener('click', handleUssdInput);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', resetUssdMenu);
  }

  if (inputEl) {
    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUssdInput();
    });
  }
}

function dialUssdCode(code) {
  switchTab('ussd-simulator');
  resetUssdMenu();
  showToast(`Dialed ${code} via USSD Gateway...`, 'info');
}

function pressKeypad(key) {
  const input = document.getElementById('ussdUserInput');
  if (input) input.value += key;
}

function resetUssdMenu() {
  ussdState.currentMenu = 'main';
  ussdState.tempExpense = {};
  const display = document.getElementById('ussdDisplayText');
  const input = document.getElementById('ussdUserInput');
  
  if (display) {
    display.innerHTML = `
      <strong>CampusCash USSD Gateway</strong><br/>
      Welcome Alex Kimani!<br/>
      1. Check Balance & Upkeep Runway<br/>
      2. View Semester Goals<br/>
      3. Quick Log Expense (e.g. Lunch)<br/>
      4. Get Budget Advice via SMS<br/>
      5. Mini Statement<br/>
      0. Exit
    `;
  }
  if (input) {
    input.value = '';
    input.placeholder = 'Enter option (1-5)';
  }
}

function handleUssdInput() {
  const inputEl = document.getElementById('ussdUserInput');
  const displayEl = document.getElementById('ussdDisplayText');
  if (!inputEl || !displayEl) return;

  const val = inputEl.value.trim();
  inputEl.value = '';

  if (ussdState.currentMenu === 'main') {
    switch (val) {
      case '1': {
        const totalBal = state.wallets.reduce((acc, w) => acc + Number(w.balance), 0);
        const daily = Math.round(totalBal / (state.semester.daysRemaining || 84));
        displayEl.innerHTML = `
          <strong>CampusCash Balance Check</strong><br/>
          Total Balance: KES ${formatNumber(totalBal)}<br/>
          Runway: ${state.semester.daysRemaining} days left<br/>
          Safe Daily Cap: KES ${daily}/day<br/><br/>
          0. Back to Main Menu
        `;
        ussdState.currentMenu = 'sub';
        break;
      }
      case '2': {
        let goalsTxt = state.goals.map((g, i) => `${i+1}. ${g.name}: KES ${g.saved}/${g.target}`).join('<br/>');
        displayEl.innerHTML = `
          <strong>Semester Goals Progress:</strong><br/>
          ${goalsTxt}<br/><br/>
          0. Back to Main Menu
        `;
        ussdState.currentMenu = 'sub';
        break;
      }
      case '3': {
        displayEl.innerHTML = `
          <strong>Quick Log Expense</strong><br/>
          Enter Amount in KES (e.g. 150):<br/><br/>
          0. Cancel
        `;
        ussdState.currentMenu = 'expense_amt';
        inputEl.placeholder = 'Enter amount (KES)';
        break;
      }
      case '4': {
        dispatchSimulatedSms("CampusCash Advisor: You have 84 days left. Stick to mess meals instead of fast food to preserve KES 3,500 this month!");
        displayEl.innerHTML = `
          <strong>Budget Tip Dispatched!</strong><br/>
          An SMS with personalized budget advice has been sent to your phone.<br/><br/>
          0. Back
        `;
        ussdState.currentMenu = 'sub';
        break;
      }
      case '5': {
        const last3 = state.transactions.slice(0, 3).map(t => `${t.title.slice(0, 15)}: ${t.type === 'income' ? '+' : '-'}${t.amount}`).join('<br/>');
        displayEl.innerHTML = `
          <strong>Mini Statement (Last 3):</strong><br/>
          ${last3}<br/><br/>
          0. Back
        `;
        ussdState.currentMenu = 'sub';
        break;
      }
      case '0':
        displayEl.innerHTML = `<em>USSD Session Ended. Thank you for using CampusCash.</em>`;
        break;
      default:
        displayEl.innerHTML = `Invalid option.<br/>Please enter 1, 2, 3, 4, 5 or 0.<br/><br/>0. Back`;
        ussdState.currentMenu = 'sub';
    }
  } else if (ussdState.currentMenu === 'expense_amt') {
    if (val === '0') {
      resetUssdMenu();
      return;
    }
    const amt = parseFloat(val);
    if (isNaN(amt) || amt <= 0) {
      displayEl.innerHTML = `Invalid amount.<br/>Enter KES amount or 0 to cancel:`;
      return;
    }
    ussdState.tempExpense.amount = amt;
    displayEl.innerHTML = `
      <strong>Select Expense Category:</strong><br/>
      1. Food & Mess<br/>
      2. Academics & Printing<br/>
      3. Matatu Transport<br/>
      4. Wi-Fi / Bundles<br/>
      0. Cancel
    `;
    ussdState.currentMenu = 'expense_cat';
    inputEl.placeholder = 'Select 1-4';
  } else if (ussdState.currentMenu === 'expense_cat') {
    if (val === '0') {
      resetUssdMenu();
      return;
    }
    const catMap = {
      '1': 'Food & Mess',
      '2': 'Academics & Books',
      '3': 'Transport',
      '4': 'Tech & Bundles'
    };
    const cat = catMap[val] || 'Food & Mess';
    const amt = ussdState.tempExpense.amount;

    // Deduct from M-Pesa / Cash
    const wallet = state.wallets[0]; // M-Pesa default
    wallet.balance -= amt;

    const newTx = {
      id: `tx-${Date.now()}`,
      title: `USSD Logged: ${cat}`,
      type: 'expense',
      amount: amt,
      category: cat,
      wallet: 'M-Pesa',
      date: new Date().toISOString()
    };

    state.transactions.unshift(newTx);
    saveState();

    dispatchSimulatedSms(`Alert: KES ${amt} logged for ${cat} via USSD (*384*45#). M-Pesa Balance: KES ${wallet.balance}.`);

    displayEl.innerHTML = `
      <strong>Success!</strong><br/>
      KES ${amt} for ${cat} recorded.<br/>
      New Balance: KES ${formatNumber(wallet.balance)}<br/><br/>
      0. Main Menu
    `;
    ussdState.currentMenu = 'sub';
  } else if (ussdState.currentMenu === 'sub') {
    resetUssdMenu();
  }
}

function dispatchSimulatedSms(message) {
  const container = document.getElementById('simulatedSmsList');
  if (!container) return;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const smsCard = document.createElement('div');
  smsCard.className = 'sms-card';
  smsCard.innerHTML = `
    <span class="sms-sender">CAMPUSCASH ALERTS:</span>
    <p class="sms-text">${message}</p>
    <span class="sms-time">${now}</span>
  `;
  container.prepend(smsCard);
  showToast('New simulated SMS received on phone!', 'info');
}

// ================= CAMPUSAI FINANCIAL ADVISOR =================
function initAiAdvisor() {
  const sendBtn = document.getElementById('sendAiChatBtn');
  const inputEl = document.getElementById('aiChatInput');
  const clearBtn = document.getElementById('clearChatBtn');

  if (sendBtn && inputEl) {
    sendBtn.addEventListener('click', () => handleAiUserQuery());
    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAiUserQuery();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const area = document.getElementById('chatMessagesArea');
      if (area) {
        area.innerHTML = `
          <div class="chat-message bot-msg">
            <div class="msg-avatar"><img src="logo.jpg" alt="Bot" /></div>
            <div class="msg-bubble">
              <p>Chat cleared! How can I help you manage your student funds today? 🎓</p>
            </div>
          </div>
        `;
      }
    });
  }
}

function askAiPrompt(query) {
  switchTab('ai-advisor');
  sendQuickAiQuery(query);
}

function sendQuickAiQuery(query) {
  const inputEl = document.getElementById('aiChatInput');
  if (inputEl) {
    inputEl.value = query;
    handleAiUserQuery();
  }
}

function handleAiUserQuery() {
  const inputEl = document.getElementById('aiChatInput');
  const area = document.getElementById('chatMessagesArea');
  if (!inputEl || !area) return;

  const query = inputEl.value.trim();
  if (!query) return;
  inputEl.value = '';

  // Render User Message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user-msg';
  userMsg.innerHTML = `
    <div class="msg-bubble"><p>${escapeHtml(query)}</p></div>
  `;
  area.appendChild(userMsg);
  area.scrollTop = area.scrollHeight;

  // Bot Thinking placeholder
  const botMsg = document.createElement('div');
  botMsg.className = 'chat-message bot-msg';
  botMsg.innerHTML = `
    <div class="msg-avatar"><img src="logo.jpg" alt="Bot" /></div>
    <div class="msg-bubble"><p><i class="fa-solid fa-spinner fa-spin"></i> Analyzing student budget & campus guidelines...</p></div>
  `;
  area.appendChild(botMsg);
  area.scrollTop = area.scrollHeight;

  // Generate intelligent response based on student context
  setTimeout(() => {
    const reply = generateAiResponse(query);
    botMsg.querySelector('.msg-bubble').innerHTML = reply;
    area.scrollTop = area.scrollHeight;
  }, 750);
}

function generateAiResponse(q) {
  const query = q.toLowerCase();
  const totalBal = state.wallets.reduce((acc, w) => acc + Number(w.balance), 0);
  const daysLeft = state.semester.daysRemaining || 84;
  const safeDaily = Math.round(totalBal / daysLeft);

  if (query.includes('side hustle') || query.includes('gig') || query.includes('earn') || query.includes('job')) {
    return `
      <p>💡 <strong>Top 4 High-Demand Campus Side-Hustles for Kenyan University Students:</strong></p>
      <ul>
        <li><strong>Academic & CV Typing / LaTeX Formatting:</strong> Charge KES 30–50 per page for final year projects.</li>
        <li><strong>Late-Night Hostel Snack & Beverage Stash:</strong> Stock Indomie, biscuits, coffee sachets for exam revision hours (30-40% profit margin).</li>
        <li><strong>Campus Tech Support & Software Installation:</strong> OS installations, SSD upgrades, and troubleshooting for coursemates (KES 500–1,500/gig).</li>
        <li><strong>Event Photography & Social Media Reels:</strong> Cover student club elections, sports matches, and birthday dinners.</li>
      </ul>
      <p><em>Pro-Tip: Dedicate at most 8–10 hours per week so your GPA remains top tier!</em></p>
    `;
  }

  if (query.includes('mmf') || query.includes('invest') || query.includes('money market') || query.includes('save')) {
    return `
      <p>📈 <strong>Student Guide to Money Market Funds (MMFs) in Kenya:</strong></p>
      <p>An MMF is the best vehicle for your semester upkeep and emergency fund because it offers <strong>high liquidity</strong> (withdraw to M-Pesa in 24-48h) and pays <strong>12%–16% p.a. compound interest</strong>.</p>
      <ul>
        <li><strong>Popular Student-Friendly Funds:</strong> Sanlam, CIC, Britam, Etica, NCBA, Apollo.</li>
        <li><strong>Minimum entry:</strong> Many start at just <strong>KES 100 to KES 1,000</strong>.</li>
        <li><strong>Why not just keep it in M-Pesa?</strong> M-Pesa makes money too easy to impulse spend, and earns 0% interest.</li>
      </ul>
    `;
  }

  if (query.includes('meal') || query.includes('cooking') || query.includes('food') || query.includes('1500') || query.includes('hostel')) {
    return `
      <p>🍲 <strong>Survival Meal Strategy (Under KES 1,500/week):</strong></p>
      <ol>
        <li><strong>Buy Bulk Dry Foods:</strong> 2kg rice (KES 380), 1kg lentils/ndengu (KES 220), 1 packet maize flour (KES 140).</li>
        <li><strong>Veggies & Sukuma Wiki:</strong> Buy in small batches from local mama mboga (KES 150/week).</li>
        <li><strong>Eggs & Milk:</strong> 1 crate shared among roommates brings cost per egg down to KES 14.</li>
        <li><strong>Mess Lunch:</strong> Eat subsidised student mess lunch (KES 70–100) instead of off-campus fast food (KES 350+).</li>
      </ol>
      <p>This strategy saves you approximately <strong>KES 4,500 each month</strong>!</p>
    `;
  }

  if (query.includes('afford') || query.includes('2500') || query.includes('outing') || query.includes('party') || query.includes('trip')) {
    const pctOfBal = Math.round((2500 / totalBal) * 100);
    return `
      <p>🤔 <strong>Affordability Assessment:</strong></p>
      <p>Spending <strong>KES 2,500</strong> represents <strong>${pctOfBal}%</strong> of your remaining liquid funds (KES ${formatNumber(totalBal)}).</p>
      <p>Your safe daily allowance is currently <strong>KES ${safeDaily}/day</strong>. A KES 2,500 outing burns <strong>~8 days worth of daily living budget</strong>!</p>
      <p><strong>Recommendation:</strong> Cap your outing at <strong>KES 800–1,000</strong> or take on a quick weekend freelancing task to cover the extra fun!</p>
    `;
  }

  return `
    <p>🎓 <strong>CampusCash AI Advice:</strong></p>
    <p>Based on your current numbers: You have <strong>KES ${formatNumber(totalBal)}</strong> available across all wallets with <strong>${daysLeft} days</strong> remaining in the semester.</p>
    <p>Recommended rule of thumb:</p>
    <ul>
      <li>Set aside your fixed hostel rent and exam handout costs first.</li>
      <li>Keep daily disposable spending strictly below <strong>KES ${safeDaily}</strong>.</li>
      <li>If unexpected expenses arise, check our USSD offline dialer or side-hustle directory!</li>
    </ul>
  `;
}

// ================= EXPORT TO CSV / EXCEL =================
function exportToCsv() {
  const transactions = state.transactions;
  if (!transactions || transactions.length === 0) {
    showToast('No transactions available to export.', 'warning');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'ID,Title,Type,Category,Payment Method,Amount (KES),Date & Time\n';

  transactions.forEach(t => {
    const row = [
      `"${t.id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      `"${t.wallet}"`,
      `"${t.amount}"`,
      `"${t.date}"`
    ].join(',');
    csvContent += row + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `CampusCash_Semester_Report_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Exported report as CSV successfully!', 'success');
}

// ================= MODAL & TOAST HELPERS =================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconMap = {
    success: 'fa-circle-check text-emerald',
    warning: 'fa-triangle-exclamation text-amber',
    error: 'fa-circle-xmark text-rose',
    info: 'fa-circle-info text-blue'
  };

  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || 'fa-info'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Formatting utilities
function formatMoney(amount) {
  return `KES ${Number(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNumber(amount) {
  return Number(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
