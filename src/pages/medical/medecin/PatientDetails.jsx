import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [dialysisHistory, setDialysisHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { activeRole } = useAuth();

  const fetchPatientDetails = useCallback(async () => {
    try {
      // Check user role
      if (activeRole !== 'MEDECIN') {
        Swal.fire('Accès interdit', 'Vous n’avez pas les autorisations nécessaires pour voir les détails du patient.', 'error');
        navigate('/medical/seances');
        return;
      }

      const [patientResponse, historyResponse] = await Promise.all([
        authService.getPatientById(id),
        authService.getDialysisHistory(id),
      ]);
      setPatient(patientResponse);
      setDialysisHistory(historyResponse || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du patient', error);
      Swal.fire('Erreur', 'Impossible de charger les détails du patient. Vous n’avez peut-être pas les autorisations nécessaires.', 'error');
      navigate('/medical/medecin/patients');
    }
  }, [id, navigate, activeRole]);

  useEffect(() => {
    fetchPatientDetails();
  }, [fetchPatientDetails]);

  if (loading) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Détails du Patient</h1>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <div>Chargement...</div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Détails du Patient</h1>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <div>Patient non trouvé.</div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Détails du Patient</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{patient.prenom} {patient.nom}</h3>
                <div className="card-tools">
                  <Link
                    to={`/medical/medecin/patients/edit/${id}`}
                    className="btn btn-warning btn-sm"
                  >
                    Modifier
                  </Link>
                  <Link
                    to="/medical/medecin/patients"
                    className="btn btn-secondary btn-sm ml-1"
                  >
                    Retour
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Nom :</strong> {patient.nom || 'Non spécifié'}</p>
                    <p><strong>Prénom :</strong> {patient.prenom || 'Non spécifié'}</p>
                    <p><strong>Date de naissance :</strong> {patient.dateNaissance ? patient.dateNaissance : 'Non spécifiée'}</p>
                    <p><strong>Domicile :</strong> {patient.domicile || 'Non spécifié'}</p>
                    <p><strong>Carnet de soin :</strong> {patient.carnetSoin || 'Non spécifié'}</p>
                    <p><strong>Groupe sanguin :</strong> {patient.groupeSanguin || 'Non spécifié'}</p>
                    <p><strong>Numéro de téléphone :</strong> {patient.numeroTelephone || 'Non spécifié'}</p>
                    <p><strong>Historique médical :</strong> {patient.historiqueMaladie || 'Non spécifié'}</p>
                    <p><strong>Antécédents médicaux :</strong> {patient.antecedent || 'Non spécifié'}</p>
                    <p><strong>Évolution :</strong> {patient.evolution || 'Non spécifié'}</p>
                    <p><strong>Traitement :</strong> {patient.traitement || 'Non spécifié'}</p>
                    <p><strong>Statut :</strong> {patient.actif ? 'Actif' : 'Inactif'}</p>
                    <p><strong>Archivé :</strong> {patient.archive ? 'Oui' : 'Non'}</p>
                  </div>
                </div>

                <h4 className="mt-4">Historique de Dialyse</h4>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Date Début</th>
                      <th>Date Fin</th>
                      <th>Cause</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dialysisHistory.length > 0 ? (
                      dialysisHistory.map((record) => (
                        <tr key={record.idPatDF}>
                          <td>{record.dateDebutDialyse || 'Non spécifié'}</td>
                          <td>{record.dateFinDialyse || 'En cours'}</td>
                          <td>{record.dateFinDialyse && record.cause ? record.cause : '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">Aucun historique de dialyse trouvé</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientDetails;