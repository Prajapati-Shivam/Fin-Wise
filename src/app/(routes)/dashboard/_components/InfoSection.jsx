'use client';
import { Sparkle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import InfoCard from './InfoCard';
import { PiggyBank, ReceiptText, Wallet, CircleDollarSign } from 'lucide-react';
import useFinanceStore from '@/app/_store/financeStore';
const InfoSection = () => {
  const { user } = useUser();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const { budgetList, incomeList, fetchBudgetList, fetchIncomeList } =
    useFinanceStore();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchBudgetList(user.primaryEmailAddress.emailAddress);
      fetchIncomeList(user.primaryEmailAddress.emailAddress);
    }
  }, [
    user?.primaryEmailAddress?.emailAddress,
    fetchBudgetList,
    fetchIncomeList,
  ]);
  // Recalculate totals when budgetList or incomeList changes
  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      calculateInfo();
    }
  }, [budgetList, incomeList]);

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

  // Function to calculate totals
  const calculateInfo = () => {
    let tBudget = 0;
    let tIncome = 0;
    let tSpend = 0;

    budgetList.forEach((budget) => {
      tBudget += Number(budget.amount || 0);
      tSpend += Number(budget.tSpend || 0);
    });

    incomeList.forEach((income) => {
      tIncome += Number(income.totalAmount || 0);
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
                <h3>FinWise AI</h3>
                <Sparkle className='rounded-full size-10 text-white p-2 animated-background bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500' />
              </div>
              <p className='text-gray-600 text-lg'>
                {loadingAdvice
                  ? 'Fetching financial advice...'
                  : financialAdvice || 'No advice available at the moment.'}
              </p>
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
        <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[1, 2, 3].map((item, index) => (
            <div
              className='h-[110px] w-full bg-slate-200 animate-pulse rounded-lg'
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoSection;
