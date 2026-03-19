import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import type { ReactNode } from 'react';

// RequireAuth guard kept for later use (when we truly block routes)
interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// RootGuard specifically for the '/' path logic
export const RootGuard = () => {
  const { user } = useAuthContext();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};
