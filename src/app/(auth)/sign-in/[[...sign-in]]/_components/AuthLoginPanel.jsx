'use client';

import { SignIn } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DemoLoginCard from './DemoLoginCard';

const clerkAppearance = {
  layout: {
    logoPlacement: 'none',
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'blockButton',
    showOptionalFields: false,
  },
  elements: {
    rootBox: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    cardBox: {
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
    },
    card: {
      width: '100%',
      boxShadow: 'none',
    },
  },
};

export default function AuthLoginPanel() {
  return (
    <div className='mx-auto flex w-full max-w-[440px] flex-col items-center'>
      <Tabs defaultValue='clerk' className='w-full'>
        <TabsList className='grid h-12 w-full grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900'>
          <TabsTrigger
            value='clerk'
            className='h-10 rounded-xl text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900'
          >
            Clerk login
          </TabsTrigger>
          <TabsTrigger
            value='demo'
            className='h-10 rounded-xl text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900'
          >
            Demo account login
          </TabsTrigger>
        </TabsList>

        <div className='mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-950'>
          <TabsContent value='clerk' className='m-0 p-3 sm:p-4'>
            <div className='flex justify-center'>
              <SignIn
                path='/sign-in'
                fallbackRedirectUrl='/dashboard'
                appearance={clerkAppearance}
              />
            </div>
          </TabsContent>

          <TabsContent value='demo' className='m-0 p-4 sm:p-6'>
            <div className='flex justify-center'>
              <DemoLoginCard />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
