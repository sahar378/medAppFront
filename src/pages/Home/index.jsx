//src/pages/Home/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logout from '../../components/Logout';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const Home = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Bienvenue sur la page d'accueil</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            {isAuthenticated ? (
              <div className="card">
                <div className="card-body">
                  <p>Vous êtes connecté en tant que {userRole || 'utilisateur'} !</p>
                  {userRole === 'INTENDANT' && <Link to="/intendant">Accéder à l’espace Intendant</Link>}
                  {(userRole === 'RESPONSABLE_STOCK' || userRole === 'PERSONNEL_MEDICAL') && (
                    <Link to="/agent">Accéder à votre espace</Link>
                  )}
                  <br />
                  <Logout />
                </div>
              </div>
            ) : (
              <p>
                Veuillez vous <Link to="/login">connecter</Link> pour accéder à plus de fonctionnalités.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Home;