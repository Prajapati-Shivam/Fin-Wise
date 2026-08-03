'use client';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ensureUser } from '@/app/action/user';
import useFinanceStore from '@/app/_store/financeStore';
import { Navbar } from './_components/Navbar';

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { fetchCurrentUser } = useFinanceStore();

  useEffect(() => {
    const initUser = async () => {
      if (userEmail) {
        await ensureUser(userEmail);
        fetchCurrentUser(userEmail);
      }
    };
    initUser();
  }, [userEmail, fetchCurrentUser]);

  return (
    <>
      <Navbar />
      <main className='mt-10'>{children}</main>
    </>
  );
}

