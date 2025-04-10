// src/pages/medical/MedicalSpace.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import medicalBackground from '../../assets/images/image.png';

const MedicalSpace = () => {
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
              Espace Personnel Médical
            </h1>
          </div>
        </div>
        <section className="content" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                <Link to="/medical/faire-inventaire" style={{ textDecoration: 'none' }}>
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-clipboard-check fa-3x mb-3" />
                      <h5>Faire un Inventaire</h5>
                      <p>Effectuez un nouvel inventaire du stock.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/medical/machines" style={{ textDecoration: 'none' }}>
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-cogs fa-3x mb-3" />
                      <h5>Ajouter une Machine</h5>
                      <p>Ajoutez une nouvelle machine.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/medical/machines/list" style={{ textDecoration: 'none' }}>
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-3x mb-3" />
                      <h5>Liste des Machines</h5>
                      <p>Consultez et gérez les machines.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/medical/techniciens" style={{ textDecoration: 'none' }}>
                  <div className="card bg-teal text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user-cog fa-3x mb-3" />
                      <h5>Ajouter un Technicien</h5>
                      <p>Ajoutez un nouveau technicien.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/medical/techniciens/list" style={{ textDecoration: 'none' }}>
                  <div className="card bg-dark text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-3x mb-3" />
                      <h5>Liste des Techniciens</h5>
                      <p>Consultez et gérez les techniciens.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/medical/interventions" style={{ textDecoration: 'none' }}>
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-tools fa-3x mb-3" />
                      <h5>Créer une Réclamation</h5>
                      <p>Signalez une nouvelle panne.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/medical/reclamations" style={{ textDecoration: 'none' }}>
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-3x mb-3" />
                      <h5>Liste des Réclamations</h5>
                      <p>Consultez et gérez les réclamations.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div className="card bg-secondary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user fa-3x mb-3" />
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

export default MedicalSpace;