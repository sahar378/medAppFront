// src/pages/auth/Login.jsx
//Page de connexion pour tous les utilisateurs (intendant ou agents).
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //Redirige selon le rôle (INTENDANT → /intendant, autres → /agent) ou vers /change-password si le mot de passe est expiré.
      const response = await login(userId, password);
      console.log('Réponse complète:', response);
      if (response.message.includes('expiré')) {
        navigate('/change-password');
      } else {
        const role = response.authorities[0]?.authority;
        if (role === 'INTENDANT') navigate('/intendant');
        else navigate('/agent');
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