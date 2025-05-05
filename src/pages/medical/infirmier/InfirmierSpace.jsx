import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import medicalBackground from '../../../assets/images/image.png';

const InfirmierSpace = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div
        className="content-wrapper"
        style={{
          backgroundImage: `url(${medicalBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
        <div className="content-header" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <h1 className="m-0 text-white" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              Espace Infirmier
            </h1>
          </div>
        </div>
        <section className="content" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <div className="row">
              {/* Faire un Inventaire */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/infirmier/faire-inventaire" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-info text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-clipboard-check fa-3x mb-3"></i>
                      <h5 className="card-title">Faire un Inventaire</h5>
                      <p className="card-text">Effectuez un nouvel inventaire du stock.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Gérer les Séances */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/infirmier/seances" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-primary text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-calendar-plus fa-3x mb-3"></i>
                      <h5 className="card-title">Gérer les Séances</h5>
                      <p className="card-text">Ajoutez ou documentez une séance.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Créer une Réclamation */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/infirmier/interventions" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-warning text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-tools fa-3x mb-3"></i>
                      <h5 className="card-title">Créer une Réclamation</h5>
                      <p className="card-text">Remplissez une réclamation technique.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Ajouter une Machine */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/infirmier/machines" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-purple text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-cogs fa-3x mb-3"></i>
                      <h5 className="card-title">Ajouter une Machine</h5>
                      <p className="card-text">Ajoutez une nouvelle machine.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Ajouter un Technicien */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/infirmier/techniciens" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-indigo text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-user-cog fa-3x mb-3"></i>
                      <h5 className="card-title">Ajouter un Technicien</h5>
                      <p className="card-text">Ajoutez un nouveau technicien.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Liste des Réclamations */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/infirmier/interventions/list" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-secondary text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-list fa-3x mb-3"></i>
                      <h5 className="card-title">Liste des Réclamations</h5>
                      <p className="card-text">Consultez les réclamations existantes.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Liste des Machines */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/infirmier/machines/list" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-teal text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-list fa-3x mb-3"></i>
                      <h5 className="card-title">Liste des Machines</h5>
                      <p className="card-text">Consultez les machines existantes.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Liste des Techniciens */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/infirmier/techniciens/list" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-maroon text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-list fa-3x mb-3"></i>
                      <h5 className="card-title">Liste des Techniciens</h5>
                      <p className="card-text">Consultez les techniciens existants.</p>
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

export default InfirmierSpace;