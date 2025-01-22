import React from 'react';
import IncomeList from './_components/IncomeList';

function Income() {
  return (
    <div className='px-4 sm:px-8 py-10'>
      <h2 className='font-bold text-3xl'>My Income Streams</h2>
      <IncomeList />
    </div>
  );
}

export default Income;
