'use client';
import { useUser } from '@clerk/nextjs';
import InfoSection from './_components/InfoSection';
import { useRouter } from 'next/navigation';
const Dashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  if (!user) router.push('/sign-in');

  return (
    <div className='p-8'>
      <h2 className='text-4xl font-bold'>Hi, {user?.fullName}👋</h2>
      <p className='text-gray-600 dark:text-gray-400 mt-2'>
        What happening with your money? Let manage your expenses.
      </p>
      <div>
        <InfoSection />
      </div>
    </div>
  );
};

export default Dashboard;
