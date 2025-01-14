import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

function ExpenseListTable({ expensesList, refreshData }) {
  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast('Expense Deleted!');
      refreshData();
    }
  };
  return (
    <div className='mt-3'>
      <h2 className='font-bold text-lg'>Latest Expenses</h2>
      <div className='grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3'>
        <p className='font-bold'>Name</p>
        <p className='font-bold'>Amount</p>
        <p className='font-bold'>Date</p>
        <p className='font-bold'>Action</p>
      </div>
      {expensesList.map((expenses, index) => (
        <div
          key={index}
          className='grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2'
        >
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2
            onClick={() => deleteExpense(expenses)}
            className='text-red-500 cursor-pointer'
          >
            Delete
          </h2>
          {/* <h2>
            <Trash
              className="text-red-500 cursor-pointer"
              onClick={() => deleteExpense(expenses)}
            />
          </h2> */}
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
