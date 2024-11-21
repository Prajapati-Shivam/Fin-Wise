'use client';
import { useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import InfoSection from './_components/InfoSection';

const Dashboard = () => {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  // useEffect(() => {
  //   user && getBugetList();
  // }, [user])

  // const getBugetList = async () => {

  // }
  return (
    <div className='p-8'>
      <h2 className='text-4xl font-bold'>Hi, {user?.fullName}</h2>
      <p className='text-gray-600 dark:text-gray-400'>
        What happening with your money? Let manage your expenses.
      </p>
      <div>{/* <InfoSection budgetList={} incomeList={} /> */}</div>
    </div>
  );
};

export default Dashboard;
