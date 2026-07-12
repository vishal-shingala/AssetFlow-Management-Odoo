import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const token = sessionStorage.getItem('auth_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const token = sessionStorage.getItem('auth_token');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}