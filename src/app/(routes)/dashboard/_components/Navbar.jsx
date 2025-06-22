'use client';

import { Button } from '@/components/ui/button';
import { useUser, UserButton } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { ToggleMode } from '@/components/ToggleMode';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Menu,
  ReceiptText,
  ScrollText,
  X,
} from 'lucide-react';
import { MobileNavMenu } from './MobileNavMenu';

export const Navbar = () => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', href: '/dashboard/expenses', icon: ReceiptText },
    { name: 'Categories', href: '/dashboard/category', icon: ScrollText },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-shadow 
      ${
        scrolled
          ? 'bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className='mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
        {/* Logo */}
        <Link href='/' className='font-bold text-2xl'>
          FinWise
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden sm:flex items-center gap-x-6'>
          {isSignedIn &&
            links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium transition hover:text-primary ${
                  pathname.startsWith(link.href)
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          <ToggleMode />
          <UserButton />
        </div>

        {/* Mobile Menu Button */}
        <div className='sm:hidden flex items-center gap-2'>
          <MobileNavMenu links={links} />
          <ToggleMode />
          <UserButton />
        </div>
      </nav>
    </header>
  );
};
