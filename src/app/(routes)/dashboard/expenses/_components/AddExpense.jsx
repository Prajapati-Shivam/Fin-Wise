'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { Loader } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react';
import { toast } from 'sonner';

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const addNewExpense = async () => {
    if (!name || !amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please provide a valid name and amount.');
      return;
    }

    try {
      setLoading(true);
      const result = await db
        .insert(Expenses)
        .values({
          name: name.trim(),
          amount: Number(amount),
          budgetId: budgetId,
          createdBy: user?.primaryEmailAddress?.emailAddress,
        })
        .returning();

      if (result.length > 0) {
        toast.success('New Expense Added!');
        refreshData();
        setName('');
        setAmount('');
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
    <div className='border p-5 rounded-2xl'>
      <h2 className='font-bold text-lg'>Add Expense</h2>
      <div className='mt-2'>
        <h2 className='font-medium my-1'>Expense Name</h2>
        <Input
          placeholder='e.g. Bedroom Decor'
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
          !(name && amount && !isNaN(amount) && Number(amount) > 0) || loading
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
