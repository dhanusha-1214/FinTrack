import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_TRANSACTIONS } from '../data/transactions';
import * as api from '../api/mockApi';

let nextId = MOCK_TRANSACTIONS.length + 1;

const EMPTY_FILTERS = { search: '', category: '', type: '', month: '', amountMin: '', amountMax: '' };

const useStore = create(
  persist(
    (set, get) => ({
      transactions: MOCK_TRANSACTIONS,
      role: 'admin',
      filters: EMPTY_FILTERS,
      sortConfig: { col: 'date', dir: -1 },
      darkMode: true,
      budgets: {},
      goals: [],
      toasts: [],

      setRole: (role) => set({ role }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Toasts
      addToast: (message, type = 'success') => {
        const id = Date.now();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),

      resetFilters: () => set({ filters: EMPTY_FILTERS }),

      setSort: (col) =>
        set((s) => ({
          sortConfig: {
            col,
            dir: s.sortConfig.col === col ? s.sortConfig.dir * -1 : -1,
          },
        })),

      // Mock API actions
      loadTransactions: async () => {
        set({ apiStatus: 'loading', apiError: null });
        try {
          const data = await api.fetchTransactions();
          set({ transactions: data, apiStatus: 'success' });
        } catch (err) {
          set({ apiStatus: 'error', apiError: err.message });
          get().addToast(err.message, 'error');
        }
      },

      loadBudgets: async () => {
        try {
          const budgets = await api.fetchBudgets();
          set({ budgets });
        } catch (_) {}
      },

      addTransaction: async (txn) => {
        set({ apiStatus: 'loading' });
        try {
          const created = await api.createTransaction({ ...txn, id: nextId++ });
          set((s) => ({
            transactions: [created, ...s.transactions],
            apiStatus: 'success',
          }));
          get().addToast('Transaction added', 'success');
        } catch (err) {
          set({ apiStatus: 'error' });
          get().addToast(err.message, 'error');
          throw err;
        }
      },

      updateTransaction: async (id, updates) => {
        set({ apiStatus: 'loading' });
        try {
          await api.patchTransaction(id, updates);
          set((s) => ({
            transactions: s.transactions.map((t) => t.id === id ? { ...t, ...updates } : t),
            apiStatus: 'success',
          }));
          get().addToast('Transaction updated', 'success');
        } catch (err) {
          set({ apiStatus: 'error' });
          get().addToast(err.message, 'error');
          throw err;
        }
      },

      deleteTransaction: async (id) => {
        const snapshot = get().transactions;
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
        try {
          await api.removeTransaction(id);
          get().addToast('Transaction deleted', 'success');
        } catch (err) {
          set({ transactions: snapshot });
          get().addToast(err.message, 'error');
        }
      },

      setBudget: (cat, amount) =>
        set((s) => ({ budgets: { ...s.budgets, [cat]: amount } })),

      // Goals actions
      addGoal: (goal) => set((s) => ({ goals: [...s.goals, { ...goal, id: Date.now(), saved: 0 }] })),
      updateGoal: (id, updates) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)) })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
      contributeToGoal: (id, amount) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g)),
        })),

      getFilteredTransactions: () => {
        const { transactions, filters, sortConfig } = get();
        const { search, category, type, month, amountMin, amountMax } = filters;
        let result = transactions.filter((t) => {
          if (search && !t.desc.toLowerCase().includes(search.toLowerCase()) &&
              !t.cat.toLowerCase().includes(search.toLowerCase())) return false;
          if (category && t.cat !== category) return false;
          if (type && t.type !== type) return false;
          if (month && !t.date.startsWith(month)) return false;
          if (amountMin && t.amount < parseFloat(amountMin)) return false;
          if (amountMax && t.amount > parseFloat(amountMax)) return false;
          return true;
        });
        result = [...result].sort((a, b) => {
          let av = a[sortConfig.col], bv = b[sortConfig.col];
          if (sortConfig.col === 'amount') {
            av = a.amount * (a.type === 'income' ? 1 : -1);
            bv = b.amount * (b.type === 'income' ? 1 : -1);
          }
          return av < bv ? -sortConfig.dir : av > bv ? sortConfig.dir : 0;
        });
        return result;
      },

      getDerivedStats: () => {
        const { transactions } = get();
        const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort().reverse();
        const curMonth = months[0] || '';
        const prevMonth = months[1] || '';

        const statsForMonth = (m) => {
          const txns = transactions.filter((t) => t.date.startsWith(m));
          const income = txns.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
          const expense = txns.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
          return { income, expense, net: income - expense };
        };

        const cur = statsForMonth(curMonth);
        const prev = statsForMonth(prevMonth);

        const totalIncome = transactions.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
        const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
        const balance = totalIncome - totalExpense;

        const expByCat = {};
        transactions.filter((t) => t.type === 'expense').forEach((t) => {
          expByCat[t.cat] = (expByCat[t.cat] || 0) + t.amount;
        });
        const topCat = Object.entries(expByCat).sort((a, b) => b[1] - a[1])[0];

        const avgTxn = transactions.length
          ? transactions.reduce((a, t) => a + t.amount, 0) / transactions.length : 0;
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
        const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

        const monthlyData = months.slice(0, 6).reverse().map((m) => {
          const s = statsForMonth(m);
          const label = new Date(m + '-01').toLocaleString('default', { month: 'short' });
          return { month: label, income: s.income, expense: s.expense, net: s.net };
        });

        const catData = Object.entries(expByCat)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }));

        // Weekly spending for bar chart (last 8 weeks)
        const now = new Date('2024-07-31');
        const weeklyData = Array.from({ length: 8 }, (_, i) => {
          const weekEnd = new Date(now);
          weekEnd.setDate(now.getDate() - i * 7);
          const weekStart = new Date(weekEnd);
          weekStart.setDate(weekEnd.getDate() - 6);
          const ws = weekStart.toISOString().slice(0, 10);
          const we = weekEnd.toISOString().slice(0, 10);
          const amt = transactions
            .filter((t) => t.type === 'expense' && t.date >= ws && t.date <= we)
            .reduce((a, t) => a + t.amount, 0);
          return { week: `W${8 - i}`, amount: amt };
        }).reverse();

        return {
          balance, totalIncome, totalExpense,
          cur, prev, curMonth, prevMonth,
          topCat, avgTxn, savingsRate, expenseRatio,
          monthlyData, catData, weeklyData,
          months, expByCat,
        };
      },
    }),
    {
      name: 'fintrack-storage',
      partialize: (s) => ({
        transactions: s.transactions,
        role: s.role,
        darkMode: s.darkMode,
        budgets: s.budgets,
        goals: s.goals,
      }),
    }
  )
);

export default useStore;
