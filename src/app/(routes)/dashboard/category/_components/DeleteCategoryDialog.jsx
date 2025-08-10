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
import { Category, Expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';

export function DeleteCategoryDialog({ category, refreshData }) {
  const [deletingId, setDeletingId] = useState(null);

  const deleteCategory = async (category) => {
    if (!category?.id) return;
    setDeletingId(category.id);
    try {
      // also delete all expenses associated with this category
      await db.delete(Expenses).where(eq(Expenses.categoryId, category.id));

      const result = await db
        .delete(Category)
        .where(eq(Category.id, category.id))
        .returning();

      if (result.length > 0) {
        toast.success('Category Deleted!');
        // refreshData();
      } else {
        toast.error('Failed to delete category.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('An error occurred while deleting the category.');
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash
          className={`text-red-500 cursor-pointer ${
            deletingId == category.id ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete the
            category <strong>{category.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteCategory(category)}
            className='bg-red-600 hover:bg-red-700'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
