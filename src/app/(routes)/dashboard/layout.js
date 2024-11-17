import { Navbar } from './_components/Navbar';
import { SideNav } from './_components/SideNav';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <SideNav />
      <main>{children}</main>
    </>
  );
}
