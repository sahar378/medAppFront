import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, setActiveSpace } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reason') === 'session-expired') {
      Swal.fire({
        icon: 'warning',
        title: 'Session expirée',
        text: 'Votre session a expiré. Veuillez vous reconnecter.',
        confirmButtonText: 'OK',
      });
    }
  }, [location]);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    // Valider le mot de passe
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      const response = await login(userId, password);
      if (response.message.includes('expiré')) {
        navigate('/change-password');
      } else {
        const profiles = response.profiles;
        if (profiles.length === 1) {
          setActiveSpace(profiles[0].role);
          navigate(profiles[0].url); // Redirection directe vers l'URL du rôle
        } else {
          navigate('/role-selection');
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: error.response?.data?.message || 'Identifiant ou mot de passe incorrect.',
        confirmButtonText: 'Réessayer',
      });
      setPasswordError('');
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <div className="login-box">
        <div className="card">
          <div className="card-body login-card-body">
            <h2 className="login-box-msg">Connexion</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Matricule (userId)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  autoComplete="username"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(''); // Réinitialiser l'erreur lors de la modification
                  }}
                  required
                  autoComplete="current-password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
              </div>
              <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;