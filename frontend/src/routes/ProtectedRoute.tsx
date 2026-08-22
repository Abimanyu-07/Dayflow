import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/services/authApi';
import { LoadingState } from '@/components/common/LoadingState';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <LoadingState />
      </div>
    );
  }

  // Check 1: Must be authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check 2: Role Authorization Guard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If an EMPLOYEE attempts to access an HR route:
    if (user.role === 'EMPLOYEE') {
      toast.error('Access denied. HR Administrator permissions required.');
      return <Navigate to="/employee/dashboard" replace />;
    }

    // If an HR officer accesses an employee route or unauthorized path:
    if (user.role === 'HR') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
