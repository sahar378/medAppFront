//src/pages/intendant/Habilitation.jsx
//Permet à l’intendant de gérer les habilitations des agents (mot de passe et rôle).
// src/pages/intendant/Habilitation.jsx
import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Swal from 'sweetalert2';

const Habilitation = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [tempPassword, setTempPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await authService.getAgents();
        setAgents(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAgents();
  }, []);

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
    setTempPassword('');
    setConfirmPassword('');
    setSelectedRole('');
  };

  const handleSave = async () => {
    if (!selectedAgent) return;
    if (tempPassword !== confirmPassword) {
      Swal.fire('Erreur', 'Les mots de passe ne correspondent pas', 'error');
      return;
    }
    try {
      await authService.resetPassword(selectedAgent.userId, tempPassword);
      if (selectedRole) {
        const profilId = selectedRole === 'RESPONSABLE_STOCK' ? 1 : 2;
        await authService.assignRole(selectedAgent.userId, profilId);
      }
      Swal.fire(
        'Succès',
        `Habilitation mise à jour pour ${selectedAgent.prenom} ${selectedAgent.nom}. Un email a été envoyé à ${selectedAgent.prenom} ${selectedAgent.nom} avec ses identifiants (matricule: ${selectedAgent.userId}, mot de passe temporaire: ${tempPassword}).`,
        'success'
      );
      const updatedAgents = await authService.getAgents();
      setAgents(updatedAgents);
      setSelectedAgent(null);
    } catch (error) {
      console.error(error);
      Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour', 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Habilitation de personnels</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Liste de personnels</h3>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      {agents.map(agent => {
                        const hasAccess = agent.password && agent.password.length > 0;
                        return (
                          <li
                            key={agent.userId}
                            className="list-group-item"
                            onClick={() => handleAgentClick(agent)}
                            style={{ cursor: 'pointer' }}
                          >
                            {hasAccess ? (
                              <i className="fas fa-check-circle text-success mr-2" />
                            ) : (
                              <i className="fas fa-times-circle text-danger mr-2" />
                            )}
                            {agent.prenom} {agent.nom} ({agent.userId})
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              {selectedAgent && (
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Habilité {selectedAgent.prenom} {selectedAgent.nom}</h3>
                    </div>
                    <div className="card-body">
                      <div className="form-group">
                        <label>Matricule :</label>
                        <input type="text" className="form-control" value={selectedAgent.userId} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Nouveau mot de passe :</label>
                        <input
                          type="password"
                          className="form-control"
                          value={tempPassword}
                          onChange={(e) => setTempPassword(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirmer mot de passe :</label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Rôle :</label>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="roleStock"
                            name="role"
                            value="RESPONSABLE_STOCK"
                            checked={selectedRole === 'RESPONSABLE_STOCK'}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-check-input"
                          />
                          <label htmlFor="roleStock" className="form-check-label" style={{ marginLeft: '100px' }}>
                            Responsable de stock
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="roleMedical"
                            name="role"
                            value="PERSONNEL_MEDICAL"
                            checked={selectedRole === 'PERSONNEL_MEDICAL'}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-check-input"
                          />
                          <label htmlFor="roleMedical" className="form-check-label" style={{ marginLeft: '100px' }}>
                            Personnel médical
                          </label>
                        </div>
                      </div>
                      <button className="btn btn-primary" onClick={handleSave}>Enregistrer</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Habilitation;