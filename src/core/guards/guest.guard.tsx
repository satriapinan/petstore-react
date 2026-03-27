import { useAuth } from '@/core/services/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const GuestGuard = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to={user?.username === 'admin' ? '/dashboard' : '/pets'} replace />;
};

export default GuestGuard;
