import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';
export function DeleteExpenseDialog({ expense, refreshData }) {
  const [deletingId, setDeletingId] = useState(null);

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
        refreshData();
      } else {
        toast.error('Failed to delete expense.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('An error occurred while deleting the expense.');
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash
          className={`text-red-500 cursor-pointer ${
            deletingId == expense.id ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete the
            expense <strong>{expense.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteExpense(expense)}
            className='bg-red-600 hover:bg-red-700'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
