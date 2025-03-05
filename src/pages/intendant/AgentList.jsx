// src/pages/intendant/AgentList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState('all'); // Par défaut, tous les agents
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        let data;
        switch (filter) {
          case 'all':
            data = await authService.getAllAgents();
            break;
          case 'with-access':
            data = await authService.getAgentsWithAccess();
            break;
          case 'without-access':
            data = await authService.getAgentsWithoutAccess();
            break;
          default:
            data = [];
        }
        setAgents(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des agents', error);
      }
    };
    fetchAgents();
  }, [filter]);

  const handleAgentClick = (agent) => {
    navigate(`/intendant/agents/${agent.userId}`); // Redirection vers la page de détails
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Liste de personnels</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} mr-2`}
                  onClick={() => setFilter('all')}
                >
                  Tous le personnels
                </button>
                <button
                  className={`btn ${filter === 'with-access' ? 'btn-primary' : 'btn-outline-primary'} mr-2`}
                  onClick={() => setFilter('with-access')}
                >
                  Personnels avec accès
                </button>
                <button
                  className={`btn ${filter === 'without-access' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('without-access')}
                >
                  Personnels sans accès
                </button>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Prénom</th>
                      <th>Nom</th>
                      <th>Matricule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map(agent => (
                      <tr
                        key={agent.userId}
                        onClick={() => handleAgentClick(agent)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{agent.prenom}</td>
                        <td>{agent.nom}</td>
                        <td>{agent.userId}</td>
                      </tr>
                    ))}
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

export default AgentList;