'use client';
import React, { useEffect } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import useFinanceStore from '@/app/_store/financeStore';
import { toast } from 'sonner';

function ExpensesScreen() {
  const { fetchExpenseList, fetchBudgetList, loading, expenseList, error } =
    useFinanceStore();
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchExpenseList(user.primaryEmailAddress.emailAddress);
    }
  }, [fetchExpenseList, user?.primaryEmailAddress?.emailAddress]);
  // console.log('expenseList:', expenseList);
  if (error) {
    toast.error('An error occurred while fetching expenses.');
    console.log('Error fetching expenses:', error);
  }
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl mb-4'>My Expenses</h2>

      {loading ? (
        <div className='text-center'>Loading expenses...</div>
      ) : (
        <ExpenseListTable
          refreshData={() =>
            fetchBudgetList(user.primaryEmailAddress.emailAddress)
          }
          expensesList={expenseList}
        />
      )}

      {expenseList.length === 0 && !loading && (
        <p className='text-center text-gray-500'>No expenses found.</p>
      )}
    </div>
  );
}

export default ExpensesScreen;
