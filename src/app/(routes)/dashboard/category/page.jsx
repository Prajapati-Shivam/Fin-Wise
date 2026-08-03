import React from 'react';
import CategoryList from './_components/CategoryList';

const Category = () => {
  return (
    <div className='px-4 sm:px-8 py-10'>
      <h2 className='font-bold text-3xl'>My Categories</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Starter categories are added automatically so you can begin tracking
        expenses right away.
      </p>
      <CategoryList />
    </div>
  );
};

export default Category;
