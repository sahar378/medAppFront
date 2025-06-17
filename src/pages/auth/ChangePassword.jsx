import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const ChangePassword = () => {
  const [userId] = useState(localStorage.getItem('userId') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Valider le nouveau mot de passe
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setNewPasswordError(passwordValidationError);
      setConfirmPasswordError('');
      return;
    }

    // Vérifier la correspondance des mots de passe
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas.');
      setNewPasswordError('');
      return;
    }

    try {
      await authService.changePassword(userId, newPassword, confirmPassword);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Mot de passe mis à jour, reconnectez-vous.',
        confirmButtonText: 'OK',
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe.',
        confirmButtonText: 'Réessayer',
      });
      console.error(error);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <div className="login-box">
        <div className="card">
          <div className="card-body login-card-body">
            <h2 className="login-box-msg">Votre mot de passe est expiré</h2>
            <p>Modifiez votre mot de passe pour continuer</p>
            <form onSubmit={handleChangePassword}>
              <div className="input-group mb-3">
                <input type="text" className="form-control" value={userId} readOnly />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className={`form-control ${newPasswordError ? 'is-invalid' : ''}`}
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewPasswordError(''); // Réinitialiser l'erreur lors de la modification
                  }}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
                {newPasswordError && <div className="invalid-feedback">{newPasswordError}</div>}
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                  placeholder="Confirmer mot de passe"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError(''); // Réinitialiser l'erreur lors de la modification
                  }}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
                {confirmPasswordError && <div className="invalid-feedback">{confirmPasswordError}</div>}
              </div>
              <button type="submit" className="btn btn-primary btn-block">Enregistrer</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;