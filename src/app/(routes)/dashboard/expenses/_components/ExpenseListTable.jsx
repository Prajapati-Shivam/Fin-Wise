'use client';
import useFinanceStore from '@/app/_store/financeStore';
import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react';
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

function ExpenseListTable({ expensesList, refreshData }) {
  const { budgetList } = useFinanceStore();
  const [deletingId, setDeletingId] = useState(null);
  const getBudgetName = (budgetId) => {
    const budget = budgetList.find((budget) => budget.id == budgetId);
    return budget?.name || 'Unknown';
  };
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

  return (
    <div className='overflow-x-auto'>
      <h2 className='font-bold text-lg mb-4'>Latest Expenses</h2>
      {expensesList.length > 0 && (
        <Table>
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='font-bold'>Budget</TableHead>
              <TableHead className='font-bold'>Expense</TableHead>
              <TableHead className='font-bold'>Amount</TableHead>
              <TableHead className='text-right font-bold'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expensesList.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{getBudgetName(expense.budgetId)}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      )}
      {expensesList.length === 0 && (
        <p className='text-center text-gray-500'>
          No expenses found. Start by adding one!
        </p>
      )}
    </div>
  );
}

export default ExpenseListTable;
