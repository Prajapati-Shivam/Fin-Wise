import { create } from 'zustand';
import { db } from '@/db';
import { desc, eq, sql, getTableColumns } from 'drizzle-orm';
import { Expenses, Incomes, Budgets } from '@/db/schema';

const useFinanceStore = create((set) => ({
  // States for income and expense lists
  budgetList: [],
  incomeList: [],
  expenseList: [],
  loading: false,
  error: null,

  // Fetch budget list from the database
  fetchBudgetList: async (userEmail) => {
    if (!userEmail) return;

    set({ loading: true, error: null });
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(CAST(${Expenses.amount} as NUMERIC))`.mapWith(
            Number
          ),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, userEmail))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));
      set({ budgetList: result, loading: false });
    } catch (error) {
      console.error('Error fetching budget list:', error);
      set({ error: 'Failed to fetch budget list', loading: false });
    }
  },

  // Set budget list manually
  setBudgetList: (newBudgetList) => set({ budgetList: newBudgetList }),

  // Fetch income list
  fetchIncomeList: async (userEmail) => {
    if (!userEmail) return;

    set({ loading: true, error: null });
    try {
      const result = await db
        .select(getTableColumns(Incomes))
        .from(Incomes)
        .where(eq(Incomes.createdBy, userEmail))
        .orderBy(desc(Incomes.id));
      set({ incomeList: result, loading: false });
    } catch (error) {
      console.error('Error fetching income list:', error);
      set({ error: 'Failed to fetch income list', loading: false });
    }
  },

  // Fetch expense list
  fetchExpenseList: async (userEmail) => {
    if (!userEmail) return;

    set({ loading: true, error: null });
    try {
      const result = await db
        .select(getTableColumns(Expenses))
        .from(Expenses)
        .where(eq(Expenses.createdBy, userEmail))
        .orderBy(desc(Expenses.id));
      set({ expenseList: result, loading: false });
    } catch (error) {
      console.error('Error fetching expense list:', error);
      set({ error: 'Failed to fetch expense list', loading: false });
    }
  },

  // Set income list manually
  setIncomeList: (newIncomeList) => set({ incomeList: newIncomeList }),

  // Set expense list manually
  setExpenseList: (newExpenseList) => set({ expenseList: newExpenseList }),
}));

export default useFinanceStore;
