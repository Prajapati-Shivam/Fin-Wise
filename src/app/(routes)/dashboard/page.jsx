'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import InfoSection from './_components/InfoSection';
import BarCharts from './_components/BarCharts';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import useFinanceStore from '@/app/_store/financeStore';
import { useEffect } from 'react';
import BudgetItem from './budgets/_components/BudgetItem';
import { Loader2 } from 'lucide-react';

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
        <p className='text-gray-600 dark:text-gray-400 text-lg flex items-center'>
          <span>
            <Loader2 size='24' className='animate-spin mr-2' />
          </span>
          Loading...
        </p>
      </div>
    );
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className='px-4 sm:px-8 py-10'>
      <h2 className='text-4xl font-bold'>Hi, {user?.fullName} 👋</h2>
      <p className='text-gray-600 dark:text-gray-400 mt-2'>
        {`What's happening with your money? Let's manage your expenses.`}
      </p>

      {/* Info Section */}
      <InfoSection />

      {/* Charts and Expense List */}
      <div className='mt-6 gap-5'>
        {/* Charts Section */}
        <div className='lg:col-span-2'>
          {loading ? (
            <div className='flex items-center justify-center h-40'>
              <p className='text-gray-600 dark:text-gray-400 text-lg flex items-center'>
                <span>
                  <Loader2 size='24' className='animate-spin mr-2' />
                </span>
                Loading charts...
              </p>
            </div>
          ) : (
            <BarCharts budgetList={budgetList} />
          )}
        </div>
        {/* Expense List */}
        <div className='lg:col-span-3 border rounded-lg mt-6 p-3 sm:p-5'>
          {loading ? (
            <div className='flex items-center justify-center h-40'>
              <p className='text-gray-600 dark:text-gray-400 text-lg flex items-center'>
                <span>
                  <Loader2 size='24' className='animate-spin mr-2' />
                </span>
                Loading expense...
              </p>
            </div>
          ) : (
            <ExpenseListTable
              refreshData={() => fetchBudgetList(userEmail)}
              expensesList={expenseList}
            />
          )}
        </div>
        <div className='mt-7'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {loading
              ? [1, 2, 3, 4].map((_, index) => (
                  <div
                    key={index}
                    className='w-full bg-slate-200 dark:bg-slate-800 rounded-lg h-[150px] animate-pulse'
                  ></div>
                ))
              : budgetList.length > 0
              ? budgetList.map((budget) => (
                  <BudgetItem budget={budget} key={budget.id} />
                ))
              : !loading && (
                  <div className='w-full col-span-1 md:col-span-2 lg:col-span-3 text-center'>
                    No budgets found. Start by creating one!
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
