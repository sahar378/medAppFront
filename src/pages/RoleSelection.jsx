// src/pages/RoleSelection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleSelection = () => {
  const { profiles, setActiveSpace } = useAuth();

  const handleSpaceSelection = (role) => {
    setActiveSpace(role);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f9',
      }}
    >
      <h2>Choisissez votre espace</h2>
      <div style={{ textAlign: 'center' }}>
        {profiles
          .filter(profile => profile.role !== 'SUPER_ADMIN') // Exclure SUPER_ADMIN
          .map((profile) => (
            <p key={profile.role} style={{ margin: '10px 0' }}>
              <Link
                to={profile.url}
                onClick={() => handleSpaceSelection(profile.role)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  display: 'inline-block',
                }}
              >
                {profile.descriptif}
              </Link>
            </p>
          ))}
      </div>
    </div>
  );
};

export default RoleSelection;
/*Affichage des espaces :
RoleSelection utilise profiles (extrait de AuthContext) pour afficher une liste d’espaces disponibles.
Chaque profil est représenté par un bouton (via un Link) qui affiche le descriptif (ex. "Espace Infirmier") et pointe vers l’url correspondante (ex. /medical/infirmier).
Les profils avec le rôle SUPER_ADMIN sont exclus de la liste via le filtre profile.role !== 'SUPER_ADMIN'.
Sélection d’un espace :
Lorsqu’un utilisateur clique sur un espace (ex. "Espace Infirmier"), la fonction handleSpaceSelection est appelée.
handleSpaceSelection appelle setActiveSpace (fourni par AuthContext), qui définit activeRole (ex. "INFIRMIER") et le stocke dans localStorage.
Le Link redirige l’utilisateur vers l’URL du profil choisi (ex. /medical/infirmier).
*/