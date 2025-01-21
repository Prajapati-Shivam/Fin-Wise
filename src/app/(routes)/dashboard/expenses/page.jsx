'use client';
import React, { useEffect } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import useFinanceStore from '@/app/_store/financeStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function ExpensesScreen() {
  const { fetchExpenseList, fetchBudgetList, loading, expenseList, error } =
    useFinanceStore();
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchExpenseList(user.primaryEmailAddress.emailAddress);
    }
  }, [fetchExpenseList, user?.primaryEmailAddress?.emailAddress]);

  if (error) {
    toast.error('An error occurred while fetching expenses.');
    console.log('Error fetching expenses:', error);
  }
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl mb-4'>My Expenses</h2>

      {loading ? (
        <p className='text-gray-600 dark:text-gray-400 text-lg flex items-center'>
          <span>
            <Loader2 size='24' className='animate-spin mr-2' />
          </span>
          Loading...
        </p>
      ) : (
        <ExpenseListTable
          refreshData={() =>
            fetchBudgetList(user.primaryEmailAddress.emailAddress)
          }
          expensesList={expenseList}
        />
      )}
    </div>
  );
}

export default ExpensesScreen;
