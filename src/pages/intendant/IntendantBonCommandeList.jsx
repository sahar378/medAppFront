import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const IntendantBonCommandeList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'brouillon');
  const [bonsCommande, setBonsCommande] = useState({
    brouillon: [],
    approuve: [],
    envoye: [],
  });

  useEffect(() => {
    const fetchAllBons = async () => {
      try {
        const brouillonData = await authService.getBonsDeCommandeByEtat('brouillon');
        const approuveData = await authService.getBonsDeCommandeByEtat('approuvé');
        const envoyeData = await authService.getBonsDeCommandeByEtat('envoyé');
        
        setBonsCommande({
          brouillon: brouillonData,
          approuve: approuveData,
          envoye: envoyeData,
        });

        // Afficher les alertes uniquement si l'onglet actif est 'brouillon'
        if (activeTab === 'brouillon') {
          const newBons = brouillonData.filter(bon => !bon.dateModification && !bon.dateRejet);
          if (newBons.length > 0) {
            Swal.fire('Nouveaux Bons', `${newBons.length} bon(s) en attente d’approbation.`, 'info');
          }
          const correctedBons = brouillonData.filter(bon => bon.dateRejet && bon.dateModification && new Date(bon.dateModification) > new Date(bon.dateRejet));
          if (correctedBons.length > 0) {
            Swal.fire('Corrections', `${correctedBons.length} bon(s) corrigé(s) après rejet.`, 'success');
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des bons', error);
      }
    };
    fetchAllBons();
  }, [activeTab]); // Ajout de activeTab comme dépendance

  const handleRowClick = (bon) => {
    navigate(`/intendant/bons-commande/${bon.idBonCommande}`, { state: { fromTab: activeTab } });
  };

  const getStatutBadge = (bon) => {
    if (bon.etat === 'brouillon') {
      if (bon.dateRejet && bon.dateModification && new Date(bon.dateModification) > new Date(bon.dateRejet))
        return <span className="badge bg-info">Corrigé</span>;
      if (bon.dateRejet) return <span className="badge bg-danger">Rejeté</span>;
      if (bon.dateModification) return <span className="badge bg-warning text-dark">Modifié</span>;
      return <span className="badge bg-primary">Nouveau</span>;
    }
    if (bon.etat === 'approuvé') return <span className="badge bg-success">Approuvé</span>;
    if (bon.etat === 'envoyé') return <span className="badge bg-dark">Envoyé</span>;
    return null;
  };

  const renderTable = (bons) => (
    <table className="table table-bordered table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Fournisseur</th>
          <th>Créé par</th>
          <th>Modifié par</th>
          <th>Date de modification</th>
          <th>Commentaire</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        {bons.map(bon => (
          <tr key={bon.idBonCommande} onClick={() => handleRowClick(bon)} style={{ cursor: 'pointer' }}>
            <td>{bon.idBonCommande}</td>
            <td>{new Date(bon.date).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
            <td>{bon.fournisseur.nom}</td>
            <td>{bon.createdBy ? `${bon.createdBy.nom} ${bon.createdBy.prenom}` : '-'}</td>
            <td>{bon.modifiedBy ? `${bon.modifiedBy.nom} ${bon.modifiedBy.prenom}` : '-'}</td>
            <td>
              {bon.dateModification 
                ? new Date(bon.dateModification).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) 
                : '-'}
            </td>
            <td>{bon.commentaireRejet || bon.motifAnnulation || '-'}</td>
            <td>{getStatutBadge(bon)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Gestion des Bons de Commande</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'brouillon' ? 'active' : ''}`} onClick={() => setActiveTab('brouillon')}>
                      En attente d’approbation
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'approuve' ? 'active' : ''}`} onClick={() => setActiveTab('approuve')}>
                      Approuvé
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'envoye' ? 'active' : ''}`} onClick={() => setActiveTab('envoye')}>
                      Envoyé
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === 'brouillon' && renderTable(bonsCommande.brouillon)}
                {activeTab === 'approuve' && renderTable(bonsCommande.approuve)}
                {activeTab === 'envoye' && renderTable(bonsCommande.envoye)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntendantBonCommandeList;