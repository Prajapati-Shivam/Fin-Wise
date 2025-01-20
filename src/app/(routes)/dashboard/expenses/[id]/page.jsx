'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Trash } from 'lucide-react';

import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import EditBudget from '../_components/EditBudget';

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

  const {
    budgetList,
    expenseList,
    fetchBudgetList,
    fetchExpenseList,
    loading,
    error,
  } = useFinanceStore();

  const currentBudget = budgetList.find((budget) => budget.id == params.id);

  useEffect(() => {
    if (user) {
      fetchBudgetList(user.primaryEmailAddress.emailAddress);
      fetchExpenseList(user.primaryEmailAddress.emailAddress);
    }
  }, [user, fetchBudgetList, fetchExpenseList]);

  const handleDeleteBudget = async () => {
    try {
      await db
        .delete(Expenses)
        .where(eq(Expenses.budgetId, params.id))
        .returning();
      await db.delete(Budgets).where(eq(Budgets.id, params.id)).returning();

      toast.success('Budget Deleted!');
      router.replace('/dashboard/budgets');
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget.');
    }
  };

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
        <div className='flex gap-2 items-center'>
          <EditBudget
            budgetInfo={currentBudget}
            refreshData={() =>
              fetchBudgetList(user.primaryEmailAddress.emailAddress)
            }
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='flex gap-2 rounded-full' variant='destructive'>
                <Trash className='w-4' /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the budget and all related
                  expenses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteBudget}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div
        className='grid grid-cols-1 
        md:grid-cols-2 mt-6 gap-5'
      >
        {loading ? (
          <div
            className='h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse'
          ></div>
        ) : currentBudget ? (
          <BudgetItem
            budget={currentBudget}
            refreshData={() =>
              fetchBudgetList(user.primaryEmailAddress.emailAddress)
            }
          />
        ) : (
          <div>No Budget Found</div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => {
            fetchExpenseList(user.primaryEmailAddress.emailAddress);
            fetchBudgetList(user.primaryEmailAddress.emailAddress);
          }}
        />
      </div>
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
