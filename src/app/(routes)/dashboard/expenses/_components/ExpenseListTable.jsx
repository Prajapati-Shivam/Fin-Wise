'use client';
import useFinanceStore from '@/app/_store/financeStore';
import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

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
    <div className='mt-3'>
      <h2 className='font-bold text-lg'>Latest Expenses</h2>

      <table width={100} className='w-full mt-3 text-left border rounded-xl'>
        <thead>
          <tr>
            <th>Budget</th>
            <th>Expense</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {expensesList.length > 0 ? (
            expensesList.map((expense) => (
              <tr key={expense.id}>
                <td>{getBudgetName(expense.budgetId)}</td>
                <td>{expense.name}</td>
                <td>₹ {Number(expense.amount).toLocaleString()}</td>
                <td>{expense.createdAt}</td>
                <td>
                  <Trash
                    className={`text-red-500 cursor-pointer ${
                      deletingId == expense.id
                        ? 'opacity-50 pointer-events-none'
                        : ''
                    }`}
                    onClick={() => deleteExpense(expense)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4' className='text-center py-4 text-gray-500'>
                No expenses found. Add some expenses to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* <div className='grid grid-cols-4 rounded-tl-xl rounded-tr-xl p-4 mt-3 font-bold'>
        <p>Budget</p>
        <p>Expense</p>
        <p>Amount</p>
        <p>Action</p>
      </div>

      {expensesList.length > 0 ? (
        expensesList.map((expense) => (
          <div
            key={expense.id}
            className='grid grid-cols-4 p-4 border-b last:border-none rounded-bl-xl rounded-br-xl'
          >
            <h2>{getBudgetName(expense.budgetId)}</h2>
            <h2>{expense.name}</h2>
            <h2>₹ {Number(expense.amount).toLocaleString()}</h2>
            <h2>{expense.createdAt}</h2>
            <div className='flex items-center gap-2'>
              <Trash
                className={`text-red-500 cursor-pointer ${
                  deletingId == expense.id
                    ? 'opacity-50 pointer-events-none'
                    : ''
                }`}
                onClick={() => deleteExpense(expense)}
              />
            </div>
          </div>
        ))
      ) : (
        <div className='text-center py-4 text-gray-500'>
          No expenses found. Add some expenses to get started!
        </div>
      )} */}
    </div>
  );
}

export default ExpenseListTable;
