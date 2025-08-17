'use client';
import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import useFinanceStore from '@/app/_store/financeStore';
import CategoryItem from './CategoryItem';
import { CreateCategoryDialog } from './CreateCategoryDialog';

function CategoryList() {
  const {
    currentUser,
    categoryList,
    fetchCategoryList,
    fetchExpenseList,
    loading,
    error,
  } = useFinanceStore();

  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  useEffect(() => {
    if (userEmail) {
      fetchCategoryList(currentUser?.id);
      fetchExpenseList(currentUser?.id);
    }
  }, [fetchCategoryList, fetchExpenseList, currentUser?.id, userEmail]);

  const placeholders = Array.from({ length: 5 });

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateCategoryDialog
          refresh={() => fetchCategoryList(currentUser?.id)}
        />

        {loading
          ? placeholders.map((_, index) => (
              <div
                key={index}
                className='w-full bg-slate-200 dark:bg-slate-800 rounded-lg h-[150px] animate-pulse'
              ></div>
            ))
          : categoryList.length > 0
            ? categoryList.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))
            : !loading &&
              !error && (
                <div className='w-full col-span-1 md:col-span-2 lg:col-span-3 text-center'>
                  <p className='text-gray-500'>No categories available</p>
                </div>
              )}
      </div>

      {error && <div className='mt-4 text-red-600 text-center'>{error}</div>}
    </div>
  );
}

export default CategoryList;
