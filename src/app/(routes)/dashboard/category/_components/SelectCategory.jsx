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
  const { currentUser, categoryList, fetchCategoryList } = useFinanceStore();
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchCategoryList(currentUser?.id);
    }
  }, [
    fetchCategoryList,
    currentUser?.id,
    user?.primaryEmailAddress?.emailAddress,
  ]);

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder='Select a category' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categoryList.length === 0 && (
            <SelectItem disabled value='no-categories'>
              No categories available. Create one first.
            </SelectItem>
          )}

          {categoryList.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
