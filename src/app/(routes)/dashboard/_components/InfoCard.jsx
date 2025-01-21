import React from 'react';
import formatNumber from '@/lib/formatNum';
import { PiggyBank } from 'lucide-react';

const InfoCard = ({ amount, title, icon: Icon = PiggyBank }) => {
  return (
    <div className='border p-5 rounded-2xl flex items-center justify-between bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div>
        <h3 className='text-gray-700 dark:text-gray-300 text-lg font-medium'>
          {title}
        </h3>
        <div className='font-bold text-2xl text-gray-900 dark:text-white'>
          {title == 'Number of Budgets'
            ? `${formatNumber(amount)}`
            : `₹${formatNumber(amount)}`}
        </div>
      </div>
      <div className='flex items-center justify-center size-14 rounded-full bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 text-white'>
        <Icon size={30} />
      </div>
    </div>
  );
};

export default InfoCard;
