import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  numeric,
} from 'drizzle-orm/pg-core';

// Users schema
export const Users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email').notNull(),
  receiveReport: boolean('receiveReport').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
});

// Category schema
export const Category = pgTable('category', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  icon: varchar('icon'),
  createdBy: uuid('createdBy').references(() => Users.id),
  createdAt: timestamp('createdAt').defaultNow(),
});

// Expenses schema
export const Expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  amount: numeric('amount').notNull(),
  categoryId: uuid('categoryId').references(() => Category.id),
  userId: uuid('userId').references(() => Users.id),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
