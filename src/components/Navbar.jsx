// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { profiles, activeRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Trouver le profil actif basé sur activeRole
  const activeProfile = profiles.find(profile => profile.role === activeRole);
  const spaceName = activeProfile ? activeProfile.descriptif : 'Espace Utilisateur';

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        {isAuthenticated && (
          <li className="nav-item">
            <button className="nav-link btn" data-widget="pushmenu" type="button">
              <i className="fas fa-bars"></i>
            </button>
          </li>
        )}
        <li className="nav-item">
          <Link to="/" className="nav-link">Accueil</Link>
        </li>
        {isAuthenticated && activeProfile && (
          <li className="nav-item">
            <Link to={activeProfile.url} className="nav-link">
              {spaceName}
            </Link>
          </li>
        )}
      </ul>
      <ul className="navbar-nav ml-auto">
        {isAuthenticated ? (
          <>
            {activeRole && (
              <li className="nav-item">
                <span className="nav-link text-muted">
                  Rôle actif : {activeRole.replace('_', ' ')}
                </span>
              </li>
            )}
            {profiles.length > 1 && (
              <li className="nav-item">
                <Link to="/role-selection" className="nav-link">Changer d’espace</Link>
              </li>
            )}
            {activeRole && (
              <li className="nav-item">
                <button className="nav-link btn" onClick={handleLogout}>Déconnexion</button>
              </li>
            )}
          </>
        ) : (
          <li className="nav-item">
            <Link to="/login" className="nav-link">Se connecter</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;