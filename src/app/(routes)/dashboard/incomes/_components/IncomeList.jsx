'use client';
import React, { useEffect } from 'react';
import CreateIncomes from './CreateIncomes';
import { useUser } from '@clerk/nextjs';
import IncomeItem from './IncomeItem';
import useFinanceStore from '@/app/_store/financeStore';

function IncomeList() {
  const { fetchIncomeList, incomeList, loading, error } = useFinanceStore();
  const { user } = useUser();
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchIncomeList(user.primaryEmailAddress.emailAddress);
    }
  }, [user?.primaryEmailAddress?.emailAddress, fetchIncomeList]);
  const placeholders = Array.from({ length: 5 });

  return (
    <div className='mt-7'>
      <div
        className='grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5'
      >
        <CreateIncomes
          refreshData={() =>
            fetchIncomeList(user?.primaryEmailAddress?.emailAddress)
          }
        />
        {loading
          ? placeholders.map((_, index) => (
              <div
                key={index}
                className='w-full bg-slate-200 dark:bg-slate-800 rounded-lg h-[150px] animate-pulse'
              ></div>
            ))
          : incomeList.length > 0
          ? incomeList.map((income) => (
              <IncomeItem income={income} key={income.id} />
            ))
          : !loading &&
            !error && (
              <div className='w-full col-span-1 md:col-span-2 lg:col-span-3 text-center'>
                No income found. Start by creating one!
              </div>
            )}
      </div>
    </div>
  );
}

export default IncomeList;
