import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const ActiveMateriels = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produitsData = await authService.getActiveMateriels();
        const alertesData = await authService.verifierAlertesMateriels();
        setProduits(produitsData);
        setFilteredProduits(produitsData);
        setAlertes(alertesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = produits.filter(p => 
      p.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProduits(filtered);
  }, [searchTerm, produits]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleManagePrices = (produitId) => {
    navigate(`/intendant/prix/${produitId}`);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Stock Actif - Matériels</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="mb-3 position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par nom..."
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
            {alertes.length > 0 && (
              <div className="card mb-3" style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>
                <div className="card-body" style={{ color: '#721c24' }}>
                  <h5>
                    <i className="fas fa-exclamation-triangle mr-2" /> Alertes
                  </h5>
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {alertes.map(dto => (
                      <li key={dto.produit.idProduit} style={{ marginBottom: '5px' }}>
                        <span
                          style={{ fontWeight: 'bold' }}
                          dangerouslySetInnerHTML={{
                            __html: dto.messages.join('<br />'),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Description</th>
                      <th>Quantité</th>
                      <th>Seuil</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProduits.map(produit => (
                      <tr key={produit.idProduit}>
                        <td>{produit.nom}</td>
                        <td>{produit.description}</td>
                        <td>{produit.qteDisponible}</td>
                        <td>{produit.seuilAlerte}</td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              alignItems: 'center',
                              flexWrap: 'nowrap',
                            }}
                          >
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => navigate(`/intendant/logs/${produit.idProduit}`)}
                            >
                              Voir les logs
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleManagePrices(produit.idProduit)}
                            >
                              Voir les prix
                            </button>
                          </div>
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

export default ActiveMateriels;