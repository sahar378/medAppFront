import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const BonsHistorique = () => {
  const [bonsHistorique, setBonsHistorique] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBonsHistorique = async () => {
      try {
        const data = await authService.getBonsDeCommandeByEtats(['approuvé', 'envoyé', 'annulé']);
        console.log('Données brutes des bons :', data.map(bon => ({ id: bon.idBonCommande, etat: bon.etat, date: bon.date })));
        setBonsHistorique(data);
      } catch (error) {
        console.error('Erreur lors du chargement des bons historiques', error);
      }
    };
    fetchBonsHistorique();
  }, []);

  const handleRowClick = (bon) => {
    navigate(`/stock/bons-historique/${bon.idBonCommande}`);
  };

  const getEtatBadge = (etat) => {
    switch (etat) {
      case 'approuvé':
        return <span className="badge bg-success">Approuvé</span>;
      case 'envoyé':
        return <span className="badge bg-dark">Envoyé</span>;
      case 'annulé':
        return <span className="badge bg-warning">Annulé</span>;
      default:
        return <span className="badge bg-secondary">{etat}</span>;
    }
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
              <div className="card-body">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date de création</th>
                      <th>Fournisseur</th>
                      <th>Créé par</th>
                      <th>Modifié par</th>
                      <th>Date de modification</th>
                      <th>État</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonsHistorique.map(bon => (
                      <tr
                        key={bon.idBonCommande}
                        onClick={() => handleRowClick(bon)}
                        style={{ cursor: 'pointer' }}
                      >
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
                        <td>{getEtatBadge(bon.etat)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BonsHistorique;