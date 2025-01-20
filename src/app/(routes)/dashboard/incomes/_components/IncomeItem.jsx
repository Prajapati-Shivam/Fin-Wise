import React from 'react';

function IncomeItem({ income }) {
  const calculateProgressPerc = () => {
    const perc = (income.totalReceived / income.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2); // Cap progress percentage at 100%
  };

  return (
    <div className='p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[150px] flex flex-col justify-between'>
      {/* Header Section */}
      <div className='flex gap-2 items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <h2 className='text-2xl size-10 flex items-center justify-center bg-slate-100 rounded-full'>
            {income?.icon || '📈'}
          </h2>
          <div>
            <h2 className='font-bold'>{income.name || 'Unnamed Source'}</h2>
            <h2 className='text-sm text-gray-500'>
              {income.totalItem || 0} Item(s)
            </h2>
          </div>
        </div>
        <h2 className='font-bold text-primary text-lg'>
          ₹{income.amount || 0}
        </h2>
      </div>

      {/* Progress Bar Section */}
      <div className='mt-5'>
        <div className='flex items-center justify-between mb-3'>
          <div className='text-xs text-slate-400'>
            ₹{income.totalReceived ? income.totalReceived : 0} Received
          </div>
          <div className='text-xs text-slate-400'>
            ₹{(income.amount || 0) - (income.totalReceived || 0)} Remaining
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
  );
}

export default IncomeItem;
