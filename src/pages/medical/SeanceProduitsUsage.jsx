import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const SeanceProduitsUsage = () => {
  const [seances, setSeances] = useState([]);
  const [produitsBySeance, setProduitsBySeance] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [triggerFetch, setTriggerFetch] = useState(true);
  const { activeRole } = useAuth();

  // Handle date range change with validation
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'endDate' && dateRange.startDate && value < dateRange.startDate) {
      Swal.fire('Erreur', 'La date de fin doit être après la date de début', 'error');
      return;
    }
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle filter button click
  const handleFilter = () => {
    if (dateRange.startDate && !dateRange.endDate) {
      Swal.fire('Erreur', 'Veuillez sélectionner une date de fin', 'error');
      return;
    }
    if (!dateRange.startDate && dateRange.endDate) {
      Swal.fire('Erreur', 'Veuillez sélectionner une date de début', 'error');
      return;
    }
    setTriggerFetch(true);
  };

  // Fetch sessions and products
  useEffect(() => {
    if (!triggerFetch) return;

    const fetchSeancesAndProduits = async () => {
      setLoading(true);
      try {
        let seancesData;
        const startDate = dateRange.startDate || null;
        const endDate = dateRange.endDate || null;

        console.log('Fetching sessions with params:', { startDate, endDate });

        if (startDate && endDate) {
          seancesData = await authService.getSeancesByDateRange(null, startDate, endDate);
        } else {
          seancesData = await authService.getSeancesByPatient(null, null, null);
          seancesData.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        setSeances(seancesData);

        // Fetch products for each session
        const produitsBySeanceData = {};
        for (const seance of seancesData) {
          const produits = await authService.getProduitsBySeance(seance.idSeance);
          produitsBySeanceData[seance.idSeance] = produits;
        }
        setProduitsBySeance(produitsBySeanceData);

        if (seancesData.length === 0) {
          Swal.fire('Information', 'Aucune séance trouvée pour les critères sélectionnés.', 'info');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des séances ou produits:', error);
        Swal.fire(
          'Erreur',
          'Impossible de charger les séances ou les produits: ' + (error.message || 'Erreur inconnue'),
          'error'
        );
      } finally {
        setLoading(false);
        setTriggerFetch(false);
      }
    };

    fetchSeancesAndProduits();
  }, [triggerFetch, dateRange]);

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Produits Utilisés par Séance</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Filtrer les Produits Utilisés</h3>
                <div className="card-tools">
                  {activeRole === 'PERSONNEL_MEDICAL' && (
                    <Link to="/medical" className="btn btn-tool btn-sm">
                      <i className="fas fa-arrow-left"></i> Retour à l'espace médical
                    </Link>
                  )}
                  {activeRole === 'RESPONSABLE_STOCK' && (
                    <Link to="/stock" className="btn btn-tool btn-sm">
                      <i className="fas fa-arrow-left"></i> Retour à l'espace stock
                    </Link>
                  )}
                  {activeRole === 'INTENDANT' && (
                    <Link to="/intendant" className="btn btn-tool btn-sm">
                      <i className="fas fa-arrow-left"></i> Retour à l'espace intendant
                    </Link>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-3 form-group">
                    <label>Date de Début</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>Date de Fin</label>
                    <input
                      type="date"
                      className="form-control"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div className="col-md-12 form-group mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={handleFilter}
                      disabled={loading}
                    >
                      <i className="fas fa-filter mr-1"></i> Filtrer
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Chargement...</span>
                    </div>
                  </div>
                ) : seances.length === 0 ? (
                  <p>Aucune séance trouvée pour les critères sélectionnés.</p>
                ) : (
                  seances.map((seance) => (
                    <div key={seance.idSeance} className="card mb-3">
                      <div className="card-header bg-info">
                        <h5 className="card-title">
                          Séance ID: {seance.idSeance} | Patient: {seance.patient.prenom}{' '}
                          {seance.patient.nom} | Date: {new Date(seance.date).toLocaleString()}
                        </h5>
                      </div>
                      <div className="card-body">
                        {produitsBySeance[seance.idSeance]?.length > 0 ? (
                          <table className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th>Nom du Produit</th>
                                <th>Quantité Administrée</th>
                                <th>Standard</th>
                                <th>Date d’Administration</th>
                                <th>Observation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {produitsBySeance[seance.idSeance].map((produit) => (
                                <tr key={produit.idDetail}>
                                  <td>{produit.nomProduit}</td>
                                  <td>{produit.qteAdministre}</td>
                                  <td>{produit.standard ? 'Oui' : 'Non'}</td>
                                  <td>{new Date(produit.dateTemps).toLocaleString()}</td>
                                  <td>{produit.observation || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>Aucun produit utilisé dans cette séance.</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeanceProduitsUsage;