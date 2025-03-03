//src/context/AuthContext
//Fournit un contexte global pour gérer l’état d’authentification (connexion, déconnexion, rôle, userId) à travers l’application.
import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();
//Composant enveloppant qui fournit les valeurs et fonctions à tous les composant
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));// Vrai si token existe
  const [userRole, setUserRole] = useState(() => {
    const authorities = JSON.parse(localStorage.getItem('authorities') || '[]');
    return authorities[0]?.authority || null;// Rôle initial ou null
  });
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  const login = async (userId, password) => {
    try {
      const response = await authService.login(userId, password);
      setIsAuthenticated(true);
      const authorities = response.authorities || [];
      setUserRole(authorities[0]?.authority || null);
      setUserId(userId);
      localStorage.setItem('authorities', JSON.stringify(authorities));
      localStorage.setItem('userId', userId);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId('');
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);