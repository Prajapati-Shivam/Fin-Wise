'use client';

import { Button } from '@/components/ui/button';
import { useUser, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

import React from 'react';
import { ToggleMode } from '@/components/ToggleMode';
import Link from 'next/link';

export const Header = () => {
  const { user, isSignedIn } = useUser();
  return (
    <div className='relative py-6 px-4 sm:px-8 flex justify-between items-center z-20'>
      <div>
        {/* logo to be added later */}
        {/* <Image alt='logo' src={} /> */}
        <Link href={'/'}>
          <span className='font-bold text-2xl'>FinWise</span>
        </Link>
      </div>
      <div className='flex items-center gap-2'>
        <ToggleMode />
        {isSignedIn && (
          <>
            <Link href={'/dashboard'} className='hidden sm:block'>
              <Button className='rounded-full'>Dashboard</Button>
            </Link>
            <UserButton />
          </>
        )}
      </div>
    </div>
  );
};
