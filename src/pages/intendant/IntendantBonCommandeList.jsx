// src/pages/intendant/IntendantBonCommandeList.jsx
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

        if (activeTab === 'brouillon') {
          // Tous les bons "nouveau" : pas encore rejetés (indépendamment de dateModification)
          const newBons = brouillonData.filter(bon => !bon.dateRejet);
          if (newBons.length > 0) {
            Swal.fire('Nouveaux Bons', `${newBons.length} bon(s) en attente d’approbation.`, 'info');
          }
          // Bons corrigés après rejet
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
  }, [activeTab]);

  const handleRowClick = (bon) => {
    navigate(`/intendant/bons-commande/${bon.idBonCommande}`, { state: { fromTab: activeTab } });
  };

  const getStatutBadge = (bon) => {
    if (bon.etat === 'brouillon') {
      if (bon.dateRejet && bon.dateModification && new Date(bon.dateModification) > new Date(bon.dateRejet)) {
        return <span className="badge bg-success">Corrigé</span>;
      }
      if (bon.dateRejet) {
        return <span className="badge bg-danger">Rejeté</span>;
      }
      return <span className="badge bg-primary">Nouveau</span>; // "Nouveau" même si modifié, tant que pas rejeté
    }
    if (bon.etat === 'approuvé') return <span className="badge bg-success">Approuvé</span>;
    if (bon.etat === 'envoyé') return <span className="badge bg-dark">Envoyé</span>;
    return null;
  };

  const renderTable = (bons, tab) => {
    if (tab === 'envoye') {
      return (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date de création</th>
              <th>Fournisseur</th>
              <th>Envoyé par</th>
              <th>Date d’envoi</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {bons.map(bon => (
              <tr key={bon.idBonCommande} onClick={() => handleRowClick(bon)} style={{ cursor: 'pointer' }}>
                <td>{bon.idBonCommande}</td>
                <td>{new Date(bon.date).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td>{bon.fournisseur.nom}</td>
                <td>
                  {bon.envois && bon.envois.length > 0 
                    ? `${bon.envois[0].sentBy.nom} ${bon.envois[0].sentBy.prenom}` 
                    : '-'}
                </td>
                <td>
                  {bon.envois && bon.envois.length > 0 
                    ? new Date(bon.envois[0].dateEnvoi).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) 
                    : '-'}
                </td>
                <td>{getStatutBadge(bon)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return (
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date de création</th>
            <th>Fournisseur</th>
            <th>Créé par</th>
            <th>Modifié par</th>
            <th>Date de modification</th>
            <th>Cause de rejet</th>
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
  };

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
                {activeTab === 'brouillon' && renderTable(bonsCommande.brouillon, 'brouillon')}
                {activeTab === 'approuve' && renderTable(bonsCommande.approuve, 'approuve')}
                {activeTab === 'envoye' && renderTable(bonsCommande.envoye, 'envoye')}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntendantBonCommandeList;