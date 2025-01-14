'use client';
import { db } from '@/db';
import { Budgets, Expenses } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getAllExpenses();
    }
  }, [user]);

  const getAllExpenses = async () => {
    try {
      setLoading(true);
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expenses.id));

      setExpensesList(result);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl mb-4'>My Expenses</h2>

      {loading ? (
        <div className='text-center'>Loading expenses...</div>
      ) : (
        <ExpenseListTable
          refreshData={getAllExpenses}
          expensesList={expensesList}
        />
      )}

      {expensesList.length === 0 && !loading && (
        <p className='text-center text-gray-500'>No expenses found.</p>
      )}
    </div>
  );
}

export default ExpensesScreen;
