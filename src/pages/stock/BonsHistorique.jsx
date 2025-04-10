import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const BonsHistorique = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'envoye'); // Utilise l'onglet passé au retour
  const [bonsCommande, setBonsCommande] = useState({
    approuve: [],
    envoye: [],
    annule: [],
  });

  useEffect(() => {
    const fetchAllBons = async () => {
      try {
        const approuveData = await authService.getBonsDeCommandeByEtat('approuvé');
        const envoyeData = await authService.getBonsDeCommandeByEtat('envoyé');
        const annuleData = await authService.getBonsDeCommandeByEtat('annulé');

        setBonsCommande({
          approuve: approuveData,
          envoye: envoyeData,
          annule: annuleData,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des bons historiques', error);
      }
    };
    fetchAllBons();
  }, []);

  const handleRowClick = (bon) => {
    navigate(`/stock/bons-historique/${bon.idBonCommande}`, { state: { fromTab: activeTab } });
  };

  const getStatutBadge = (bon) => {
    if (bon.etat === 'approuvé') return <span className="badge bg-success">Approuvé</span>;
    if (bon.etat === 'envoyé') return <span className="badge bg-dark">Envoyé</span>;
    if (bon.etat === 'annulé') return <span className="badge bg-warning">Annulé</span>;
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
    if (tab === 'annule') {
      return (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date de création</th>
              <th>Fournisseur</th>
              <th>Créé par</th>
              <th>Cause d’annulation</th>
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
                <td>{bon.motifAnnulation || '-'}</td>
                <td>{getStatutBadge(bon)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    // Onglet "Approuvé"
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
          <h1 className="m-0">Historique des Bons de Commande (Lecture seule)</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'envoye' ? 'active' : ''}`} onClick={() => setActiveTab('envoye')}>
                      Envoyé
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'annule' ? 'active' : ''}`} onClick={() => setActiveTab('annule')}>
                      Annulé
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'approuve' ? 'active' : ''}`} onClick={() => setActiveTab('approuve')}>
                      Approuvé
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === 'envoye' && renderTable(bonsCommande.envoye, 'envoye')}
                {activeTab === 'annule' && renderTable(bonsCommande.annule, 'annule')}
                {activeTab === 'approuve' && renderTable(bonsCommande.approuve, 'approuve')}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BonsHistorique;