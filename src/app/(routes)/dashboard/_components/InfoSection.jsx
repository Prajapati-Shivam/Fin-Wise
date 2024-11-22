import { Sparkle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import InfoCard from './InfoCard';

const InfoSection = ({ budgetList, incomeList }) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState('');
  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      calculateInfo();
    }
  }, [budgetList, incomeList]);

  // useEffect(() => {
  //   if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
  //     const fetchAdvice = async () => {
  //       const advice = await getFinancialAdvice(totalBudget, totalIncome, totalSpend);
  //     }
  //     setFinancialAdvice(advice);

  //   }
  //   fetchAdvice();
  // }, [totalBudget, totalIncome, totalSpend])

  const calculateInfo = () => {
    let tBudget = 0;
    let tIncome = 0;
    let tSpend = 0;

    budgetList.forEach((element) => {
      tBudget += Number(element.amount);
      tSpend += element.tSpend;
    });

    incomeList.forEach((element) => {
      tIncome += element.totalAmount;
    });

    setTotalBudget(tBudget);
    setTotalIncome(tIncome);
    setTotalSpend(tSpend);
  };

  return (
    <div>
      {budgetList.length > 0 ? (
        <div>
          <div className='border p-5 mt-4 rounded-2xl flex items-center justify-between'>
            <div>
              <div className='flex mb-2 items-center space-x-1'>
                <h3>FinWise AI</h3>
                <Sparkle className='rounded-full size-10 text-white p-2 animated-background bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500' />
              </div>
              <p className='text-gray-600 text-lg'>
                {financialAdvice || 'Loading financial advice...'}
              </p>
            </div>
          </div>
          <InfoCard title={'Total Budget'} amount={totalBudget} />
          <InfoCard title={'No. of Budget'} amount={budgetList?.length} />
          <InfoCard title={'Total Spend'} amount={totalSpend} />
        </div>
      ) : (
        <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[1, 2, 3].map((item, index) => (
            <div
              className='h-[110px] w-full bg-slate-200 animate-pulse rounded-lg'
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoSection;
