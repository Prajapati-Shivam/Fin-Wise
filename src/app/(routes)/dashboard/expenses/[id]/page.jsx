'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Trash } from 'lucide-react';

import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import useFinanceStore from '@/app/_store/financeStore';
import { db } from '@/db';
import { Expenses, Budgets } from '@/db/schema';
import { eq } from 'drizzle-orm';

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const router = useRouter();

  const { expenseList, fetchExpenseList, loading, error } = useFinanceStore();

  useEffect(() => {
    if (user) {
      fetchExpenseList(user.primaryEmailAddress.emailAddress);
    }
  }, [user, fetchExpenseList]);

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold gap-2 flex justify-between items-center'>
        <span
          className='flex gap-2 items-center cursor-pointer'
          onClick={() => router.back()}
        >
          <ArrowLeft />
          My Expenses
        </span>
      </h2>

      <div className='mt-4'>
        {loading ? (
          <div>Loading expenses...</div>
        ) : (
          <ExpenseListTable
            expensesList={expenseList.filter(
              (expense) => expense.budgetId == params.id
            )}
            refreshData={() => {
              fetchExpenseList(user.primaryEmailAddress.emailAddress);
              fetchBudgetList(user.primaryEmailAddress.emailAddress);
            }}
          />
        )}
      </div>
      {error && <div className='text-red-500 mt-4'>{error}</div>}
    </div>
  );
}

export default ExpensesScreen;
