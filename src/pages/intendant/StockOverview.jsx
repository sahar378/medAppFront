import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const StockOverview = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produitsData = await authService.getAllProduits(); // Utiliser getAllProduits pour voir tous les produits
        const alertesData = await authService.verifierAlertes();
        setProduits(produitsData);
        setAlertes(alertesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Vue d’ensemble du stock</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            {alertes.length > 0 && (
              <div className="card mb-3" style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>
                <div className="card-body" style={{ color: '#721c24' }}>
                  <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    <i className="fas fa-exclamation-triangle mr-2" /> Alertes de Stock
                  </h5>
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {alertes.map(p => (
                      <li key={p.idProduit} style={{ marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold' }}>{p.nom}</span> - Quantité: {p.qteDisponible} (Seuil: {p.seuilAlerte})
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
                      <th>Catégorie</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map(produit => (
                      <tr
                        key={produit.idProduit}
                        style={{ backgroundColor: produit.archive ? '#d3d3d3' : 'inherit' }} // Gris pour les archivés
                      >
                        <td>{produit.nom}</td>
                        <td>{produit.description}</td>
                        <td>{produit.qteDisponible}</td>
                        <td>{produit.seuilAlerte}</td>
                        <td>{produit.categorie.libelleCategorie}</td>
                        <td>{produit.archive ? <span className="badge bg-secondary">Archivé</span> : <span className="badge bg-success">Actif</span>}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => navigate(`/intendant/logs/${produit.idProduit}`)}
                          >
                            Voir les logs
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

export default StockOverview;