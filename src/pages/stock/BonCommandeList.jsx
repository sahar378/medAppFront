// src/pages/stock/BonCommandeList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const BonCommandeList = () => {
  const navigate = useNavigate();
  const [bonsCommande, setBonsCommande] = useState([]);

  useEffect(() => {
    const fetchBonsCommande = async () => {
      try {
        const data = await authService.getBonsDeCommande();
        const brouillonBons = data.filter(bon => bon.etat === 'brouillon');
        // Log temporaire pour inspecter les données brutes
        console.log('Données brutes des bons de commande :', brouillonBons.map(bon => ({ id: bon.idBonCommande, date: bon.date })));
        setBonsCommande(brouillonBons);

        const rejectedNotModifiedBons = brouillonBons.filter(bon =>
          bon.commentaireRejet &&
          bon.dateRejet &&
          (!bon.dateModification || new Date(bon.dateModification) <= new Date(bon.dateRejet))
        );
        if (rejectedNotModifiedBons.length > 0) {
          Swal.fire({
            title: 'Attention',
            text: `${rejectedNotModifiedBons.length} bon(s) de commande ont été rejeté(s) par l’intendant et nécessitent une modification.`,
            icon: 'warning',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des bons de commande', error);
      }
    };
    fetchBonsCommande();
  }, []);

  const handleEdit = (bon) => {
    const type = bon.lignesCommande[0].produit.categorie.idCategorie === 1 ? 'materiel' : 'medicament';
    navigate(`/stock/commande/${type}`, { state: { bonCommande: bon } });
  };

  const getStatutBadge = (bon) => {
    if (bon.commentaireRejet && bon.dateRejet) {
      const isNotModified = !bon.dateModification || new Date(bon.dateModification) <= new Date(bon.dateRejet);
      return (
        <span className={`badge ${isNotModified ? 'bg-danger' : 'bg-success'}`}>
          {isNotModified ? 'Rejeté' : 'Corrigé'}
        </span>
      );
    }
    return <span className="badge bg-info">Nouveau</span>;
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Liste des Bons de Commande</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date de création</th>
                      <th>Fournisseur</th>
                      <th>Créé par</th>
                      <th>Modifié par</th>
                      <th>Commentaire/Motif</th>
                      <th>Date de modification</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonsCommande.map(bon => (
                      <tr key={bon.idBonCommande} onClick={() => handleEdit(bon)} style={{ cursor: 'pointer' }}>
                        <td>{bon.idBonCommande}</td>
                        <td>{new Date(bon.date).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{bon.fournisseur.nom}</td>
                        <td>{bon.createdBy ? `${bon.createdBy.nom} ${bon.createdBy.prenom}` : 'Inconnu'}</td>
                        <td>{bon.modifiedBy ? `${bon.modifiedBy.nom} ${bon.modifiedBy.prenom}` : '-'}</td>
                        <td>{bon.commentaireRejet || bon.motifAnnulation || '-'}</td>
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BonCommandeList;