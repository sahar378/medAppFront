// src/services/authService.js
//Fournit des fonctions pour interagir avec le backend (connexion, déconnexion, gestion des agents).
import api from '../axiosConfig';
import Swal from 'sweetalert2';

const authService = {
  //pour authentifier.
    login: async (userId, password) => {
        try {
          const response = await api.post('/auth/login', { userId, password });
          localStorage.setItem('token', response.data.token);
          return response.data; // Retourne { token, message, authorities }
        } catch (error) {
          const errorMessage = error.response?.data || 'Identifiants incorrects';
          Swal.fire('Erreur', errorMessage, 'error');
          throw new Error(errorMessage); // Relance une erreur claire
        }
  },
  //pour invalider le token.
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('authorities'); // Supprime aussi les authorities
      localStorage.removeItem('userId');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  },
  //pour mettre à jour le mot de passe.
  changePassword: async (userId, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/auth/change-password', { userId, newPassword, confirmPassword });
      localStorage.removeItem('token'); // Forcer une reconnexion
      return response.data;
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors du changement de mot de passe', 'error');
      throw error;
    }
  },
  //pour la liste des agents.
  getAgents: async () => {
    try {
      const response = await api.get('/intendant/users');
      return response.data;
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de récupérer la liste des agents', 'error');
      throw error;
    }
  },
  //pour définir un mot de passe temporaire.
  resetPassword: async (userId, tempPassword) => {
    try {
      const response = await api.post('/intendant/reset-password', { userId, tempPassword });
      return response.data;
    } catch (error) {
      Swal.fire('Erreur', error.response?.data || 'Erreur lors de la réinitialisation', 'error');
      throw error;
    }
  },
  //pour assigner plusieurs rôle.
  assignRoles: async (userId, profilIds) => {
    try {
        const response = await api.post('/intendant/assign-roles', { userId, profilIds });
        return response.data;
    } catch (error) {
        Swal.fire('Erreur', 'Erreur lors de l’assignation des rôles', 'error');
        throw error;
    }
},
  //gestion de profil : voir les informations de user connecté
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/agent/profile?userId=${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
//modifier les informations de user connecté 
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/agent/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },

// Gestion de stock
getAllProduits: async () => {
  try {
    const response = await api.get('/stock/all');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer tous les produits', 'error');
    throw error;
  }
},
getProduitsByUser: async () => { // Retiré userId
  try {
    const response = await api.get('/stock/produits');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les produits', 'error');
    throw error;
  }
},
getProduitById: async (produitId) => {
  const response = await api.get(`/stock/produit/${produitId}`);
  return response.data;
},
updateProduit: async (produitId, produit) => {
  try {
      const response = await api.put(`/stock/produit/${produitId}`, produit);
      return response.data;
  } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la mise à jour du produit', 'error');
      throw error;
  }
},
getProduitLogs: async (produitId) => {
  const response = await api.get(`/stock/logs?produitId=${produitId}`);
  return response.data;
},

verifierAlertes: async () => { // Retiré userId
  try {
    const response = await api.get('/stock/alertes');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de vérifier les alertes', 'error');
    throw error;
  }
},

saveProduit: async (produit) => { // Retiré userId
  try {
    const response = await api.post('/stock/produit', produit);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de l’ajout du produit', 'error');
    throw error;
  }
},

deleteProduit: async (produitId) => { // Retiré userId
  try {
    const response = await api.delete(`/stock/produit/${produitId}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la suppression du produit', 'error');
    throw error;
  }
},

definirSeuilsCategorie: async (idCategorie, nombreMalades) => { // Retiré userId
  try {
    const response = await api.post('/stock/seuils/categorie', null, {
      params: { idCategorie, nombreMalades }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
},
  //gestion des agents 
  //ajouter un agent
  addAgent: async (agentData) => {
    try {
      const response = await api.post('/intendant/agents/add', agentData);
      return response.data; // Retourne l'utilisateur avec le userId généré
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de l’ajout de l’agent', 'error');
      throw error;
    }
  },
//modifier les infos d'un agent
  updateAgent: async (userId, agentData) => {
    try {
      const response = await api.put(`/intendant/agents/update/${userId}`, agentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
//supprimer un agent
  deleteAgent: async (userId) => {
    try {
      const response = await api.delete(`/intendant/agents/delete/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
//récupérer tous les agents
  getAllAgents: async () => {
    try {
      const response = await api.get('/intendant/agents/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
//récupérer les agents qui ont un accées à l'application
  getAgentsWithAccess: async () => {
    try {
      const response = await api.get('/intendant/agents/with-access');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
//récupérer les agents qui n'ont pas encore d'accées à l'application
  getAgentsWithoutAccess: async () => {
    try {
      const response = await api.get('/intendant/agents/without-access');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAgentById: async (userId) => {
    try {
      const response = await api.get(`/intendant/agents/${userId}`);
      return response.data;
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de récupérer les détails de l’agent', 'error');
      throw error;
    }
  },
  getAllRoles: async () => {
    try {
      const response = await api.get('/intendant/profils');
      console.log('Réponse getAllRoles:', response.data); // Debug
      return response.data; // Retourne un tableau de rôles
    } catch (error) {
      console.error('Erreur getAllRoles:', error);
      Swal.fire('Erreur', 'Impossible de récupérer les rôles', 'error');
      throw error;
    }
  }
};

export default authService;
