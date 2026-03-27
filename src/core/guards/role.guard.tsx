import { useAuth } from '@core/services/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

interface RoleGuardProps {
  requiredRole: string;
}

const RoleGuard = ({ requiredRole }: RoleGuardProps) => {
  const { user } = useAuth();

  if (user?.username === requiredRole) {
    return <Outlet />;
  }

  return <Navigate to="/pets" replace />;
};

export default RoleGuard;
