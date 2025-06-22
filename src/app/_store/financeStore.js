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
      // 1. Fetch all categories
      const categories = await db
        .select(getTableColumns(Category))
        .from(Category)
        .where(eq(Category.createdBy, userEmail))
        .orderBy(desc(Category.id));

      // 2. Fetch all expenses (to group by category)
      const allExpenses = await db
        .select({
          categoryId: Expenses.categoryId,
          amount: Expenses.amount,
        })
        .from(Expenses)
        .where(eq(Expenses.createdBy, userEmail));

      // 3. Calculate total spending
      const totalSpending = allExpenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );

      // 4. Enrich categories
      const enrichedCategories = categories.map((category) => {
        const filtered = allExpenses.filter(
          (e) => e.categoryId === category.id
        );

        const totalExpenseAmount = filtered.reduce(
          (sum, e) => sum + Number(e.amount),
          0
        );

        const expenseCount = filtered.length;
        const percentage =
          totalSpending > 0
            ? ((totalExpenseAmount / totalSpending) * 100).toFixed(1)
            : '0.0';

        return {
          ...category,
          totalExpenseAmount,
          expenseCount,
          percentage,
        };
      });

      set({ categoryList: enrichedCategories, loading: false });
    } catch (error) {
      console.error('Error fetching category list with stats:', error);
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
        .orderBy(desc(Expenses.createdAt)); // ✅ updated
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
