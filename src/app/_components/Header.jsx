'use client';

import { Button } from '@/components/ui/button';
import { useUser, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

import React from 'react';
import { ToggleMode } from './ToggleMode';

export const Header = () => {
  const { user, isSignedIn } = useUser();
  return (
    <div className='relative py-4 px-4 sm:px-8 border-b-2 shadow-md flex justify-between items-center z-20'>
      <div>
        {/* logo to be added later */}
        {/* <Image alt='logo' src={} /> */}
        <span className='font-bold text-2xl'>FinWise</span>
      </div>
      <div className='flex items-center gap-2'>
        <ToggleMode />
        {isSignedIn && <UserButton />}
      </div>
    </div>
  );
};
