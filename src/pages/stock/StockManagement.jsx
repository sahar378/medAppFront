// src/pages/stock/StockManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const StockManagement = () => {
  const { userId, userRole } = useAuth();
  const [produits, setProduits] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    qteDisponible: '',
    seuilAlerte: '',
    dateExpiration: '',
    categorie: { idCategorie: 1 } // Par défaut matériel (idCategorie à ajuster selon ta DB)
  });
  const [nombreMalades, setNombreMalades] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produitsData = await authService.getProduitsByUser(userId);
        const alertesData = await authService.verifierAlertes(userId);
        setProduits(produitsData);
        setAlertes(alertesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      }
    };
    if (userRole === 'RESPONSABLE_STOCK') fetchData();
  }, [userId, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduit = async (e) => {
    e.preventDefault();
    try {
      const newProduit = await authService.saveProduit(formData, userId);
      setProduits([...produits, newProduit]);
      setFormData({
        nom: '',
        description: '',
        qteDisponible: '',
        seuilAlerte: '',
        dateExpiration: '',
        categorie: { idCategorie: 1 }
      });
      Swal.fire('Succès', 'Produit ajouté', 'success');
    } catch (error) {
      console.error('Erreur lors de l’ajout', error);
    }
  };

  const handleDefinirSeuil = async (produitId) => {
    if (!nombreMalades) {
      Swal.fire('Erreur', 'Veuillez entrer le nombre de malades', 'error');
      return;
    }
    try {
      await authService.definirSeuilAlerte(produitId, parseInt(nombreMalades));
      const updatedProduits = await authService.getProduitsByUser(userId);
      setProduits(updatedProduits);
      Swal.fire('Succès', 'Seuil d’alerte mis à jour', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du seuil', error);
    }
  };

  const handleDeleteProduit = async (produitId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce produit ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authService.deleteProduit(produitId, userId);
          setProduits(produits.filter(p => p.idProduit !== produitId));
          Swal.fire('Succès', 'Produit supprimé', 'success');
        } catch (error) {
          console.error('Erreur lors de la suppression', error);
        }
      }
    });
  };

  if (userRole !== 'RESPONSABLE_STOCK') {
    return <div>Accès refusé. Cette page est réservée aux responsables de stock.</div>;
  }

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Gestion de Stock</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            {/* Alertes */}
            {alertes.length > 0 && (
              <div className="card bg-warning mb-3">
                <div className="card-body">
                  <h5>Alertes de Stock</h5>
                  <ul>
                    {alertes.map(p => (
                      <li key={p.idProduit}>{p.nom} - Quantité: {p.qteDisponible} (Seuil: {p.seuilAlerte})</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Formulaire d’ajout */}
            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">Ajouter un produit</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddProduit}>
                  <div className="form-group">
                    <label>Nom :</label>
                    <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Description :</label>
                    <input type="text" className="form-control" name="description" value={formData.description} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Quantité disponible :</label>
                    <input type="number" className="form-control" name="qteDisponible" value={formData.qteDisponible} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Catégorie :</label>
                    <select className="form-control" name="categorie.idCategorie" value={formData.categorie.idCategorie} onChange={e => setFormData({ ...formData, categorie: { idCategorie: parseInt(e.target.value) } })}>
                      <option value={1}>Matériel</option>
                      <option value={2}>Médicament</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date d’expiration (médicaments uniquement) :</label>
                    <input type="date" className="form-control" name="dateExpiration" value={formData.dateExpiration} onChange={handleInputChange} />
                  </div>
                  <button type="submit" className="btn btn-primary">Ajouter</button>
                </form>
              </div>
            </div>

            {/* Liste des produits */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Liste des produits</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label>Nombre de malades (pour seuil matériel) :</label>
                  <input type="number" className="form-control" value={nombreMalades} onChange={e => setNombreMalades(e.target.value)} />
                </div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Description</th>
                      <th>Quantité</th>
                      <th>Seuil</th>
                      <th>Catégorie</th>
                      <th>Date d’expiration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map(produit => (
                      <tr key={produit.idProduit}>
                        <td>{produit.nom}</td>
                        <td>{produit.description}</td>
                        <td>{produit.qteDisponible}</td>
                        <td>{produit.seuilAlerte}</td>
                        <td>{produit.categorie.libelleCategorie}</td>
                        <td>{produit.dateExpiration ? new Date(produit.dateExpiration).toLocaleDateString() : '-'}</td>
                        <td>
                          <button className="btn btn-info btn-sm mr-2" onClick={() => handleDefinirSeuil(produit.idProduit)}>
                            Définir seuil
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduit(produit.idProduit)}>
                            Supprimer
                          </button>
                        </td>
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

export default StockManagement;