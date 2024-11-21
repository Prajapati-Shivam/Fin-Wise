import React from 'react';
import formatNumber from '@/lib/formatNum';
import { PiggyBank, ReceiptText, Wallet, CircleDollarSign } from 'lucide-react';

const InfoCard = ({ amount, title, icon }) => {
  return (
    <div className='mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
      <div className='border p-5 mt-4 rounded-2xl flex items-center justify-between'>
        <div>
          <h3>{title}</h3>
          <div className='font-bold text-2xl'>₹ {formatNumber(amount)}</div>
        </div>
        <PiggyBank />
      </div>
    </div>
  );
};

export default InfoCard;
