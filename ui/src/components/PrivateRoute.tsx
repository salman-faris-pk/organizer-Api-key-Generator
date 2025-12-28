import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import Loader from './Loader';


const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;