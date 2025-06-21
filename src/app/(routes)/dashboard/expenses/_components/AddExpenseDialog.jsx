'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import AddExpense from './AddExpense';

export function AddExpenseDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = window.innerWidth >= 768;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='secondary' className='rounded-full'>
            + Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <AddExpense />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='secondary' className='rounded-full'>
          + Add Expense
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <AddExpense />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
