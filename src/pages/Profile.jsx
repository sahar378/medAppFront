import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import authService from '../services/authService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userId, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    numeroTelephone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile(userId);
        setProfile(response.data);
        setFormData({
          nom: response.data.nom || '',
          prenom: response.data.prenom || '',
          email: response.data.email || '',
          dateNaissance: response.data.dateNaissance ? response.data.dateNaissance.split('T')[0] : '',
          numeroTelephone: response.data.numeroTelephone || ''
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil', error);
      }
    };
    fetchProfile();
  }, [userId]);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    try {
      await authService.updateProfile({ userId, ...formData });
      setProfile({ ...profile, ...formData });
      setEditMode(false);
      Swal.fire('Succès', 'Profil mis à jour', 'success');
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
    }
  };

  const handleChangePassword = async () => {
    // Ajout de l'alerte de confirmation avant de procéder au changement
    const result = await Swal.fire({
      title: 'Confirmer le changement de mot de passe',
      text: 'Êtes-vous sûr de vouloir changer votre mot de passe ? Vous serez déconnecté après cette action.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, changer !',
      cancelButtonText: 'Annuler'
    });

    if (!result.isConfirmed) {
      return; // Si l'utilisateur annule, on arrête la fonction
    }

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs de mot de passe', 'error');
      return;
    }

    const newPasswordError = validatePassword(passwordData.newPassword);
    if (newPasswordError) {
      setPasswordErrors({ newPassword: newPasswordError, confirmPassword: '' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors({
        newPassword: '',
        confirmPassword: 'Les nouveaux mots de passe ne correspondent pas.'
      });
      return;
    }

    try {
      await authService.changeProfilePassword(
        userId,
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      Swal.fire('Succès', 'Mot de passe mis à jour. Veuillez vous reconnecter.', 'success');
      logout();
      navigate('/login');
    } catch (error) {
      Swal.fire('Erreur', error.response?.data?.message || 'Erreur lors du changement de mot de passe', 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Profil Utilisateur</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Informations personnelles</h3>
                <div className="card-tools">
                  <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Annuler' : 'Modifier Profil'}
                  </button>
                  {!editMode && (
                    <button
                      className="btn btn-secondary ml-2"
                      onClick={() => setPasswordEditMode(!passwordEditMode)}
                    >
                      {passwordEditMode ? 'Annuler' : 'Changer Mot de Passe'}
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                {profile ? (
                  <>
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
                    ) : passwordEditMode ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
                        <div className="form-group">
                          <label>Mot de passe actuel :</label>
                          <input
                            type="password"
                            className="form-control"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Nouveau mot de passe :</label>
                          <input
                            type="password"
                            className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordInputChange}
                            required
                          />
                          {passwordErrors.newPassword && <div className="invalid-feedback">{passwordErrors.newPassword}</div>}
                        </div>
                        <div className="form-group">
                          <label>Confirmer le nouveau mot de passe :</label>
                          <input
                            type="password"
                            className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordInputChange}
                            required
                          />
                          {passwordErrors.confirmPassword && <div className="invalid-feedback">{passwordErrors.confirmPassword}</div>}
                        </div>
                        <button type="submit" className="btn btn-success">Changer le mot de passe</button>
                      </form>
                    ) : (
                      <div>
                        <p><strong>Nom :</strong> {profile.nom}</p>
                        <p><strong>Prénom :</strong> {profile.prenom}</p>
                        <p><strong>Email :</strong> {profile.email}</p>
                        <p><strong>Date de naissance :</strong> {profile.dateNaissance ? new Date(profile.dateNaissance).toLocaleDateString() : 'Non défini'}</p>
                        <p><strong>Numéro de téléphone :</strong> {profile.numeroTelephone || 'Non défini'}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p>Chargement du profil...</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;