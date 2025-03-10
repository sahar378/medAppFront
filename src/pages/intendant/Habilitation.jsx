// src/pages/intendant/Habilitation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const Habilitation = () => {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await authService.getAllAgents();
        setAgents(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des agents:', error);
      }
    };
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(agent =>
    agent.userId.toString().includes(searchTerm)
  );

  const handleAgentClick = (userId) => {
    navigate(`/intendant/agents/${userId}`);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Habilitation des agents</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Liste des agents</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher par matricule"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Statut d’accès</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.length > 0 ? (
                      filteredAgents.map(agent => {
                        const hasAccess = agent.password && agent.password.length > 0; // Vérifie si l’agent a un mot de passe
                        return (
                          <tr
                            key={agent.userId}
                            onClick={() => handleAgentClick(agent.userId)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{agent.userId}</td>
                            <td>{agent.nom}</td>
                            <td>{agent.prenom}</td>
                            <td>
                              {hasAccess ? (
                                <span className="text-success">
                                  <i className="fas fa-key mr-2" /> Activé
                                </span>
                              ) : (
                                <span className="text-danger">
                                  <i className="fas fa-lock mr-2" /> Désactivé
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4">Aucun agent trouvé</td>
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

export default Habilitation;