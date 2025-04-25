// src/pages/medical/MedicalSpace.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import medicalBackground from '../../assets/images/image.png';
import { useAuth } from '../../context/AuthContext';

const MedicalSpace = () => {
  const {user } = useAuth();

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
              {/* Fonctionnalité commune : Consulter la liste des séances */}
              <div className="col-md-3">
                <Link to="/medical/seances" style={{ textDecoration: 'none' }}>
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-check fa-3x mb-3" />
                      <h5>Consulter les Séances</h5>
                      <p>Consultez la liste des séances et leurs détails.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Bouton conditionnel pour rediriger vers l'espace Infirmier ou Médecin */}
              {sousRole === 'INFIRMIER' && (
                <div className="col-md-3">
                  <Link to="/infirmier" style={{ textDecoration: 'none' }}>
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <i className="fas fa-user-nurse fa-3x mb-3" />
                        <h5>Aller à l'Espace Infirmier</h5>
                        <p>Accédez à vos fonctionnalités spécifiques.</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {sousRole === 'MEDECIN' && (
                <div className="col-md-3">
                  <Link to="/medecin" style={{ textDecoration: 'none' }}>
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <i className="fas fa-user-md fa-3x mb-3" />
                        <h5>Aller à l'Espace Médecin</h5>
                        <p>Accédez à vos fonctionnalités spécifiques.</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Profil accessible à tous */}
              <div className="col-md-3">
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