'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import InfoSection from './_components/InfoSection';
import BarCharts from './_components/BarCharts';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import useFinanceStore from '@/app/_store/financeStore';
import { useEffect } from 'react';
import BudgetItem from './budgets/_components/BudgetItem';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { budgetList, expenseList, fetchBudgetList, loading } =
    useFinanceStore();

  // Redirect to sign-in if the user is not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg text-gray-600'>Loading...</p>
      </div>
    );
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className='px-8 py-10'>
      <h2 className='text-4xl font-bold'>Hi, {user?.fullName} 👋</h2>
      <p className='text-gray-600 dark:text-gray-400 mt-2'>
        What's happening with your money? Let's manage your expenses.
      </p>

      {/* Info Section */}
      <InfoSection />

      {/* Charts and Expense List */}
      <div className='grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5'>
        {/* Charts Section */}
        <div className='lg:col-span-2'>
          {loading ? (
            <div className='flex items-center justify-center h-40'>
              <p className='text-gray-600 dark:text-gray-400'>
                Loading charts...
              </p>
            </div>
          ) : (
            <BarCharts budgetList={budgetList} />
          )}
        </div>

        {/* Expense List */}
        <div className='lg:col-span-3'>
          {loading ? (
            <div className='flex items-center justify-center h-40'>
              <p className='text-gray-600 dark:text-gray-400'>
                Loading expenses...
              </p>
            </div>
          ) : (
            <ExpenseListTable
              refreshData={() => fetchBudgetList(userEmail)}
              expensesList={expenseList}
            />
          )}
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList?.length > 0
            ? budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            : [1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className='h-[180xp] w-full
                 bg-slate-200 rounded-lg animate-pulse'
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
