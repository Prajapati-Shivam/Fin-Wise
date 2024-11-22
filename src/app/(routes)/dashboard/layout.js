'use client';
import { useUser } from '@clerk/nextjs';
import { Navbar } from './_components/Navbar';
import { SideNav } from './_components/SideNav';
import { useRouter } from 'next/navigation';
import { db } from '@/db/index';
import { Budgets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    user && checkUserBudget();
  });

  const checkUserBudget = async () => {
    const result = await db
      .select()
      .from(Budgets)
      .where(eq(user.primaryEmailAddress.emailAddress, Budgets.createdBy));

    if (result?.length == 0) router.replace('/dashboard/budgets');
    console.log(result);
  };

  return (
    <>
      <Navbar />
      <SideNav />
      <main>{children}</main>
    </>
  );
}
