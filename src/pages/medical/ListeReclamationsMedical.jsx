// src/pages/medical/ListeReclamationsMedical.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const ListeReclamationsMedical = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const data = await authService.getAllInterventions();
        setInterventions(data.filter((i) => !i.archived && !i.estFermee));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchInterventions();
  }, []);

  const handleClose = (id) => {
    navigate(`/medical/interventions/close/${id}`);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Liste des Réclamations en Cours</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Interventions en Cours</h3>
              </div>
              <div className="card-body">
                {interventions.length === 0 ? (
                  <p>Aucune intervention en cours.</p>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Machine</th>
                        <th>Technicien</th>
                        <th>Personnel Médical</th>
                        <th>Date</th>
                        <th>Nature</th>
                        <th>Date Panne</th>
                        <th>Panne</th>
                        <th>Réparation</th>
                        <th>Date Réparation</th>
                        <th>Lieu Réparation</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interventions.map((intervention) => (
                        <tr key={intervention.idIntervention} style={{ backgroundColor: '#fff3cd' }}>
                          <td>{intervention.idIntervention}</td>
                          <td>{intervention.machine.idMachine}</td>
                          <td>{intervention.technicien.nom}</td>
                          <td>
                            {(intervention.personnel.nom && intervention.personnel.prenom)
                              ? `${intervention.personnel.nom} ${intervention.personnel.prenom}`
                              : intervention.personnel.userId}
                          </td>
                          <td>{new Date(intervention.date).toLocaleDateString('fr-FR')}</td>
                          <td>{intervention.nature === 0 ? 'Préventif' : 'Réparation'}</td>
                          <td>{intervention.datePanne ? new Date(intervention.datePanne).toLocaleDateString('fr-FR') : '-'}</td>
                          <td>{intervention.panne || '-'}</td>
                          <td>{intervention.reparation || '-'}</td>
                          <td>{intervention.dateReparation ? new Date(intervention.dateReparation).toLocaleDateString('fr-FR') : '-'}</td>
                          <td>{intervention.lieuReparation || '-'}</td>
                          <td>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleClose(intervention.idIntervention)}
                            >
                              Fermer
                            </button>
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

export default ListeReclamationsMedical;