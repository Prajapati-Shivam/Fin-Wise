'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import InfoSection from './_components/InfoSection';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import useFinanceStore from '@/app/_store/financeStore';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AddExpenseDialog } from './expenses/_components/AddExpenseDialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ChartsSection from './_components/ChartsSection';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { expenseList, categoryList, fetchExpenseList, loading } =
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

      {/* Quick buttons */}
      <div className='mt-6 flex flex-wrap gap-4 sm:hidden'>
        <AddExpenseDialog />
        <Button variant='secondary' className='rounded-full'>
          <Link href='/dashboard/category'>Create Category</Link>
        </Button>
      </div>

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
            <ChartsSection
              expenseList={expenseList}
              categoryList={categoryList}
            />
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
              refreshData={() => fetchExpenseList(userEmail)}
              expensesList={expenseList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
