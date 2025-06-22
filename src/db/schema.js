import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

// Category schema
export const Category = pgTable('category', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  icon: varchar('icon'),
  createdBy: varchar('createdBy').notNull(),
});

// Expense schema
export const Expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  amount: varchar('amount').notNull(),
  categoryId: uuid('categoryId').references(() => Category.id),
  createdBy: varchar('createdBy').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
