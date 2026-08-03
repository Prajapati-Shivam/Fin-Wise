'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import { KeyRound, Sparkles, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEMO_CREDENTIALS } from '@/lib/demoConfig';
import { toast } from 'sonner';

export default function DemoLoginCard() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      const response = await fetch('/api/demo-user', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to prepare demo account.');
      }

      const result = await signIn.create({
        identifier: DEMO_CREDENTIALS.email,
        password: DEMO_CREDENTIALS.password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
        return;
      }

      toast.error('Demo login could not be completed.');
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 shadow-sm sm:p-5 dark:border-blue-900/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
        <div className='flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20'>
          <Sparkles size={20} />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300'>
            Try the demo account
          </p>
          <h3 className='mt-1 text-base font-bold text-slate-900 sm:text-lg dark:text-white'>
            Skip signup and explore the app instantly
          </h3>
          <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300'>
            Use the prefilled demo credentials below to sign in and see the
            dashboard with starter categories already loaded.
          </p>

          <div className='mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm dark:border-slate-700 dark:bg-slate-950/60'>
            <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2 text-slate-700 dark:text-slate-200'>
              <UserCircle2 size={16} />
              <span className='font-medium'>Email / username</span>
              <span className='font-mono text-xs text-slate-500 sm:ml-auto dark:text-slate-400'>
                {DEMO_CREDENTIALS.email}
              </span>
            </div>
            <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2 text-slate-700 dark:text-slate-200'>
              <KeyRound size={16} />
              <span className='font-medium'>Password</span>
              <span className='font-mono text-xs text-slate-500 sm:ml-auto dark:text-slate-400'>
                {DEMO_CREDENTIALS.password}
              </span>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            disabled={loading}
            className='mt-4 w-full rounded-full bg-blue-600 text-white hover:bg-blue-700'
          >
            {loading ? 'Signing you in...' : 'Launch demo dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
}
