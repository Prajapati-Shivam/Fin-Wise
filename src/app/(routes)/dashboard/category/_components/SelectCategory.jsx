'use client';
import React, { useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useFinanceStore from '@/app/_store/financeStore';
import Link from 'next/link';

export function SelectCategory() {
  const fetchCategoryList = useFinanceStore((state) => state.fetchCategoryList);
  const categoryList = useFinanceStore((state) => state.categoryList);

  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder='Select a category' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Categories</SelectLabel> */}
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
          {/* <SelectItem>
            <Link href='/category'>+ Create category</Link>
          </SelectItem> */}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
