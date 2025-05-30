import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const SeanceProduitsDetails = () => {
  const { seanceId } = useParams();
  const [seance, setSeance] = useState(null);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeRole } = useAuth();

  useEffect(() => {
    console.log('Seance ID from params:', seanceId);
    if (!seanceId || seanceId === 'undefined') {
      Swal.fire('Erreur', 'ID de séance invalide', 'error').then(() => window.location.href = '/medical/seances/produits');
      return;
    }

    const fetchSeanceAndProduits = async () => {
      try {
        const seanceData = await authService.getSeanceById(seanceId);
        setSeance(seanceData);

        const produitsData = await authService.getProduitsBySeance(seanceId);
        setProduits(produitsData);
      } catch (error) {
        console.error('Erreur lors de la récupération de la séance ou des produits:', error);
        Swal.fire('Erreur', 'Impossible de charger les données', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSeanceAndProduits();
  }, [seanceId]);

  if (loading) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Détails des Produits de la Séance</h1>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Chargement...</span>
                </div>
              </div>
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
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">
                  Détails des Produits - Séance ID: {seanceId} | Patient:{' '}
                  {seance?.patient?.prenom} {seance?.patient?.nom}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Produits Utilisés</h3>
                <div className="card-tools">
                  <Link to="/medical/produits-usage" className="btn btn-tool btn-sm">
                    <i className="fas fa-arrow-left"></i> Retour
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {produits.length > 0 ? (
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
                      {produits.map((produit) => (
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
                {activeRole === 'INTENDANT' && (
                  <Link
                    to={`/medical/seances/${seanceId}/produits/edit`}
                    className="btn btn-primary mt-3"
                  >
                    <i className="fas fa-edit"></i> Modifier
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeanceProduitsDetails;