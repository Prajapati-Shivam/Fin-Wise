'use client';
import { useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import InfoSection from './_components/InfoSection';
import { db } from '@/db';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses, Incomes } from '@/db/schema';

const Dashboard = () => {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    user && getBugetList();
  }, [user]);

  const getBugetList = async () => {
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
      getAllExpenses();
      getIncomeList();
    } catch (error) {
      console.log('Error fetching budget: ', error);
    }
  };

  const getIncomeList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`sum(case(${Incomes.amount} as numberic))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .groupBy(Incomes.id);

      setIncomeList(result);
    } catch (error) {
      console.log('Error fetching income list: ', error);
    }
  };

  const getAllExpenses = async () => {
    try {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdBy,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expenses.id));

      setExpenseList(result);
    } catch (error) {
      console.log('Error fetching expense list: ', error);
    }
  };
  return (
    <div className='p-8'>
      <h2 className='text-4xl font-bold'>Hi, {user?.fullName}</h2>
      <p className='text-gray-600 dark:text-gray-400'>
        What happening with your money? Let manage your expenses.
      </p>
      <div>
        <InfoSection budgetList={budgetList} incomeList={incomeList} />
      </div>
    </div>
  );
};

export default Dashboard;
