import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

   if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  };

  return <Outlet />;

};

export default PrivateRoute;
