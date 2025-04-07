// src/pages/stock/CreerBonCommande.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import Select from 'react-select';

const CreerBonCommande = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [produits, setProduits] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [commandeItems, setCommandeItems] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [selectedFournisseurId, setSelectedFournisseurId] = useState('');
  const [bonCommandeId, setBonCommandeId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produitsData = await authService.getProduitsByUser();
        setProduits(produitsData);

        if (state?.bonCommande) {
          const bon = state.bonCommande;
          setBonCommandeId(bon.idBonCommande);
          const bonAvecCalculs = await authService.getBonCommandeAvecCalculs(bon.idBonCommande);
          setCommandeItems(bonAvecCalculs.lignesAvecCalculs.map(item => ({
            idProduit: item.idProduit,
            nomProduit: item.nomProduit,
            idFournisseur: item.idFournisseur,
            nomFournisseur: item.nomFournisseur,
            quantite: item.quantite,
            prixUnitaire: item.prixUnitaire,
            tauxTva: item.tauxTva,
            sousTotal: item.sousTotal,
            montantTva: item.montantTva,
            total: item.total,
          })));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      }
    };
    fetchData();
  }, [state]);

  const interpreterPrixUnitaire = (prixUnitaire) => {
    if (prixUnitaire >= 1 && prixUnitaire === Math.floor(prixUnitaire)) {
      return prixUnitaire;
    }
    return prixUnitaire;
  };

  const calculerMontants = (prixUnitaire, quantite, tauxTva) => {
    const prixInterprete = interpreterPrixUnitaire(prixUnitaire);
    const sousTotal = prixInterprete * quantite;
    const montantTva = (sousTotal * tauxTva) / 100;
    const total = sousTotal + montantTva;
    return { sousTotal, montantTva, total };
  };

  const calculerTotalAPayer = () => {
    return commandeItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleProduitChange = async (selectedOption) => {
    setSelectedProduit(selectedOption);
    if (!selectedOption) {
      setFournisseurs([]);
      setSelectedFournisseurId('');
      return;
    }

    const produitId = selectedOption.value;
    try {
      const fournisseursData = await authService.getFournisseursWithPrixByProduit(produitId);
      setFournisseurs(fournisseursData);
      setSelectedFournisseurId('');
    } catch (error) {
      setFournisseurs([]);
      setSelectedFournisseurId('');
      Swal.fire('Erreur', 'Impossible de récupérer les fournisseurs avec prix pour ce produit.', 'error');
    }
  };

  const handleFournisseurChange = async (fournisseurId) => {
    if (!fournisseurId || !selectedProduit) return;
    setSelectedFournisseurId(fournisseurId);
    const produit = produits.find(p => p.idProduit === selectedProduit.value);
    const fournisseur = fournisseurs.find(f => f.idFournisseur === parseInt(fournisseurId));

    if (fournisseur.statut !== 0) {
      Swal.fire(
        'Erreur',
        `Le fournisseur "${fournisseur.nom}" est inactif et ne peut pas être ajouté au bon de commande.`,
        'error'
      );
      setSelectedFournisseurId('');
      return;
    }

    try {
      const prixData = await authService.getPrixActif(produit.idProduit, fournisseur.idFournisseur); // Si le backend ne renvoie pas les prix
      if (produit && fournisseur && prixData) {
        const exists = commandeItems.some(
          item => item.idProduit === produit.idProduit && item.idFournisseur === fournisseur.idFournisseur
        );
        if (exists) {
          Swal.fire('Erreur', `${produit.nom} est déjà associé à ${fournisseur.nom}.`, 'error');
          return;
        }

        const { sousTotal, montantTva, total } = calculerMontants(prixData.prixUnitaire, 0, prixData.tauxTva);

        setCommandeItems([
          ...commandeItems,
          {
            idProduit: produit.idProduit,
            nomProduit: produit.nom,
            idFournisseur: fournisseur.idFournisseur,
            nomFournisseur: fournisseur.nom,
            quantite: 0,
            prixUnitaire: prixData.prixUnitaire,
            tauxTva: prixData.tauxTva,
            sousTotal,
            montantTva,
            total,
          },
        ]);
        setSelectedProduit(null);
        setSelectedFournisseurId('');
      }
    } catch (error) {
      Swal.fire('Erreur', 'Prix actif non trouvé pour ce produit et fournisseur.', 'error');
      setSelectedFournisseurId('');
    }
  };

  const handleQuantiteChange = (index, quantite) => {
    if (!/^\d*$/.test(quantite)) return;

    const parsedQuantite = quantite === '' ? 0 : parseInt(quantite, 10) || 0;
    const updatedItems = [...commandeItems];
    updatedItems[index].quantite = quantite;

    const { sousTotal, montantTva, total } = calculerMontants(
      updatedItems[index].prixUnitaire,
      parsedQuantite,
      updatedItems[index].tauxTva
    );
    updatedItems[index].sousTotal = sousTotal;
    updatedItems[index].montantTva = montantTva;
    updatedItems[index].total = total;

    setCommandeItems(updatedItems);
  };

  const handleQuantiteClick = (index) => {
    const updatedItems = [...commandeItems];
    if (updatedItems[index].quantite === 0) {
      updatedItems[index].quantite = '';
    }
    setCommandeItems(updatedItems);
  };

  const handleRemoveFromCommande = (index) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce produit du bon de commande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, garder'
    }).then((result) => {
      if (result.isConfirmed) {
        setCommandeItems(commandeItems.filter((_, i) => i !== index));
        Swal.fire('Supprimé', 'Le produit a été retiré du bon de commande', 'success');
      }
    });
  };

  const handleSubmitCommande = async () => {
    if (commandeItems.length === 0) {
      Swal.fire('Erreur', 'Veuillez ajouter au moins un produit', 'error');
      return;
    }
    if (commandeItems.some(item => !item.idFournisseur)) {
      Swal.fire('Erreur', 'Veuillez sélectionner un fournisseur pour chaque produit', 'error');
      return;
    }
    if (commandeItems.some(item => item.quantite === '' || parseInt(item.quantite, 10) === 0)) {
      Swal.fire('Erreur', 'Les quantités ne peuvent pas être 0', 'error');
      return;
    }

    try {
      const groupedByFournisseur = commandeItems.reduce((acc, item) => {
        if (!acc[item.idFournisseur]) {
          acc[item.idFournisseur] = {
            idFournisseur: item.idFournisseur,
            lignesCommande: [],
          };
        }
        acc[item.idFournisseur].lignesCommande.push({
          idProduit: item.idProduit,
          quantite: parseInt(item.quantite, 10),
        });
        return acc;
      }, {});

      const bonsCommandeData = Object.values(groupedByFournisseur);

      let response;
      if (bonCommandeId) {
        response = await authService.modifierBonCommande(bonCommandeId, bonsCommandeData[0]);
        Swal.fire('Succès', 'Bon de commande modifié avec succès', 'success');
        setCommandeItems(response.lignesAvecCalculs);
      } else {
        response = await authService.creerBonsCommandeParFournisseur(bonsCommandeData);
        Swal.fire('Succès', `Bons de commande créés avec succès (${response.length} bons)`, 'success');
      }

      navigate('/stock/bons-commande');
    } catch (error) {
      console.error('Erreur lors de la création/modification des bons de commande', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la soumission du bon de commande';
      Swal.fire('Erreur', errorMessage, 'error');
    }
  };

  const produitOptions = produits.map(p => ({
    value: p.idProduit,
    label: p.nom,
  }));

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">
              {bonCommandeId ? 'Modifier' : 'Créer'} un bon de commande
            </h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <label>Sélectionner un produit :</label>
                  <Select
                    options={produitOptions}
                    value={selectedProduit}
                    onChange={handleProduitChange}
                    placeholder="Tapez ou sélectionnez un produit..."
                    isClearable
                    noOptionsMessage={() => "Aucun produit trouvé"}
                  />
                </div>
                {selectedProduit && (
                  <div className="form-group">
                    <label>Fournisseur :</label>
                    <select
                      className="form-control"
                      value={selectedFournisseurId}
                      onChange={(e) => handleFournisseurChange(e.target.value)}
                    >
                      <option value="">Sélectionner un fournisseur</option>
                      {fournisseurs.map(f => (
                        <option
                          key={f.idFournisseur}
                          value={f.idFournisseur}
                          style={f.statut !== 0 ? { color: 'red' } : {}}
                          disabled={f.statut !== 0}
                        >
                          {f.nom} {f.statut !== 0 ? '(Inactif)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {commandeItems.length > 0 && (
                  <div className="mt-3">
                    <h5>Produits dans le bon de commande :</h5>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Fournisseur</th>
                          <th>Prix Unitaire</th>
                          <th>Quantité</th>
                          <th>Sous-total</th>
                          <th>TVA (%)</th>
                          <th>Montant TVA</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commandeItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.nomProduit}</td>
                            <td>{item.nomFournisseur}</td>
                            <td>{item.prixUnitaire.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.quantite}
                                onChange={(e) => handleQuantiteChange(index, e.target.value)}
                                onClick={() => handleQuantiteClick(index)}
                                placeholder="Entrez un nombre"
                              />
                            </td>
                            <td>{item.sousTotal.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                            <td>{item.tauxTva.toLocaleString('fr-TN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                            <td>{item.montantTva.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                            <td>{item.total.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveFromCommande(index)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-3 text-right">
                      <h5>
                        Total à payer :{' '}
                        <span className="font-weight-bold">
                          {calculerTotalAPayer().toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} TND
                        </span>
                      </h5>
                    </div>
                  </div>
                )}
                <div className="mt-3">
                  <button className="btn btn-primary mr-2" onClick={handleSubmitCommande}>
                    {bonCommandeId ? 'Modifier' : 'Valider'} la commande
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/stock/bons-commande')}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreerBonCommande;