'use client';
import { Loader2, Sparkle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import InfoCard from './InfoCard';
import { PiggyBank, ReceiptText, Wallet, CircleDollarSign } from 'lucide-react';
import useFinanceStore from '@/app/_store/financeStore';
import { Button } from '@/components/ui/button';
import getFinancialAdvice from '@/lib/getFinancialAdvice';
import Link from 'next/link';
import { AddExpenseDialog } from '../expenses/_components/AddExpenseDialog';

const InfoSection = () => {
  const { user } = useUser();
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [financialAdvice, setFinancialAdvice] = useState('');
  const [totalSpend, setTotalSpend] = useState(0);

  const { expenseList, fetchExpenseList } = useFinanceStore();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchExpenseList(user.primaryEmailAddress.emailAddress);
    }
  }, [user?.primaryEmailAddress?.emailAddress, fetchExpenseList]);

  // Calculate totals whenever budgetList or incomeList changes
  useEffect(() => {
    if (expenseList.length > 0) {
      setLoadingTotals(true);
      calculateInfo();
      setLoadingTotals(false);
    }
  }, [expenseList]);

  // Fetch financial advice when totals change
  useEffect(() => {
    const fetchAdvice = async () => {
      if (totalSpend > 0) {
        setLoadingAdvice(true);
        const advice = await getFinancialAdvice(totalSpend);

        setFinancialAdvice(advice);
        setLoadingAdvice(false);
      }
    };

    fetchAdvice();
  }, [totalSpend]);

  // Calculate totals for budget and income
  const calculateInfo = () => {
    let tSpend = 0;

    expenseList.forEach((expense) => {
      tSpend += Number(expense.amount || 0);
    });

    setTotalSpend(tSpend);
  };

  return (
    <div>
      {expenseList.length > 0 ? (
        <div className='flex flex-col sm:flex-row gap-5 mt-4'>
          <div className='border p-3 sm:p-5 flex-1 rounded-2xl flex items-center justify-between'>
            <div>
              <div className='flex mb-2 items-center space-x-1'>
                <h3 className='text-xl font-semibold'>FinWise AI</h3>
                <Sparkle
                  className={`rounded-full size-9 text-white p-2 animated-background bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 ${
                    loadingAdvice && 'animate-spin'
                  }`}
                />
              </div>
              <div>
                {loadingAdvice ? (
                  <p className='text-gray-600 dark:text-gray-400 text-lg flex items-center'>
                    <span>
                      <Loader2 size='24' className='animate-spin mr-2' />
                    </span>
                    Fetching financial advice...
                  </p>
                ) : (
                  <p className='text-gray-500 text-md'>
                    {financialAdvice || 'No financial advice at the moment.'}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 flex-1'>
            <InfoCard
              title='Total Spend'
              amount={totalSpend}
              icon={ReceiptText}
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4 mt-8 justify-center items-center border-2 py-5 rounded-2xl'>
          <div className='border-4 border-black dark:border-white p-4 rounded-full'>
            <CircleDollarSign className='size-14' />
          </div>
          <h3 className='font-semibold text-2xl'>No Expenses Found</h3>
          <p className='text-gray-800 dark:text-gray-200 text-center'>
            It seems you haven't added any expenses yet. Start tracking your
            expenses to get insights and financial advice.
          </p>

          <AddExpenseDialog />
        </div>
      )}
    </div>
  );
};

export default InfoSection;
