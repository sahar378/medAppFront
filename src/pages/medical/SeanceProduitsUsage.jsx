import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const SeanceProduitsUsage = () => {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(false);
  const { activeRole } = useAuth();

  useEffect(() => {
    const fetchSeances = async () => {
      setLoading(true);
      try {
        const seancesData = await authService.getSeancesLastTwoDays();
        seancesData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSeances(seancesData);

        if (seancesData.length === 0) {
          Swal.fire('Information', 'Aucune séance trouvée pour les 2 derniers jours.', 'info');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des séances:', error);
        Swal.fire(
          'Erreur',
          'Impossible de charger les séances: ' + (error.message || 'Erreur inconnue'),
          'error'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSeances();
  }, []);

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Produits Utilisés par Séance</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Liste des Séances (Derniers 2 Jours)</h3>
                <div className="card-tools">
                  {activeRole === 'PERSONNEL_MEDICAL' && (
                    <Link to="/medical" className="btn btn-tool btn-sm">
                      <i className="fas fa-arrow-left"></i> Retour à l'espace médical
                    </Link>
                  )}
                </div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Chargement...</span>
                    </div>
                  </div>
                ) : seances.length === 0 ? (
                  <p>Aucune séance trouvée pour les 2 derniers jours.</p>
                ) : (
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Séance ID</th>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seances.map((seance) => (
                        <tr
                          key={seance.idSeance}
                          style={{ cursor: 'pointer' }}
                          onClick={() => window.location.href = `/medical/seances/${seance.idSeance}/produits/details`}
                        >
                          <td>{seance.idSeance}</td>
                          <td>{seance.patient.prenom} {seance.patient.nom}</td>
                          <td>{new Date(seance.date).toLocaleString()}</td>
                          <td>
                            <Link
                              to={`/medical/seances/${seance.idSeance}/produits/details`}
                              className="btn btn-info btn-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-eye"></i> Consulter
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeanceProduitsUsage;