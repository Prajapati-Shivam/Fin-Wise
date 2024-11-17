'use client';
import {
  Calendar,
  Home,
  Inbox,
  PanelRight,
  Search,
  Settings,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import Link from 'next/link';
// Menu items.
const items = [
  {
    id: 1,
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    id: 2,
    title: 'Budgets',
    url: '/dashboard/budgets',
    icon: Search,
  },
  {
    id: 3,
    title: 'Incomes',
    url: '/dashboard/incomes',
    icon: Inbox,
  },
  {
    id: 4,
    title: 'Expenses',
    url: '/dashboard/expenses',
    icon: Calendar,
  },
  {
    id: 5,
    title: 'Upgrade',
    url: '/dashboard/upgrade',
    icon: Calendar,
  },
];

export function SideNav() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className='fixed right-4 sm:right-10 top-4 sm:top-6 z-50 cursor-pointer py-2.5'>
          <PanelRight size={25} />
        </div>
      </SheetTrigger>
      <SheetContent side='right'>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
