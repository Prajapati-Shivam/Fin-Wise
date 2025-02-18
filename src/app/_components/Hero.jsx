'use client';
import { Button } from '@/components/ui/button';
import CycleText from '@/components/ui/cycle-text';
import Link from 'next/link';
import React from 'react';
export const Hero = () => {
  return (
    <section>
      <div className='relative isolate'>
        <div
          aria-hidden='true'
          className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
          />
        </div>
        <div className='mx-auto max-w-4xl h-[calc(100vh-88px)] flex flex-col justify-center items-center'>
          <div className='text-center'>
            <h1 className='text-balance text-5xl font-semibold tracking-tight sm:text-6xl'>
              Manage money with AI-Driven <br />
              <span className='dark:text-gray-400 text-gray-600'>
                Finance Advisor
              </span>
            </h1>
            <div className='mt-8 h-14 flex items-center justify-center sm:h-0 text-pretty text-xl font-medium dark:text-gray-300 text-gray-700 sm:text-xl'>
              <CycleText />
            </div>
            <div className='mt-10 flex items-center justify-center gap-x-4'>
              <Link href={'/sign-in'}>
                <Button className='rounded-full'>Get started</Button>
              </Link>
              <Link href={'/'}>
                <Button variant='ghost' className='rounded-full'>
                  Learn more <span aria-hidden='true'>→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div
          aria-hidden='true'
          className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
          />
        </div>
      </div>
    </section>
  );
};
