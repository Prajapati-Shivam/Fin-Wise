import React from 'react';
import BudgetList from './_components/BudgetList';

const Budgets = () => {
  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>My Budgets</h2>
      <BudgetList />
    </div>
  );
};

export default Budgets;
