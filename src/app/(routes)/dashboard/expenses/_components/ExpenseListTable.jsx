'use client';
import useFinanceStore from '@/app/_store/financeStore';

import { ReceiptText } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DeleteExpenseDialog } from './DeleteExpenseDialog';

function ExpenseListTable({ expensesList }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [sortBy, setSortBy] = useState(null); // 'amount' | 'date'
  const [sortOrder, setSortOrder] = useState('desc');

  const { categoryList } = useFinanceStore();

  const getCategoryInfo = (categoryId) =>
    categoryList.find((c) => c.id === categoryId);

  const filteredExpenses = useMemo(() => {
    let filtered = [...expensesList];

    if (selectedCategoryId) {
      filtered = filtered.filter(
        (e) => String(e.categoryId) === selectedCategoryId
      );
    }

    if (sortBy === 'amount') {
      filtered.sort((a, b) =>
        sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
      );
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) =>
        sortOrder === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return filtered;
  }, [expensesList, selectedCategoryId, sortBy, sortOrder]);

  return (
    <div className='overflow-x-auto'>
      <div className='flex flex-wrap gap-4 my-4 items-center'>
        {categoryList.map((cat) => (
          <Button
            key={cat.id}
            variant={`${selectedCategoryId === cat.id ? 'outline' : 'primary'}`}
            onClick={() => {
              setSelectedCategoryId(
                selectedCategoryId === cat.id ? '' : cat.id
              );
            }}
          >
            {cat.icon} {cat.name}
          </Button>
        ))}

        <Button
          variant='outline'
          onClick={() => {
            setSortBy('amount');
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
          }}
        >
          Sort by Amount{' '}
          {sortBy === 'amount' &&
            (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
        </Button>

        <Button
          variant='outline'
          onClick={() => {
            setSortBy('date');
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
          }}
        >
          Sort by Date{' '}
          {sortBy === 'date' &&
            (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
        </Button>
      </div>

      {filteredExpenses.length > 0 ? (
        <Table>
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='font-bold'>Category</TableHead>
              <TableHead className='font-bold'>Expense</TableHead>
              <TableHead className='font-bold'>Amount</TableHead>
              <TableHead className='font-bold'>Date</TableHead>
              <TableHead className='text-right font-bold'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => {
              const category = getCategoryInfo(expense.categoryId);
              return (
                <TableRow key={expense.id}>
                  <TableCell>
                    {category ? (
                      <div
                        className='flex items-center gap-2 group relative'
                        title={`${category.percentage || 0}% of total`}
                      >
                        <span className='text-xl'>{category.icon}</span>
                        <span>{category.name}</span>
                        <div className='absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition'>
                          {category.percentage || '0.0'}% of spending
                        </div>
                      </div>
                    ) : (
                      <span className='text-gray-500 italic'>Unknown</span>
                    )}
                  </TableCell>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>
                    ₹ {Number(expense.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='float-end'>
                    <DeleteExpenseDialog expense={expense} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className='flex flex-col gap-4 mt-8 justify-center items-center border-2 py-5 rounded-2xl'>
          <div className='border-4 border-black dark:border-white p-4 rounded-full'>
            <ReceiptText className='size-14' />
          </div>
          <h3 className='font-semibold text-2xl'>No Expense found</h3>
          <p className='text-gray-800 dark:text-gray-200 text-center'>
            Get started by adding a new expense
          </p>
          <Link href={'/dashboard/expenses'}>
            <Button variant='secondary' className='rounded-full'>
              + New Expense
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ExpenseListTable;
