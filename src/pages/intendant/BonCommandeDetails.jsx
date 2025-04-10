import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const BonCommandeDetails = ({ readOnly = false }) => {
  const { idBonCommande } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Pour récupérer l'état passé dans navigate
  const [bonCommande, setBonCommande] = useState(null);
  const [commentaireRejet, setCommentaireRejet] = useState('');

  useEffect(() => {
    const fetchBonCommande = async () => {
      try {
        let selectedBon;
        if (readOnly) {
          const historiqueData = await authService.getBonsDeCommandeByEtats(['approuvé', 'envoyé', 'annulé']);
          selectedBon = historiqueData.find(bon => bon.idBonCommande === parseInt(idBonCommande));
        } else {
          const nonEnvoyesData = await authService.getBonsDeCommande();
          selectedBon = nonEnvoyesData.find(bon => bon.idBonCommande === parseInt(idBonCommande));
          if (!selectedBon) {
            const envoyesData = await authService.getBonsDeCommandeByEtat('envoyé');
            selectedBon = envoyesData.find(bon => bon.idBonCommande === parseInt(idBonCommande));
          }
        }
        if (selectedBon) {
          setBonCommande(selectedBon);
        } else {
          Swal.fire('Erreur', 'Bon de commande introuvable', 'error');
          navigate(readOnly ? '/stock/bons-historique' : '/intendant/bons-commande');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du bon de commande', error);
        Swal.fire('Erreur', 'Erreur lors du chargement', 'error');
        navigate(readOnly ? '/stock/bons-historique' : '/intendant/bons-commande');
      }
    };
    fetchBonCommande();
  }, [idBonCommande, navigate, readOnly]);

  const handleApprouver = async (approuve) => {
    if (!approuve && !commentaireRejet.trim()) {
      Swal.fire('Erreur', 'Veuillez fournir un commentaire de rejet', 'error');
      return;
    }
    try {
      const approbationData = { 
        approuve, 
        commentaireRejet: approuve ? bonCommande.commentaireRejet : commentaireRejet 
      };
      await authService.approuverBonCommande(idBonCommande, approbationData);
      setBonCommande({
        ...bonCommande,
        etat: approuve ? 'approuvé' : 'brouillon',
        commentaireRejet: approuve ? bonCommande.commentaireRejet : commentaireRejet,
        dateRejet: approuve ? null : new Date(),
      });
      Swal.fire('Succès', approuve ? 'Bon approuvé' : 'Bon rejeté', 'success');
      navigate('/intendant/bons-commande', { state: { activeTab: 'brouillon' } });
    } catch (error) {
      console.error('Erreur lors de l’approbation', error);
      Swal.fire('Erreur', error.response?.data?.message || 'Erreur lors de l’approbation', 'error');
    }
  };

  const handleEnvoyer = async () => {
    try {
      await authService.envoyerBonCommande(idBonCommande);
      setBonCommande({ ...bonCommande, etat: 'envoyé' });
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Bon envoyé au fournisseur. Un email a été envoyé à ' + bonCommande.fournisseur.nom,
      });
      navigate('/intendant/bons-commande', { state: { activeTab: 'envoye' } });
    } catch (error) {
      console.error('Erreur lors de l’envoi', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de l’envoi du bon de commande',
      });
    }
  };

  const handleAnnuler = async () => {
    if (!commentaireRejet.trim()) {
      Swal.fire('Erreur', 'Veuillez fournir un motif d’annulation', 'error');
      return;
    }
    try {
      await authService.annulerBonCommande(idBonCommande, { motifAnnulation: commentaireRejet });
      setBonCommande({ ...bonCommande, etat: 'annulé', motifAnnulation: commentaireRejet });
      Swal.fire('Succès', 'Bon annulé', 'success');
      navigate('/intendant/bons-annules');
    } catch (error) {
      console.error('Erreur lors de l’annulation', error);
      Swal.fire('Erreur', 'Erreur lors de l’annulation', 'error');
    }
  };

  if (!bonCommande) {
    return <div>Chargement...</div>;
  }

  const isEnvoye = bonCommande.etat === 'envoyé';
  const isAnnule = bonCommande.etat === 'annulé';
  const fromTab = location.state?.fromTab || (readOnly ? 'envoye' : 'brouillon'); // Différents défauts selon le contexte

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">
            Détails du Bon de Commande #{bonCommande.idBonCommande} {readOnly || isEnvoye ? '(Lecture seule)' : ''}
          </h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <p><strong>Date de création :</strong> {new Date(bonCommande.date).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Fournisseur :</strong> {bonCommande.fournisseur.nom} ({bonCommande.fournisseur.email})</p>
                <p><strong>Créé par :</strong> {bonCommande.createdBy ? `${bonCommande.createdBy.nom} ${bonCommande.createdBy.prenom}` : 'Inconnu'}</p>
                {bonCommande.modifiedBy && (
                  <p><strong>Modifié par :</strong> {bonCommande.modifiedBy ? `${bonCommande.modifiedBy.nom} ${bonCommande.modifiedBy.prenom}` : '-'}</p>
                )}
                {bonCommande.dateModification && (
                  <p><strong>Date de modification :</strong> {new Date(bonCommande.dateModification).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                )}
                <p><strong>Statut :</strong> {getStatutBadge(bonCommande)}</p>
                {bonCommande.commentaireRejet && (
                  <p><strong>Cause de rejet :</strong> {bonCommande.commentaireRejet}</p>
                )}
                {bonCommande.motifAnnulation && (
                  <p><strong>Cause d’annulation :</strong> {bonCommande.motifAnnulation}</p>
                )}
                <p><strong>Lignes de commande :</strong></p>
                <table className="table table-bordered">
                  <thead>
                    <tr><th>Produit</th><th>Quantité</th></tr>
                  </thead>
                  <tbody>
                    {bonCommande.lignesCommande.map((ligne, index) => (
                      <tr key={index}>
                        <td>{ligne.produit.nom}</td>
                        <td>{ligne.quantite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!readOnly && bonCommande.etat === 'brouillon' && (
                  <div className="mt-3">
                    <button className="btn btn-success mr-2" onClick={() => handleApprouver(true)}>
                      Approuver
                    </button>
                    <div className="form-group mt-2">
                      <label>Cause de rejet (obligatoire) :</label>
                      <textarea
                        className="form-control"
                        value={commentaireRejet}
                        onChange={(e) => setCommentaireRejet(e.target.value)}
                        rows="3"
                        placeholder="Entrez une cause pour rejeter le bon..."
                      />
                    </div>
                    <button className="btn btn-danger mr-2" onClick={() => handleApprouver(false)}>
                      Rejeter
                    </button>
                  </div>
                )}
                {!readOnly && bonCommande.etat === 'approuvé' && (
                  <div className="mt-3">
                    <button className="btn btn-primary mr-2" onClick={handleEnvoyer}>
                      Envoyer au fournisseur
                    </button>
                    <div className="form-group mt-2">
                      <label>Cause d’annulation :</label>
                      <textarea
                        className="form-control"
                        value={commentaireRejet}
                        onChange={(e) => setCommentaireRejet(e.target.value)}
                        rows="3"
                        placeholder="Entrez une cause pour annuler..."
                      />
                    </div>
                    <button className="btn btn-warning mr-2" onClick={handleAnnuler}>
                      Annuler
                    </button>
                  </div>
                )}
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => {
                    if (readOnly) {
                      navigate('/stock/bons-historique', { state: { activeTab: fromTab } });
                    } else if (isAnnule) {
                      navigate('/intendant/bons-annules');
                    } else {
                      navigate('/intendant/bons-commande', { state: { activeTab: fromTab } });
                    }
                  }}
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const getStatutBadge = (bon) => {
  if (bon.etat === 'brouillon') {
    if (bon.dateRejet && bon.dateModification && new Date(bon.dateModification) > new Date(bon.dateRejet))
      return <span className="badge bg-info">Corrigé</span>;
    if (bon.dateRejet) return <span className="badge bg-danger">Rejeté</span>;
    if (bon.dateModification && new Date(bon.dateModification) > new Date(bon.date))
      return <span className="badge bg-warning text-dark">Modifié</span>;
    return <span className="badge bg-primary">Nouveau</span>;
  }
  if (bon.etat === 'approuvé') return <span className="badge bg-success">Approuvé</span>;
  if (bon.etat === 'envoyé') return <span className="badge bg-dark">Envoyé</span>;
  if (bon.etat === 'annulé') return <span className="badge bg-warning">Annulé</span>;
  if (bon.etat === 'livré') return <span className="badge bg-secondary">Livré</span>;
  return null;
};

export default BonCommandeDetails;