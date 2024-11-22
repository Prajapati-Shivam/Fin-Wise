'use client';
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import { db } from '@/db';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/db/schema';
import { useUser } from '@clerk/nextjs';
import BudgetItem from './BudgetItem';

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getBudgetList();
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  const getBudgetList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      console.log(result);
      setBudgetList(result);
    } catch (error) {
      console.error('Error fetching budget list:', error);
    }
  };
  const placeholders = Array.from({ length: 5 });
  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget refreshData={() => getBudgetList()} />
        {budgetList?.length > 0
          ? budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))
          : placeholders.map((_, index) => (
              <div
                key={index}
                className='w-full bg-slate-200 dark:bg-slate-800 rounded-lg h-[150px] animate-pulse'
              ></div>
            ))}
      </div>
    </div>
  );
}

export default BudgetList;
