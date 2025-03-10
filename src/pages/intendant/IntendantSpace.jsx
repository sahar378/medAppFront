// src/pages/intendant/IntendantSpace.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

// Import de l'image (à placer dans src/assets/images/)
import intendantBackground from '../../assets/images/intendant-background.jpg';

const IntendantSpace = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div
        className="content-wrapper"
        style={{
          backgroundImage: `url(${intendantBackground})`,
          backgroundSize: 'cover', // Couvre toute la zone
          backgroundPosition: 'center', // Centrage de l'image
          backgroundRepeat: 'no-repeat', // Pas de répétition
          minHeight: '100vh', // Hauteur minimale pour couvrir l'écran
          position: 'relative', // Pour la superposition
        }}
      >
        {/* Superposition pour améliorer la lisibilité du texte */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Superposition sombre semi-transparente
            zIndex: 1,
          }}
        />
        <div className="content-header" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <h1
              className="m-0 text-white"
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
              }}
            >
              Espace Intendant
            </h1>
          </div>
        </div>
        <section className="content" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <div className="row">
              {/* Carte 1 : Habilitation des agents */}
              <div className="col-md-3">
                <Link to="/intendant/habilitation" style={{ textDecoration: 'none' }}>
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user-check fa-3x mb-3"></i>
                      <h5>Habilitation des agents</h5>
                      <p>Gérez les habilitations du personnel.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Carte 2 : Ajouter un personnel */}
              <div className="col-md-3">
                <Link to="/intendant/agents/add" style={{ textDecoration: 'none' }}>
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user-plus fa-3x mb-3"></i>
                      <h5>Ajouter un personnel</h5>
                      <p>Ajoutez un nouveau membre au personnel.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Carte 3 : Consulter stock */}
              <div className="col-md-3">
                <Link to="/intendant/stock" style={{ textDecoration: 'none' }}>
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-warehouse fa-3x mb-3"></i>
                      <h5>Consulter stock</h5>
                      <p>Vérifiez les niveaux de stock actuels.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Carte 4 : Voir mon profil */}
              <div className="col-md-3">
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div className="card bg-secondary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user fa-3x mb-3"></i>
                      <h5>Voir mon profil</h5>
                      <p>Consultez ou modifiez vos informations.</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntendantSpace;