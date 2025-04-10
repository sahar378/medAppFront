// src/pages/intendant/ListeReclamationsIntendant.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const ListeReclamationsIntendant = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reparation'); // Défaut à 'reparation'

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const data = await authService.getAllInterventions();
        setInterventions(data); // Pas de filtre, on prend tout
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchInterventions();
  }, []);

  // Filtrer les interventions selon l'onglet actif (uniquement par nature)
  const filteredInterventions = interventions.filter((intervention) =>
    activeTab === 'preventif' ? intervention.nature === 0 : intervention.nature === 1
  );

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Liste des Réclamations</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'preventif' ? 'active' : ''}`}
                      onClick={() => setActiveTab('preventif')}
                    >
                      Interventions Préventives
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'reparation' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reparation')}
                    >
                      Interventions de Réparation
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {filteredInterventions.length === 0 ? (
                  <p>Aucune intervention enregistrée pour cet onglet.</p>
                ) : (
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Machine</th>
                        <th>Technicien</th>
                        <th>Personnel Médical</th>
                        <th>Date</th>
                        <th>Nature</th>
                        {activeTab === 'reparation' && (
                          <>
                            <th>Date Panne</th>
                            <th>Panne</th>
                            <th>Réparation</th>
                            <th>Date Réparation</th>
                            <th>Lieu Réparation</th>
                            <th>Statut</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInterventions.map((intervention) => {
                        const rowStyle = {
                          backgroundColor: intervention.estFermee
                            ? '#f2f2f2' // Gris clair pour toutes les interventions fermées
                            : intervention.nature === 0
                            ? '#ccffcc' // Vert clair pour préventif ouvert (ne devrait pas arriver)
                            : '#fff3cd', // Jaune pâle pour réparation ouverte
                        };

                        return (
                          <tr key={intervention.idIntervention} style={rowStyle}>
                            <td>{intervention.idIntervention}</td>
                            <td>{intervention.machine.idMachine}</td>
                            <td>{intervention.technicien.nom}</td>
                            <td>
                              {(intervention.personnel.nom && intervention.personnel.prenom)
                                ? `${intervention.personnel.nom} ${intervention.personnel.prenom}`
                                : intervention.personnel.userId}
                            </td>
                            <td>{new Date(intervention.date).toLocaleDateString('fr-FR')}</td>
                            <td>
                              <span
                                className={`badge ${
                                  intervention.nature === 0 ? 'bg-info' : 'bg-danger'
                                }`}
                              >
                                {intervention.nature === 0 ? 'Préventif' : 'Réparation'}
                              </span>
                            </td>
                            {activeTab === 'reparation' && (
                              <>
                                <td>
                                  {intervention.datePanne
                                    ? new Date(intervention.datePanne).toLocaleDateString('fr-FR')
                                    : '-'}
                                </td>
                                <td>{intervention.panne || '-'}</td>
                                <td>{intervention.reparation || '-'}</td>
                                <td>
                                  {intervention.dateReparation
                                    ? new Date(intervention.dateReparation).toLocaleDateString(
                                        'fr-FR'
                                      )
                                    : '-'}
                                </td>
                                <td>{intervention.lieuReparation || '-'}</td>
                                <td>
                                  {intervention.archived ? (
                                    <span className="badge bg-secondary">Archivée</span>
                                  ) : intervention.estFermee ? (
                                    <span className="badge bg-success">Fermée</span>
                                  ) : (
                                    <span className="badge bg-warning text-dark">Ouverte</span>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
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

export default ListeReclamationsIntendant;