import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useApp } from '../../context/AppContext';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      {/* Main area — margin exactly matches sidebar width, no extra gap */}
      <div
        className={`flex flex-col flex-1 min-h-screen min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]'
        }`}
      >
        <Navbar />
        <main className="flex-1 p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
