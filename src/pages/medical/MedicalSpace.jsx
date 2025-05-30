// src/pages/medical/MedicalSpace.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import medicalBackground from '../../assets/images/image.png';
import { useAuth } from '../../context/AuthContext';

const MedicalSpace = () => {
  const { user } = useAuth();

  // Déterminer le sous-rôle (INFIRMIER ou MEDECIN)
  const sousRole = user?.roles?.includes('INFIRMIER') ? 'INFIRMIER' : user?.roles?.includes('MEDECIN') ? 'MEDECIN' : null;

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
              {/* Consulter la liste des séances */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/seances" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-primary text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-calendar-check fa-3x mb-3"></i>
                      <h5 className="card-title">Consulter les Séances</h5>
                      <p className="card-text">Consultez la liste des séances et leurs détails.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Créer une nouvelle séance */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/seances/create" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-warning text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-calendar-plus fa-3x mb-3"></i>
                      <h5 className="card-title">Créer une Séance</h5>
                      <p className="card-text">Planifiez une nouvelle séance de dialyse.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Consulter la liste des patients (Medical) */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/patients" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-info text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-users fa-3x mb-3"></i>
                      <h5 className="card-title">Liste des Patients</h5>
                      <p className="card-text">Consultez l’historique de dialyse des patients.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Bouton conditionnel pour rediriger vers l'espace Infirmier */}
              {sousRole === 'INFIRMIER' && (
                <div className="col-md-4 mb-4">
                  <Link to="/medical/infirmier" style={{ textDecoration: 'none' }}>
                    <div
                      className="card bg-purple text-white"
                      style={{ height: '200px', width: '100%' }}
                    >
                      <div className="card-body text-center d-flex flex-column justify-content-center">
                        <i className="fas fa-user-nurse fa-3x mb-3"></i>
                        <h5 className="card-title">Aller à l'Espace Infirmier</h5>
                        <p className="card-text">Accédez à vos fonctionnalités spécifiques.</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {/* Bouton conditionnel pour rediriger vers l'espace Médecin */}
              {sousRole === 'MEDECIN' && (
                <div className="col-md-4 mb-4">
                  <Link to="/medical/medecin" style={{ textDecoration: 'none' }}>
                    <div
                      className="card bg-indigo text-white"
                      style={{ height: '200px', width: '100%' }}
                    >
                      <div className="card-body text-center d-flex flex-column justify-content-center">
                        <i className="fas fa-user-md fa-3x mb-3"></i>
                        <h5 className="card-title">Aller à l'Espace Médecin</h5>
                        <p className="card-text">Accédez à vos fonctionnalités spécifiques.</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {/* Profil accessible à tous */}
              <div className="col-md-4 mb-4">
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-secondary text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-user fa-3x mb-3"></i>
                      <h5 className="card-title">Voir mon profil</h5>
                      <p className="card-text">Consultez ou modifiez vos informations.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Produits Standards accessible à tous */}
              <div className="col-md-4 mb-4">
                <Link to="/medical/produits-standards" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-maroon text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-pills fa-3x mb-3"></i>
                      <h5 className="card-title">Produits Standards</h5>
                      <p className="card-text">Consultez la liste des produits standards.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/stock/produits-usage" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-lime text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-clipboard-list fa-3x mb-3" />
                      <h5 className="card-title">Produits utilisés</h5>
                      <p className="card-text">Consultez les produits utilisés par le personnel médical.</p>
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