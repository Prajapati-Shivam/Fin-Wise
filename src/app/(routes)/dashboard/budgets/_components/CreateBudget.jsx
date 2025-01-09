'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { Budgets } from '@/db/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState('😀');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const onCreateBudget = async () => {
    if (!name || !amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter valid budget details.');
      return;
    }

    try {
      setLoading(true);
      const result = await db
        .insert(Budgets)
        .values({
          name: name.trim(),
          amount: Number(amount),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          icon: emojiIcon,
        })
        .returning({ insertedId: Budgets.id });

      if (result.length > 0) {
        toast.success('New Budget Created!');
        refreshData();
        setName('');
        setAmount('');
        setEmojiIcon('😀');
      } else {
        toast.error('Failed to create budget. Please try again.');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('An error occurred while creating the budget.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className='bg-slate-100 dark:bg-slate-900 rounded-2xl
            items-center flex flex-col border-2 border-dashed border-slate-400 dark:border-slate-500
            cursor-pointer hover:shadow-md p-5 h-[150px] justify-center'
          >
            <p className='text-3xl'>+</p>
            <p>Create New Budget</p>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className='mt-5'>
                <div className='relative'>
                  <Button
                    variant='outline'
                    className='text-lg'
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    {emojiIcon}
                  </Button>
                  {openEmojiPicker && (
                    <div className='absolute z-20 mt-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full md:w-[300px] max-h-[350px] overflow-y-auto'>
                      <EmojiPicker
                        width='100%'
                        height='auto'
                        onEmojiClick={(e) => {
                          setEmojiIcon(e.emoji);
                          setOpenEmojiPicker(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className='mt-2'>
                  <p className='text-black font-medium my-1'>Budget Name</p>
                  <Input
                    placeholder='e.g. Home Decor'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='mt-2'>
                  <p className='text-black font-medium my-1'>Budget Amount</p>
                  <Input
                    type='number'
                    placeholder='e.g. ₹5000'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='sm:justify-start'>
            <DialogClose asChild>
              <Button
                disabled={
                  !(name && amount && !isNaN(amount) && Number(amount) > 0)
                }
                onClick={onCreateBudget}
                className='mt-5 w-full rounded-full'
                loading={loading}
              >
                {loading ? 'Creating...' : 'Create Budget'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;
