'use client';
import React from 'react';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = [
  '#6366f1',
  '#60a5fa',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
];

function ChartsSection({ expenseList, categoryList }) {
  if (!expenseList || expenseList.length === 0) {
    return (
      <div className='border rounded-2xl p-5 flex flex-col items-center justify-center'>
        <h2 className='font-bold text-lg mb-2'>Charts</h2>
        <p className='text-gray-600 dark:text-gray-300'>
          No data available to display.
        </p>
      </div>
    );
  }

  // Aggregate spend by category
  const spendByCategory = categoryList.map((cat) => {
    const total = expenseList
      .filter((e) => e.categoryId === cat.id)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return { name: cat.name, value: total };
  });

  // Spending over time (by date)
  const spendOverTime = expenseList.reduce((acc, e) => {
    const date = new Date(e.createdAt).toLocaleDateString();
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.amount += Number(e.amount);
    } else {
      acc.push({ date, amount: Number(e.amount) });
    }
    return acc;
  }, []);

  return (
    <div className='flex flex-col gap-5'>
      {/* Bar Chart - Spending by Category */}
      <div className='border rounded-2xl p-3 sm:p-5'>
        <h2 className='font-bold text-lg mb-4'>Spending by Category</h2>
        <ResponsiveContainer width='100%'>
          <BarChart
            data={spendByCategory}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='value' fill='#6366f1' name='Total Spent' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Spending Over Time */}
      <div className='border rounded-2xl p-3 sm:p-5'>
        <h2 className='font-bold text-lg mb-4'>Spending Over Time</h2>
        <ResponsiveContainer width='100%'>
          <LineChart
            data={spendOverTime}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='amount'
              stroke='#6366f1'
              name='Spent'
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Expense Distribution */}
      <div className='border rounded-2xl p-3 sm:p-5'>
        <h2 className='font-bold text-lg mb-4'>
          Category-wise Expense Distribution
        </h2>
        <ResponsiveContainer width='100%'>
          <PieChart>
            <Tooltip />
            <Legend verticalAlign='bottom' height={36} />
            <Pie
              data={spendByCategory}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={100}
              label
            >
              {spendByCategory.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartsSection;
