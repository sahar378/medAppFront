// src/components/Sidebar.jsx
//pour le menu latéral
// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Sidebar = () => {
  const { userRole, userId } = useAuth();
  const [userProfile, setUserProfile] = React.useState({ nom: '', prenom: '' });

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authService.getProfile(userId);
        setUserProfile({ nom: response.data.nom, prenom: response.data.prenom });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
      }
    };
    if (userId) fetchUserProfile();
  }, [userId]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="/" className="brand-link">
        <span className="brand-text font-weight-light">PrivateApp</span>
        <img
          src="/images/kidney-logo.png"
          alt="Kidney Logo"
          className="brand-image img-circle elevation-3"
          style={{ marginLeft: '10px', width: '35px', height: '120px' }}
        />
      </Link>
      {userId && (
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <i className="fas fa-user fa-lg" style={{ color: '#ffffff', padding: '3px' }}></i>
          </div>
          <div className="info">
            <Link
              to="/agent/profile"
              className="nav-link"
              style={{ color: '#ffffff', padding: '0.5px', fontSize: '14px' }}
            >
              {userProfile.prenom} {userProfile.nom}
            </Link>
          </div>
        </div>
      )}
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="nav-icon fas fa-home"></i>
                <p>Accueil</p>
              </Link>
            </li>
            {userRole === 'INTENDANT' && (
              <li className="nav-item has-treeview">
                <button className="nav-link" type="button">
                  <i className="nav-icon fas fa-users"></i>
                  <p>
                    Gestion des personnels
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </button>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/intendant/habilitation" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Habilitation</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/intendant/agents/add" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Ajouter un personnel</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/intendant/agents" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Liste de personnels</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            <li className="nav-item">
              <Link to="/agent/profile" className="nav-link">
                <i className="nav-icon fas fa-user"></i>
                <p>Profil</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;