'use client';
import useFinanceStore from '@/app/_store/financeStore';
import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ReceiptText, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ExpenseListTable({ expensesList, refreshData }) {
  const [deletingId, setDeletingId] = useState(null);
  const categoryList = useFinanceStore((state) => state.categoryList);

  const deleteExpense = async (expense) => {
    if (!expense?.id) return;

    setDeletingId(expense.id);
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result.length > 0) {
        toast.success('Expense Deleted!');
        refreshData(); // Refresh the expense list after deletion
      } else {
        toast.error('Failed to delete expense. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('An error occurred while deleting the expense.');
    } finally {
      setDeletingId(null); // Reset the deleting ID
    }
  };

  // Helper to get full category info
  const getCategoryInfo = (categoryId) =>
    categoryList.find((c) => c.id === categoryId);

  return (
    <div className='overflow-x-auto'>
      <h2 className='font-bold text-lg mb-4'>Latest Expenses</h2>
      {expensesList.length > 0 && (
        <Table>
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='font-bold'>Category</TableHead>
              <TableHead className='font-bold'>Expense</TableHead>
              <TableHead className='font-bold'>Amount</TableHead>
              <TableHead className='text-right font-bold'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expensesList.map((expense) => {
              const category = getCategoryInfo(expense.categoryId);
              return (
                <TableRow key={expense.id}>
                  <TableCell>
                    {category ? (
                      <div className='flex items-center gap-2'>
                        <span className='text-xl'>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    ) : (
                      <span className='text-gray-500 italic'>Unknown</span>
                    )}
                  </TableCell>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>
                    ₹ {Number(expense.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className='float-end'>
                    <Trash
                      className={`text-red-500 cursor-pointer text-right ${
                        deletingId == expense.id
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }`}
                      onClick={() => deleteExpense(expense)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {expensesList.length === 0 && (
        <div className='flex flex-col gap-4 mt-8 justify-center items-center border-2 py-5 rounded-2xl'>
          <div className='border-4 border-black dark:border-white p-4 rounded-full'>
            <ReceiptText className='size-14' />
          </div>
          <h3 className='font-semibold text-2xl'>No Expense found</h3>
          <p className='text-gray-800 dark:text-gray-200 text-center'>
            Get started by adding a new expense
          </p>
          <Link href={'/dashboard/budgets'}>
            <Button variant='secondary' className='rounded-full'>
              + New Expense
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ExpenseListTable;
