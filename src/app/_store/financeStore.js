import { create } from 'zustand';
import { db } from '@/db';
import { desc, eq, sql, getTableColumns } from 'drizzle-orm';
import { Category, Expenses } from '@/db/schema';

const useFinanceStore = create((set) => ({
  // States for category and expense lists
  categoryList: [],
  expenseList: [],
  loading: false,
  error: null,

  // Fetch category list
  fetchCategoryList: async (userEmail) => {
    if (!userEmail) return;

    set({ loading: true, error: null });
    try {
      const result = await db
        .select(getTableColumns(Category))
        .from(Category)
        .where(eq(Category.createdBy, userEmail))
        .orderBy(desc(Category.id));
      set({ categoryList: result, loading: false });
    } catch (error) {
      console.error('Error fetching category list:', error);
      set({ error: 'Failed to fetch category list', loading: false });
    }
  },

  // Set category list manually
  setCategoryList: (newCategoryList) => set({ categoryList: newCategoryList }),

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

  // Set expense list manually
  setExpenseList: (newExpenseList) => set({ expenseList: newExpenseList }),
}));

export default useFinanceStore;
