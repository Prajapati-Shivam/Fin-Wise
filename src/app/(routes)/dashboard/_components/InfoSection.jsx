'use client';
import { Sparkle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import InfoCard from './InfoCard';
import { PiggyBank, ReceiptText, Wallet, CircleDollarSign } from 'lucide-react';
import useFinanceStore from '@/app/_store/financeStore';
import { Button } from '@/components/ui/button';
import getFinancialAdvice from '@/lib/getFinancialAdvice';
import Link from 'next/link';

const InfoSection = () => {
  const { user } = useUser();
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [financialAdvice, setFinancialAdvice] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  const {
    budgetList,
    incomeList,
    expenseList,
    fetchBudgetList,
    fetchExpenseList,
    fetchIncomeList,
  } = useFinanceStore();

  // Fetch budgets and incomes when the user logs in
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchBudgetList(user.primaryEmailAddress.emailAddress);
      fetchIncomeList(user.primaryEmailAddress.emailAddress);
      fetchExpenseList(user.primaryEmailAddress.emailAddress);
    }
  }, [
    user?.primaryEmailAddress?.emailAddress,
    fetchBudgetList,
    fetchIncomeList,
    fetchExpenseList,
  ]);

  // Calculate totals whenever budgetList or incomeList changes
  useEffect(() => {
    if (
      (budgetList.length > 0 || incomeList.length > 0, expenseList.length > 0)
    ) {
      setLoadingTotals(true);
      calculateInfo();
      setLoadingTotals(false);
    }
  }, [budgetList, incomeList, expenseList]);

  // Fetch financial advice when totals change
  useEffect(() => {
    const fetchAdvice = async () => {
      if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
        setLoadingAdvice(true);
        const advice = await getFinancialAdvice(
          totalBudget,
          totalIncome,
          totalSpend
        );

        setFinancialAdvice(advice);
        setLoadingAdvice(false);
      }
    };

    fetchAdvice();
  }, [totalBudget, totalIncome, totalSpend]);

  // Calculate totals for budget and income
  const calculateInfo = () => {
    let tBudget = 0;
    let tIncome = 0;
    let tSpend = 0;

    budgetList.forEach((budget) => {
      tBudget += Number(budget.amount || 0);
    });

    expenseList.forEach((expense) => {
      tSpend += Number(expense.amount || 0);
    });

    incomeList.forEach((income) => {
      tIncome += Number(income.amount || 0);
    });

    setTotalBudget(tBudget);
    setTotalIncome(tIncome);
    setTotalSpend(tSpend);
  };

  return (
    <div>
      {budgetList.length > 0 ? (
        <div>
          <div className='border p-5 mt-4 rounded-2xl flex items-center justify-between'>
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
                  <p className='text-gray-600 text-md'>
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4'>
            <InfoCard
              title='Total Budget'
              amount={totalBudget}
              icon={PiggyBank}
            />
            <InfoCard
              title='Total Income'
              amount={totalIncome}
              icon={CircleDollarSign}
            />
            <InfoCard
              title='Total Spend'
              amount={totalSpend}
              icon={ReceiptText}
            />
            <InfoCard
              title='Number of Budgets'
              amount={budgetList.length}
              icon={Wallet}
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4 mt-8 justify-center items-center border-2 py-5 rounded-2xl'>
          <div className='border-4 border-black dark:border-white p-4 rounded-full'>
            <PiggyBank className='size-14' />
          </div>
          <h3 className='font-semibold text-2xl'>No Budget</h3>
          <p className='text-gray-800 dark:text-gray-200 text-center'>
            Get started by creating a new budget
          </p>
          <Link href={'/dashboard/budgets'}>
            <Button variant='secondary' className='rounded-full'>
              + New Budget
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default InfoSection;
