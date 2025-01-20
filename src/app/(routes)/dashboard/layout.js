'use client';
import { useUser } from '@clerk/nextjs';
import { Navbar } from './_components/Navbar';
import { SideNav } from './_components/SideNav';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useFinanceStore from '@/app/_store/financeStore';

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const { fetchBudgetList, budgetList } = useFinanceStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchBudgetList(user.primaryEmailAddress.emailAddress);
    }
  }, [fetchBudgetList, user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (budgetList.length === 0) {
      router.replace('/dashboard/budgets');
    }
  }, [budgetList, router]);

  return (
    <>
      <Navbar />
      <SideNav />
      <main className='mt-10'>{children}</main>
    </>
  );
}
