// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [profiles, setProfiles] = useState(() => {
    //profiles, une liste d’objets contenant role, url, et descriptif retourné avec le token et le message
    return JSON.parse(localStorage.getItem('profiles') || '[]');
  });
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [activeRole, setActiveRole] = useState(localStorage.getItem('activeRole') || '');

  const login = async (userId, password) => {
    try {
      const response = await authService.login(userId, password);
      setIsAuthenticated(true);
      setProfiles(response.profiles);
      setUserId(userId);
      localStorage.setItem('token', response.token);
      if (response.profiles.length === 1) {
        setActiveRole(response.profiles[0].role);
        localStorage.setItem('activeRole', response.profiles[0].role);
      } else {
        setActiveRole('');
        localStorage.removeItem('activeRole');
      }
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setProfiles([]);
      setUserId('');
      setActiveRole('');
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setProfiles([]);
    setUserId('');
    setActiveRole('');
    localStorage.clear();
  };
//La fonction setActiveSpace permet de mettre à jour activeRole et le stocke dans le localstorage
  const setActiveSpace = (role) => {
    setActiveRole(role);
    localStorage.setItem('activeRole', role);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profiles,
        userId,
        activeRole,
        login,
        logout,
        setActiveSpace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/*Ajout de activeRole pour suivre le rôle actif.
Ajout de setActiveSpace pour mettre à jour le rôle actif.
Lors de la connexion (login), si l’utilisateur a un seul rôle, activeRole est défini automatiquement. 
Sinon, il reste vide jusqu’à ce que l’utilisateur choisisse un espace.

*État géré:
isAuthenticated : Indique si l’utilisateur est connecté (basé sur la présence d’un token dans localStorage).
profiles : Liste des profils/permissions de l’utilisateur, récupérée depuis le backend lors de la connexion. Exemple : [{ role: "INFIRMIER", url: "/medical/infirmier", descriptif: "Espace Infirmier" }, { role: "PERSONNEL_MEDICAL", url: "/medical", descriptif: "Espace Médical" }].
userId : Identifiant de l’utilisateur connecté.
activeRole : Rôle actif de l’utilisateur (ex. "INFIRMIER"), utilisé pour déterminer les redirections et les permissions.

*Fonction login :
Appelle authService.login pour authentifier l’utilisateur.
Si la connexion réussit, stocke le token et les profils dans localStorage et met à jour l’état.
Si l’utilisateur a un seul rôle (response.profiles.length === 1), définit activeRole automatiquement et stocke ce rôle dans localStorage.
Si l’utilisateur a plusieurs rôles, activeRole est défini comme une chaîne vide (''), ce qui déclenche une redirection vers /role-selection dans Login.jsx.

*Fonction setActiveSpace :
Utilisée dans RoleSelection pour définir activeRole lorsqu’un utilisateur choisit un espace.
Met à jour activeRole dans l’état et dans localStorage, permettant à l’application de savoir quel rôle est actif pour les redirections et l’affichage (ex. dans Navbar et Sidebar).

*onction logout :
Réinitialise tous les états (isAuthenticated, profiles, userId, activeRole) et vide localStorage, déconnectant l’utilisateur.

=>AuthContext fournit les données nécessaires (profiles et activeRole) pour que Login.jsx et Home.jsx puissent décider où rediriger l’utilisateur.
La logique de redirection est basée sur la condition profiles.length > 1 && !activeRole, qui est vérifiée à la fois après la connexion et lors de l’accès à certaines pages.


*exemple de réponse de backend :
{
  "token": "jwt-token",
  "profiles": [
    { "role": "PERSONNEL_MEDICAL", "url": "/medical", "descriptif": "Espace Médical" },
    { "role": "INFIRMIER", "url": "/medical/infirmier", "descriptif": "Espace Infirmier" }
  ]
}
*/