'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

export function MobileNavMenu({ links }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className='sm:hidden'>
      <Select
        value={pathname}
        onValueChange={(value) => {
          if (value) {
            router.push(value);
          }
        }}
        className='w-full'
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a page' />
        </SelectTrigger>
        <SelectContent>
          {links.map((link) => (
            <SelectItem
              key={link.name}
              value={link.href}
              className={clsx(
                'flex items-center gap-2',
                pathname.endsWith(link.href) && 'font-bold text-primary'
              )}
            >
              <span>{link.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
