'use client';
import React, { useEffect } from 'react';
import CreateBudget from './CreateBudget';
import BudgetItem from './BudgetItem';
import { useUser } from '@clerk/nextjs';
import useFinanceStore from '@/app/_store/financeStore';

function BudgetList() {
  const { fetchBudgetList, budgetList, loading, error } = useFinanceStore();
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchBudgetList(user.primaryEmailAddress.emailAddress);
    }
  }, [user?.primaryEmailAddress?.emailAddress, fetchBudgetList]);

  const placeholders = Array.from({ length: 5 });

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget
          refreshData={() =>
            fetchBudgetList(user?.primaryEmailAddress?.emailAddress)
          }
        />

        {loading
          ? placeholders.map((_, index) => (
              <div
                key={index}
                className='w-full bg-slate-200 dark:bg-slate-800 rounded-lg h-[150px] animate-pulse'
              ></div>
            ))
          : budgetList.length > 0
          ? budgetList.map((budget) => (
              <BudgetItem budget={budget} key={budget.id} />
            ))
          : !loading &&
            !error && (
              <div className='w-full col-span-1 md:col-span-2 lg:col-span-3 text-center'>
                No budgets found. Start by creating one!
              </div>
            )}
      </div>

      {error && <div className='mt-4 text-red-600 text-center'>{error}</div>}
    </div>
  );
}

export default BudgetList;
