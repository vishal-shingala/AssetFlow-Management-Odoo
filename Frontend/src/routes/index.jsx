import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import App from '../App.jsx';
import { GlobalError } from '../components/error/GlobalError.jsx';
import { NotFound } from '../components/error/NotFound.jsx';

// Lazy load pages
const Login = lazy(() => import('../features/login/pages/Login.jsx'));
const Signup = lazy(() => import('../features/signup/pages/Signup.jsx'));
const Dashboard = lazy(() => import('../features/dashboard/pages/Dashboard.jsx'));
const Departments = lazy(() => import('../features/departments/pages/Departments.jsx'));
const Employees = lazy(() => import('../features/employees/pages/Employees.jsx'));
const Assets = lazy(() => import('../features/assets/pages/Assets.jsx'));
const Allocations = lazy(() => import('../features/allocations/pages/Allocations.jsx'));
const Bookings = lazy(() => import('../features/bookings/pages/Bookings.jsx'));
const Maintenance = lazy(() => import('../features/maintenance/pages/Maintenance.jsx'));
const Reports = lazy(() => import('../features/reports/pages/Reports.jsx'));
const Settings = lazy(() => import('../features/settings/pages/Settings.jsx'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
    errorElement: <GlobalError />,
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <GlobalError />,
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <GlobalError />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'departments', element: <Departments /> },
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
]);
