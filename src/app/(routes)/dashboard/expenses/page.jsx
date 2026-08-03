'use client';

import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import useFinanceStore from '@/app/_store/financeStore';
import { toast } from 'sonner';
import { Loader2, Download } from 'lucide-react';
import { AddExpenseDialog } from './_components/AddExpenseDialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { updateReceiveReport } from '@/app/action/user';

const getMonthToDateRange = (date = new Date()) => {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date);

  return { startDate, endDate };
};

const formatDateRangeLabel = (startDate, endDate) =>
  `${startDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`;

const formatMonthToDateFileName = (date = new Date()) => {
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  return `${month}-1-to-${day}-Expense-Report.pdf`;
};

function ExpensesScreen() {
  const {
    currentUser,
    fetchCurrentUser,
    fetchCategoryList,
    fetchExpenseList,
    loading,
    categoryList,
    expenseList,
    error,
  } = useFinanceStore();

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const [receiveReport, setReceiveReport] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    if (email) {
      fetchCurrentUser(email);
    }
  }, [email, fetchCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      setReceiveReport(currentUser.receiveReport ?? false);
      fetchExpenseList(currentUser.id);
      fetchCategoryList(currentUser.id);
    }
  }, [currentUser, fetchExpenseList, fetchCategoryList]);

  const handleToggle = async (checked) => {
    setReceiveReport(checked);

    try {
      const res = await updateReceiveReport(currentUser.id, checked);

      if (checked) {
        toast.success('You will now receive monthly reports.');
      } else {
        toast.success('You have unsubscribed from monthly reports.');
      }
    } catch (err) {
      console.error('Error updating preference:', err);
      toast.error('Error updating preference.');
    }
  };

  const handleDownloadMonthToDateReport = async () => {
    if (!email || expenseList.length === 0 || categoryList.length === 0) {
      toast.error('Add at least one expense before downloading a report.');
      return;
    }

    const { startDate, endDate } = getMonthToDateRange();

    const monthToDateExpenses = expenseList.filter((expense) => {
      const expenseDate = new Date(expense.createdAt);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    if (monthToDateExpenses.length === 0) {
      toast.error('No expenses found for the current month yet.');
      return;
    }

    setDownloadingReport(true);

    try {
      const [{ ExpenseReportDocument }, { pdf }] = await Promise.all([
        import('./_components/ExpenseReportDocument'),
        import('@react-pdf/renderer'),
      ]);

      const blob = await pdf(
        <ExpenseReportDocument
          expenseList={monthToDateExpenses}
          categoryList={categoryList}
          userEmail={email}
          reportTitle='FinWise: Month-to-Date Expense Report'
          reportPeriodLabel={formatDateRangeLabel(startDate, endDate)}
          startDate={startDate}
          endDate={endDate}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = formatMonthToDateFileName(endDate);
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Month-to-date report downloaded.');
    } catch (err) {
      console.error('Error downloading month-to-date report:', err);
      toast.error('Failed to download the report. Please try again.');
    } finally {
      setDownloadingReport(false);
    }
  };

  // Send PDF on 1st of the month if enabled
  // useEffect(() => {
  //   const sendMonthlyReportIfNeeded = async () => {
  //     if (!receiveReport || !email) return;

  //     const today = new Date();
  //     if (today.getDate() !== 1) return;

  //     const lastSent = localStorage.getItem('lastReportSentAt');
  //     const lastSentDate = lastSent ? new Date(lastSent) : null;

  //     if (
  //       lastSentDate &&
  //       lastSentDate.getFullYear() === today.getFullYear() &&
  //       lastSentDate.getMonth() === today.getMonth()
  //     ) {
  //       return; // already sent this month
  //     }

  //     const blob = await pdf(
  //       <DynamicExpenseReportDocument
  //         expenseList={expenseList}
  //         categoryList={categoryList}
  //         userEmail={email}
  //       />
  //     ).toBlob();

  //     if (!blob) {
  //       toast.error('Failed to generate PDF.');
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append(
  //       'pdf',
  //       new File([blob], 'ExpenseReport.pdf', { type: 'application/pdf' })
  //     );
  //     formData.append('email', email);

  //     try {
  //       const res = await fetch('/api/send-expense-report', {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       if (res.ok) {
  //         localStorage.setItem('lastReportSentAt', new Date().toISOString());
  //         toast.success('Monthly expense report sent!');
  //       } else {
  //         toast.error('Failed to send expense report.');
  //       }
  //     } catch (err) {
  //       console.error('Error sending report:', err);
  //       toast.error('An error occurred while sending report.');
  //     }
  //   };

  //   if (expenseList.length > 0 && categoryList.length > 0 && currentUser) {
  //     sendMonthlyReportIfNeeded();
  //   }
  // }, [expenseList, categoryList, currentUser, email, receiveReport]);

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
        <AddExpenseDialog
          refreshData={() => fetchExpenseList(currentUser?.id)}
        />
        <Button
          variant='secondary'
          onClick={handleDownloadMonthToDateReport}
          disabled={downloadingReport || expenseList.length === 0}
          className='rounded-full'
        >
          <Download className='mr-2 size-4' />
          {downloadingReport
            ? 'Preparing report...'
            : 'Download month-to-date report'}
        </Button>
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
          refreshData={() => fetchExpenseList(currentUser?.id)}
          expensesList={expenseList}
        />
      )}
    </div>
  );
}

export default ExpensesScreen;
