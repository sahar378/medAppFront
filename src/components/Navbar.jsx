// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { userRoles, activeRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        {/* Afficher l'icône de la Sidebar uniquement si l'utilisateur est authentifié */}
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
        {activeRole === 'INTENDANT' && (
          <li className="nav-item">
            <Link to="/intendant" className="nav-link">Espace Intendant</Link>
          </li>
        )}
        {activeRole === 'RESPONSABLE_STOCK' && (
          <li className="nav-item">
            <Link to="/stock" className="nav-link">Espace Stock</Link>
          </li>
        )}
        {activeRole === 'PERSONNEL_MEDICAL' && (
          <li className="nav-item">
            <Link to="/medical" className="nav-link">Espace Médical</Link>
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
            {userRoles.length > 1 && (
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