import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const ProduitsStandardsList = () => {
  const { id } = useParams();
  const [produitsStandards, setProduitsStandards] = useState([]);
  const [patient, setPatient] = useState(null);
  const { activeRole } = useAuth();

  const fetchProduitsStandards = useCallback(async () => {
    try {
      const patientResponse = await authService.getPatientById(id);
      setPatient(patientResponse);
      const produitsResponse = await authService.getProduitsStandards(id);
      setProduitsStandards(produitsResponse);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits standards', error);
      Swal.fire('Erreur', 'Impossible de récupérer les produits standards', 'error');
    }
  }, [id]);

  useEffect(() => {
    fetchProduitsStandards();
  }, [fetchProduitsStandards]);

  if (!patient) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Produits Standards du Patient</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{patient.prenom} {patient.nom}</h3>
                <div className="card-tools">
                  {activeRole === 'MEDECIN' && (
                    <Link
                      to={`/medical/medecin/patients/${id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Retour aux détails
                    </Link>
                  )}
                  {activeRole === 'RESPONSABLE_STOCK' && (
                    <Link
                      to="/stock"
                      className="btn btn-secondary btn-sm"
                    >
                      Retour à l'espace stock
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
                    {produitsStandards.length > 0 ? (
                      produitsStandards.map((produit) => (
                        <tr key={produit.idProduit}>
                          <td>{produit.nom}</td>
                          <td>{produit.qteDisponible}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">Aucun produit standard trouvé</td>
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

export default ProduitsStandardsList;