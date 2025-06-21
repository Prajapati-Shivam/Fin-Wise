import React from 'react';
import CategoryList from './_components/CategoryList';

const Category = () => {
  return (
    <div className='px-4 sm:px-8 py-10'>
      <h2 className='font-bold text-3xl'>My Category</h2>
      <CategoryList />
    </div>
  );
};

export default Category;
