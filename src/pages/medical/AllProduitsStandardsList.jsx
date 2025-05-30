import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const AllProduitsStandardsList = () => {
  const [produitsStandards, setProduitsStandards] = useState([]);
  const [serumSaleProducts, setSerumSaleProducts] = useState({
    'Sérum salé 1L': { nom: 'Sérum salé 1L', qteDisponible: 0 },
    'Sérum salé 0.5L': { nom: 'Sérum salé 0.5L', qteDisponible: 0 },
  });
  const [loading, setLoading] = useState(true);
  const { activeRole } = useAuth();

  const fetchProduitsStandards = useCallback(async () => {
    try {
      // Fetch all standard products and specific serum products concurrently
      const [produitsResponse, serum1L, serum05L] = await Promise.all([
        authService.getAllProduitsStandards(),
        authService.getProduitByNom('Sérum salé 1L'),
        authService.getProduitByNom('Sérum salé 0.5L'),
      ]);

      // Update serum products with fetched data (or keep defaults if null)
      setSerumSaleProducts({
        'Sérum salé 1L': {
          nom: 'Sérum salé 1L',
          qteDisponible: serum1L ? serum1L.qteDisponible : 0,
        },
        'Sérum salé 0.5L': {
          nom: 'Sérum salé 0.5L',
          qteDisponible: serum05L ? serum05L.qteDisponible : 0,
        },
      });

      // Filter out Sérum salé from produitsStandards to avoid duplication (case-insensitive)
      const filteredProduits = produitsResponse.filter(
        (produit) => !['sérum salé 1l', 'sérum salé 0.5l'].includes(produit.nom.toLowerCase())
      );
      setProduitsStandards(filteredProduits);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits standards', error);
      Swal.fire('Erreur', 'Impossible de récupérer les produits standards', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduitsStandards();
  }, [fetchProduitsStandards]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Liste des Produits Standards</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Produits Standards</h3>
                <div className="card-tools">
                  {activeRole === 'PERSONNEL_MEDICAL' && (
                    <Link to="/medical" className="btn btn-secondary btn-sm">
                      Retour à l'espace médical
                    </Link>
                  )}
                  {activeRole === 'RESPONSABLE_STOCK' && (
                    <Link to="/stock" className="btn btn-secondary btn-sm">
                      Retour à l'espace stock
                    </Link>
                  )}
                  {activeRole === 'INTENDANT' && (
                    <Link to="/intendant" className="btn btn-secondary btn-sm">
                      Retour à l'espace intendant
                    </Link>
                  )}
                </div>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Quantité Disponible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Always display Sérum salé 1L and 0.5L first */}
                    <tr key="Sérum salé 1L">
                      <td>Sérum salé 1L</td>
                      <td>
                        {serumSaleProducts['Sérum salé 1L'].qteDisponible}
                        {serumSaleProducts['Sérum salé 1L'].qteDisponible === 0 && (
                          <span className="text-muted"> (Non disponible)</span>
                        )}
                      </td>
                    </tr>
                    <tr key="Sérum salé 0.5L">
                      <td>Sérum salé 0.5L</td>
                      <td>
                        {serumSaleProducts['Sérum salé 0.5L'].qteDisponible}
                        {serumSaleProducts['Sérum salé 0.5L'].qteDisponible === 0 && (
                          <span className="text-muted"> (Non disponible)</span>
                        )}
                      </td>
                    </tr>
                    {/* Display other standard products */}
                    {produitsStandards.length > 0 ? (
                      produitsStandards.map((produit) => (
                        <tr key={produit.idProduit}>
                          <td>{produit.nom}</td>
                          <td>{produit.qteDisponible}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">Aucun autre produit standard trouvé</td>
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

export default AllProduitsStandardsList;