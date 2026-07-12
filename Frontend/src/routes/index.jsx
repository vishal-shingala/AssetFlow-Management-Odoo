import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import App from '../App.jsx';
import { GlobalError } from '../components/error/GlobalError.jsx';
import { NotFound } from '../components/error/NotFound.jsx';
import { ProtectedRoute, PublicRoute } from '../components/auth/RouteGuards.jsx';

// Lazy load pages
const Login = lazy(() => import('../features/login/pages/Login.jsx'));
const Signup = lazy(() => import('../features/signup/pages/Signup.jsx'));
const Dashboard = lazy(() => import('../features/dashboard/pages/Dashboard.jsx'));
const OrganizationSetup = lazy(() => import('../features/OrganizationSetup/pages/OrganizationSetup.jsx'));
const Employees = lazy(() => import('../features/employees/pages/Employees.jsx'));
const Assets = lazy(() => import('../features/assets/pages/Assets.jsx'));
const Allocations = lazy(() => import('../features/allocations/pages/Allocations.jsx'));
const Bookings = lazy(() => import('../features/bookings/pages/Bookings.jsx'));
const Maintenance = lazy(() => import('../features/maintenance/pages/Maintenance.jsx'));
const Reports = lazy(() => import('../features/reports/pages/Reports.jsx'));
const Settings = lazy(() => import('../features/settings/pages/Settings.jsx'));

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    errorElement: <GlobalError />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <GlobalError />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'organizationsetup', element: <OrganizationSetup /> },
          { path: 'employees', element: <Employees /> },
          { path: 'assets', element: <Assets /> },
          { path: 'allocations', element: <Allocations /> },
          { path: 'bookings', element: <Bookings /> },
          { path: 'maintenance', element: <Maintenance /> },
          { path: 'reports', element: <Reports /> },
          { path: 'settings', element: <Settings /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]);
