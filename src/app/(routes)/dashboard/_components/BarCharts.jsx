import React from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function BarCharts({ budgetList }) {
  if (!budgetList || budgetList.length === 0) {
    return (
      <div className='border rounded-2xl p-5 flex flex-col items-center justify-center'>
        <h2 className='font-bold text-lg mb-2'>Activity</h2>
        <p className='text-gray-600 dark:text-gray-300'>
          No data available to display.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 rounded shadow-lg text-gray-700'>
          <p className='font-bold'>{payload[0].payload.name}</p>
          <p>Total Spend: ₹{payload[0].value}</p>
          <p>Total Budget: ₹{payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='border rounded-2xl p-3 sm:p-5'>
      <h2 className='font-bold text-lg mb-4'>Activity</h2>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart
          data={budgetList}
          margin={{
            top: 20,
            right: 20,
            left: 10,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey='name'
            label={{
              value: 'Budget Name',
              position: 'insideBottom',
              offset: -10,
            }}
          />
          <YAxis
            label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign='top'
            wrapperStyle={{
              top: -10,
              left: 25,
              fontSize: '12px',
            }}
          />
          <Bar
            dataKey='totalSpend'
            name='Total Spend'
            stackId='a'
            fill='#4845d2'
          />
          <Bar
            dataKey='amount'
            name='Total Budget'
            stackId='a'
            fill='#C3C2FF'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarCharts;
