import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Swal from 'sweetalert2';

const AgentDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [agent, setAgent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [tempPassword, setTempPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    nom: '',
    prenom: '',
    email: '',
    numeroTelephone: '',
    tempPassword: '',
    confirmPassword: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const activeTab = searchParams.get('tab') || 'withAccess';

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

  const isAgentIntendant = () => {
    return agent?.profils?.some(profil => profil.libelleProfil === 'INTENDANT');
  };

  const validateField = (name, value) => {
    if (name === 'nom' || name === 'prenom') {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
      if (value !== '' && !nameRegex.test(value)) {
        return `Le ${name === 'nom' ? 'nom' : 'prénom'} ne doit contenir que des lettres, espaces, tirets ou apostrophes`;
      }
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value !== '' && !emailRegex.test(value)) {
        return 'Veuillez entrer un email valide (ex: exemple@domaine.com)';
      }
    }

    if (name === 'numeroTelephone') {
      const phoneRegex = /^\d{0,8}$/;
      if (!phoneRegex.test(value)) {
        return 'Le numéro doit contenir uniquement des chiffres';
      } else if (value.length > 0 && value.length < 8) {
        return 'Le numéro doit contenir exactement 8 chiffres';
      }
    }

    return '';
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+=\-[\]{}|;:,.<>?]/.test(password);

    if (password.length < minLength) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (!hasUpperCase) {
      return 'Le mot de passe doit contenir au moins une lettre majuscule.';
    }
    if (!hasLowerCase) {
      return 'Le mot de passe doit contenir au moins une lettre minuscule.';
    }
    if (!hasDigit) {
      return 'Le mot de passe doit contenir au moins un chiffre.';
    }
    if (!hasSpecialChar) {
      return 'Le mot de passe doit contenir au moins un caractère spécial (ex. !@#$%).';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tempPassword') setTempPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);

    const passwordError = validatePassword(value);
    setErrors(prev => ({
      ...prev,
      [name]: passwordError,
      confirmPassword: name === 'confirmPassword' && value !== tempPassword ? 'Les mots de passe ne correspondent pas.' : prev.confirmPassword
    }));
  };

  const handleSave = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.numeroTelephone) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const newErrors = {
      nom: validateField('nom', formData.nom),
      prenom: validateField('prenom', formData.prenom),
      email: validateField('email', formData.email),
      numeroTelephone: validateField('numeroTelephone', formData.numeroTelephone),
    };

    setErrors(prev => ({ ...prev, ...newErrors }));

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      Swal.fire('Erreur', 'Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      await authService.updateAgent(userId, formData);
      setAgent({ ...agent, ...formData });
      setEditMode(false);
      Swal.fire('Succès', 'Informations mises à jour', 'success');
    } catch (error) {
      let errorMessage = "Erreur lors de la mise à jour";

      if (error.response) {
        if (error.response.data) {
          if (typeof error.response.data === 'object' && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (typeof error.response.data === 'object' && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          }
        }
        if (error.response.status === 401) {
          errorMessage = 'Session expirée ou authentification invalide. Veuillez vous reconnecter.';
          Swal.fire({
            icon: 'error',
            title: 'Session expirée',
            text: errorMessage,
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/login');
          });
          return;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (typeof errorMessage === 'string' && errorMessage.includes("existe déjà")) {
        Swal.fire({
          icon: 'warning',
          title: 'Email déjà utilisé',
          text: `Un agent avec l'email ${formData.email} existe déjà dans le système`,
        });
      } else {
        Swal.fire('Erreur', errorMessage, 'error');
      }
      console.error('Erreur:', error);
    } finally {
      setIsUpdating(false);
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

    const tempPasswordError = validatePassword(tempPassword);
    if (tempPasswordError) {
      setErrors(prev => ({ ...prev, tempPassword: tempPasswordError }));
      return;
    }

    if (tempPassword !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Les mots de passe ne correspondent pas.' }));
      return;
    }

    setErrors(prev => ({ ...prev, tempPassword: '', confirmPassword: '' }));

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

  const isSaveDisabled = 
    !formData.nom || 
    !formData.prenom || 
    !formData.email || 
    !formData.numeroTelephone || 
    errors.nom || 
    errors.prenom || 
    errors.email || 
    errors.numeroTelephone || 
    isUpdating;

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
                  {agent.archived !== 1 && (
                    <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
                      {editMode ? 'Annuler' : 'Modifier'}
                    </button>
                  )}
                  <button
                    className="btn btn-secondary ml-2"
                    onClick={() => navigate(`/intendant/habilitation?tab=${activeTab}`)}
                  >
                    Retour
                  </button>
                  {agent.archived !== 1 && !isAgentIntendant() && (
                    <button
                      className="btn btn-danger ml-2"
                      onClick={handleArchive}
                      disabled={agent.archived === 1}
                    >
                      Archiver
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                {editMode && agent.archived !== 1 ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="form-group">
                      <label>Nom *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                      />
                      {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                    </div>
                    <div className="form-group">
                      <label>Prénom *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                      />
                      {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                      <label>Date de naissance :</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dateNaissance"
                        value={formData.dateNaissance}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Numéro de téléphone *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.numeroTelephone ? 'is-invalid' : ''}`}
                        name="numeroTelephone"
                        value={formData.numeroTelephone}
                        onChange={handleInputChange}
                        maxLength={8}
                      />
                      {errors.numeroTelephone && <div className="invalid-feedback">{errors.numeroTelephone}</div>}
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={isSaveDisabled}
                    >
                      {isUpdating ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span> Enregistrement...</span>
                        </>
                      ) : 'Enregistrer'}
                    </button>
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

            {agent.archived !== 1 && (
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
                          className={`form-control ${errors.tempPassword ? 'is-invalid' : ''}`}
                          name="tempPassword"
                          placeholder="Nouveau mot de passe"
                          value={tempPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.tempPassword && <div className="invalid-feedback">{errors.tempPassword}</div>}
                      </div>
                      <div className="form-group">
                        <label>Confirmer mot de passe :</label>
                        <input
                          type="password"
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          name="confirmPassword"
                          placeholder="Confirmer mot de passe"
                          value={confirmPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
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
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgentDetails;