import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? <Navigate to='/dashboard' replace/> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
