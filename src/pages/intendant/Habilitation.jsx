// src/pages/intendant/Habilitation.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Swal from 'sweetalert2';

const Habilitation = () => {
  const [agentsWithAccess, setAgentsWithAccess] = useState([]);
  const [agentsWithoutAccess, setAgentsWithoutAccess] = useState([]);
  const [archivedAgents, setArchivedAgents] = useState([]); // Nouvel état pour les agents archivés
  const location = useLocation();
  const navigate = useNavigate();

  // Déterminer l'onglet actif à partir de l'URL ou par défaut
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'withAccess';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const withAccess = await authService.getAgentsWithAccess();
        const withoutAccess = await authService.getAgentsWithoutAccess();
        const archived = await authService.getArchivedAgents(); // Récupérer les agents archivés
        setAgentsWithAccess(withAccess);
        setAgentsWithoutAccess(withoutAccess);
        setArchivedAgents(archived);
      } catch (error) {
        console.error('Erreur lors de la récupération des agents:', error);
        Swal.fire('Erreur', 'Impossible de charger les agents', 'error');
      }
    };
    fetchData();
  }, []);

  // Fonction pour vérifier si un utilisateur a le rôle INTENDANT
  const isIntendant = (agent) => {
    return agent.profils?.some(profil => profil.libelleProfil === 'INTENDANT');
  };

  // Fonction pour déterminer le style en fonction du statut et du rôle
  const getRowStyle = (agent) => {
    if (isIntendant(agent)) {
      return agent.enabled === true
        ? { backgroundColor: '#ccffcc' } // Vert clair pour les intendants activés
        : { backgroundColor: '#ffcccc' }; // Rouge clair pour les intendants désactivés
    }
    return {};
  };

  // Changer l'onglet actif et mettre à jour l'URL
  const handleTabChange = (tab) => {
    navigate(`/intendant/habilitation?tab=${tab}`);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Habilitation de Personnels</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'withAccess' ? 'active' : ''}`}
                  onClick={() => handleTabChange('withAccess')}
                >
                  Personnels avec accès
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'withoutAccess' ? 'active' : ''}`}
                  onClick={() => handleTabChange('withoutAccess')}
                >
                  Personnels sans accès
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'archived' ? 'active' : ''}`}
                  onClick={() => handleTabChange('archived')}
                >
                  Personnels archivés
                </button>
              </li>
            </ul>

            <div className="tab-content">
              {/* Onglet : Agents avec accès */}
              <div className={`tab-pane ${activeTab === 'withAccess' ? 'active' : ''}`}>
                <div className="card mt-3">
                  <div className="card-header">
                    <h3 className="card-title">Personnels avec accès</h3>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Matricule</th>
                          <th>Nom</th>
                          <th>Prénom</th>
                          <th>Rôles</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agentsWithAccess.map(agent => (
                          <tr key={agent.userId} style={getRowStyle(agent)}>
                            <td>{agent.userId}</td>
                            <td>{agent.nom}</td>
                            <td>{agent.prenom}</td>
                            <td>{agent.profils?.map(p => p.libelleProfil).join(', ') || 'Aucun'}</td>
                            <td>
                              <Link
                                to={`/intendant/agents/${agent.userId}?tab=withAccess`}
                                className="btn btn-primary btn-sm"
                              >
                                Gérer
                              </Link>
                              {/* Badge pour les intendants */}
                              {isIntendant(agent) && (
                                <span
                                  className={`badge ml-2 ${agent.enabled ? 'badge-success' : 'badge-danger'}`}
                                >
                                  {agent.enabled ? 'Activé' : 'Désactivé'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Onglet : Agents sans accès */}
              <div className={`tab-pane ${activeTab === 'withoutAccess' ? 'active' : ''}`}>
                <div className="card mt-3">
                  <div className="card-header">
                    <h3 className="card-title">Personnels sans accès</h3>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Matricule</th>
                          <th>Nom</th>
                          <th>Prénom</th>
                          <th>Rôles</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agentsWithoutAccess.map(agent => (
                          <tr key={agent.userId} style={getRowStyle(agent)}>
                            <td>{agent.userId}</td>
                            <td>{agent.nom}</td>
                            <td>{agent.prenom}</td>
                            <td>{agent.profils?.map(p => p.libelleProfil).join(', ') || 'Aucun'}</td>
                            <td>
                              <Link
                                to={`/intendant/agents/${agent.userId}?tab=withoutAccess`}
                                className="btn btn-primary btn-sm"
                              >
                                Gérer
                              </Link>
                              {/* Badge pour les intendants */}
                              {isIntendant(agent) && (
                                <span
                                  className={`badge ml-2 ${agent.enabled ? 'badge-success' : 'badge-danger'}`}
                                >
                                  {agent.enabled ? 'Activé' : 'Désactivé'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Onglet : Utilisateurs archivés */}
              <div className={`tab-pane ${activeTab === 'archived' ? 'active' : ''}`}>
                <div className="card mt-3">
                  <div className="card-header">
                    <h3 className="card-title">Personnels archivés</h3>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Matricule</th>
                          <th>Nom</th>
                          <th>Prénom</th>
                          <th>Rôles</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {archivedAgents.map(agent => (
                          <tr key={agent.userId} style={getRowStyle(agent)}>
                            <td>{agent.userId}</td>
                            <td>{agent.nom}</td>
                            <td>{agent.prenom}</td>
                            <td>{agent.profils?.map(p => p.libelleProfil).join(', ') || 'Aucun'}</td>
                            <td>
                              <Link
                                to={`/intendant/agents/${agent.userId}?tab=archived`}
                                className="btn btn-primary btn-sm"
                              >
                                Voir
                              </Link>
                              {/* Badge pour les intendants */}
                              {isIntendant(agent) && (
                                <span
                                  className={`badge ml-2 ${agent.enabled ? 'badge-success' : 'badge-danger'}`}
                                >
                                  {agent.enabled ? 'Activé' : 'Désactivé'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Habilitation;