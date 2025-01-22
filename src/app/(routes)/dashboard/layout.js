'use client';
import { useUser } from '@clerk/nextjs';
import { Navbar } from './_components/Navbar';
import { SideNav } from './_components/SideNav';
import { useEffect } from 'react';
import useFinanceStore from '@/app/_store/financeStore';

export default function DashboardLayout({ children }) {
  // const { user } = useUser();
  // const { fetchBudgetList } = useFinanceStore();

  // useEffect(() => {
  //   if (user?.primaryEmailAddress?.emailAddress) {
  //     fetchBudgetList(user.primaryEmailAddress.emailAddress);
  //   }
  // }, [fetchBudgetList, user?.primaryEmailAddress?.emailAddress]);

  return (
    <>
      <Navbar />
      <SideNav />
      <main className='mt-10'>{children}</main>
    </>
  );
}
