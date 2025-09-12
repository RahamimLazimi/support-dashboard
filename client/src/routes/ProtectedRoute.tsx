import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/redux';

interface ProtectedRouteProps {
  children: React.ReactElement;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.roles.includes('Admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
}
