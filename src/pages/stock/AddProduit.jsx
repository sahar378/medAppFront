import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AddProduit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    qteDisponible: '',
    seuilAlerte: '',
    dateExpiration: '',
    categorie: { idCategorie: 1 }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorieChange = (e) => {
    const idCategorie = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      categorie: { idCategorie },
      dateExpiration: idCategorie === 1 ? '' : prev.dateExpiration
    }));
  };

  const handleAddProduit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.description || !formData.qteDisponible) {
      Swal.fire('Erreur', 'Tous les champs obligatoires doivent être remplis', 'error');
      return;
    }
    if (formData.categorie.idCategorie === 2 && !formData.dateExpiration) {
      Swal.fire('Erreur', 'La date d’expiration est obligatoire pour un médicament', 'error');
      return;
    }
    try {
      const newProduit = {
        ...formData,
        qteDisponible: parseInt(formData.qteDisponible) || 0, // Convertir en entier
        seuilAlerte: parseInt(formData.seuilAlerte) || 0,     // Convertir en entier, 0 par défaut
        categorie: { idCategorie: parseInt(formData.categorie.idCategorie) }
      };
      await authService.saveProduit(newProduit);
      Swal.fire('Succès', 'Produit ajouté avec succès', 'success');
      setFormData({
        nom: '',
        description: '',
        qteDisponible: '',
        seuilAlerte: '',
        dateExpiration: '',
        categorie: { idCategorie: 1 }
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire('Attention', error.response.data.message, 'warning');
      } else {
        console.error('Erreur lors de l’ajout', error);
        Swal.fire('Erreur', 'Erreur lors de l’ajout du produit', 'error');
      }
    }
  };

  const handleBack = () => {
    const destination = formData.categorie.idCategorie === 1 ? '/stock/materiels' : '/stock/medicaments';
    navigate(destination);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Ajouter un produit</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleAddProduit}>
                  <div className="form-group">
                    <label>Nom :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantité disponible :</label>
                    <input
                      type="number"
                      className="form-control"
                      name="qteDisponible"
                      value={formData.qteDisponible}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Seuil d’alerte :</label>
                    <input
                      type="number"
                      className="form-control"
                      name="seuilAlerte"
                      value={formData.seuilAlerte}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Catégorie :</label>
                    <select
                      className="form-control"
                      value={formData.categorie.idCategorie}
                      onChange={handleCategorieChange}
                    >
                      <option value={1}>Matériel</option>
                      <option value={2}>Médicament</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date d’expiration :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateExpiration"
                      value={formData.dateExpiration}
                      onChange={handleInputChange}
                      disabled={formData.categorie.idCategorie === 1}
                      required={formData.categorie.idCategorie === 2}
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary mr-2">Ajouter</button>
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      Retour
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddProduit;