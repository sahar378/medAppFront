// src/pages/stock/ListeLivraisons.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import authService from '../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const ListeLivraisons = () => {
  const { activeRole } = useAuth();
  const [livraisons, setLivraisons] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecent, setFilterRecent] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Chargement initial des livraisons et fournisseurs
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const livraisonsResponse = await authService.getAllLivraisons();
        setLivraisons(livraisonsResponse);

        // Récupérer la liste des fournisseurs
        const fournisseursResponse = await authService.getAllFournisseurs();
        setFournisseurs(fournisseursResponse);
        setLoading(false);
      } catch (error) {
        Swal.fire('Erreur', 'Impossible de charger les données initiales', 'error');
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Charger les livraisons en fonction des filtres
  const loadFilteredLivraisons = useCallback(async () => {
    try {
      let response;
      if (filterRecent) {
        response = await authService.getLastSevenLivraisons();
      } else if (selectedFournisseur && selectedDate) {
        response = await authService.getLivraisonsByFournisseurAndDate(selectedFournisseur, selectedDate);
      } else if (selectedFournisseur) {
        response = await authService.getLivraisonsByFournisseur(selectedFournisseur);
      } else if (selectedDate) {
        response = await authService.getLivraisonsByDate(selectedDate);
      } else {
        response = await authService.getAllLivraisons();
      }
      setLivraisons(response);
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de charger les livraisons', 'error');
    }
  }, [filterRecent, selectedFournisseur, selectedDate]);

  useEffect(() => {
    if (!loading) {
      loadFilteredLivraisons();
    }
  }, [filterRecent, selectedFournisseur, selectedDate, loadFilteredLivraisons, loading]);

  const filteredLivraisons = livraisons.filter(livraison => {
    const matchesSearch =
      livraison.produit?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livraison.fournisseur?.nom.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Réinitialiser le champ de recherche et le fournisseur sélectionné
  const handleResetSearch = () => {
    setSearchTerm('');
    setSelectedFournisseur(''); // Réinitialise aussi le filtre fournisseur
    loadFilteredLivraisons(); // Recharge les données sans filtre fournisseur
  };

  // Réinitialiser le filtre fournisseur
  const handleResetFournisseur = () => {
    setSelectedFournisseur('');
    loadFilteredLivraisons(); // Recharge les données sans filtre fournisseur
  };

  // Réinitialiser le filtre date
  const handleResetDate = () => {
    setSelectedDate('');
    loadFilteredLivraisons(); // Recharge les données sans filtre date
  };

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
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher par produit ou fournisseur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleResetSearch}
                          title="Effacer la recherche"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="recentFilter"
                      checked={filterRecent}
                      onChange={(e) => setFilterRecent(e.target.checked)}
                      style={{ marginLeft: '130px' }}
                    />
                    <label className="form-check-label" htmlFor="recentFilter">
                      Afficher les 7 dernières livraisons
                    </label>
                  </div>
                  <div className="form-group mb-2">
                    <label>Fournisseur :</label>
                    <div className="input-group">
                      <select
                        className="form-control"
                        value={selectedFournisseur}
                        onChange={(e) => setSelectedFournisseur(e.target.value)}
                      >
                        <option value="">Tous les fournisseurs</option>
                        {fournisseurs.map(f => (
                          <option key={f.idFournisseur} value={f.idFournisseur}>
                            {f.nom}
                          </option>
                        ))}
                      </select>
                      {selectedFournisseur && (
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleResetFournisseur}
                            title="Effacer le fournisseur"
                            style={{ marginTop: '1px' }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group mb-2">
                    <label>Date :</label>
                    <div className="input-group">
                      <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                      {selectedDate && (
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleResetDate}
                            title="Effacer la date"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>
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
                          <td>{formatDate(livraison.date)}</td>
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