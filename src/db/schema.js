import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

// Budget schema
export const Budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: varchar('amount').notNull(),
  icon: varchar('icon'),
  createdBy: varchar('createdBy').notNull(),
});

// Income schema
export const Incomes = pgTable('incomes', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: varchar('amount').notNull(),
  icon: varchar('icon'),
  createdBy: varchar('createdBy').notNull(),
});

// expense schema
export const Expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: varchar('amount').notNull(),
  budgetId: integer('budgetId').references(() => Budgets.id),
  createdBy: varchar('createdBy').notNull(),
});
