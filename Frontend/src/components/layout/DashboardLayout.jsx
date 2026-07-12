import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useApp } from '../../context/AppContext';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Navbar />
        <main className="flex-1 p-8">
          <Suspense fallback={<LoadingSpinner />}>
            <div className="fadeinup animation-duration-300 animation-iteration-1">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
