//src/pages/auth/ChangePassword.jsx
//Permet à un agent de changer son mot de passe temporaire après une première connexion.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const ChangePassword = () => {
  const [userId] = useState(localStorage.getItem('userId') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    //Vérifie que newPassword et confirmPassword correspondent.
    if (newPassword !== confirmPassword) {
      Swal.fire('Erreur', 'Les mots de passe ne correspondent pas', 'error');
      return;
    }
    try {//Envoie une requête POST /api/auth/change-password via authService.
      await authService.changePassword(userId, newPassword, confirmPassword);
      Swal.fire('Succès', 'Mot de passe mis à jour, reconnectez-vous', 'success');
      //Redirige vers /login après succès.
      navigate('/login');
    } catch (error) {
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
                  className="form-control"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirmer mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
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