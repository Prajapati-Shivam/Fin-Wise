'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function MobileNavMenu({ links }) {
  const pathname = usePathname();

  return (
    <NavigationMenu className='sm:hidden'>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='text-base font-semibold rounded-md'>
            Menu
          </NavigationMenuTrigger>
          <NavigationMenuContent className='bg-popover p-2 rounded-md shadow-lg'>
            <ul className='grid gap-1'>
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li key={link.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className={clsx(
                          'flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-muted/70 text-muted-foreground'
                        )}
                      >
                        {link.icon && (
                          <link.icon className='w-4 h-4 text-primary' />
                        )}
                        {link.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
