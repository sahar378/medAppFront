// src/pages/intendant/FournisseurDetailsReadOnly.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const FournisseurDetailsReadOnly = ({ fournisseurId, onBack }) => {
  const navigate = useNavigate();
  const [fournisseur, setFournisseur] = useState(null);

  useEffect(() => {
    const fetchFournisseur = async () => {
      if (!fournisseurId) return;
      try {
        const data = await authService.getFournisseurById(fournisseurId);
        setFournisseur(data);
      } catch (error) {
        Swal.fire('Erreur', 'Fournisseur introuvable', 'error');
        setFournisseur(null);
      }
    };
    fetchFournisseur();
  }, [fournisseurId]);

  if (!fournisseurId) return <div>Sélectionnez un fournisseur pour voir ses détails.</div>;
  if (!fournisseur) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Détails du Fournisseur #{fournisseur.idFournisseur}</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <p><strong>Nom :</strong> {fournisseur.nom}</p>
                <p><strong>Email :</strong> {fournisseur.email}</p>
                <p><strong>Adresse :</strong> {fournisseur.adresse}</p>
                <p><strong>Téléphone :</strong> {fournisseur.telephone}</p>
                <p><strong>Fax :</strong> {fournisseur.fax || '-'}</p>
                <p><strong>Matricule Fiscale :</strong> {fournisseur.matriculeFiscale || '-'}</p>
                <p><strong>RIB :</strong> {fournisseur.rib || '-'}</p>
                <p><strong>RC :</strong> {fournisseur.rc || '-'}</p>
                <p><strong>Code TVA :</strong> {fournisseur.codeTva || '-'}</p>
                <p><strong>Statut :</strong>
                  {fournisseur.statut === 0 ? 'Actif' :
                    fournisseur.statut === 1 ? 'Inactif' :
                      `Supprimé (Cause: ${fournisseur.causeSuppression || '-'})`}
                </p>
                <p><strong>Produits associés :</strong></p>
                {fournisseur.produits && fournisseur.produits.length > 0 ? (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Nom du produit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fournisseur.produits.map(p => (
                        <tr key={p.idProduit}>
                          <td>{p.nom}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucun produit associé</p>
                )}
                <button
                  className="btn btn-secondary mt-2"
                  onClick={onBack || (() => navigate('/intendant/fournisseurs'))}
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

export default FournisseurDetailsReadOnly;