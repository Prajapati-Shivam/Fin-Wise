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
import { Incomes } from '@/db/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

function CreateIncomes({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState('😀');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const onCreateIncomes = async () => {
    if (!name || !amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please provide a valid source name and amount.');
      return;
    }

    try {
      setLoading(true);
      const result = await db
        .insert(Incomes)
        .values({
          name: name.trim(),
          amount: Number(amount),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          icon: emojiIcon,
        })
        .returning();

      if (result.length > 0) {
        toast.success('New Income Source Created!');
        refreshData();
        setName('');
        setAmount('');
        setEmojiIcon('😀');
      } else {
        toast.error('Failed to create income source. Please try again.');
      }
    } catch (error) {
      console.error('Error creating income source:', error);
      toast.error('An error occurred while creating the income source.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-slate-100 dark:bg-slate-900 rounded-2xl items-center flex flex-col border-2 border-dashed border-slate-400 dark:border-slate-500 cursor-pointer hover:shadow-md p-5 h-[150px] justify-center'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create New Income Source</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Income Source</DialogTitle>
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
                  <h2 className='font-medium my-1'>Source Name</h2>
                  <Input
                    placeholder='e.g. Youtube'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='mt-2'>
                  <h2 className='font-medium my-1'>Monthly Amount</h2>
                  <Input
                    type='number'
                    placeholder='e.g. 5000'
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
                  !(name && amount && !isNaN(amount) && Number(amount) > 0) ||
                  loading
                }
                onClick={onCreateIncomes}
                className='mt-5 w-full rounded-full'
              >
                {loading ? 'Creating...' : 'Create Income Source'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateIncomes;
