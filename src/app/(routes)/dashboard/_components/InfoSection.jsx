'use client';
import {
  Loader2,
  Sparkle,
  CircleDollarSign,
  CalendarDays,
  Tag,
  TrendingUp,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import InfoCard from './InfoCard';
import { ReceiptText, ListOrdered } from 'lucide-react';
import useFinanceStore from '@/app/_store/financeStore';
import getFinancialAdvice from '@/lib/getFinancialAdvice';
import { AddExpenseDialog } from '../expenses/_components/AddExpenseDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const InfoSection = () => {
  const { user } = useUser();
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [financialAdvice, setFinancialAdvice] = useState(
    'Click the button above to get financial advice based on your expenses.'
  );
  const [totalSpend, setTotalSpend] = useState(0);
  const [averageDailySpend, setAverageDailySpend] = useState(0);
  const [highestExpense, setHighestExpense] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);

  const { expenseList, fetchExpenseList, fetchCategoryList } =
    useFinanceStore();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchExpenseList(user.primaryEmailAddress.emailAddress);
      fetchCategoryList(user.primaryEmailAddress.emailAddress);
    }
  }, [
    user?.primaryEmailAddress?.emailAddress,
    fetchExpenseList,
    fetchCategoryList,
  ]);

  useEffect(() => {
    if (expenseList.length > 0) {
      setLoadingTotals(true);
      calculateInfo();
      setLoadingTotals(false);
    }
  }, [expenseList]);

  useEffect(() => {
    // Load cached advice if available and not expired
    const cachedAdvice = localStorage.getItem('financialAdvice');
    const cachedTime = localStorage.getItem('financialAdviceTimestamp');

    if (cachedAdvice && cachedTime) {
      const now = new Date();
      const lastFetched = new Date(cachedTime);
      const diffInHours = (now - lastFetched) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        setFinancialAdvice(cachedAdvice);
      }
    }
  }, []);

  const handleFetchAdvice = async () => {
    // Check for cached advice again before fetching
    console.log('click');

    if (totalSpend <= 0) return;

    try {
      setLoadingAdvice(true);
      const advice = await getFinancialAdvice({
        totalSpend,
        averageDailySpend: parseFloat(averageDailySpend),
        highestExpense,
        expenseCount,
      });

      if (!advice.startsWith('Sorry')) {
        setFinancialAdvice(advice);
        localStorage.setItem('financialAdvice', advice);
        localStorage.setItem(
          'financialAdviceTimestamp',
          new Date().toISOString()
        );
      } else {
        toast.error(advice);
      }
    } catch (err) {
      setFinancialAdvice('Failed to fetch advice. Please try again later.');
    } finally {
      setLoadingAdvice(false);
    }
  };

  const calculateInfo = () => {
    let tSpend = 0;
    let highest = 0;
    let categoryCount = {};
    let minDate = new Date();
    let maxDate = new Date(0);

    expenseList.forEach((expense) => {
      const amount = Number(expense.amount || 0);
      const date = new Date(expense.createdAt);
      tSpend += amount;

      if (amount > highest) highest = amount;

      if (date < minDate) minDate = date;
      if (date > maxDate) maxDate = date;

      categoryCount[expense.categoryId] =
        (categoryCount[expense.categoryId] || 0) + 1;
    });

    // Days between first and last expense (avoid division by 0)
    const daysActive = Math.max(
      1,
      Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1
    );

    setTotalSpend(tSpend);
    setHighestExpense(highest);
    setAverageDailySpend((tSpend / daysActive).toFixed(2));
    setExpenseCount(expenseList.length);
  };

  return (
    <div>
      {expenseList.length > 0 ? (
        <div className='flex flex-col sm:flex-row gap-5 mt-4'>
          {/* Info Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:w-1/2'>
            <InfoCard
              title='Total Spend'
              amount={totalSpend}
              icon={ReceiptText}
            />
            <InfoCard
              title='Avg. Daily Spend'
              amount={averageDailySpend}
              icon={CalendarDays}
            />
            <InfoCard
              title='Highest Expense'
              amount={highestExpense}
              icon={TrendingUp}
            />
            <InfoCard
              title='Expenses Count'
              amount={expenseCount}
              icon={ListOrdered}
            />
          </div>

          {/* AI Advice Box */}
          <div className='border p-3 sm:p-5 sm:w-1/2 rounded-2xl flex items-center justify-between'>
            <div>
              <div className='flex mb-2 items-center space-x-1'>
                <Button
                  variant='ghost'
                  className='p-2 flex items-center space-x-2'
                  onClick={handleFetchAdvice}
                  disabled={loadingAdvice}
                  title='Advice refreshes every 24 hours or on button click.'
                >
                  <div className='text-xl font-semibold'>FinWise AI</div>
                  <div
                    className={`rounded-full size-6 bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 flex items-center justify-center ${
                      loadingAdvice ? 'animate-pulse' : ''
                    }`}
                  >
                    <Sparkle
                      size={24}
                      className={`text-white ${loadingAdvice && 'animate-spin'}`}
                    />
                  </div>
                </Button>
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
                  <div className='text-gray-700 text-md dark:text-gray-300'>
                    <ReactMarkdown>{financialAdvice}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4 mt-8 justify-center items-center border-2 py-5 rounded-2xl'>
          <div className='border-4 border-black dark:border-white p-4 rounded-full'>
            <CircleDollarSign className='size-14' />
          </div>
          <h3 className='font-semibold text-2xl'>No Expenses Found</h3>
          <p className='text-gray-800 dark:text-gray-200 text-center'>
            It seems you haven&apos;t added any expenses yet. Start tracking
            your expenses to get insights and financial advice.
          </p>
          <AddExpenseDialog />
        </div>
      )}
    </div>
  );
};

export default InfoSection;
