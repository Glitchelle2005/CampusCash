(function () {
  const toGoal = function (row) {
    const category = row.category || 'General';
    const icons = {
      'Hostel & Rent': 'fa-house-user',
      'Academics & Books': 'fa-book-open',
      'Tech & Laptop': 'fa-laptop',
      'Emergency Cushion': 'fa-shield-heart',
      'Graduation / Trips': 'fa-graduation-cap'
    };
    return {
      id: row.id,
      name: row.goal_name,
      target: Number(row.target_amount),
      saved: Number(row.current_amount),
      deadline: row.deadline || '',
      category,
      icon: icons[category] || 'fa-bullseye'
    };
  };

  const toTransaction = function (row) {
    return {
      id: row.id,
      title: row.description,
      type: row.type,
      amount: Number(row.amount),
      category: row.category,
      wallet: row.payment_method,
      date: row.transaction_date
    };
  };

  document.addEventListener('DOMContentLoaded', async function () {
    const message = document.getElementById('dashboardLoading');
    const showError = function (text) {
      if (message) {
        message.textContent = text;
        message.classList.add('dashboard-loading-error');
      }
    };
    try {
      const storage = localStorage.getItem('campuscash_session_storage') || 'localStorage';
      const client = window.createCampusCashClient(storage);
      window.campusCashSupabase = client;
      const { data: { user }, error: userError } = await client.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        window.location.replace('login.html');
        return;
      }

      const [profileResult, transactionResult, goalResult, budgetResult] = await Promise.all([
        client.from('profiles').select('full_name,email').eq('id', user.id).single(),
        client.from('transactions').select('*').eq('user_id', user.id).order('transaction_date', { ascending: false }),
        client.from('savings_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        client.from('budgets').select('*').eq('user_id', user.id).order('category')
      ]);
      if (profileResult.error) throw profileResult.error;
      if (transactionResult.error) throw transactionResult.error;
      if (goalResult.error) throw goalResult.error;
      if (budgetResult.error) throw budgetResult.error;

      window.CampusCash = {
        client,
        user,
        profile: profileResult.data,
        transactions: transactionResult.data.map(toTransaction),
        goals: goalResult.data.map(toGoal),
        budgets: budgetResult.data,
        async saveTransaction(transaction) {
          const record = {
            user_id: user.id,
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.title.trim(),
            payment_method: transaction.wallet || 'Other',
            transaction_date: new Date(transaction.date).toISOString()
          };
          const query = transaction.id && !transaction.id.startsWith('tx-')
            ? client.from('transactions').update(record).eq('id', transaction.id).eq('user_id', user.id).select().single()
            : client.from('transactions').insert(record).select().single();
          const { data, error } = await query;
          if (error) throw error;
          return toTransaction(data);
        },
        async deleteTransaction(id) {
          const { error } = await client.from('transactions').delete().eq('id', id).eq('user_id', user.id);
          if (error) throw error;
        },
        async saveGoal(goal) {
          const record = {
            user_id: user.id,
            goal_name: goal.name.trim(),
            category: goal.category,
            target_amount: goal.target,
            current_amount: goal.saved,
            deadline: goal.deadline || null
          };
          const { data, error } = await client.from('savings_goals').insert(record).select().single();
          if (error) throw error;
          return toGoal({ ...data, category: goal.category });
        },
        async updateGoal(goal) {
          const { data, error } = await client.from('savings_goals')
            .update({ current_amount: goal.saved })
            .eq('id', goal.id)
            .eq('user_id', user.id)
            .select()
            .single();
          if (error) throw error;
          return toGoal({ ...data, category: goal.category });
        },
        async saveBudget(budget) {
          const record = {
            user_id: user.id,
            category: budget.category,
            budget_amount: budget.amount,
            period: budget.period
          };
          const query = budget.id
            ? client.from('budgets').update(record).eq('id', budget.id).eq('user_id', user.id).select().single()
            : client.from('budgets').upsert(record, { onConflict: 'user_id,category,period' }).select().single();
          const { data, error } = await query;
          if (error) throw error;
          return data;
        },
        async deleteBudget(id) {
          const { error } = await client.from('budgets').delete().eq('id', id).eq('user_id', user.id);
          if (error) throw error;
        }
      };

      const name = profileResult.data.full_name || user.email;
      document.querySelectorAll('[data-user-name]').forEach(element => element.textContent = name);
      const avatar = document.getElementById('userAvatar');
      if (avatar) avatar.textContent = name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
      const reportStudent = document.getElementById('reportStudentName');
      if (reportStudent) reportStudent.textContent = name;

      document.getElementById('logoutBtn')?.addEventListener('click', async function () {
        this.disabled = true;
        const { error } = await client.auth.signOut();
        if (error) {
          this.disabled = false;
          window.alert(`Could not log out: ${error.message}`);
          return;
        }
        localStorage.removeItem('campuscash_session_storage');
        window.location.replace('login.html');
      });

      client.auth.onAuthStateChange(function (event) {
        if (event === 'SIGNED_OUT') window.location.replace('login.html');
      });

      if (message) message.remove();
      window.dispatchEvent(new CustomEvent('campuscash:ready'));
    } catch (error) {
      showError(`CampusCash could not load your account data: ${error.message} Check the Supabase setup and schema, then reload.`);
    }
  });
})();
