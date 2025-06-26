'use client';

import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import useFinanceStore from '@/app/_store/financeStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AddExpenseDialog } from './_components/AddExpenseDialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
// import TestSendReport from './_components/TestSendReport';
import dynamic from 'next/dynamic';
// const TestDownload = dynamic(() => import('./_components/test-download'), {
//   ssr: false,
//   loading: () => <span>Loading Download...</span>,
// });

const DynamicExpenseReportDocument = dynamic(
  () =>
    import('./_components/ExpenseReportDocument').then(
      (mod) => mod.ExpenseReportDocument
    ),
  { ssr: false }
);

function ExpensesScreen() {
  const {
    fetchCategoryList,
    fetchExpenseList,
    loading,
    categoryList,
    expenseList,
    error,
  } = useFinanceStore();
  const { user } = useUser();

  const [receiveReport, setReceiveReport] = useState(false);

  // Load initial value from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('receiveMonthlyReport');
    if (stored !== null) {
      setReceiveReport(stored === 'true');
    }
  }, []);

  // Save switch toggle to localStorage
  const handleToggle = (checked) => {
    setReceiveReport(checked);
    localStorage.setItem('receiveMonthlyReport', checked.toString());
  };

  // Fetch user-specific data
  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (email) {
      fetchExpenseList(email);
      fetchCategoryList(email);
    }
  }, [
    fetchExpenseList,
    fetchCategoryList,
    user?.primaryEmailAddress?.emailAddress,
  ]);

  // Send PDF on 1st of the month if enabled
  useEffect(() => {
    const sendMonthlyReportIfNeeded = async () => {
      const isEnabled = localStorage.getItem('receiveMonthlyReport');
      const email = user?.primaryEmailAddress?.emailAddress;
      if (isEnabled !== 'true' || !email) return;

      const today = new Date();
      if (today.getDate() !== 1) return;

      const lastSent = localStorage.getItem('lastReportSentAt');
      const lastSentDate = lastSent ? new Date(lastSent) : null;

      if (
        lastSentDate &&
        lastSentDate.getFullYear() === today.getFullYear() &&
        lastSentDate.getMonth() === today.getMonth()
      ) {
        return;
      }

      const blob = await pdf(
        <DynamicExpenseReportDocument
          expenseList={expenseList}
          categoryList={categoryList}
          userEmail={email}
        />
      ).toBlob();

      if (!blob) {
        toast.error('Failed to generate PDF.');
        return;
      }

      const formData = new FormData();
      formData.append(
        'pdf',
        new File([blob], 'ExpenseReport.pdf', { type: 'application/pdf' })
      );
      formData.append('email', email);

      try {
        const res = await fetch('/api/send-expense-report', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          localStorage.setItem('lastReportSentAt', new Date().toISOString());
          toast.success('Monthly expense report sent!');
        } else {
          toast.error('Failed to send expense report.');
        }
      } catch (err) {
        console.error('Error sending report:', err);
        toast.error('An error occurred while sending report.');
      }
    };

    if (expenseList.length > 0 && categoryList.length > 0 && user) {
      sendMonthlyReportIfNeeded();
    }
  }, [expenseList, categoryList, user]);

  if (error) {
    toast.error('An error occurred while fetching expenses.');
    console.log('Error fetching expenses:', error);
  }

  return (
    <div className='px-4 sm:px-8 py-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-4'>
        <h2 className='font-bold text-3xl'>
          My Expenses
          {/* <TestSendReport
            expenseList={expenseList}
            categoryList={categoryList}
            userEmail={user?.primaryEmailAddress?.emailAddress}
          /> */}
        </h2>
        <div className='flex items-center justify-between space-x-4'>
          <div>
            <p className='text-sm font-medium'>Receive monthly report</p>
            <p className='text-xs text-muted-foreground'>
              Sends on 1st of each month
            </p>
            {/* <TestDownload
              expenseList={expenseList}
              categoryList={categoryList}
              userEmail={user?.primaryEmailAddress?.emailAddress}
            /> */}
          </div>
          <Switch checked={receiveReport} onCheckedChange={handleToggle} />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 sm:py-4'>
        <AddExpenseDialog />
        {/* <Input type='text' placeholder='Search expenses...' /> */}
      </div>

      {loading ? (
        <p className='text-gray-600 dark:text-gray-400 text-lg flex items-center'>
          <span>
            <Loader2 size='24' className='animate-spin mr-2' />
          </span>
          Loading...
        </p>
      ) : (
        <ExpenseListTable
          refreshData={() =>
            fetchExpenseList(user?.primaryEmailAddress?.emailAddress)
          }
          expensesList={expenseList}
        />
      )}
    </div>
  );
}

export default ExpensesScreen;
