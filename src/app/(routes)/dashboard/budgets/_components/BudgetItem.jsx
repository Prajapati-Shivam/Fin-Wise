import Link from 'next/link';
import React from 'react';

function BudgetItem({ budget, refreshData }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  return (
    <Link href={'/dashboard/expenses/' + budget?.id}>
      <div
        className='p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[150px] flex flex-col justify-between'
        onClick={refreshData}
      >
        <div className='flex gap-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <h2 className='text-2xl size-10 flex items-center justify-center bg-slate-100 rounded-full'>
              {budget?.icon}
            </h2>
            <div>
              <h2 className='font-bold'>{budget.name}</h2>
              <h2 className='text-sm text-gray-500'>
                {budget.totalItem} Item(s)
              </h2>
            </div>
          </div>
          <h2 className='font-bold text-primary text-lg'>${budget.amount}</h2>
        </div>

        {/* Progress Bar Section */}
        <div className='mt-5'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-xs text-slate-400'>
              ${budget.totalSpend ? budget.totalSpend : 0} Spent
            </div>
            <div className='text-xs text-slate-400'>
              ${budget.amount - budget.totalSpend} Remaining
            </div>
          </div>
          <div className='w-full bg-slate-300 h-2 rounded-full'>
            <div
              className='bg-gray-500 h-2 rounded-full'
              style={{
                width: `${calculateProgressPerc()}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;
