'use client';
import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import useFinanceStore from '@/app/_store/financeStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AddExpenseDialog } from './_components/AddExpenseDialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import TestDownload from './_components/test-download';

function ExpensesScreen() {
  const {
    fetchCategoryList,
    fetchExpenseList,
    loading,
    categoryList,
    expenseList,
    error,
  } = useFinanceStore();
  const { user } = useUser();

  const [receiveReport, setReceiveReport] = useState(false);

  // Load initial value from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('receiveMonthlyReport');
    if (stored !== null) {
      setReceiveReport(stored === 'true');
    }
  }, []);

  // Save switch toggle to localStorage
  const handleToggle = (checked) => {
    setReceiveReport(checked);
    localStorage.setItem('receiveMonthlyReport', checked.toString());
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchExpenseList(user.primaryEmailAddress.emailAddress);
      fetchCategoryList(user.primaryEmailAddress.emailAddress);
    }
  }, [
    fetchExpenseList,
    fetchCategoryList,
    user?.primaryEmailAddress?.emailAddress,
  ]);

  if (error) {
    toast.error('An error occurred while fetching expenses.');
    console.log('Error fetching expenses:', error);
  }

  return (
    <div className='px-4 sm:px-8 py-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-4'>
        <h2 className='font-bold text-3xl'>My Expenses</h2>
        <div className='flex items-center justify-between space-x-4'>
          <div>
            <p className='text-sm font-medium'>Receive monthly report</p>
            <p className='text-xs text-muted-foreground'>
              Sends on 1st of each month
            </p>
            <TestDownload
              expenseList={expenseList}
              categoryList={categoryList}
              userEmail={user?.primaryEmailAddress?.emailAddress}
            />
          </div>
          <Switch checked={receiveReport} onCheckedChange={handleToggle} />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 sm:py-4'>
        <AddExpenseDialog />
        <Input type='text' placeholder='Search expenses...' />
      </div>

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
            fetchExpenseList(user?.primaryEmailAddress?.emailAddress)
          }
          expensesList={expenseList}
        />
      )}
    </div>
  );
}

export default ExpensesScreen;
