'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { SelectCategory } from '../../category/_components/SelectCategory';
import { useUser } from '@clerk/nextjs';

function AddExpense({ refreshData }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const addNewExpense = async () => {
    if (
      !name ||
      !amount ||
      isNaN(amount) ||
      Number(amount) <= 0 ||
      !selectedCategoryId
    ) {
      toast.error('Please fill out all fields and select a valid category.');
      return;
    }

    try {
      setLoading(true);
      const result = await db
        .insert(Expenses)
        .values({
          name: name.trim(),
          amount: Number(amount),
          categoryId: selectedCategoryId,
          createdBy: user?.primaryEmailAddress?.emailAddress,
        })
        .returning();

      if (result.length > 0) {
        toast.success('New Expense Added!');
        refreshData?.();
        setName('');
        setAmount('');
        setSelectedCategoryId(null);
      } else {
        toast.error('Failed to add expense. Please try again.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('An error occurred while adding the expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2 className='font-medium my-1'>Select Category</h2>
        <SelectCategory onChange={setSelectedCategoryId} />
      </div>
      <div className='mt-2'>
        <h2 className='font-medium my-1'>Expense Name</h2>
        <Input
          placeholder='e.g. Coffee, Groceries'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='mt-2'>
        <h2 className='font-medium my-1'>Expense Amount</h2>
        <Input
          type='number'
          placeholder='e.g. 1000'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={
          !(
            name &&
            amount &&
            !isNaN(amount) &&
            Number(amount) > 0 &&
            selectedCategoryId
          ) || loading
        }
        onClick={addNewExpense}
        className='mt-3 w-full rounded-full'
      >
        {loading ? <Loader className='animate-spin' /> : 'Add New Expense'}
      </Button>
    </div>
  );
}

export default AddExpense;
