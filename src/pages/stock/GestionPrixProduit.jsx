// src/pages/stock/GestionPrixProduit.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const GestionPrixProduit = () => {
  const { produitId } = useParams();
  const navigate = useNavigate();
  const [prixList, setPrixList] = useState([]);
  const [produitNom, setProduitNom] = useState('');
  const [sortBy, setSortBy] = useState('prixUnitaire');
  const [sortOrder, setSortOrder] = useState('asc');
  const [updatePrix, setUpdatePrix] = useState({ idProduit: null, idFournisseur: null, prixUnitaire: '', tauxTva: '0' });
  const [addPrix, setAddPrix] = useState({ idProduit: produitId, idFournisseur: '', prixUnitaire: '', tauxTva: '0', date: '' });
  const [fournisseursAssocies, setFournisseursAssocies] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchPrix = useCallback(async () => {
    try {
      const prixResponse = await authService.getPrixByProduit(produitId, sortBy, sortOrder);
      setPrixList(prixResponse);
      const produitResponse = await authService.getProduitById(produitId);
      setProduitNom(produitResponse.nom);
      const fournisseursResponse = await authService.getFournisseursByProduit(produitId);
      setFournisseursAssocies(fournisseursResponse.filter(f => f.statut !== 2));
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de charger les données', 'error');
    }
  }, [produitId, sortBy, sortOrder]);

  useEffect(() => {
    fetchPrix();
  }, [fetchPrix]);

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleUpdateClick = (item) => {
    setUpdatePrix({
      idPrix: item.idPrix,
      idProduit: item.idProduit,
      idFournisseur: item.idFournisseur,
      prixUnitaire: item.prixUnitaire,
      tauxTva: item.tauxTva !== null ? item.tauxTva : '0',
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await authService.updatePrix(updatePrix.idPrix, {
        produit: { idProduit: updatePrix.idProduit },
        fournisseur: { idFournisseur: updatePrix.idFournisseur },
        prixUnitaire: parseFloat(updatePrix.prixUnitaire),
        tauxTva: updatePrix.tauxTva === '' || updatePrix.tauxTva === null ? 0 : parseFloat(updatePrix.tauxTva),
        statut: 1,
      });
      setShowUpdateModal(false);
      fetchPrix();
      Swal.fire('Succès', 'Prix mis à jour', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
    }
  };

  const handleAddClick = () => {
    setAddPrix({ idProduit: produitId, idFournisseur: '', prixUnitaire: '', tauxTva: '0', date: '' });
    setShowAddModal(true);
  };

  const handleAddSubmit = async () => {
    if (!addPrix.idFournisseur || !addPrix.prixUnitaire || !addPrix.date) {
      Swal.fire('Erreur', 'Veuillez remplir les champs obligatoires (fournisseur, prix, date)', 'error');
      return;
    }
    try {
      await authService.createPrix({
        produit: { idProduit: addPrix.idProduit },
        fournisseur: { idFournisseur: parseInt(addPrix.idFournisseur) },
        prixUnitaire: parseFloat(addPrix.prixUnitaire),
        tauxTva: addPrix.tauxTva === '' || addPrix.tauxTva === null ? 0 : parseFloat(addPrix.tauxTva),
        date: new Date(addPrix.date),
        statut: 1,
      });
      setShowAddModal(false);
      fetchPrix();
      Swal.fire('Succès', 'Prix ajouté', 'success');
    } catch (error) {
      if (error.response?.data?.message === "Un prix actif existe déjà pour ce produit et ce fournisseur.") {
        Swal.fire('Erreur', 'Ce prix pour ce fournisseur existe déjà.', 'error');
      } else {
        Swal.fire('Erreur', 'Erreur lors de l’ajout du prix', 'error');
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isAddPrixDisabled = prixList.length >= fournisseursAssocies.length;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Gestion des Prix pour {produitNom}</h1>
          <button className="btn btn-secondary mt-2" onClick={handleBack}>
            Retour
          </button>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Fournisseur</th>
                      <th onClick={() => handleSort('prixUnitaire')} style={{ cursor: 'pointer' }}>
                        Prix Unitaire (TND) {sortBy === 'prixUnitaire' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>TVA (%)</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prixList.map((item) => (
                      <tr key={`${item.idProduit}-${item.idFournisseur}`}>
                        <td>{item.nomFournisseur}</td>
                        <td>
                          {item.prixUnitaire.toLocaleString('fr-TN', {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                          })}
                        </td>
                        <td>
                          {item.tauxTva !== null && item.tauxTva !== 0
                            ? item.tauxTva.toLocaleString('fr-TN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                            : '0'}
                        </td>
                        <td>{new Date(item.date).toLocaleDateString('fr-TN')}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleUpdateClick(item)}
                          >
                            Mettre à jour
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!isAddPrixDisabled && (
                  <button className="btn btn-success mt-3" onClick={handleAddClick}>
                    Ajouter un prix
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {showUpdateModal && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Mettre à jour le prix</h5>
                  <button type="button" className="close" onClick={() => setShowUpdateModal(false)}>
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Prix Unitaire (TND) :</label>
                    <input
                      type="number"
                      className="form-control"
                      value={updatePrix.prixUnitaire}
                      onChange={(e) => setUpdatePrix({ ...updatePrix, prixUnitaire: e.target.value })}
                      step="0.001"
                    />
                  </div>
                  <div className="form-group">
                    <label>TVA (%) :</label>
                    <input
                      type="number"
                      className="form-control"
                      value={updatePrix.tauxTva}
                      onChange={(e) => setUpdatePrix({ ...updatePrix, tauxTva: e.target.value })}
                      step="1"
                      placeholder="0 si pas de TVA"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handleUpdateSubmit}>
                    Enregistrer
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Ajouter un prix</h5>
                  <button type="button" className="close" onClick={() => setShowAddModal(false)}>
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Fournisseur :</label>
                    <select
                      className="form-control"
                      value={addPrix.idFournisseur}
                      onChange={(e) => setAddPrix({ ...addPrix, idFournisseur: e.target.value })}
                    >
                      <option value="">Sélectionner un fournisseur</option>
                      {fournisseursAssocies
                        .filter(f => !prixList.some(p => p.idFournisseur === f.idFournisseur))
                        .map(f => (
                          <option key={f.idFournisseur} value={f.idFournisseur}>
                            {f.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Prix Unitaire (TND) :</label>
                    <input
                      type="number"
                      className="form-control"
                      value={addPrix.prixUnitaire}
                      onChange={(e) => setAddPrix({ ...addPrix, prixUnitaire: e.target.value })}
                      step="0.001"
                    />
                  </div>
                  <div className="form-group">
                    <label>TVA (%) :</label>
                    <input
                      type="number"
                      className="form-control"
                      value={addPrix.tauxTva}
                      onChange={(e) => setAddPrix({ ...addPrix, tauxTva: e.target.value })}
                      step="1"
                      placeholder="0 si pas de TVA"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date :</label>
                    <input
                      type="date"
                      className="form-control"
                      value={addPrix.date}
                      onChange={(e) => setAddPrix({ ...addPrix, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handleAddSubmit}>
                    Enregistrer
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionPrixProduit;