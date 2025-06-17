import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';

const EditSeanceProduits = () => {
  const { seanceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [seance, setSeance] = useState(null);
  
  // Fonction pour valider les entrées numériques
  const validateNumericInput = (value) => {
    return value === '' || /^[0-9]*\.?[0-9]*$/.test(value);
  };

  // États modifiés pour stocker les valeurs numériques comme chaînes
  const [produitsNonStandards, setProduitsNonStandards] = useState({
    'Sérum salé 0.5L': '0',
    'Seringue 10cc': '0',
    'Seringue 5cc': '0',
    'Robinet': '0',
    'Transfuseur': '0',
    'Lame bistouri': '0',
    'Compress': '',
    'Gants': '0',
    'Masque O2': '0',
    'Lunette O2': '0',
    'Fils de suture': '0',
    'Bandelette': '0',
    'Filtre (dialyseur)': '0',
    'ligne artérielle': '0',
    'ligne veineuse': '0',
    '2 aiguilles': '0',
    'champ stérile': '0',
  });
  
  const [produitsSansStock, setProduitsSansStock] = useState({
    'Héparine': '',
    'Ether': '',
    'Néofix': '',
  });
  
  const [produitsHorsStock, setProduitsHorsStock] = useState([{ nom: '', qte: '' }]);
  const [produitsSpeciaux, setProduitsSpeciaux] = useState({});
  const [selectedMateriel, setSelectedMateriel] = useState([]);

  useEffect(() => {
    console.log('Seance ID from params:', seanceId);
    if (!seanceId || seanceId === 'undefined') {
      Swal.fire('Erreur', 'ID de séance invalide', 'error').then(() => navigate('/medical/seances/produits'));
      return;
    }

    const fetchSeanceAndProduits = async () => {
      try {
        const seanceData = await authService.getSeanceById(seanceId);
        setSeance(seanceData);

        const produitsData = await authService.getProduitsBySeance(seanceId);
        const newProduitsNonStandards = {
          'Sérum salé 0.5L': '0',
          'Seringue 10cc': '0',
          'Seringue 5cc': '0',
          'Robinet': '0',
          'Transfuseur': '0',
          'Lame bistouri': '0',
          'Compress': '',
          'Gants': '0',
          'Masque O2': '0',
          'Lunette O2': '0',
          'Fils de suture': '0',
          'Bandelette': '0',
          'Filtre (dialyseur)': '0',
          'ligne artérielle': '0',
          'ligne veineuse': '0',
          '2 aiguilles': '0',
          'champ stérile': '0',
        };
        const newProduitsSansStock = {
          'Héparine': '',
          'Ether': '',
          'Néofix': '',
        };
        const newProduitsHorsStock = [];
        const newProduitsSpeciaux = {};
        const newSelectedMateriel = [];

        produitsData.forEach((produit) => {
          if (!produit.standard) {
            if (Object.keys(newProduitsNonStandards).includes(produit.nomProduit)) {
              newProduitsNonStandards[produit.nomProduit] = produit.qteAdministre.toString();
            } else if (Object.keys(newProduitsSansStock).includes(produit.nomProduit)) {
              newProduitsSansStock[produit.nomProduit] = produit.qteAdministre.toString();
            } else if (produit.produit && produit.produit.categorie.libelleCategorie.toLowerCase() === 'materiel') {
              newProduitsSpeciaux[produit.nomProduit] = produit.qteAdministre.toString();
              newSelectedMateriel.push({
                value: produit.produit.idProduit,
                label: produit.nomProduit,
                produit: produit.produit,
              });
            } else {
              newProduitsHorsStock.push({
                nom: produit.nomProduit,
                qte: produit.qteAdministre.toString(),
              });
            }
          }
        });

        setProduitsNonStandards(newProduitsNonStandards);
        setProduitsSansStock(newProduitsSansStock);
        setProduitsHorsStock(newProduitsHorsStock.length > 0 ? newProduitsHorsStock : [{ nom: '', qte: '' }]);
        setProduitsSpeciaux(newProduitsSpeciaux);
        setSelectedMateriel(newSelectedMateriel);
      } catch (error) {
        console.error('Erreur lors de la récupération de la séance ou des produits:', error);
        Swal.fire('Erreur', 'Impossible de charger les données', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSeanceAndProduits();
  }, [seanceId, navigate]);

  const loadMaterielOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 1) return [];
    try {
      const response = await authService.getActiveMateriels();
      const filtered = response.filter((produit) =>
        produit.nom.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filtered.map((produit) => ({
        value: produit.idProduit,
        label: produit.nom,
        produit,
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche de produits matériels:', error);
      return [];
    }
  };

  const handleProduitNonStandardChange = (e, produit) => {
    const { checked } = e.target;
    setProduitsNonStandards((prev) => ({
      ...prev,
      [produit]: checked ? '1' : '0',
    }));
  };

  const handleCompressChange = (e) => {
    const { value } = e.target;
    if (validateNumericInput(value)) {
      setProduitsNonStandards((prev) => ({
        ...prev,
        Compress: value,
      }));
    }
  };

  const handleProduitSansStockChange = (e, produit) => {
    const { value } = e.target;
    if (validateNumericInput(value)) {
      setProduitsSansStock((prev) => ({
        ...prev,
        [produit]: value,
      }));
    }
  };

  const handleProduitHorsStockChange = (e, index, field) => {
    const { value } = e.target;
    if (field === 'qte' && !validateNumericInput(value)) {
      return;
    }
    setProduitsHorsStock((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addProduitHorsStock = () => {
    setProduitsHorsStock((prev) => [...prev, { nom: '', qte: '' }]);
  };

  const removeProduitHorsStock = (index) => {
    setProduitsHorsStock((prev) =>
      prev.filter((_, i) => i !== index).length > 0
        ? prev.filter((_, i) => i !== index)
        : [{ nom: '', qte: '' }]
    );
  };

  const handleMaterielSelect = (selectedOptions) => {
    const selected = selectedOptions || [];
    setSelectedMateriel(selected);
    
    // MODIFICATION CLÉ : Plus de valeur par défaut "1"
    setProduitsSpeciaux(
      selected.reduce(
        (acc, option) => ({
          ...acc,
          [option.produit.nom]: produitsSpeciaux[option.produit.nom] || '',
        }),
        {}
      )
    );
  };

  const handleProduitSpecialQuantityChange = (e, produitNom) => {
    const { value } = e.target;
    if (validateNumericInput(value)) {
      setProduitsSpeciaux((prev) => ({
        ...prev,
        [produitNom]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirmer les modifications',
      text: 'Êtes-vous sûr de vouloir enregistrer les modifications des produits pour cette séance ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, enregistrer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        // Fonction pour convertir les valeurs en nombres et filtrer celles > 0
        const convertAndFilter = (obj) => {
          return Object.fromEntries(
            Object.entries(obj)
              .map(([key, value]) => [key, parseFloat(value)])
              .filter(([_, value]) => !isNaN(value) && value > 0)
          );
        };

        // Conversion et filtrage des produits
        const produitsNonStandardsFiltered = convertAndFilter(produitsNonStandards);
        const produitsSansStockFiltered = convertAndFilter(produitsSansStock);
        
        const produitsHorsStockFiltered = produitsHorsStock
          .filter((item) => item.nom && item.qte && !isNaN(item.qte))
          .reduce((acc, item) => ({ 
            ...acc, 
            [item.nom]: parseFloat(item.qte) 
          }), {});
        
        const produitsSpeciauxFiltered = convertAndFilter(produitsSpeciaux);

        await authService.updateSeanceProduits(seanceId, {
          produitsNonStandards: produitsNonStandardsFiltered,
          produitsSansStock: produitsSansStockFiltered,
          produitsHorsStock: produitsHorsStockFiltered,
          produitsSpeciaux: produitsSpeciauxFiltered,
        });

        Swal.fire('Succès', 'Produits mis à jour avec succès', 'success');
        navigate(`/medical/seances/${seanceId}/produits/details`);
      } catch (error) {
        console.error('Erreur lors de la mise à jour des produits:', error);
        Swal.fire(
          'Erreur',
          error.response?.data?.message || 'Erreur lors de la mise à jour des produits',
          'error'
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Modifier les Produits de la Séance</h1>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Chargement...</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">
                  Modifier les Produits - Séance ID: {seanceId} | Patient:{' '}
                  {seance?.patient?.prenom} {seance?.patient?.nom}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Modifier les Produits Utilisés</h3>
                <div className="card-tools">
                  <Link to={`/medical/seances/${seanceId}/produits/details`} className="btn btn-tool btn-sm">
                    <i className="fas fa-arrow-left"></i> Retour
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="card card-outline card-info mb-4">
                    <div className="card-header">
                      <h4 className="card-title">Produits Non Standards</h4>
                    </div>
                    <div className="card-body">
                      <h5>Produits affectant le stock</h5>
                      <div className="row">
                        {Object.keys(produitsNonStandards)
                          .filter((produit) => produit !== 'Compress')
                          .map((produit) => (
                            <div key={produit} className="col-md-3 form-group">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`${produit}-${seanceId}`}
                                  checked={produitsNonStandards[produit] === '1'}
                                  onChange={(e) => handleProduitNonStandardChange(e, produit)}
                                  style={{ marginRight: '10px', marginLeft: '20px' }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`${produit}-${seanceId}`}
                                >
                                  {produit}
                                </label>
                              </div>
                            </div>
                          ))}
                        <div className="col-md-3 form-group">
                          <label>Compress</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="form-control"
                            value={produitsNonStandards['Compress']}
                            onChange={handleCompressChange}
                          />
                        </div>
                      </div>

                      <h5 className="mt-4">Produits sans impact sur le stock</h5>
                      <div className="row">
                        {Object.keys(produitsSansStock).map((produit) => (
                          <div key={produit} className="col-md-3 form-group">
                            <label>{produit}</label>
                            <input
                              type="text"
                              inputMode="decimal"
                              className="form-control"
                              value={produitsSansStock[produit]}
                              onChange={(e) => handleProduitSansStockChange(e, produit)}
                            />
                          </div>
                        ))}
                      </div>

                      <h5 className="mt-4">Produits hors stock</h5>
                      {produitsHorsStock.map((item, index) => (
                        <div key={index} className="row mb-2 align-items-center">
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nom du produit"
                              value={item.nom}
                              onChange={(e) => handleProduitHorsStockChange(e, index, 'nom')}
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              inputMode="decimal"
                              className="form-control"
                              placeholder="Quantité"
                              value={item.qte}
                              onChange={(e) => handleProduitHorsStockChange(e, index, 'qte')}
                            />
                          </div>
                          <div className="col-md-2">
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => removeProduitHorsStock(index)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-info mt-2"
                        onClick={addProduitHorsStock}
                      >
                        Ajouter Produit Hors Stock
                      </button>

                      <h5 className="mt-4">Produits Spéciaux (Matériel)</h5>
                      <div className="form-group">
                        <label>Rechercher Matériel</label>
                        <AsyncSelect
                          isMulti
                          cacheOptions
                          defaultOptions
                          loadOptions={loadMaterielOptions}
                          onChange={handleMaterielSelect}
                          placeholder="Rechercher un matériel..."
                          value={selectedMateriel}
                        />
                      </div>
                      {selectedMateriel.map((materiel) => (
                        <div key={materiel.value} className="row mb-2 align-items-center">
                          <div className="col-md-4">
                            <label>{materiel.label}</label>
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              inputMode="decimal"
                              className="form-control"
                              value={produitsSpeciaux[materiel.label] || ''} // MODIFICATION: Plus de valeur par défaut "1"
                              onChange={(e) =>
                                handleProduitSpecialQuantityChange(e, materiel.label)
                              }
                              placeholder="Quantité"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Enregistrer les Modifications
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

export default EditSeanceProduits;