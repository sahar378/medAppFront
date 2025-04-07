import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const ListeProduitsPrix = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('medicaments');
  const [produitsList, setProduitsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProduits = useCallback(async () => {
    try {
      const response = await authService.getProduitsByCategorie(activeTab === 'medicaments' ? 2 : 1);
      setProduitsList(response.filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase())));
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de charger les produits', 'error');
    }
  }, [activeTab, searchTerm]);

  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleProductClick = (produitId) => {
    navigate(`/stock/prix/produit/${produitId}`);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Gestion des Prix des Produits</h1>
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
                {/* Barre de recherche avec croix */}
                <div className="mb-3 position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-link position-absolute"
                      style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', padding: 0 }}
                      onClick={handleClearSearch}
                    >
                      <i className="fas fa-times" style={{ color: '#6c757d' }} />
                    </button>
                  )}
                </div>
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
                              Gérer les prix
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListeProduitsPrix;