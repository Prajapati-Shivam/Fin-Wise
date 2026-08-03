import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { Expenses, Category, Users } from '@/db/schema';
import { DEFAULT_CATEGORIES, DEMO_CREDENTIALS } from '@/lib/demoConfig';

export async function ensureDefaultCategoriesForUser(userId) {
  if (!userId) return [];

  const existingCategories = await db
    .select({ name: Category.name })
    .from(Category)
    .where(eq(Category.createdBy, userId));

  const existingNames = new Set(
    existingCategories.map((category) => category.name.trim().toLowerCase()),
  );

  const missingCategories = DEFAULT_CATEGORIES.filter(
    (category) => !existingNames.has(category.name.toLowerCase()),
  );

  if (missingCategories.length > 0) {
    await db.insert(Category).values(
      missingCategories.map((category) => ({
        ...category,
        createdBy: userId,
      })),
    );
  }

  return db.select().from(Category).where(eq(Category.createdBy, userId));
}

const DEMO_EXPENSE_TEMPLATES = [
  { name: 'Groceries', category: 'Groceries', amount: 1450 },
  { name: 'Lunch with team', category: 'Food & Dining', amount: 620 },
  { name: 'Metro recharge', category: 'Transport', amount: 300 },
  { name: 'Electricity bill', category: 'Bills', amount: 1850 },
  { name: 'Weekend dinner', category: 'Food & Dining', amount: 980 },
  { name: 'Monthly rent', category: 'Rent', amount: 12000 },
  { name: 'Mobile bill', category: 'Bills', amount: 499 },
  { name: 'Online shopping', category: 'Shopping', amount: 2190 },
  { name: 'Medicine refill', category: 'Health', amount: 760 },
  { name: 'Movie night', category: 'Entertainment', amount: 840 },
  { name: 'Fuel top-up', category: 'Transport', amount: 1500 },
  { name: 'Savings transfer', category: 'Savings', amount: 5000 },
];

function buildDemoExpenses(categoryMap) {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const totalDays = Math.max(
    1,
    Math.floor(
      (today.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  );

  return Array.from({ length: totalDays }, (_, index) => {
    const template =
      DEMO_EXPENSE_TEMPLATES[index % DEMO_EXPENSE_TEMPLATES.length];
    const expenseDate = new Date(startOfMonth);

    expenseDate.setDate(startOfMonth.getDate() + index);
    expenseDate.setHours(12, 0, 0, 0);

    const categoryId = categoryMap.get(template.category.toLowerCase()) ?? null;
    const amount = template.amount + (index % 3) * 75;

    return {
      name: `${template.name} ${index + 1}`,
      amount,
      categoryId,
      createdAt: expenseDate,
    };
  }).filter((expense) => expense.categoryId);
}

export async function ensureDemoExpensesForUser(userId, email) {
  if (!userId || email !== DEMO_CREDENTIALS.email) return [];

  const existingExpense = await db
    .select({ id: Expenses.id })
    .from(Expenses)
    .where(eq(Expenses.userId, userId))
    .limit(1);

  if (existingExpense.length > 0) {
    return existingExpense;
  }

  const categories = await db
    .select({ id: Category.id, name: Category.name })
    .from(Category)
    .where(eq(Category.createdBy, userId));

  const categoryMap = new Map(
    categories.map((category) => [
      category.name.trim().toLowerCase(),
      category.id,
    ]),
  );

  const demoExpenses = buildDemoExpenses(categoryMap).map((expense) => ({
    ...expense,
    userId,
  }));

  if (demoExpenses.length === 0) {
    return [];
  }

  await db.insert(Expenses).values(demoExpenses);

  return db.select().from(Expenses).where(eq(Expenses.userId, userId));
}

// 1. Get all users who opted in for monthly reports
export async function getAllOptedInUsers() {
  return await db
    .selectDistinct()
    .from(Users)
    .where(eq(Users.receiveReport, true));
}

// 2. Get all expenses for a specific user
export async function getExpensesForUser(userId) {
  return await db.select().from(Expenses).where(eq(Expenses.userId, userId));
}

// 3. Get all categories for a specific user
export async function getCategoriesForUser(userId) {
  return await db.select().from(Category).where(eq(Category.createdBy, userId));
}
