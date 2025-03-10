// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Sidebar = () => {
  const { userId, activeRole, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = React.useState({ nom: '', prenom: '' });

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return; // Évite l'appel si userId est undefined
      try {
        const response = await authService.getProfile(userId);
        setUserProfile({ nom: response.data.nom, prenom: response.data.prenom });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
      }
    };
    fetchUserProfile();
  }, [userId]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="/" className="brand-link" title="Retourner à l'accueil">
        <span className="brand-text font-weight-light">PrivateApp</span>
        <img
          src="/images/kidney-logo.png"
          alt="Kidney Logo"
          className="brand-image img-circle elevation-3"
          style={{ marginLeft: '10px', width: '35px', height: '120px' }}
        />
      </Link>
      {isAuthenticated && userId && (
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <i className="fas fa-user fa-lg" style={{ color: '#ffffff', padding: '3px' }}></i>
          </div>
          <div className="info">
            <Link
              to="/profile"
              className="nav-link"
              style={{ color: '#ffffff', padding: '0.5px', fontSize: '14px' }}
              title="Cliquez pour voir mon profil"
            >
              {userProfile.prenom} {userProfile.nom}
            </Link>
          </div>
        </div>
      )}
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
            {activeRole === 'INTENDANT' && (
              <>
                {/* Titre non cliquable */}
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>
                  Gestion des personnels
                </li>
                <li className="nav-item">
                  <Link to="/intendant/habilitation" className="nav-link" title="Gérer les habilitations des personnels">
                    <i className="nav-icon fas fa-users-cog"></i>
                    <p>Habilitation</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/intendant/agents/add" className="nav-link" title="Ajouter un nouveau personnel">
                    <i className="nav-icon fas fa-user-plus"></i>
                    <p>Ajouter un personnel</p>
                  </Link>
                </li>
                {/* Séparateur */}
                <li className="nav-item">
                  <hr style={{ borderColor: '#4f5962', margin: '10px 0' }} />
                </li>
                <li className="nav-item">
                  <Link to="/intendant/stock" className="nav-link" title="Consulter l'état du stock">
                    <i className="nav-icon fas fa-warehouse"></i>
                    <p>Consultation Stock</p>
                  </Link>
                </li>
              </>
            )}
            {activeRole === 'RESPONSABLE_STOCK' && (
              <>
                {/* Titre non cliquable */}
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>
                  Gestion de Stock
                </li>
                <li className="nav-item">
                  <Link to="/stock/add" className="nav-link" title="Ajouter un nouveau produit au stock">
                    <i className="nav-icon fas fa-plus-circle"></i>
                    <p>Ajouter un produit</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/stock/medicaments" className="nav-link" title="Voir la liste des médicaments">
                    <i className="nav-icon fas fa-pills"></i>
                    <p>Liste des médicaments</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/stock/materiels" className="nav-link" title="Voir la liste des matériels">
                    <i className="nav-icon fas fa-tools"></i>
                    <p>Liste des matériels</p>
                  </Link>
                </li>
              </>
            )}
            {activeRole === 'PERSONNEL_MEDICAL' && (
              <>
                {/* Titre non cliquable */}
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>
                  Espace Médical
                </li>
                <li className="nav-item">
                  <Link to="/medical" className="nav-link" title="Accéder à l'espace médical">
                    <i className="nav-icon fas fa-medkit"></i>
                    <p>Espace Médical</p>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;