'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useFinanceStore from '@/app/_store/financeStore';

export function SelectCategory({ onChange }) {
  const fetchCategoryList = useFinanceStore((state) => state.fetchCategoryList);
  const categoryList = useFinanceStore((state) => state.categoryList);
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchCategoryList(user.primaryEmailAddress.emailAddress);
    }
  }, [user?.primaryEmailAddress?.emailAddress, fetchCategoryList]);

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder='Select a category' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categoryList.length === 0 && (
            <SelectItem disabled value='no-categories'>
              No categories available
            </SelectItem>
          )}

          {categoryList.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}

          <div className='text-sm text-blue-500 p-2 text-center'>
            <Link href='/dashboard/category'>+ Create New Category</Link>
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
