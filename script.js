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
  goals: [],
  budgets: [],
  transactions: [],
  notifications: []
};

// 10 Curated Academic Mascot Characters
const MASCOTS = [
  {
    name: 'Ollie the Scholar Owl',
    role: 'Chief Wisdom & Budget Guide',
    avatar: 'logo.jpg',
    icon: '🦉',
    tip: 'Track your spending regularly and keep your semester goals in view.',
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
    tip: 'Beep boop! Your current totals are calculated from the transactions you record.',
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
    tip: 'Build your savings goal step by step and celebrate the progress you make.',
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

// The dashboard initializes only after the authenticated user's data is loaded.
let state = JSON.parse(JSON.stringify(DEFAULT_STATE));

// USSD State Machine
let ussdState = {
  currentMenu: 'main', // 'main', 'expense_amt', 'expense_cat', 'goal_view', 'statement', 'advice'
  tempExpense: {}
};

// ================= INITIALIZATION =================
window.addEventListener('campuscash:ready', () => {
  state = loadState();
  state.transactions = window.CampusCash.transactions;
  state.goals = window.CampusCash.goals;
  state.budgets = window.CampusCash.budgets;
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
  const saved = localStorage.getItem(`campuscash_state_${window.CampusCash.user.id}`);
  if (saved) {
    try {
      return { ...JSON.parse(JSON.stringify(DEFAULT_STATE)), ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to parse saved state, using default', e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveState() {
  const { transactions, goals, budgets, ...personalPreferences } = state;
  localStorage.setItem(`campuscash_state_${window.CampusCash.user.id}`, JSON.stringify(personalPreferences));
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
    'wallets': 'Payment Methods in Your Records',
    'goals': 'Semester Financial Goals',
    'transactions': 'Income & Expenses Ledger',
    'ai-advisor': 'CampusCash Budget Guide',
    'ussd-simulator': 'Browser USSD & SMS Preview',
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
  renderBudgets();
  renderTransactions();
  renderCategoryBreakdown();
  renderReport();
  drawIncomeExpenseChart();
}

function renderMetrics() {
  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const totalBalance = totalIncome - totalExpenses;

  // Safe daily allowance
  const daysLeft = state.semester.daysRemaining || 84;
  const safeDaily = daysLeft > 0 ? (Math.max(totalBalance, 0) / daysLeft) : 0;

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
  const methods = [...new Set(state.transactions.map(transaction => transaction.wallet || 'Other'))]
    .map(name => ({
      name,
      balance: state.transactions
        .filter(transaction => (transaction.wallet || 'Other') === name)
        .reduce((balance, transaction) => balance + (transaction.type === 'income' ? 1 : -1) * Number(transaction.amount), 0)
    }));
  // Overview wallets grid
  const overviewGrid = document.getElementById('walletsOverviewGrid');
  if (overviewGrid) {
    overviewGrid.innerHTML = methods.length ? methods.map(method => `
      <div class="wallet-pill-card">
        <div class="wallet-top">
          <div class="wallet-brand">
            <span class="brand-tag bank-tag">${escapeHtml(method.name)}</span>
            <span class="account-num">Manually recorded</span>
          </div>
          <i class="fa-solid fa-money-bill-transfer"></i>
        </div>
        <div class="wallet-balance">
          <span class="curr">KES</span>
          <span class="amt">${formatNumber(method.balance)}</span>
        </div>
        <div class="wallet-bottom">
          <span class="sync-time">Net from your recorded transactions</span>
        </div>
      </div>
    `).join('') : '<p class="text-muted p-3">Payment methods from your transactions will appear here. CampusCash does not connect to external accounts.</p>';
  }

  const detailedGrid = document.getElementById('walletsDetailedGrid');
  if (detailedGrid) {
    detailedGrid.innerHTML = methods.length ? methods.map(method => `
      <div class="dash-card">
        <div class="card-header">
          <div class="card-title-group">
            <span class="brand-tag bank-tag" style="font-size:0.85rem; padding:0.3rem 0.6rem;">${escapeHtml(method.name)}</span>
          </div>
          <span class="badge-tag">Manual tracking</span>
        </div>
        <div class="wallet-balance my-3">
          <span class="curr" style="font-size:1rem;">KES</span>
          <span class="amt" style="font-size:2rem;">${formatNumber(method.balance)}</span>
        </div>
        <p class="text-sm text-muted mb-3">Net total of your saved income and expenses tagged with this payment method. No account is linked or synced.</p>
      </div>
    `).join('') : '<div class="dash-card text-muted">No payment methods recorded yet. Add a transaction to begin.</div>';
  }
}

function renderGoals() {
  const totalTarget = state.goals.reduce((acc, g) => acc + Number(g.target), 0);
  const totalSaved = state.goals.reduce((acc, g) => acc + Number(g.saved), 0);

  const targetEl = document.getElementById('goalsTotalTarget');
  const savedEl = document.getElementById('goalsTotalSaved');
  if (targetEl) targetEl.textContent = formatMoney(totalTarget);
  if (savedEl) savedEl.textContent = formatMoney(totalSaved);
  const nearest = state.goals
    .filter(goal => goal.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
  const nearestEl = document.getElementById('goalsNearestDeadline');
  if (nearestEl) nearestEl.textContent = nearest ? nearest.name : 'No deadline';
  const nearestDaysEl = nearestEl?.parentElement?.querySelector('.metric-sublabel');
  if (nearestDaysEl) {
    nearestDaysEl.textContent = nearest
      ? `Due ${new Date(`${nearest.deadline}T00:00:00`).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}`
      : 'Add a deadline to a savings goal';
  }

  // Spotlight on dashboard
  const spotlight = document.getElementById('goalsSpotlightList');
  if (spotlight) {
    spotlight.innerHTML = state.goals.length ? state.goals.slice(0, 3).map(g => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `
        <div class="goal-mini-card">
          <div class="goal-mini-header">
            <span class="goal-mini-title"><i class="fa-solid ${g.icon} text-blue"></i> ${escapeHtml(g.name)}</span>
            <span class="goal-mini-deadline">Due: ${escapeHtml(g.deadline)}</span>
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
    }).join('') : '<p class="text-sm text-muted">Create a savings goal to see your progress here.</p>';
  }

  // Full Goals Grid
  const fullGrid = document.getElementById('goalsFullGrid');
  if (fullGrid) {
    fullGrid.innerHTML = state.goals.length ? state.goals.map(g => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      const isComplete = pct >= 100;
      return `
        <div class="goal-card">
          <div class="goal-card-header">
            <div>
              <div class="goal-icon-badge"><i class="fa-solid ${g.icon}"></i></div>
              <h3>${escapeHtml(g.name)}</h3>
                  <span class="badge-pill mt-1">${escapeHtml(g.category)}</span>
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
            <span class="text-sm text-muted"><i class="fa-regular fa-clock"></i> Target Date: ${escapeHtml(g.deadline)}</span>
            <button class="btn-primary btn-sm" onclick="openAllocateMoneyModal('${g.id}')">
              <i class="fa-solid fa-plus"></i> Add Money
            </button>
          </div>
        </div>
      `;
    }).join('') : '<p class="text-muted">No savings goals yet. Create one to start tracking a target.</p>';
  }
}

function renderBudgets() {
  const container = document.getElementById('budgetList');
  if (!container) return;
  if (!state.budgets.length) {
    container.innerHTML = '<p class="text-muted p-3">No category budgets yet. Add one to start comparing your plan with recorded expenses.</p>';
    return;
  }
  const periodStart = period => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    if (period === 'weekly') start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    else if (period === 'monthly') start.setDate(1);
    else return null;
    return start;
  };
  container.innerHTML = state.budgets.map(budget => {
    const start = periodStart(budget.period);
    const spent = state.transactions
      .filter(transaction => transaction.type === 'expense' &&
        transaction.category === budget.category &&
        (!start || new Date(transaction.date) >= start))
      .reduce((total, transaction) => total + Number(transaction.amount), 0);
    const percentage = Math.min(100, Math.round((spent / Number(budget.budget_amount)) * 100));
    const periodLabel = budget.period === 'weekly' ? 'This week' : budget.period === 'monthly' ? 'This month' : 'Recorded to date';
    return `
      <article class="budget-row">
        <div class="budget-row-title"><strong>${escapeHtml(budget.category)}</strong><span>${periodLabel}</span></div>
        <div class="budget-progress"><div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${percentage}%;"></div></div><small>${formatMoney(spent)} / ${formatMoney(budget.budget_amount)}</small></div>
        <div class="budget-row-actions">
          <button type="button" class="btn-icon-sm" onclick="editBudget('${budget.id}')" aria-label="Edit ${escapeHtml(budget.category)} budget"><i class="fa-solid fa-pen"></i></button>
          <button type="button" class="btn-icon-sm" onclick="deleteBudget('${budget.id}')" aria-label="Delete ${escapeHtml(budget.category)} budget"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </article>
    `;
  }).join('');
}

function openBudgetModal(budget) {
  const form = document.getElementById('budgetForm');
  form.reset();
  document.getElementById('budgetId').value = budget?.id || '';
  document.getElementById('budgetCategory').value = budget?.category || 'Food & Mess';
  document.getElementById('budgetAmount').value = budget?.budget_amount || '';
  document.getElementById('budgetPeriod').value = budget?.period || 'monthly';
  document.getElementById('budgetModalTitle').textContent = budget ? 'Edit Category Budget' : 'Set Category Budget';
  openModal('budgetModal');
}

function editBudget(id) {
  const budget = state.budgets.find(item => item.id === id);
  if (budget) openBudgetModal(budget);
}

async function saveBudget(event) {
  event.preventDefault();
  const category = document.getElementById('budgetCategory').value;
  const amount = Number(document.getElementById('budgetAmount').value);
  const period = document.getElementById('budgetPeriod').value;
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast('Enter a budget amount greater than zero.', 'error');
    return;
  }
  const submit = document.querySelector('#budgetForm [type="submit"]');
  const originalLabel = submit.textContent;
  submit.disabled = true;
  submit.textContent = 'Saving…';
  try {
    const id = document.getElementById('budgetId').value;
    const saved = await window.CampusCash.saveBudget({ id, category, amount, period });
    state.budgets = state.budgets.filter(item => item.id !== saved.id && !(item.category === saved.category && item.period === saved.period));
    state.budgets.push(saved);
    saveState();
    closeModal('budgetModal');
    showToast('Budget saved.', 'success');
  } catch (error) {
    showToast(`Budget was not saved: ${error.message}`, 'error');
  } finally {
    submit.disabled = false;
    submit.textContent = originalLabel;
  }
}

async function deleteBudget(id) {
  const budget = state.budgets.find(item => item.id === id);
  if (!budget || !confirm(`Delete the ${budget.category} budget?`)) return;
  try {
    await window.CampusCash.deleteBudget(id);
    state.budgets = state.budgets.filter(item => item.id !== id);
    saveState();
    showToast('Budget deleted.', 'info');
  } catch (error) {
    showToast(`Budget was not deleted: ${error.message}`, 'error');
  }
}

function renderTransactions() {
  const recentTable = document.getElementById('recentTransactionsTableBody');
  const allTable = document.getElementById('allTransactionsTableBody');

  const sortedTx = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentTransactions = sortedTx.slice(0, 5);

  // Dashboard Recent 5
  if (recentTable) {
    recentTable.innerHTML = recentTransactions.length ? recentTransactions.map(tx => `
      <tr>
        <td>
          <div class="tx-icon-pill">
            <i class="fa-solid ${tx.type === 'income' ? 'fa-arrow-down text-emerald' : 'fa-arrow-up text-rose'}"></i>
            <span>${escapeHtml(tx.title)}</span>
          </div>
        </td>
        <td><span class="badge-pill">${escapeHtml(tx.wallet || 'Other')}</span></td>
        <td><span class="badge-pill">${escapeHtml(tx.category)}</span></td>
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
    `).join('') : '<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No transactions yet. Add your first income or expense to see it here.</td></tr>';
  }

  // All Transactions with Filters
  if (allTable) {
    const searchVal = (document.getElementById('txSearchInput')?.value || '').toLowerCase();
    const typeVal = document.getElementById('txTypeFilter')?.value || 'all';
    const catVal = document.getElementById('txCategoryFilter')?.value || 'all';
    const wallVal = document.getElementById('txWalletFilter')?.value || 'all';
    const fromDate = document.getElementById('txDateFromFilter')?.value || '';
    const toDate = document.getElementById('txDateToFilter')?.value || '';

    const filtered = sortedTx.filter(tx => {
      const matchesSearch = tx.title.toLowerCase().includes(searchVal) || tx.category.toLowerCase().includes(searchVal);
      const matchesType = typeVal === 'all' || tx.type === typeVal;
      const matchesCat = catVal === 'all' || tx.category === catVal;
      const matchesWall = wallVal === 'all' || tx.wallet === wallVal;
      const localDate = new Date(tx.date);
      const txDay = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      const matchesDate = (!fromDate || txDay >= fromDate) && (!toDate || txDay <= toDate);
      return matchesSearch && matchesType && matchesCat && matchesWall && matchesDate;
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
              <div class="text-bold">${escapeHtml(tx.title)}</div>
            </div>
          </div>
        </td>
        <td><span class="badge-tag ${tx.type === 'income' ? 'tag-income' : 'tag-expense'}">${tx.type.toUpperCase()}</span></td>
        <td><span class="badge-pill">${escapeHtml(tx.category)}</span></td>
        <td><strong>${escapeHtml(tx.wallet || 'Other')}</strong></td>
        <td class="text-muted text-sm">${formatDateTime(tx.date)}</td>
        <td class="text-right text-bold ${tx.type === 'income' ? 'text-emerald' : 'text-rose'}">
          ${tx.type === 'income' ? '+' : '-'}${formatMoney(tx.amount)}
        </td>
        <td class="text-center">
          <button class="btn-icon-sm" onclick="editTransaction('${tx.id}')" title="Edit">
            <i class="fa-solid fa-pen"></i>
          </button>
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
        <span>${escapeHtml(cat.name)}</span>
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
  const netReserves = grossIncome - grossExpense;

  const repInc = document.getElementById('repGrossIncome');
  const repExp = document.getElementById('repGrossExpense');
  const repNet = document.getElementById('repNetReserves');
  if (repInc) repInc.textContent = formatMoney(grossIncome);
  if (repExp) repExp.textContent = formatMoney(grossExpense);
  if (repNet) repNet.textContent = formatMoney(netReserves);
  const dateStamp = document.getElementById('reportDateStamp');
  if (dateStamp) dateStamp.textContent = new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });

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
          <td><strong>${escapeHtml(cat)}</strong></td>
          <td>${data.count} txns</td>
          <td>${formatMoney(data.sum)}</td>
          <td>${pct}%</td>
          <td><span class="badge-tag ${pct > 40 ? 'status-warning' : 'tag-income'}">${pct > 40 ? 'Large share' : 'Smaller share'}</span></td>
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
  ['txSearchInput', 'txTypeFilter', 'txCategoryFilter', 'txWalletFilter', 'txDateFromFilter', 'txDateToFilter'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', renderTransactions);
    document.getElementById(id)?.addEventListener('change', renderTransactions);
  });

}

function openNewTxModal() {
  document.getElementById('newTxForm')?.reset();
  document.getElementById('txId').value = '';
  document.getElementById('txModalTitle').innerHTML = '<i class="fa-solid fa-receipt text-blue"></i> Log Transaction';
  document.querySelector('#newTxForm [type="submit"]').textContent = 'Save Transaction';
  const dateInput = document.getElementById('txDate');
  if (dateInput) {
    dateInput.value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  updateCategoryOptions();
  openModal('txModal');
}

function editTransaction(id) {
  const transaction = state.transactions.find(item => item.id === id);
  if (!transaction) return;
  document.getElementById('txId').value = transaction.id;
  document.getElementById('txType').value = transaction.type;
  document.getElementById('txAmount').value = transaction.amount;
  document.getElementById('txTitle').value = transaction.title;
  document.getElementById('txWallet').value = transaction.wallet || 'Other';
  const date = new Date(transaction.date);
  document.getElementById('txDate').value = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  updateCategoryOptions();
  document.getElementById('txCategory').value = transaction.category;
  document.getElementById('txModalTitle').innerHTML = '<i class="fa-solid fa-pen text-blue"></i> Edit Transaction';
  document.querySelector('#newTxForm [type="submit"]').textContent = 'Save Changes';
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

async function handleTransactionSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('txType').value;
  const amount = parseFloat(document.getElementById('txAmount').value);
  const title = document.getElementById('txTitle').value.trim();
  const category = document.getElementById('txCategory').value;
  const wallet = document.getElementById('txWallet').value;
  const date = document.getElementById('txDate').value;

  if (!title || !Number.isFinite(amount) || amount <= 0) {
    showToast('Please enter a valid title and amount.', 'error');
    return;
  }

  const existingId = document.getElementById('txId').value;
  const newTx = {
    id: existingId || `tx-${Date.now()}`,
    title,
    type,
    amount,
    category,
    wallet,
    date: date || new Date().toISOString()
  };

  const submitButton = document.querySelector('#newTxForm [type="submit"]');
  const originalLabel = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Saving…';
  try {
    const savedTransaction = await window.CampusCash.saveTransaction(newTx);
    state.transactions = state.transactions.filter(tx => tx.id !== savedTransaction.id);
    state.transactions.unshift(savedTransaction);
    saveState();
    closeModal('txModal');
    document.getElementById('newTxForm').reset();
    showToast(`Transaction "${title}" ${existingId ? 'updated' : 'added'} successfully!`, 'success');
  } catch (error) {
    showToast(`Transaction was not saved: ${error.message}`, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
}

async function deleteTransaction(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;

  if (confirm(`Delete transaction "${tx.title}" (KES ${tx.amount})?`)) {
    try {
      await window.CampusCash.deleteTransaction(id);
      state.transactions = state.transactions.filter(t => t.id !== id);
      saveState();
      showToast('Transaction deleted.', 'info');
    } catch (error) {
      showToast(`Transaction was not deleted: ${error.message}`, 'error');
    }
  }
}

// Goal Management
function openNewGoalModal() {
  openModal('goalModal');
}

async function handleGoalSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('goalName').value.trim();
  const target = parseFloat(document.getElementById('goalTarget').value);
  const current = parseFloat(document.getElementById('goalCurrent').value) || 0;
  const category = document.getElementById('goalCategory').value;
  const deadline = document.getElementById('goalDeadline').value;

  if (!name || name.length > 120 || !Number.isFinite(target) || target <= 0 || current < 0 || current > target) {
    showToast('Enter a goal name, a positive target, and a saved amount no greater than the target.', 'error');
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
    name,
    target,
    saved: current,
    category,
    deadline,
    icon: iconMap[category] || 'fa-bullseye'
  };

  const submitButton = document.querySelector('#newGoalForm [type="submit"]');
  const originalLabel = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Saving…';
  try {
    state.goals.push(await window.CampusCash.saveGoal(newGoal));
    saveState();
    closeModal('goalModal');
    document.getElementById('newGoalForm').reset();
    showToast(`Goal "${name}" created!`, 'success');
  } catch (error) {
    showToast(`Goal was not saved: ${error.message}`, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
}

function openAllocateMoneyModal(goalId) {
  const goal = state.goals.find(g => g.id === goalId);
  if (!goal) return;

  document.getElementById('allocateGoalId').value = goalId;
  document.getElementById('allocateGoalTitle').innerHTML = `Depositing to: <span class="text-blue">${escapeHtml(goal.name)}</span><br/><small class="text-muted">Target: ${formatMoney(goal.target)} • Current: ${formatMoney(goal.saved)}</small>`;
  
  openModal('allocateGoalModal');
}

async function handleAllocateGoal(e) {
  e.preventDefault();
  const goalId = document.getElementById('allocateGoalId').value;
  const amount = parseFloat(document.getElementById('allocateAmount').value);
  const goal = state.goals.find(g => g.id === goalId);

  if (!goal || isNaN(amount) || amount <= 0) {
    showToast('Invalid allocation amount.', 'error');
    return;
  }

  if (goal.saved + amount > goal.target) {
    showToast('That deposit would exceed the goal target.', 'error');
    return;
  }
  const updatedGoal = { ...goal, saved: goal.saved + amount };
  const submitButton = document.querySelector('#allocateGoalForm [type="submit"]');
  const originalLabel = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Saving…';
  try {
    const savedGoal = await window.CampusCash.updateGoal(updatedGoal);
    state.goals = state.goals.map(item => item.id === goalId ? savedGoal : item);
    saveState();
    closeModal('allocateGoalModal');
    document.getElementById('allocateGoalForm').reset();
    showToast(`KES ${amount} added to ${goal.name}'s savings goal.`, 'success');
  } catch (error) {
    showToast(`Savings progress was not updated: ${error.message}`, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
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
  showToast(`Opened the browser-based USSD simulator for ${code}.`, 'info');
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
      Welcome to CampusCash!<br/>
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

async function handleUssdInput() {
  const inputEl = document.getElementById('ussdUserInput');
  const displayEl = document.getElementById('ussdDisplayText');
  if (!inputEl || !displayEl) return;

  const val = inputEl.value.trim();
  inputEl.value = '';

  if (ussdState.currentMenu === 'main') {
    switch (val) {
      case '1': {
        const totalBal = state.transactions.reduce((balance, transaction) =>
          balance + (transaction.type === 'income' ? 1 : -1) * Number(transaction.amount), 0);
        const daily = Math.round(Math.max(totalBal, 0) / (state.semester.daysRemaining || 84));
        displayEl.innerHTML = `
          <strong>CampusCash Balance Check</strong><br/>
          Total Balance: KES ${formatNumber(totalBal)}<br/>
          Example ${state.semester.daysRemaining}-day estimate: KES ${daily}/day<br/>
          This is based on your recorded transactions, not a live balance.<br/><br/>
          0. Back to Main Menu
        `;
        ussdState.currentMenu = 'sub';
        break;
      }
      case '2': {
        let goalsTxt = state.goals.map((g, i) => `${i+1}. ${escapeHtml(g.name)}: KES ${g.saved}/${g.target}`).join('<br/>');
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
        dispatchSimulatedSms("Sample budget reminder. No text message is sent by this browser-based simulator.");
        displayEl.innerHTML = `
          <strong>Sample Budget Tip</strong><br/>
          This is a local simulator preview. No SMS has been sent.<br/><br/>
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
    const cat = catMap[val];
    if (!cat) {
      displayEl.innerHTML = `Choose 1, 2, 3 or 4, or enter 0 to cancel.`;
      return;
    }
    const amt = ussdState.tempExpense.amount;

    const newTx = {
      id: `tx-${Date.now()}`,
      title: `USSD Logged: ${cat}`,
      type: 'expense',
      amount: amt,
      category: cat,
      wallet: 'M-Pesa',
      date: new Date().toISOString()
    };

    try {
      const savedTransaction = await window.CampusCash.saveTransaction(newTx);
      state.transactions.unshift(savedTransaction);
      saveState();
      dispatchSimulatedSms(`Sample preview: KES ${amt} for ${cat} was recorded in your account. No SMS was sent.`);
      displayEl.innerHTML = `<strong>Recorded</strong><br/>KES ${amt} for ${escapeHtml(cat)} was saved to your transaction history.<br/><br/>0. Main Menu`;
      ussdState.currentMenu = 'sub';
    } catch (error) {
      showToast(`Transaction was not saved: ${error.message}`, 'error');
      displayEl.innerHTML = `Unable to save this transaction. Please try again or use the dashboard form.<br/><br/>0. Cancel`;
    }
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
    <div class="msg-bubble">    <p><i class="fa-solid fa-spinner fa-spin"></i> Preparing a general budgeting tip...</p></div>
  `;
  area.appendChild(botMsg);
  area.scrollTop = area.scrollHeight;

  // Generate a local rule-based budgeting tip.
  setTimeout(() => {
    const reply = generateAiResponse(query);
    botMsg.querySelector('.msg-bubble').innerHTML = reply;
    area.scrollTop = area.scrollHeight;
  }, 750);
}

function generateAiResponse(q) {
  const query = q.toLowerCase();
  const totalBal = state.transactions.reduce((balance, transaction) =>
    balance + (transaction.type === 'income' ? 1 : -1) * Number(transaction.amount), 0);
  const daysLeft = state.semester.daysRemaining || 84;
  const safeDaily = Math.round(Math.max(totalBal, 0) / daysLeft);

  if (query.includes('side hustle') || query.includes('gig') || query.includes('earn') || query.includes('job')) {
    return `
      <p>💡 <strong>Campus work ideas to explore:</strong></p>
      <ul>
        <li>Offer tutoring or help with approved academic formatting.</li>
        <li>Explore campus event photography or design work.</li>
        <li>Offer tech support if you have the right skills.</li>
      </ul>
      <p>Check campus rules, agree on scope and payment in advance, and balance work with your studies.</p>
    `;
  }

  if (query.includes('mmf') || query.includes('invest') || query.includes('money market') || query.includes('save')) {
    return `
      <p>📈 <strong>Compare savings products carefully:</strong></p>
      <p>Fees, access times, minimum deposits and returns vary by provider and can change. Read current product documents, check that a provider is properly regulated, and consider when you may need the money.</p>
      <p>This general budgeting guide does not recommend a specific investment or product.</p>
    `;
  }

  if (query.includes('meal') || query.includes('cooking') || query.includes('food') || query.includes('1500') || query.includes('hostel')) {
    return `
      <p>🍲 <strong>Ways to plan food spending:</strong></p>
      <ol>
        <li>Plan a few meals before shopping.</li>
        <li>Compare prices and avoid buying more perishables than you can use.</li>
        <li>Check whether your campus offers meal options that fit your budget.</li>
      </ol>
      <p>Prices and savings depend on your location and circumstances.</p>
    `;
  }

  if (query.includes('afford') || query.includes('2500') || query.includes('outing') || query.includes('party') || query.includes('trip')) {
      const pctOfBal = totalBal > 0 ? Math.round((2500 / totalBal) * 100) : null;
    return `
      <p>🤔 <strong>Affordability Assessment:</strong></p>
      <p>${pctOfBal === null ? 'Record your income and expenses to see your current ledger balance.' : `Spending <strong>KES 2,500</strong> represents <strong>${pctOfBal}%</strong> of your recorded net balance (KES ${formatNumber(totalBal)}).`}</p>
      <p>An equal daily allocation over an example ${daysLeft}-day planning period is <strong>KES ${safeDaily}/day</strong>. This estimate uses only manually recorded transactions and is not a live balance.</p>
      <p>Compare the cost with upcoming essentials and adjust your personal plan as needed.</p>
    `;
  }

  return `
    <p>🎓 <strong>CampusCash Budget Guide:</strong></p>
    <p>Your recorded income minus expenses is <strong>KES ${formatNumber(totalBal)}</strong>. This is a ledger total, not a live bank balance.</p>
    <p>Recommended rule of thumb:</p>
    <ul>
      <li>Set aside your fixed hostel rent and exam handout costs first.</li>
      <li>An example ${daysLeft}-day allocation of your recorded net total is <strong>KES ${safeDaily}/day</strong>.</li>
      <li>Review your category budgets and adjust them as your plans change.</li>
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
  const csvCell = value => {
    const text = String(value ?? '').replace(/"/g, '""');
    return `"${/^\s*[=+\-@]/.test(text) ? "'" : ''}${text}"`;
  };

  transactions.forEach(t => {
    const row = [t.id, t.title, t.type, t.category, t.wallet, t.amount, t.date].map(csvCell).join(',');
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

  toast.innerHTML = `<i class="fa-solid ${iconMap[type] || 'fa-info'}"></i><span>${escapeHtml(String(message))}</span>`;

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
