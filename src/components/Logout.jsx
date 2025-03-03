//src/components/Logout.jsx
/*Permet à un utilisateur connecté (intendant ou agent) de se déconnecter en invalidant sa session et en le redirigeant vers la page de connexion.*/
import React from 'react';
import { useNavigate } from 'react-router-dom';//Permet de rediriger programmatiquement.
import { useAuth } from '../context/AuthContext';//Accède aux fonctions et états du contexte d’authentification (logout).
import Swal from 'sweetalert2';//Fournit des alertes visuelles (SweetAlert2).

const Logout = () => {
  const { logout } = useAuth();// Utilise la fonction logout du contexte AuthContext
  const navigate = useNavigate();// Hook pour rediriger l'utilisateur

  const handleLogout = async () => {
    try {
      await logout();// Appelle la fonction logout du contexte, qui invalide le token et nettoie localStorage
      Swal.fire('Déconnexion', 'Vous êtes déconnecté avec succès', 'success');// Alerte de succès
      navigate('/login');// Redirige vers la page de connexion
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la déconnexion', 'error');// Alerte en cas d'erreur
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  return (
    <button onClick={handleLogout}// Déclenche handleLogout au clic
     style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
      Déconnexion
    </button>
  );
};

export default Logout;