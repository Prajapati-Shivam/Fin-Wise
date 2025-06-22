'use client';
import { Navbar } from './_components/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className='mt-10'>{children}</main>
    </>
  );
}
