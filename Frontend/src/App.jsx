import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardLayout />
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#111827',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}

export default App;
