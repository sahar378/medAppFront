import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const MedicalPatientDialysisHistory = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [dialysisHistory, setDialysisHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDialysisHistory = async () => {
      try {
        // Récupérer les détails du patient via un endpoint accessible
        const patientData = await authService.getPatientById(patientId);
        if (!patientData) {
          throw new Error('Patient non trouvé.');
        }
        setPatient(patientData);

        // Récupérer l'historique de dialyse
        const historyData = await authService.getDialysisHistory(patientId);
        setDialysisHistory(historyData || []);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique de dialyse:', error);
        Swal.fire('Erreur', 'Impossible de charger l\'historique de dialyse: ' + (error.message || 'Erreur inconnue'), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDialysisHistory();
  }, [patientId]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!patient) {
    return <p>Patient non trouvé.</p>;
  }

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Historique de Dialyse - {patient.prenom} {patient.nom}</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Historique de Dialyse</h3>
                <div className="card-tools">
                  <Link to="/medical/patients" className="btn btn-secondary btn-sm">
                    Retour à la liste des patients
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {dialysisHistory.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Date Début</th>
                        <th>Date Fin</th>
                        <th>Cause</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dialysisHistory.map((record, index) => (
                        <tr key={record.idPatDF ?? `record-${index}`}>
                          <td>{record.dateDebutDialyse || 'Non spécifié'}</td>
                          <td>{record.dateFinDialyse || 'En cours'}</td>
                          <td>{record.dateFinDialyse && record.cause ? record.cause : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucun historique de dialyse trouvé pour ce patient.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MedicalPatientDialysisHistory;