import { db } from '@db';
import { eq } from 'drizzle-orm';
import { Expenses, Category, Users } from '@db/schema';

// 1. Get all users who opted in for monthly reports
export async function getAllOptedInUsers() {
  return await db.select().from(Users).where(eq(Users.receiveReport, true));
}

// 2. Get all expenses for a specific user
export async function getExpensesForUser(userId) {
  return await db.select().from(Expenses).where(eq(Expenses.userId, userId));
}

// 3. Get all categories for a specific user
export async function getCategoriesForUser(userId) {
  return await db.select().from(Category).where(eq(Category.createdBy, userId));
}
