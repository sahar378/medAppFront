// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRoles, setUserRoles] = useState(() => {
    const authorities = JSON.parse(localStorage.getItem('authorities') || '[]');
    return authorities.map(auth => auth.authority);
  });
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [redirectUrls, setRedirectUrls] = useState(JSON.parse(localStorage.getItem('redirectUrls') || '[]'));
  const [activeRole, setActiveRole] = useState(localStorage.getItem('activeRole') || ''); // Nouvel état

  const login = async (userId, password) => {
    try {
      const response = await authService.login(userId, password);
      setIsAuthenticated(true);
      const authorities = response.authorities || [];
      const roles = authorities.map(auth => auth.authority);
      const urls = response.urls || [];
      setUserRoles(roles);
      setUserId(userId);
      setRedirectUrls(urls);
      localStorage.setItem('token', response.token);
      localStorage.setItem('authorities', JSON.stringify(authorities));
      localStorage.setItem('userId', userId);
      localStorage.setItem('redirectUrls', JSON.stringify(urls));
      if (roles.length === 1) {
        setActiveRole(roles[0]); // Définit le rôle actif si un seul rôle
        localStorage.setItem('activeRole', roles[0]);
      } else {
        setActiveRole(''); // Pas de rôle actif par défaut pour plusieurs rôles
        localStorage.removeItem('activeRole');
      }
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUserRoles([]);
      setUserId('');
      setRedirectUrls([]);
      setActiveRole('');
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserRoles([]);
    setUserId('');
    setRedirectUrls([]);
    setActiveRole('');
    localStorage.clear();
  };

  const setActiveSpace = (role) => {
    setActiveRole(role);
    localStorage.setItem('activeRole', role);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRoles, userId, redirectUrls, activeRole, login, logout, setActiveSpace }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
/*Ajout de activeRole pour suivre le rôle actif.
Ajout de setActiveSpace pour mettre à jour le rôle actif.
Lors de la connexion (login), si l’utilisateur a un seul rôle, activeRole est défini automatiquement. 
Sinon, il reste vide jusqu’à ce que l’utilisateur choisisse un espace.*/