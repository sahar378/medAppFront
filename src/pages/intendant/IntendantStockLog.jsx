// src/pages/intendant/IntendantStockLog.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const IntendantStockLog = () => {
  const { produitId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [produitNom, setProduitNom] = useState(''); // État pour stocker le nom du produit

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await authService.getProduitLogs(produitId);
        setLogs(logsData);
        // Si les logs contiennent déjà le nom du produit, on le prend du premier log
        if (logsData.length > 0 && logsData[0].produit && logsData[0].produit.nom) {
          setProduitNom(logsData[0].produit.nom);
        } else {
          // Sinon, ajouter une requête pour récupérer le produit (optionnel)
          const produitData = await authService.getProduitById(produitId);
          setProduitNom(produitData.nom);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des logs', error);
      }
    };
    fetchLogs();
  }, [produitId]);

  const handleBack = () => {
    navigate('/intendant/stock'); // Retour à la vue générale de l'intendant
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Historique des actions pour le produit : {produitNom || `ID ${produitId}`}</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Utilisateur (Matricule)</th>
                      <th>Action</th>
                      <th>Détails</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.idLog}>
                        <td>{log.user.prenom} {log.user.nom} ({log.user.userId})</td>
                        <td>{log.action}</td>
                        <td>{log.details}</td>
                        <td>{new Date(log.dateAction).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="btn btn-secondary mt-3" onClick={handleBack}>
                  Retour
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntendantStockLog;