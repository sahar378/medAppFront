// src/pages/intendant/AgentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Swal from 'sweetalert2';

const AgentDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [agent, setAgent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [tempPassword, setTempPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Récupérer l'onglet actif depuis l'URL
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'withAccess';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentData = await authService.getAgentById(userId);
        setAgent(agentData);
        setFormData({
          nom: agentData.nom || '',
          prenom: agentData.prenom || '',
          email: agentData.email || '',
          dateNaissance: agentData.dateNaissance ? new Date(agentData.dateNaissance).toISOString().split('T')[0] : '',
          numeroTelephone: agentData.numeroTelephone || ''
        });
        const rolesData = await authService.getAllRoles();
        setRoles(rolesData);
        setSelectedRoles(agentData.profils ? agentData.profils.map(p => p.idProfil) : []);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        Swal.fire('Erreur', 'Impossible de charger les données', 'error');
      }
    };
    fetchData();
  }, [userId]);

  // Vérifier si l'agent est un INTENDANT
  const isAgentIntendant = () => {
    return agent?.profils?.some(profil => profil.libelleProfil === 'INTENDANT');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await authService.updateAgent(userId, formData);
      setAgent({ ...agent, ...formData });
      setEditMode(false);
      Swal.fire('Succès', 'Informations mises à jour', 'success');
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
    }
  };

  const handleRoleChange = async (idProfil) => {
    const role = roles.find(r => r.idProfil === idProfil);
    if (!role) return;

    let newSelectedRoles = [...selectedRoles];
    const isAdding = !newSelectedRoles.includes(idProfil);

    if (isAdding) {
      newSelectedRoles.push(idProfil);
      if (role.libelleProfil === 'PERSONNEL_MEDICAL') {
        const allRoles = await authService.getAllProfils();
        const medicalRoles = allRoles.filter(r => ['MEDECIN', 'INFIRMIER'].includes(r.libelleProfil));
        if (medicalRoles.length > 0) {
          const { value: selectedMedicalRole } = await Swal.fire({
            title: 'Choisir un rôle supplémentaire',
            text: 'Vous avez sélectionné le rôle PERSONNEL_MEDICAL. Veuillez choisir un rôle supplémentaire (Médecin ou Infirmier) :',
            input: 'select',
            inputOptions: medicalRoles.reduce((options, r) => {
              options[r.idProfil] = r.libelleProfil;
              return options;
            }, {}),
            inputPlaceholder: 'Sélectionner un rôle',
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler',
            inputValidator: (value) => {
              if (!value) {
                return 'Vous devez choisir un rôle !';
              }
            }
          });

          if (selectedMedicalRole) {
            newSelectedRoles.push(Number(selectedMedicalRole));
          } else {
            newSelectedRoles = newSelectedRoles.filter(id => id !== idProfil);
          }
        }
      }
    } else {
      if (role.libelleProfil === 'PERSONNEL_MEDICAL') {
        const allRoles = await authService.getAllProfils();
        const medicalRoleIds = allRoles
          .filter(r => ['MEDECIN', 'INFIRMIER'].includes(r.libelleProfil))
          .map(r => r.idProfil);
        newSelectedRoles = newSelectedRoles.filter(id => !medicalRoleIds.includes(id));
      }
      newSelectedRoles = newSelectedRoles.filter(id => id !== idProfil);
    }

    setSelectedRoles(newSelectedRoles);
  };

  const handleSaveRoles = async () => {
    try {
      await authService.assignRoles(userId, selectedRoles);
      const updatedAgent = await authService.getAgentById(userId);
      setAgent(updatedAgent);
      setSelectedRoles(updatedAgent.profils ? updatedAgent.profils.map(p => p.idProfil) : []);
      Swal.fire('Succès', 'Rôles mis à jour avec succés', 'success');
    } catch (error) {
      Swal.fire('Erreur', error.response?.data || 'Erreur lors de l’assignation des rôles', 'error');
    }
  };

  const handleResetPassword = async () => {
    if (!tempPassword || !confirmPassword) {
      Swal.fire('Erreur', 'Veuillez remplir les deux champs de mot de passe', 'error');
      return;
    }
    if (tempPassword !== confirmPassword) {
      Swal.fire('Erreur', 'Les mots de passe ne correspondent pas', 'error');
      return;
    }
    try {
      await authService.resetPassword(userId, tempPassword);
      setTempPassword('');
      setConfirmPassword('');
      Swal.fire('Succès', 'Mot de passe temporaire assigné et email envoyé', 'success');
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la réinitialisation', 'error');
    }
  };

  const handleArchive = async () => {
    const result = await Swal.fire({
      title: 'Confirmer l’archivage',
      text: `Êtes-vous sûr de vouloir archiver l’agent ${agent.prenom} ${agent.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, archiver',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await authService.archiveAgent(userId);
        Swal.fire('Succès', 'Agent archivé avec succès', 'success');
        navigate(`/intendant/habilitation?tab=${activeTab}`);
      } catch (error) {
        Swal.fire('Erreur', error.response?.data || 'Erreur lors de l’archivage', 'error');
      }
    }
  };

  if (!agent) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Détails de {agent.prenom} {agent.nom}</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Informations du personnel</h3>
                <div className="card-tools">
                  <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Annuler' : 'Modifier'}
                  </button>
                  <button
                    className="btn btn-secondary ml-2"
                    onClick={() => navigate(`/intendant/habilitation?tab=${activeTab}`)}
                  >
                    Retour
                  </button>
                  {/* Bouton Archiver (non visible pour les intendants) */}
                  {!isAgentIntendant() && (
                    <button
                      className="btn btn-danger ml-2"
                      onClick={handleArchive}
                      disabled={agent.archived === 1} // Désactiver si déjà archivé
                    >
                      Archiver
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                {editMode ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="form-group">
                      <label>Nom :</label>
                      <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Prénom :</label>
                      <input type="text" className="form-control" name="prenom" value={formData.prenom} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Email :</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Date de naissance :</label>
                      <input type="date" className="form-control" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Numéro de téléphone :</label>
                      <input type="text" className="form-control" name="numeroTelephone" value={formData.numeroTelephone} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                  </form>
                ) : (
                  <div>
                    <p><strong>Matricule :</strong> {agent.userId}</p>
                    <p><strong>Nom :</strong> {agent.nom}</p>
                    <p><strong>Prénom :</strong> {agent.prenom}</p>
                    <p><strong>Email :</strong> {agent.email || 'Non défini'}</p>
                    <p><strong>Date de naissance :</strong> {agent.dateNaissance ? new Date(agent.dateNaissance).toLocaleDateString() : 'Non défini'}</p>
                    <p><strong>Numéro de téléphone :</strong> {agent.numeroTelephone || 'Non défini'}</p>
                    <p><strong>Rôles :</strong> {agent.profils?.map(p => p.libelleProfil).join(', ') || 'Aucun'}</p>
                    <p><strong>Statut d’archivage :</strong> {agent.archived === 1 ? 'Archivé' : 'Non archivé'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <h3 className="card-title">Habilitation</h3>
              </div>
              <div className="card-body">
                {!isAgentIntendant() && (
                  <>
                    <h5>Assigner un mot de passe temporaire</h5>
                    <div className="form-group">
                      <label>Nouveau mot de passe :</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Nouveau mot de passe"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirmer mot de passe :</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirmer mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <button className="btn btn-primary mt-2" onClick={handleResetPassword}>
                      Assigner et envoyer par email
                    </button>
                  </>
                )}

                <h5 className="mt-4">Assigner des rôles</h5>
                {roles.length > 0 ? (
                  roles.map(role => (
                    <div key={role.idProfil} className="form-check" style={{ marginBottom: '10px' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`role-${role.idProfil}`}
                        checked={selectedRoles.includes(role.idProfil)}
                        onChange={() => handleRoleChange(role.idProfil)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`role-${role.idProfil}`}
                        style={{ marginLeft: '100px' }}
                      >
                        {role.libelleProfil.replace('_', ' ')}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>Aucun rôle disponible</p>
                )}
                <button className="btn btn-primary mt-2" onClick={handleSaveRoles}>
                  Enregistrer les rôles
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgentDetails;