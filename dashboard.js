(function () {
  const CURRENT_USER_KEY = 'campuscash_current_user';

  const icons = {
    'Hostel & Rent': 'fa-house-user',
    'Academics & Books': 'fa-book-open',
    'Tech & Laptop': 'fa-laptop',
    'Emergency Cushion': 'fa-shield-heart',
    'Graduation / Trips': 'fa-graduation-cap'
  };

  const toGoal = function (item) {
    const category = item.category || 'General';
    return {
      id: item.id,
      name: item.name || item.goal_name,
      target: Number(item.target || item.target_amount || 0),
      saved: Number(item.saved || item.current_amount || 0),
      deadline: item.deadline || '',
      category: category,
      icon: icons[category] || 'fa-bullseye'
    };
  };

  const toTransaction = function (item) {
    return {
      id: item.id,
      title: item.title || item.description || 'Transaction',
      type: item.type,
      amount: Number(item.amount),
      category: item.category,
      wallet: item.wallet || item.payment_method || 'Other',
      date: item.date || item.transaction_date || new Date().toISOString()
    };
  };

  document.addEventListener('DOMContentLoaded', function () {
    const loadingEl = document.getElementById('dashboardLoading');

    // 1. Check for logged-in user
    const sessionStr = sessionStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_USER_KEY);
    if (!sessionStr) {
      window.location.replace('login.html');
      return;
    }

    let user;
    try {
      user = JSON.parse(sessionStr);
    } catch (_) {
      window.location.replace('login.html');
      return;
    }

    if (!user || !user.id) {
      window.location.replace('login.html');
      return;
    }

    const txKey = `campuscash_transactions_${user.id}`;
    const goalsKey = `campuscash_goals_${user.id}`;
    const budgetsKey = `campuscash_budgets_${user.id}`;

    // 2. Load or initialize user data (Fresh empty arrays - no fake data)
    let transactions = [];
    let goals = [];
    let budgets = [];

    const isStarterId = (id) => typeof id === 'string' && (id.startsWith('tx-starter') || id.startsWith('goal-starter') || id.startsWith('b-starter'));

    const rawTx = localStorage.getItem(txKey);
    const rawGoals = localStorage.getItem(goalsKey);
    const rawBudgets = localStorage.getItem(budgetsKey);

    if (rawTx !== null) {
      try {
        transactions = JSON.parse(rawTx).filter(t => !isStarterId(t.id)).map(toTransaction);
      } catch (_) {
        transactions = [];
      }
    }
    localStorage.setItem(txKey, JSON.stringify(transactions));

    if (rawGoals !== null) {
      try {
        goals = JSON.parse(rawGoals).filter(g => !isStarterId(g.id)).map(toGoal);
      } catch (_) {
        goals = [];
      }
    }
    localStorage.setItem(goalsKey, JSON.stringify(goals));

    if (rawBudgets !== null) {
      try {
        budgets = JSON.parse(rawBudgets).filter(b => !isStarterId(b.id));
      } catch (_) {
        budgets = [];
      }
    }
    localStorage.setItem(budgetsKey, JSON.stringify(budgets));

    // 3. Mount CampusCash API for script.js
    window.CampusCash = {
      user: {
        id: user.id,
        full_name: user.fullName || user.username || 'Student',
        username: user.username
      },
      profile: {
        full_name: user.fullName || user.username || 'Student',
        username: user.username
      },
      transactions: transactions,
      goals: goals,
      budgets: budgets,

      async saveTransaction(transaction) {
        const id = (transaction.id && !transaction.id.startsWith('tx-tmp'))
          ? transaction.id
          : 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

        const record = {
          id: id,
          title: (transaction.title || transaction.description || '').trim(),
          type: transaction.type,
          amount: Number(transaction.amount),
          category: transaction.category,
          wallet: transaction.wallet || 'Other',
          date: transaction.date ? new Date(transaction.date).toISOString() : new Date().toISOString()
        };

        const existingIdx = transactions.findIndex(t => t.id === id);
        if (existingIdx >= 0) {
          transactions[existingIdx] = record;
        } else {
          transactions.unshift(record);
        }
        localStorage.setItem(txKey, JSON.stringify(transactions));
        return record;
      },

      async deleteTransaction(id) {
        transactions = transactions.filter(t => t.id !== id);
        this.transactions = transactions;
        localStorage.setItem(txKey, JSON.stringify(transactions));
      },

      async saveGoal(goal) {
        const id = goal.id || ('goal-' + Date.now() + '-' + Math.floor(Math.random() * 1000));
        const category = goal.category || 'General';
        const record = {
          id: id,
          name: (goal.name || goal.goal_name || '').trim(),
          category: category,
          target: Number(goal.target || goal.target_amount || 0),
          saved: Number(goal.saved || goal.current_amount || 0),
          deadline: goal.deadline || '',
          icon: icons[category] || 'fa-bullseye'
        };
        goals.unshift(record);
        this.goals = goals;
        localStorage.setItem(goalsKey, JSON.stringify(goals));
        return record;
      },

      async updateGoal(goal) {
        const id = goal.id;
        const targetGoal = goals.find(g => g.id === id);
        if (targetGoal) {
          targetGoal.saved = Number(goal.saved);
          if (goal.target) targetGoal.target = Number(goal.target);
          if (goal.name) targetGoal.name = goal.name;
          localStorage.setItem(goalsKey, JSON.stringify(goals));
          return targetGoal;
        }
        return goal;
      },

      async saveBudget(budget) {
        const id = budget.id || ('b-' + Date.now() + '-' + Math.floor(Math.random() * 1000));
        const record = {
          id: id,
          category: budget.category,
          budget_amount: Number(budget.amount || budget.budget_amount || 0),
          period: budget.period || 'monthly'
        };
        const idx = budgets.findIndex(b => b.id === id || (b.category === record.category && b.period === record.period));
        if (idx >= 0) {
          budgets[idx] = record;
        } else {
          budgets.push(record);
        }
        this.budgets = budgets;
        localStorage.setItem(budgetsKey, JSON.stringify(budgets));
        return record;
      },

      async deleteBudget(id) {
        budgets = budgets.filter(b => b.id !== id);
        this.budgets = budgets;
        localStorage.setItem(budgetsKey, JSON.stringify(budgets));
      },

      resetAllData() {
        transactions = [];
        goals = [];
        budgets = [];
        this.transactions = [];
        this.goals = [];
        this.budgets = [];
        localStorage.setItem(txKey, JSON.stringify([]));
        localStorage.setItem(goalsKey, JSON.stringify([]));
        localStorage.setItem(budgetsKey, JSON.stringify([]));
        localStorage.removeItem(`campuscash_state_${user.id}`);
      }
    };

    // 4. Update UI labels with the student's name
    const studentName = user.fullName || user.username || 'Student';
    document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = studentName);

    const avatar = document.getElementById('userAvatar');
    if (avatar) {
      const parts = studentName.trim().split(/\s+/);
      const initials = parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
      avatar.textContent = initials || 'CC';
    }

    const reportStudent = document.getElementById('reportStudentName');
    if (reportStudent) reportStudent.textContent = studentName;

    // 5. Reset & Logout listeners
    document.getElementById('resetDataBtn')?.addEventListener('click', function () {
      if (confirm('Start completely fresh? This will clear all transactions, goals and budgets.')) {
        window.CampusCash.resetAllData();
        window.location.reload();
      }
    });

    document.getElementById('logoutBtn')?.addEventListener('click', function () {
      this.disabled = true;
      localStorage.removeItem(CURRENT_USER_KEY);
      sessionStorage.removeItem(CURRENT_USER_KEY);
      window.location.replace('login.html');
    });

    // 6. Finish loading and signal script.js
    if (loadingEl) loadingEl.remove();
    window.dispatchEvent(new CustomEvent('campuscash:ready'));
  });
})();
