// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
/*Remplace userRoles par activeRole.
Utilise requiredRoles (au pluriel) pour accepter un tableau de rôles autorisés.
Si activeRole ne correspond pas à un des requiredRoles, redirige vers /.*/
const PrivateRoute = ({ requiredRoles }) => {
  const { isAuthenticated, activeRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si requiredRoles est spécifié, vérifier que activeRole est dans la liste
  console.log('isAuthenticated:', isAuthenticated, 'activeRole:', activeRole);
  if (requiredRoles && !requiredRoles.includes(activeRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
/*const PrivateRoute = ({ requiredRole }) => {
  const { isAuthenticated, userRoles } = useAuth(); // Changement de userRole à userRoles*

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && !userRoles.includes(requiredRole)) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PrivateRoute;*/