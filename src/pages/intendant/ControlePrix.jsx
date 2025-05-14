import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const ControlePrix = () => {
  const { produitId } = useParams();
  const navigate = useNavigate();
  const [prixList, setPrixList] = useState([]);
  const [produitNom, setProduitNom] = useState('');
  const [sortBy, setSortBy] = useState('prixUnitaire');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchPrix = useCallback(async () => {
    try {
      const prixResponse = await authService.getPrixByProduit(produitId, sortBy, sortOrder);
      setPrixList(prixResponse);
      const produitResponse = await authService.getProduitById(produitId);
      setProduitNom(produitResponse.nom);
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de charger les données', 'error');
    }
  }, [produitId, sortBy, sortOrder]);

  useEffect(() => {
    fetchPrix();
  }, [fetchPrix]);

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Contrôle des Prix pour {produitNom}</h1>
          <button className="btn btn-secondary mt-2" onClick={handleBack}>
            Retour
          </button>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Fournisseur</th>
                      <th onClick={() => handleSort('prixUnitaire')} style={{ cursor: 'pointer' }}>
                        Prix Unitaire (TND) {sortBy === 'prixUnitaire' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>TVA (%)</th>
                      <th>Date</th>
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

export default ControlePrix;