// src/pages/stock/AjouterLivraison.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AjouterLivraison = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [nextIdLivraison, setNextIdLivraison] = useState(null);
  const [formData, setFormData] = useState({
    idProduit: '',
    idFournisseur: '',
    quantiteLivree: '',
    date: '',
    observation: '',
    livreur: ''
  });
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produitsData = await authService.getProduitsByUser();
        setProduits(produitsData);
        const lastId = await authService.getLastLivraisonId();
        setNextIdLivraison(lastId + 1);
      } catch (error) {
        Swal.fire('Erreur', 'Impossible de charger les données', 'error');
        setNextIdLivraison(1);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);

    if (value.trim() === '') {
      setFilteredProduits([]);
      setFormData({ ...formData, idProduit: '', idFournisseur: '' });
      setFournisseurs([]);
    } else {
      const filtered = produits.filter(p =>
        p.nom.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProduits(filtered);
    }
  };

  const handleProduitSelect = async (produit) => {
    setFormData({ ...formData, idProduit: produit.idProduit, idFournisseur: '' });
    setSearchTerm(produit.nom);
    setShowSuggestions(false);
    try {
      const fournisseursData = await authService.getFournisseursByProduit(produit.idProduit);
      if (fournisseursData && fournisseursData.length > 0) {
        setFournisseurs(fournisseursData);
      } else {
        setFournisseurs([]);
        Swal.fire('Attention', 'Aucun fournisseur associé à ce produit.', 'warning');
      }
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de charger les fournisseurs', 'error');
      setFournisseurs([]);
    }
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setFilteredProduits([]);
    setFormData({ ...formData, idProduit: '', idFournisseur: '' });
    setFournisseurs([]);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantiteLivree') {
      if (/^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idProduit || !formData.idFournisseur) {
      Swal.fire('Erreur', 'Veuillez sélectionner un produit et un fournisseur.', 'error');
      return;
    }
    const quantiteLivreeNum = parseInt(formData.quantiteLivree, 10);
    if (!formData.quantiteLivree || isNaN(quantiteLivreeNum) || quantiteLivreeNum <= 0) {
      Swal.fire('Erreur', 'La quantité livrée doit être un nombre supérieur à 0.', 'error');
      return;
    }
    if (!formData.date) {
      Swal.fire('Erreur', 'Veuillez spécifier une date de livraison.', 'error');
      return;
    }
    if (!formData.livreur.trim()) {
      Swal.fire('Erreur', 'Veuillez spécifier un livreur.', 'error');
      return;
    }

    // Afficher la confirmation Swal avant d'envoyer les données
    Swal.fire({
      title: 'Confirmer l\'enregistrement ?',
      text: 'Voulez-vous vraiment enregistrer cette livraison ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, enregistrer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const livraison = {
          idProduit: parseInt(formData.idProduit, 10),
          idFournisseur: parseInt(formData.idFournisseur, 10),
          quantiteLivree: quantiteLivreeNum,
          date: formData.date,
          observation: formData.observation || '',
          livreur: formData.livreur
        };
        console.log('Données envoyées au backend :', livraison);

        try {
          const response = await authService.addLivraison(livraison);
          console.log('Réponse du backend :', response);
          Swal.fire('Succès', 'Livraison enregistrée avec succès', 'success');
          navigate('/liste-livraisons');
        } catch (error) {
          console.error('Erreur lors de l’enregistrement:', error.response?.data);
          Swal.fire('Erreur', error.response?.data?.message || 'Erreur lors de l’enregistrement', 'error');
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
          <h1 className="m-0">Ajouter une Livraison</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>ID de la Livraison (prochain ID prévu) :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nextIdLivraison !== null ? nextIdLivraison : 'Chargement...'}
                      readOnly
                    />
                  </div>
                  <div className="form-group position-relative">
                    <label>Produit :</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(true)}
                        ref={inputRef}
                        required
                      />
                      {searchTerm && (
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleResetSearch}
                            title="Réinitialiser"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    {showSuggestions && filteredProduits.length > 0 && (
                      <ul
                        className="list-group position-absolute w-100"
                        style={{
                          zIndex: 1000,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          marginTop: '5px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                      >
                        {filteredProduits.map(p => (
                          <li
                            key={p.idProduit}
                            className={`list-group-item ${formData.idProduit === p.idProduit ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleProduitSelect(p)}
                          >
                            {p.nom}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Fournisseur :</label>
                    <select
                      className="form-control"
                      name="idFournisseur"
                      value={formData.idFournisseur}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.idProduit || fournisseurs.length === 0}
                    >
                      <option value="">Sélectionnez un fournisseur</option>
                      {fournisseurs.map(f => (
                        <option key={f.idFournisseur} value={f.idFournisseur}>{f.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantité Livrée :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="quantiteLivree"
                      value={formData.quantiteLivree}
                      onChange={handleInputChange}
                      placeholder="Entrez un nombre"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de Livraison :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Observation :</label>
                    <textarea
                      className="form-control"
                      name="observation"
                      value={formData.observation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Livreur :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="livreur"
                      value={formData.livreur}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Enregistrer</button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => navigate('/liste-livraisons')}
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

export default AjouterLivraison;