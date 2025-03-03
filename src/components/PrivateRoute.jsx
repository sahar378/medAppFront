//src/components/PrivateRoute.
/*Protège les routes en vérifiant si l’utilisateur est authentifié et a le rôle requis, sinon redirige vers /login ou /.*/
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();// Récupère l'état d'authentification et le rôle

  if (!isAuthenticated) {
    return <Navigate to="/login" />;// Redirige si non connecté
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;// Redirige si rôle incorrect
  }
  return <Outlet />;// Affiche la route protégée si OK
  //Outlet : Rend les composants enfants de la route protégée.
};

export default PrivateRoute;