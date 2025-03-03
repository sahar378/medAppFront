//src/pages/agent/AgentSpace.jsx
//Affiche l’espace personnel d’un agent (responsable de stock ou personnel médical) après connexion.
// src/pages/agent/AgentSpace.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AgentSpace = () => {
  const { userRole } = useAuth();

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Espace {userRole === 'RESPONSABLE_STOCK' ? 'Responsable de Stock' : 'Personnel Médical'}</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <p>Bienvenue dans votre espace. Vous êtes connecté avec le rôle {userRole}.</p>
                <p>Consultez votre profil dans la barre latérale.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgentSpace;