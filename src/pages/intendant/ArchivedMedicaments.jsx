import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const ArchivedMedicaments = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produitsData = await authService.getArchivedMedicaments();
        setProduits(produitsData);
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
          <h1 className="m-0">Stock Archivé - Médicaments</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Description</th>
                      <th>Quantité</th>
                      <th>Seuil</th>
                      <th>Date Expiration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map(produit => (
                      <tr key={produit.idProduit} style={{ backgroundColor: '#d3d3d3' }}>
                        <td>{produit.nom}</td>
                        <td>{produit.description}</td>
                        <td>{produit.qteDisponible}</td>
                        <td>{produit.seuilAlerte}</td>
                        <td>{produit.dateExpiration ? new Date(produit.dateExpiration).toLocaleDateString() : '-'}</td>
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

export default ArchivedMedicaments;