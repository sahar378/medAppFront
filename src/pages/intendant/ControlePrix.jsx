import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const ControlePrix = () => {
  const [activeTab, setActiveTab] = useState('medicaments');
  const [produitsList, setProduitsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduitId, setSelectedProduitId] = useState(null);
  const [prixList, setPrixList] = useState([]);
  const [produitNom, setProduitNom] = useState('');
  const [sortBy, setSortBy] = useState('prixUnitaire');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchProduits = useCallback(async () => {
    try {
      const response = await authService.getProduitsByCategorie(activeTab === 'medicaments' ? 2 : 1);
      setProduitsList(response.filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase())));
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de charger les produits', 'error');
    }
  }, [activeTab, searchTerm]);

  const fetchPrix = useCallback(async () => {
    if (!selectedProduitId) return;
    try {
      const prixResponse = await authService.getPrixByProduit(selectedProduitId, sortBy, sortOrder);
      setPrixList(prixResponse);
      const produitResponse = await authService.getProduitById(selectedProduitId);
      setProduitNom(produitResponse.nom);
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de charger les prix', 'error');
    }
  }, [selectedProduitId, sortBy, sortOrder]);

  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  useEffect(() => {
    fetchPrix();
  }, [fetchPrix]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSelectedProduitId(null);
    setPrixList([]);
    setProduitNom('');
  };

  const handleProductClick = (produitId) => {
    setSelectedProduitId(produitId);
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleBack = () => {
    setSelectedProduitId(null);
    setPrixList([]);
    setProduitNom('');
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Contrôle des Prix</h1>
          {selectedProduitId && (
            <button className="btn btn-secondary mt-2" onClick={handleBack}>
              Retour à la liste
            </button>
          )}
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'medicaments' ? 'active' : ''}`}
                      onClick={() => handleTabChange('medicaments')}
                    >
                      Médicaments
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'materiels' ? 'active' : ''}`}
                      onClick={() => handleTabChange('materiels')}
                    >
                      Matériels
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {!selectedProduitId ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produitsList.length > 0 ? (
                          produitsList.map((produit) => (
                            <tr key={produit.idProduit}>
                              <td>{produit.nom}</td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleProductClick(produit.idProduit)}
                                >
                                  Voir les prix
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center">
                              Aucun produit trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>
                    <h3>Prix pour {produitNom}</h3>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Fournisseur</th>
                          <th onClick={() => handleSort('prixUnitaire')} style={{ cursor: 'pointer' }}>
                            Prix Unitaire (TND) {sortBy === 'prixUnitaire' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </th>
                          <th>TVA (%)</th>
                          <th>Date Mise à Jour</th>
                          {/* Supprimez la colonne Actions */}
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
                            {/* Supprimez la cellule Actions */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ControlePrix;