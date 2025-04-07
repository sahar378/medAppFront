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

verifierAlertesMedicaments: async () => {
  try {
    const response = await api.get('/stock/alertes/medicaments');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de vérifier les alertes des médicaments', 'error');
    throw error;
  }
},

verifierAlertesMateriels: async () => {
  try {
    const response = await api.get('/stock/alertes/materiels');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de vérifier les alertes des matériels', 'error');
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
getActiveMedicaments: async () => {
  try {
    const response = await api.get('/stock/produits/active/medicaments');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les médicaments actifs', 'error');
    throw error;
  }
},

getActiveMateriels: async () => {
  try {
    const response = await api.get('/stock/produits/active/materiels');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les matériels actifs', 'error');
    throw error;
  }
},

getArchivedMedicaments: async () => {
  try {
    const response = await api.get('/stock/produits/archived/medicaments');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les médicaments archivés', 'error');
    throw error;
  }
},

getArchivedMateriels: async () => {
  try {
    const response = await api.get('/stock/produits/archived/materiels');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les matériels archivés', 'error');
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
  },
// Gestion des fournisseurs
getAllFournisseurs: async () => {
  try {
    const response = await api.get('/fournisseurs');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les fournisseurs', 'error');
    throw error;
  }
},

getFournisseurById: async (id) => {
  try {
    const response = await api.get(`/fournisseurs/${id}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer le fournisseur', 'error');
    throw error;
  }
},

createFournisseur: async (fournisseurData) => {
  try {
    const response = await api.post('/fournisseurs', fournisseurData);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la création du fournisseur', 'error');
    throw error;
  }
},

updateFournisseur: async (id, fournisseurData) => {
  try {
    const response = await api.put(`/fournisseurs/${id}`, fournisseurData);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la mise à jour du fournisseur', 'error');
    throw error;
  }
},

deleteFournisseur: async (id) => {
  try {
    const response = await api.delete(`/fournisseurs/${id}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la suppression du fournisseur', 'error');
    throw error;
  }
},
// Associer un produit à un fournisseur
associerProduitFournisseur: async (fournisseurId, produitId) => {
  try {
    const response = await api.post(`/fournisseurs/${fournisseurId}/produits/${produitId}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de l’association du produit', 'error');
    throw error;
  }
},

//associer plusieur produits à un fournisseur 
associerProduitsFournisseur: async (fournisseurId, produitIds) => {
  try {
    const response = await api.post(`/fournisseurs/${fournisseurId}/associer-produits`, { produitIds });
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de l’association des produits', 'error');
    throw error;
  }
},
// Dissocier un produit d’un fournisseur
dissocierProduitFournisseur: async (fournisseurId, produitId) => {
  try {
    const response = await api.delete(`/fournisseurs/${fournisseurId}/produits/${produitId}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la dissociation du produit', 'error');
    throw error;
  }
},
// Dissocier plusieurs produits d’un fournisseur
dissocierProduitsFournisseur: async (fournisseurId, produitIds) => {
  try {
      const response = await api.delete(`/fournisseurs/${fournisseurId}/dissocier-produits`, {
          data: { produitIds } // DELETE avec un corps
      });
      return response.data;
  } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la dissociation des produits', 'error');
      throw error;
  }
},
//retourner les fournisseurs associés
getFournisseursByProduit: async (produitId) => {
  try {
    const response = await api.get(`/fournisseurs/produit/${produitId}`);
    console.log(`Fournisseurs pour produit ${produitId} :`, response.data); // Log ajouté
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les fournisseurs pour ce produit', 'error');
    throw error;
  }
},



getFournisseursByStatut: async (statut) => {
  try {
    const response = await api.get(`/fournisseurs?statut=${statut}`);
    return response.data;
  } catch (error) {
    throw error;
  }
},

changerStatutFournisseur: async (id, statut, causeSuppression) => {
  try {
    const response = await api.put(`/fournisseurs/${id}/statut`, null, {
      params: { statut, causeSuppression }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
},


// src/services/authService.js
getFournisseursActifsByProduit: async (produitId) => {
  try {
    const response = await api.get(`/fournisseurs/produit/${produitId}?statut=0`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les fournisseurs actifs pour ce produit', 'error');
    throw error;
  }
},

 getFournisseursWithPrixByProduit : async (produitId) => {
  try {
  const response = await api.get(`/fournisseurs/produit/${produitId}/avec-prix`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les fournisseurs actifs pour ce produit', 'error');
    throw error;
  }
},


// Gestion des bons de commande
creerBonCommande: async (bonCommandeData) => {
  try {
    const response = await api.post('/commande/creer', bonCommandeData);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la création du bon de commande', 'error');
    throw error;
  }
},
//  méthode pour créer plusierus bon de commande regroupé par fournisseur
creerBonsCommandeParFournisseur: async (bonsCommandeData) => {
  try {
    const response = await api.post('/commande/creer-multi', bonsCommandeData);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la création des bons de commande', 'error');
    throw error;
  }
},

modifierBonCommande: async (idBonCommande, bonCommandeData) => {
  try {
    const url = `/commande/${idBonCommande}`;
    const token = localStorage.getItem('token');
    console.log('URL générée pour modifierBonCommande:', url);
    console.log('Token envoyé:', token);
    const response = await api.put(url, bonCommandeData);
    return response.data;
  } catch (error) {
    console.error('Erreur dans modifierBonCommande:', error.response?.status, error.response?.data);
    Swal.fire('Erreur', 'Erreur lors de la modification du bon de commande', 'error');
    throw error;
  }
},

// src/services/authService.js
approuverBonCommande: async (idBonCommande, approbationData) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token envoyé:', token); // Debug
    const response = await api.post(`/commande/${idBonCommande}/approuver`, approbationData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’approbation du bon de commande', error);
    Swal.fire('Erreur', 'Erreur lors de l’approbation du bon de commande', 'error');
    throw error;
  }
},

envoyerBonCommande: async (idBonCommande) => {
  try {
    const response = await api.post(`/commande/${idBonCommande}/envoyer`);
    return response.data;
  } catch (error) {
    throw error; // Propager l’erreur pour gestion dans le composant
  }
},

annulerBonCommande: async (idBonCommande, annulationData) => {
  try {
    const response = await api.post(`/commande/${idBonCommande}/annuler`, annulationData);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de l’annulation du bon de commande', 'error');
    throw error;
  }
},

getBonsDeCommande: async () => {
  try {
    const response = await api.get('/commande/bons');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les bons de commande', 'error');
    throw error;
  }
},
getBonsDeCommandeByEtat: async (etat) => {
  try {
    const response = await api.get(`/commande/bons/etat/${etat}`);
    return response.data; // Bons par état (ex. "envoyé")
  } catch (error) {
    Swal.fire('Erreur', `Impossible de récupérer les bons de commande (${etat})`, 'error');
    throw error;
  }
},

async getBonsDeCommandeByEtats(etats) {
  try {
    const response = await api.get('/commande/bons/etats-multiples', {
      params: { etats: etats.join(',') }, // Envoie les états comme une chaîne séparée par des virgules
    });
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les bons de commande par états', 'error');
    throw error;
  }
},

getBonsEnvoyes: async () => {
  try {
    const response = await api.get('/commande/bons/etat/envoyé');
    return response.data; // Bons envoyés uniquement
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les bons envoyés', 'error');
    throw error;
  }
},
supprimerBonCommande: async (idBonCommande) => {
  try {
    const response = await api.delete(`/commande/${idBonCommande}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la suppression du bon de commande', 'error');
    throw error;
  }
},

getPrixActif: async (produitId, fournisseurId) => {
  try {
    const response = await api.get(`/commande/prix/actif`, {
      params: { produitId, fournisseurId }
    });
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer le prix actif pour ce produit et fournisseur', 'error');
    throw error;
  }
},

// Gestion des prix
getAllPrix: async () => {
  try {
    const response = await api.get('/prix');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les prix', 'error');
    throw error;
  }
},

getPrixById: async (id) => {
  try {
    const response = await api.get(`/prix/${id}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer le prix', 'error');
    throw error;
  }
},

createPrix: async (prixData) => {
  try {
    const response = await api.post('/prix', prixData);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la création du prix', 'error');
    throw error;
  }
},

updatePrix: async (id, prixData) => {
  try {
    const response = await api.put(`/prix/${id}`, prixData);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la mise à jour du prix', 'error');
    throw error;
  }
},

deletePrix: async (id) => {
  try {
    const response = await api.delete(`/prix/${id}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la suppression du prix', 'error');
    throw error;
  }
},
getProduitsWithPrixActifs: async (categorie, nom, sortBy, sortOrder) => {
  try {
    const response = await api.get('/prix/produits', {
      params: { categorie, nom, sortBy, sortOrder },
    });
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les prix', 'error');
    throw error;
  }
},
getAllProduitsWithOptionalPrix: async (categorie, nom, sortBy, sortOrder) => {
  try {
      const response = await api.get('/prix/produits/all', {
          params: { categorie, nom, sortBy, sortOrder },
      });
      return response.data;
  } catch (error) {
      Swal.fire('Erreur', 'Impossible de récupérer les produits', 'error');
      throw error;
  }
},
async getProduitsByCategorie(idCategorie) {
  const response = await api.get(`/stock/produits?categorie=${idCategorie}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
},
async getPrixByProduit(produitId, sortBy, sortOrder) {
  const response = await api.get(`/prix/produit/${produitId}?sortBy=${sortBy}&sortOrder=${sortOrder}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
},

async getBonCommandeAvecCalculs(idBonCommande) {
  const response = await api.get(`/commande/bon/${idBonCommande}/avec-calculs`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
},


addLivraison: async (livraisonData) => {
  try {
    const response = await api.post('/livraisons', livraisonData);
    return response.data;
  } catch (error) {
    console.error('Erreur dans addLivraison:', error.response?.data);
    Swal.fire('Erreur', error.response?.data?.message || 'Erreur lors de l’enregistrement de la livraison', 'error');
    throw error;
  }
},

async getAllLivraisons() {
  try {
    const token = localStorage.getItem('token');
    console.log('Token envoyé pour getAllLivraisons:', token);
    const response = await api.get('/livraisons');
    console.log('Réponse de getAllLivraisons:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons:', error.response);
    Swal.fire('Erreur', error.response?.data?.message || 'Impossible de charger les livraisons', 'error');
    throw error;
  }
},
getLastLivraisonId: async () => {
  try {
    const response = await api.get('/livraisons/last-id');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du dernier ID de livraison:', error.response?.data);
    Swal.fire('Erreur', error.response?.data?.message || 'Impossible de récupérer le dernier ID de livraison', 'error');
    throw error;
  }
},

// Gestion des inventaires pour le personnel médical
faireInventaire: async (lignes) => {
  try {
      const response = await api.post('/medical/inventaire/verifier', lignes);
      return response.data;
  } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la vérification de l’inventaire', 'error');
      throw error; // Propager l'erreur pour la gérer dans le composant
  }
},

getHistoriqueInventaires: async () => {
  try {
    const response = await api.get('/medical/inventaire/historique');
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer l’historique des inventaires', 'error');
    throw error;
  }
},

getInventaireById: async (id) => {
  try {
    const response = await api.get(`/medical/inventaire/${id}`);
    return response.data;
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de récupérer les détails de l’inventaire', 'error');
    throw error;
  }
},

// Dans src/services/authService.js, sous "Gestion des inventaires"
getProduitsForInventaire: async () => {
  try {
      const response = await api.get('/medical/produits');
      return response.data;
  } catch (error) {
      Swal.fire('Erreur', 'Impossible de récupérer les produits pour l’inventaire', 'error');
      throw error;
  }
},

//gestion des notifications 
creerNotification: async (notificationData) => {
  try {
      const response = await api.post('/notifications/creer', notificationData);
      return response.data;
  } catch (error) {
      Swal.fire('Erreur', 'Impossible d’envoyer la notification', 'error');
      throw error;
  }
},

getNotifications: async () => {
  try {
      const response = await api.get('/notifications');
      return response.data;
  } catch (error) {
      Swal.fire('Erreur', 'Impossible de récupérer les notifications', 'error');
      throw error;
  }
},

};

export default authService;

