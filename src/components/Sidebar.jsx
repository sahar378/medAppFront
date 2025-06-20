import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Sidebar = () => {
  const { userId, activeRole, profiles, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = React.useState({ nom: '', prenom: '' });

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      try {
        const response = await authService.getProfile(userId);
        setUserProfile({ nom: response.data.nom, prenom: response.data.prenom });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
      }
    };
    fetchUserProfile();
  }, [userId]);

  // Trouver le profil actif pour récupérer le descriptif
  const activeProfile = profiles.find(profile => profile.role === activeRole);
  const spaceName = activeProfile ? activeProfile.descriptif : 'Espace Utilisateur';

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '250px', overflow: 'hidden' }}>
      <Link to="/" className="brand-link" title="Retourner à l'accueil">
        <span className="brand-text font-weight-light">PrivateApp</span>
        <img src="/images/kidney-logo.png" alt="Kidney Logo" className="brand-image img-circle elevation-3" style={{ marginLeft: '10px', width: '35px', height: '35px' }} />
      </Link>
      {isAuthenticated && userId && (
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <i className="fas fa-user fa-lg" style={{ color: '#ffffff', padding: '3px' }}></i>
          </div>
          <div className="info">
            <Link to="/profile" className="nav-link" style={{ color: '#ffffff', padding: '0.5px', fontSize: '14px' }} title="Cliquez pour voir mon profil">
              {userProfile.prenom} {userProfile.nom}
            </Link>
          </div>
        </div>
      )}
      <div className="sidebar" style={{ height: 'calc(100vh - 110px)', overflowY: 'scroll', overflowX: 'hidden', paddingBottom: '20px' }}>
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
            {activeRole === 'INTENDANT' && (
              <>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>{spaceName}</li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des personnels</li>
                <li className="nav-item"><Link to="/intendant/habilitation" className="nav-link" title="Gérer les habilitations des personnels"><i className="nav-icon fas fa-users-cog"></i><p>Habilitation</p></Link></li>
                <li className="nav-item"><Link to="/intendant/agents/add" className="nav-link" title="Ajouter un nouveau personnel"><i className="nav-icon fas fa-user-plus"></i><p>Ajouter un personnel</p></Link></li>
                
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion de bon de commande</li>
                <li className="nav-item"><Link to="/intendant/bons-commande" className="nav-link" title="Approbation de bon de commande"><i className="nav-icon fas fa-file-alt"></i><p>Bons de commande</p></Link></li>
                <li className="nav-item"><Link to="/intendant/bons-annules" className="nav-link" title="Consulter les bons de commande annulés"><i className="nav-icon fas fa-times-circle"></i><p>Bons Annulés</p></Link></li>

                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion de Notifications</li>
                <li className="nav-item"><Link to="/intendant/notifications/creer" className="nav-link" title="Créer une notification"><i className="nav-icon fas fa-plus-circle"></i><p>Créer Notification</p></Link></li>
                <li className="nav-item"><Link to="/intendant/notifications" className="nav-link" title="Consulter les notifications"><i className="nav-icon fas fa-bell"></i><p>Consulter Notifications</p></Link></li>
                
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Consultation Stock</li>
                <li className="nav-item"><Link to="/intendant/stock/active/medicaments" className="nav-link" title="Stock actif des médicaments"><i className="nav-icon fas fa-pills"></i><p>Médicaments Actifs</p></Link></li>
                <li className="nav-item"><Link to="/intendant/stock/active/materiels" className="nav-link" title="Stock actif des matériels"><i className="nav-icon fas fa-tools"></i><p>Matériels Actifs</p></Link></li>
                <li className="nav-item"><Link to="/intendant/stock/archived/medicaments" className="nav-link" title="Stock archivé des médicaments"><i className="nav-icon fas fa-archive"></i><p>Médicaments Archivés</p></Link></li>
                <li className="nav-item"><Link to="/intendant/stock/archived/materiels" className="nav-link" title="Stock archivé des matériels"><i className="nav-icon fas fa-archive"></i><p>Matériels Archivés</p></Link></li>
                <li className="nav-item"><Link to="/stock/produits-usage" className="nav-link" title="Voir les produits utilisés par séance"><i className="nav-icon fas fa-boxes"></i><p>Produits Utilisés</p></Link></li>
                <li className="nav-item"><Link to="/stock/produits-standards" className="nav-link" title="Voir les produits standards des patients"><i className="nav-icon fas fa-star"></i><p>Produits Standards</p></Link></li>

                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Consultation des Livraisons</li>
                <li className="nav-item"><Link to="/liste-livraisons" className="nav-link" title="Voir toutes les livraisons"><i className="nav-icon fas fa-truck"></i><p>Liste des Livraisons</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Consultation de l'inventaire</li>
                <li className="nav-item"><Link to="/historique-inventaires" className="nav-link" title="Consulter l’historique des inventaires"><i className="nav-icon fas fa-history"></i><p>Historique Inventaires</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Consultation de Fournisseurs</li>
                <li className="nav-item"><Link to="/intendant/fournisseurs" className="nav-link" title="Consulter la liste des fournisseurs"><i className="nav-icon fas fa-truck"></i><p>Fournisseurs</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Consultation des Interventions</li>
                <li className="nav-item"><Link to="/intendant/reclamations" className="nav-link" title="Consulter les réclamations"><i className="nav-icon fas fa-exclamation-triangle"></i><p>Liste des Interventions</p></Link></li>
                <li className="nav-item"><Link to="/intendant/machines" className="nav-link" title="Consulter les machines"><i className="nav-icon fas fa-cogs"></i><p>Liste des Machines</p></Link></li>
                <li className="nav-item"><Link to="/intendant/techniciens" className="nav-link" title="Consulter les techniciens"><i className="nav-icon fas fa-user-cog"></i><p>Liste des Techniciens</p></Link></li>
                
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Consultation de Patients</li>
                <li className="nav-item"><Link to="/intendant/patients" className="nav-link" title="Voir la liste des patients"><i className="nav-icon fas fa-users"></i><p>Liste des Patients</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Consultation de Séances</li>
                <li className="nav-item"><Link to="/medical/seances" className="nav-link" title="Voir les séances effectuées"><i className="nav-icon fas fa-calendar-check"></i><p>Séances effectuées</p></Link></li>
              </>
            )}
            {activeRole === 'RESPONSABLE_STOCK' && (
              <>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>{spaceName}</li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion de Stock</li>
                <li className="nav-item"><Link to="/stock/add" className="nav-link" title="Ajouter un nouveau produit au stock"><i className="nav-icon fas fa-plus-circle"></i><p>Ajouter un produit</p></Link></li>
                <li className="nav-item"><Link to="/stock/medicaments" className="nav-link" title="Voir la liste des médicaments"><i className="nav-icon fas fa-pills"></i><p>Liste des médicaments</p></Link></li>
                <li className="nav-item"><Link to="/stock/materiels" className="nav-link" title="Voir la liste des matériels"><i className="nav-icon fas fa-tools"></i><p>Liste des matériels</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Consultation des Produits</li>
                <li className="nav-item"><Link to="/stock/produits-usage" className="nav-link" title="Voir les produits utilisés par séance"><i className="nav-icon fas fa-boxes"></i><p>Produits Utilisés</p></Link></li>
                <li className="nav-item"><Link to="/stock/produits-standards" className="nav-link" title="Voir les produits standards des patients"><i className="nav-icon fas fa-user-md"></i><p>Produits Standards</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des Livraisons</li>
                <li className="nav-item"><Link to="/stock/ajouter-livraison" className="nav-link" title="Enregistrer une nouvelle livraison"><i className="nav-icon fas fa-shipping-fast"></i><p>Ajouter une Livraison</p></Link></li>
                <li className="nav-item"><Link to="/liste-livraisons" className="nav-link" title="Voir toutes les livraisons"><i className="nav-icon fas fa-list"></i><p>Liste des Livraisons</p></Link></li>
                <li className="nav-item"><Link to="/historique-inventaires" className="nav-link" title="Consulter l’historique des inventaires"><i className="nav-icon fas fa-history"></i><p>Historique Inventaires</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des Fournisseurs</li>
                <li className="nav-item"><Link to="/stock/fournisseurs" className="nav-link" title="Liste des fournisseurs"><i className="nav-icon fas fa-truck"></i><p>Liste des Fournisseurs</p></Link></li>
                <li className="nav-item"><Link to="/stock/fournisseurs/add" className="nav-link" title="Ajouter un fournisseur"><i className="nav-icon fas fa-user-plus"></i><p>Ajouter un Fournisseur</p></Link></li>
                <li className="nav-item"><Link to="/stock/fournisseurs/associer" className="nav-link" title="Associer des produits à un fournisseur"><i className="nav-icon fas fa-link"></i><p>Associer Produits</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des Bons de Commande</li>
                <li className="nav-item"><Link to="/stock/creer-bon-commande" className="nav-link"><i className="nav-icon fas fa-cart-plus" /><p>Créer un bon de commande</p></Link></li>
                <li className="nav-item"><Link to="/stock/bons-commande" className="nav-link" title="Créer et gérer les bons de commande"><i className="nav-icon fas fa-file-alt"></i><p>Gestion Bons de Commande</p></Link></li>
                <li className="nav-item"><Link to="/stock/bons-historique" className="nav-link" title="Consulter l'historique des bons de commande"><i className="nav-icon fas fa-history"></i><p>Historique Bons</p></Link></li>
                <li className="nav-item"><Link to="/stock/notifications" className="nav-link" title="Voir les notifications"><i className="nav-icon fas fa-bell"></i><p>Notifications</p></Link></li>
              </>
            )}
                          {activeRole === 'PERSONNEL_MEDICAL' && (
              <>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>{spaceName}</li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des Séances</li>
                <li className="nav-item">
                  <Link to="/medical/seances" className="nav-link" title="Gérer les séances">
                    <i className="nav-icon fas fa-calendar-check"></i>
                    <p>Gérer les Séances</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/medical/seances/create" className="nav-link" title="Créer une séance">
                    <i className="nav-icon fas fa-calendar-plus"></i>
                    <p>Créer une Séance</p>
                  </Link>
                </li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des Patients</li>
                <li className="nav-item">
                  <Link to="/medical/patients" className="nav-link" title="Consulter l’historique de dialyse">
                    <i className="nav-icon fas fa-history"></i>
                    <p>Consulter les patients</p>
                  </Link>
                </li>
              
                <li className="nav-item">
              <Link to="/medical/produits-usage" className="nav-link">
                <i className="nav-icon fas fa-boxes"></i>
                <p>Produits Utilisés</p>
              </Link>
            </li>
              </>
            )}
            {activeRole === 'INFIRMIER' && (
              <>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>{spaceName}</li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des Inventaires</li>
                <li className="nav-item"><Link to="/medical/infirmier/faire-inventaire" className="nav-link" title="Effectuer un nouvel inventaire"><i className="nav-icon fas fa-clipboard-check"></i><p>Faire un Inventaire</p></Link></li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des Interventions</li>
                <li className="nav-item"><Link to="/medical/infirmier/machines" className="nav-link" title="Ajouter une machine"><i className="nav-icon fas fa-cogs"></i><p>Ajouter une Machine</p></Link></li>
                <li className="nav-item"><Link to="/medical/infirmier/techniciens" className="nav-link" title="Ajouter un technicien"><i className="nav-icon fas fa-user-cog"></i><p>Ajouter un Technicien</p></Link></li>
                <li className="nav-item"><Link to="/medical/infirmier/interventions" className="nav-link" title="Créer une réclamation"><i className="nav-icon fas fa-tools"></i><p>Créer une Réclamation</p></Link></li>
                <li className="nav-item"><Link to="/medical/infirmier/interventions/list" className="nav-link" title="Consulter les réclamations"><i className="nav-icon fas fa-list"></i><p>Liste des Réclamations</p></Link></li>
                <li className="nav-item"><Link to="/medical/infirmier/machines/list" className="nav-link" title="Consulter les machines"><i className="nav-icon fas fa-list"></i><p>Liste des Machines</p></Link></li>
                <li className="nav-item"><Link to="/medical/infirmier/techniciens/list" className="nav-link" title="Consulter les techniciens"><i className="nav-icon fas fa-list"></i><p>Liste des Techniciens</p></Link></li>
              </>
            )}
            {activeRole === 'SUPER_ADMIN' && (
              <>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>{spaceName}</li>
                <li className="nav-item"><Link to="/super-admin/intendants" className="nav-link"><i className="nav-icon fas fa-users-cog"></i><p>Gérer les intendants</p></Link></li>
              </>
            )}
            {activeRole === 'MEDECIN' && (
              <>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>{spaceName}</li>
                <li className="nav-header" style={{ color: '#c2c7d0', fontSize: '12px', textTransform: 'uppercase' }}>Gestion des Patients</li>
                <li className="nav-item">
                  <Link to="/medical/medecin/patients" className="nav-link" title="Gérer les patients">
                    <i className="nav-icon fas fa-users"></i>
                    <p>Liste des Patients</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/medical/medecin/patients/create" className="nav-link" title="Ajouter un patient">
                    <i className="nav-icon fas fa-user-plus"></i>
                    <p>Ajouter un Patient</p>
                  </Link>
                </li>
                <li className="nav-item"><hr style={{ borderColor: '#4f5962', margin: '10px 0' }} /></li>
                
                
              </>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;