// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ requiredRole }) => {
  const { isAuthenticated, userRoles } = useAuth(); // Changement de userRole à userRoles

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && !userRoles.includes(requiredRole)) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PrivateRoute;