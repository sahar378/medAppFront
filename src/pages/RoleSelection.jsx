// src/pages/RoleSelection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleSelection = () => {
  const { userRoles, redirectUrls, setActiveSpace } = useAuth();
//pour appeler setActiveSpace lors du clic sur un lien, définissant ainsi l’espace actif avant la redirection.
  const handleSpaceSelection = (role) => {
    setActiveSpace(role); // Définit l'espace actif
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
        {userRoles.map((role, index) => (
          <p key={role} style={{ margin: '10px 0' }}>
            <Link
              to={redirectUrls[index]}
              onClick={() => handleSpaceSelection(role)} // Met à jour l'espace actif
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                display: 'inline-block',
              }}
            >
              {role.replace('_', ' ')}
            </Link>
          </p>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;