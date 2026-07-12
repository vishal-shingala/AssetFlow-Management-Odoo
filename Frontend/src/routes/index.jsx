import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import App from '../App.jsx';
import { GlobalError } from '../components/error/GlobalError.jsx';
import { NotFound } from '../components/error/NotFound.jsx';

// Lazy load pages
const Login = lazy(() => import('../pages/Login.jsx'));
const Signup = lazy(() => import('../pages/Signup.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard.jsx'));
const Departments = lazy(() => import('../pages/Departments/Departments.jsx'));
const Employees = lazy(() => import('../pages/Employees/Employees.jsx'));
const Assets = lazy(() => import('../pages/Assets/Assets.jsx'));
const Allocations = lazy(() => import('../pages/Allocations/Allocations.jsx'));
const Bookings = lazy(() => import('../pages/Bookings/Bookings.jsx'));
const Maintenance = lazy(() => import('../pages/Maintenance/Maintenance.jsx'));
const Reports = lazy(() => import('../pages/Reports/Reports.jsx'));
const Settings = lazy(() => import('../pages/Settings/Settings.jsx'));

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
