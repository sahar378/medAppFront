//src/components/Navbar.jsx
/*Barre de navigation affichant des liens adaptés au rôle de l’utilisateur connecté (intendant, responsable de stock, personnel médical) 
et un bouton de déconnexion.*/
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';//Link : Crée des liens de navigation sans rechargement de page.
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { userRole, logout } = useAuth();//// Récupère le rôle et la fonction logout du contexte
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();// Invalide la session
    navigate('/login');// Redirige vers la page de connexion
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item"> 
        <button className="nav-link btn" data-widget="pushmenu" type="button">
            <i className="fas fa-bars"></i>
          </button>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">Accueil</Link>
        </li>
        {userRole === 'INTENDANT' && (
          <li className="nav-item">
            <Link to="/intendant" className="nav-link">Espace Intendant</Link>
          </li>
        )}
        {(userRole === 'RESPONSABLE_STOCK' || userRole === 'PERSONNEL_MEDICAL') && (
          <li className="nav-item">
            <Link to="/agent" className="nav-link">Espace Agent</Link>
          </li>
        )}
      </ul>
      <ul className="navbar-nav ml-auto">
        {userRole && (
          <li className="nav-item">
            <button className="nav-link btn" onClick={handleLogout}>Déconnexion</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;