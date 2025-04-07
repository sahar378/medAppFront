import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reason') === 'session-expired') {
      alert('Votre session a expiré. Veuillez vous reconnecter.'); // Ou un composant UI
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(userId, password);
      if (response.message.includes('expiré')) {
        navigate('/change-password');
      } else {
        const roles = response.authorities.map(auth => auth.authority);
        const urls = response.urls;
        if (roles.length === 1) {
          navigate(urls[0]);
        } else {
          navigate('/role-selection');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
      alert('Erreur: ' + error.message);
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
                className="form-control"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock"></span>
                </div>
              </div>
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
/*Après une expiration, l’utilisateur est redirigé vers /login?reason=session-expired, et un message s’affiche (ici via alert, mais tu peux utiliser un composant UI stylé).*/