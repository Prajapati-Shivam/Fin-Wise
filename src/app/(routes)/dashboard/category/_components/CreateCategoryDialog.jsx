'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import CreateCategory from './CreateCategory';

export function CreateCategoryDialog() {
  const [open, setOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className='bg-slate-100 dark:bg-slate-900 rounded-2xl
            items-center flex flex-col border-2 border-dashed border-slate-400 dark:border-slate-500
            cursor-pointer hover:shadow-md p-5 h-[150px] justify-center'
          >
            <p className='text-3xl'>+</p>
            <p>Create New Category</p>
          </div>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your expenses
            </DialogDescription>
          </DialogHeader>
          <CreateCategory />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div
          className='bg-slate-100 dark:bg-slate-900 rounded-2xl
            items-center flex flex-col border-2 border-dashed border-slate-400 dark:border-slate-500
            cursor-pointer hover:shadow-md p-5 h-[150px] justify-center'
        >
          <p className='text-3xl'>+</p>
          <p>Create New Category</p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Create Category</DrawerTitle>
          <DrawerDescription>
            Create a new category to organize your expenses
          </DrawerDescription>
        </DrawerHeader>
        <CreateCategory />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
