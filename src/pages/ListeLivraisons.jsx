// src/pages/stock/ListeLivraisons.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import authService from '../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const ListeLivraisons = () => {
  const { activeRole } = useAuth();
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecent, setFilterRecent] = useState(false);

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        const response = await authService.getAllLivraisons();
        setLivraisons(response);
        setLoading(false);
      } catch (error) {
        Swal.fire('Erreur', error.response?.data?.message || 'Impossible de charger les livraisons', 'error');
        setLoading(false);
      }
    };
    fetchLivraisons();
  }, []);

  const filteredLivraisons = livraisons.filter(livraison => {
    const matchesSearch =
      livraison.produit?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livraison.fournisseur?.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const isRecent = filterRecent
      ? new Date(livraison.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : true;
    return matchesSearch && isRecent;
  });

  if (loading) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header">
            <h1 className="m-0">Liste des Livraisons</h1>
          </div>
          <section className="content">
            <div className="container-fluid">
              <p>Chargement...</p>
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
          <h1 className="m-0">Liste des Livraisons</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher par produit ou fournisseur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="recentFilter"
                      checked={filterRecent}
                      onChange={(e) => setFilterRecent(e.target.checked)}
                      style={{ marginLeft: '120px' }}
                    />
                    <label className="form-check-label" htmlFor="recentFilter"
                    >
                      Livraisons des 7 derniers jours
                    </label>
                  </div>
                  {activeRole === 'RESPONSABLE_STOCK' && (
                    <Link to="/stock/ajouter-livraison" className="btn btn-primary mt-2">
                      Ajouter une livraison
                    </Link>
                  )}
                </div>
                {filteredLivraisons.length === 0 ? (
                  <p>Aucune livraison enregistrée.</p>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID Livraison</th>
                        <th>Produit</th>
                        <th>Fournisseur</th>
                        <th>Quantité Livrée</th>
                        <th>Date</th>
                        <th>Livreur</th>
                        <th>Observation</th>
                        <th>Créé par</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLivraisons.map((livraison) => (
                        <tr key={livraison.idLivraison}>
                          <td>{livraison.idLivraison}</td>
                          <td>{livraison.produit?.nom || 'Inconnu'}</td>
                          <td>{livraison.fournisseur?.nom || 'Inconnu'}</td>
                          <td>{livraison.quantiteLivree}</td>
                          <td>{new Date(livraison.date).toLocaleString('fr-FR')}</td>
                          <td>{livraison.livreur || '-'}</td>
                          <td>{livraison.observation || '-'}</td>
                          <td>{livraison.user ? `${livraison.user.prenom} ${livraison.user.nom}` : 'Inconnu'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListeLivraisons;