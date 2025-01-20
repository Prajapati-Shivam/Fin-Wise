'use client';

import { Button } from '@/components/ui/button';
import { useUser, UserButton } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { ToggleMode } from '@/components/ToggleMode';
import Link from 'next/link';

export const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div
      className={`fixed top-0 left-0 w-full shadow-md py-4 px-4 sm:px-8 
      flex justify-between items-center z-50
        ${scrolled && 'bg-opacity-80 backdrop-filter backdrop-blur-md'} `}
    >
      <div>
        {/* Logo placeholder */}
        <Link href={'/'}>
          <span className='font-bold text-2xl'>FinWise</span>
        </Link>
      </div>
      <div className='flex items-center gap-x-4 mr-10'>
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
