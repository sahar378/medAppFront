import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const SeanceDetails = () => {
  const { idSeance } = useParams();
  const [seance, setSeance] = useState(null);
  const [mesures, setMesures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeanceDetails = async () => {
      try {
        // Fetch session details
        const seanceData = await authService.getSeanceById(idSeance);
        setSeance(seanceData);

        // Fetch measurements
        const mesuresData = await authService.getMesuresBySeance(idSeance);
        setMesures(mesuresData);

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la séance:', error);
        Swal.fire('Erreur', 'Impossible de charger les détails de la séance', 'error');
        setLoading(false);
      }
    };
    fetchSeanceDetails();
  }, [idSeance]);

  if (loading) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Détails de la Séance</h1>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <p>Chargement...</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!seance) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Détails de la Séance</h1>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <p>Séance non trouvée.</p>
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
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Détails de la Séance #{seance.idSeance}</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Informations Générales</h3>
                <div className="card-tools">
                  <Link to="/medical/seances" className="btn btn-tool btn-sm">
                    <i className="fas fa-arrow-left"></i> Retour aux séances
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Patient:</strong> {seance.patient?.prenom} {seance.patient?.nom}</p>
                    <p><strong>Date:</strong> {new Date(seance.date).toLocaleString()}</p>
                    <p><strong>Machine:</strong> {seance.machine?.type || '-'}</p>
                    <p><strong>Infirmier:</strong> {seance.infirmier?.prenom} {seance.infirmier?.nom || '-'}</p>
                    <p><strong>Médecin:</strong> {seance.medecin?.prenom} {seance.medecin?.nom || '-'}</p>
                    <p><strong>Dialyseur:</strong> {seance.dialyseur || '-'}</p>
                    <p><strong>Ca++ Bain (mmol/L):</strong> {seance.caBain || '-'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>PPID (kg):</strong> {seance.ppid || '-'}</p>
                    <p><strong>Poids Sec (kg):</strong> {seance.ps || '-'}</p>
                    <p><strong>Durée (min):</strong> {seance.dureeSeance || '-'}</p>
                    <p><strong>Perte de Poids (kg):</strong> {seance.pertePoids || '-'}</p>
                    <p><strong>Observation:</strong> {seance.observation || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-outline card-info mb-4">
              <div className="card-header">
                <h4 className="card-title">Paramètres de la Séance</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <h5>Début de Dialyse</h5>
                    <p><strong>Heure Début:</strong> {seance.debutDialyse ? new Date(seance.debutDialyse).toLocaleString() : '-'}</p>
                    <p><strong>Poids à l’entrée:</strong> {seance.poidsEntree || '-'} kg</p>
                    <p><strong>T.A Debout:</strong> {seance.taDebutDebout || '-'}</p>
                    <p><strong>T.A Couché:</strong> {seance.taDebutCouche || '-'}</p>
                    <p><strong>Température:</strong> {seance.temperatureDebut || '-'} °C</p>
                  </div>
                  <div className="col-md-4">
                    <h5>Fin de Dialyse</h5>
                    <p><strong>Heure Fin:</strong> {seance.finDialyse ? new Date(seance.finDialyse).toLocaleString() : '-'}</p>
                    <p><strong>Poids à la sortie:</strong> {seance.poidsSortie || '-'} kg</p>
                    <p><strong>T.A Debout:</strong> {seance.taFinDebout || '-'}</p>
                    <p><strong>T.A Couché:</strong> {seance.taFinCouche || '-'}</p>
                    <p><strong>Température:</strong> {seance.temperatureFin || '-'} °C</p>
                  </div>
                  <div className="col-md-4">
                    <h5>Résultats</h5>
                    <p><strong>Durée:</strong> 
                      {seance.debutDialyse && seance.finDialyse 
                        ? Math.round((new Date(seance.finDialyse) - new Date(seance.debutDialyse)) / 60000) 
                        : '-'} min
                    </p>
                    <p><strong>Perte de poids:</strong> 
                      {seance.poidsEntree && seance.poidsSortie 
                        ? (seance.poidsEntree - seance.poidsSortie).toFixed(1) 
                        : '-'} kg
                    </p>
                    <p><strong>Restitution:</strong> {seance.restitution || '-'}</p>
                    <p><strong>Circuit/Filtre:</strong> {seance.circuitFiltre || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-outline card-info mb-4">
              <div className="card-header">
                <h4 className="card-title">Détails des Mesures</h4>
              </div>
              <div className="card-body">
                {mesures.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Heure</th>
                        <th>T.A</th>
                        <th>Pouls</th>
                        <th>Débit (ml/min)</th>
                        <th>Héparine</th>
                        <th>Pv</th>
                        <th>PTM</th>
                        <th>Conduc</th>
                        <th>UF (ml/h)</th>
                        <th>UF Total Affiché</th>
                        <th>Observation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mesures.map((mesure, index) => (
                        <tr key={index}>
                          <td>{new Date(mesure.heure).toLocaleString()}</td>
                          <td>{mesure.ta || '-'}</td>
                          <td>{mesure.pouls || '-'}</td>
                          <td>{mesure.debitMlMn || '-'}</td>
                          <td>{mesure.hep || '-'}</td>
                          <td>{mesure.pv || '-'}</td>
                          <td>{mesure.ptm || '-'}</td>
                          <td>{mesure.conduc || '-'}</td>
                          <td>{mesure.ufMlH || '-'}</td>
                          <td>{mesure.ufTotalAffiche || '-'}</td>
                          <td>{mesure.observation || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucune mesure trouvée.</p>
                )}
              </div>
            </div>

            <div className="card card-outline card-info mb-4">
              <div className="card-header">
                <h4 className="card-title">Traitement</h4>
              </div>
              <div className="card-body">
                <p><strong>Prescription:</strong> {seance.traitement || '-'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeanceDetails;