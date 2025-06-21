import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

// Budget schema
export const Category = pgTable('category', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  icon: varchar('icon'),
  createdBy: varchar('createdBy').notNull(),
});

// Income schema
// export const Incomes = pgTable('incomes', {
//   id: serial('id').primaryKey(),
//   name: varchar('name').notNull(),
//   amount: varchar('amount').notNull(),
//   icon: varchar('icon'),
//   createdBy: varchar('createdBy').notNull(),
// });

// expense schema
export const Expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: varchar('amount').notNull(),
  categoryId: integer('categoryId').references(() => Category.id),
  createdBy: varchar('createdBy').notNull(),
});
