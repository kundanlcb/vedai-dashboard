import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { ROLES } from '@/constants';

interface AdminRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export const AdminRoute = ({ children, requiredRole = ROLES.SUPER_ADMIN }: AdminRouteProps) => {
  const { isAuthenticated, isRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

