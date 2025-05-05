import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const EditProduit = () => {
  const { produitId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idProduit: null,
    nom: '',
    description: '',
    qteDisponible: '',
    seuilAlerte: '',
    dateExpiration: '',
    categorie: { idCategorie: '' }
  });

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const produit = await authService.getProduitById(produitId);
        setFormData({
          idProduit: produit.idProduit,
          nom: produit.nom,
          description: produit.description || '',
          qteDisponible: produit.qteDisponible,
          seuilAlerte: produit.seuilAlerte,
          dateExpiration: produit.dateExpiration ? produit.dateExpiration.split('T')[0] : '',
          categorie: produit.categorie || { idCategorie: '' }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du produit', error);
        Swal.fire('Erreur', 'Produit non trouvé', 'error');
        navigate('/stock/materiels');
      }
    };
    fetchProduit();
  }, [produitId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'seuilAlerte') { // Empêcher la modification de seuilAlerte
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Confirmer la modification',
      text: 'Êtes-vous sûr de vouloir modifier ce produit ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedProduit = {
            ...formData,
            qteDisponible: parseInt(formData.qteDisponible) || 0,
            categorie: { idCategorie: parseInt(formData.categorie.idCategorie) }
          };
          await authService.updateProduit(produitId, updatedProduit);
          // Définir automatiquement les seuils pour la catégorie
          await authService.definirSeuilsCategorieAutomatique(formData.categorie.idCategorie);
          Swal.fire('Succès', 'Produit mis à jour avec succès', 'success');
          navigate(formData.categorie.idCategorie === 2 ? '/stock/medicaments' : '/stock/materiels');
        } catch (error) {
          console.error('Erreur lors de la mise à jour', error);
          if (error.response && error.response.status === 400) {
            Swal.fire('Erreur', 'Données invalides', 'error');
          } else {
            Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
          }
        }
      }
    });
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Modifier le produit</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSave}>
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
                      disabled // Champ en lecture seule
                    />
                  </div>
                  {formData.categorie.idCategorie === 2 && (
                    <div className="form-group">
                      <label>Date d’expiration :</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dateExpiration"
                        value={formData.dateExpiration}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Catégorie :</label>
                    <select
                      className="form-control"
                      value={formData.categorie.idCategorie || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categorie: { idCategorie: parseInt(e.target.value) }
                        })
                      }
                      disabled
                    >
                      <option value={1}>Matériel</option>
                      <option value={2}>Médicament</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Enregistrer</button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => navigate(formData.categorie.idCategorie === 2 ? '/stock/medicaments' : '/stock/materiels')}
                  >
                    Annuler
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProduit;