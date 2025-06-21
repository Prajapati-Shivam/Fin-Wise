import React from 'react';
import { ChartPie } from 'lucide-react';

function CategoryItem({ category }) {
  return (
    <div className='p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[150px] flex flex-col justify-between'>
      {/* Top: Icon and Name */}
      <div className='flex gap-2 items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <h2 className='text-2xl size-10 flex items-center justify-center bg-slate-100 rounded-full'>
            {category?.icon}
          </h2>
          <div>
            <h4 className='font-bold text-lg'>{category.name}</h4>
            <p className='text-sm text-muted-foreground'>
              {category.expenseCount || 0} transaction
              {category.expenseCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {/* Pie % */}
        <div className='flex items-center text-sm text-blue-600 font-semibold gap-1'>
          <ChartPie size={16} />
          {category.percentage || '0.0'}%
        </div>
      </div>

      {/* Bottom: Expense Amount */}
      <div className='mt-4'>
        <div className='text-sm text-muted-foreground'>Total Spent</div>
        <div className='text-xl font-semibold text-gray-900 dark:text-white'>
          ₹{category.totalExpenseAmount || 0}
        </div>
      </div>
    </div>
  );
}

export default CategoryItem;
