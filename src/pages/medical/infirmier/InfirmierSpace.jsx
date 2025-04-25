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
              {/* Faire un inventaire */}
              <div className="col-md-3">
                <Link to="/medical/infirmier/faire-inventaire" style={{ textDecoration: 'none' }}>
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-clipboard-check fa-3x mb-3" />
                      <h5>Faire un Inventaire</h5>
                      <p>Effectuez un nouvel inventaire du stock.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Gérer les séances */}
              <div className="col-md-3">
                <Link to="/medical/infirmier/seances" style={{ textDecoration: 'none' }}>
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-plus fa-3x mb-3" />
                      <h5>Gérer les Séances</h5>
                      <p>Ajoutez ou documentez une séance.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Créer une réclamation */}
              <div className="col-md-3">
                <Link to="/medical/infirmier/interventions" style={{ textDecoration: 'none' }}>
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-tools fa-3x mb-3" />
                      <h5>Créer une Réclamation</h5>
                      <p>Remplissez une réclamation technique.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Ajouter une machine */}
              <div className="col-md-3">
                <Link to="/medical/infirmier/machines" style={{ textDecoration: 'none' }}>
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-cogs fa-3x mb-3" />
                      <h5>Ajouter une Machine</h5>
                      <p>Ajoutez une nouvelle machine.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Ajouter un technicien */}
              <div className="col-md-3">
                <Link to="/medical/infirmier/techniciens" style={{ textDecoration: 'none' }}>
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user-cog fa-3x mb-3" />
                      <h5>Ajouter un Technicien</h5>
                      <p>Ajoutez un nouveau technicien.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Liste des réclamations */}
              <div className="col-md-3">
                <Link to="/medical/infirmier/interventions/list" style={{ textDecoration: 'none' }}>
                  <div className="card bg-secondary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-3x mb-3" />
                      <h5>Liste des Réclamations</h5>
                      <p>Consultez les réclamations existantes.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Liste des machines */}
              <div className="col-md-3">
                <Link to="/medical/infirmier/machines/list" style={{ textDecoration: 'none' }}>
                  <div className="card bg-secondary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-3x mb-3" />
                      <h5>Liste des Machines</h5>
                      <p>Consultez les machines existantes.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Liste des techniciens */}
              <div className="col-md-3">
                <Link to="/medical/infirmier/techniciens/list" style={{ textDecoration: 'none' }}>
                  <div className="card bg-secondary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-3x mb-3" />
                      <h5>Liste des Techniciens</h5>
                      <p>Consultez les techniciens existants.</p>
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