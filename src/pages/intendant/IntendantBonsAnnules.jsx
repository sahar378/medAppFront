// src/pages/intendant/IntendantBonsAnnules.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const IntendantBonsAnnules = () => {
  const navigate = useNavigate();
  const [bonsAnnules, setBonsAnnules] = useState([]);

  useEffect(() => {
    const fetchBonsAnnules = async () => {
      try {
        const data = await authService.getBonsDeCommandeByEtat('annulé');
        setBonsAnnules(data);
      } catch (error) {
        console.error('Erreur lors du chargement des bons annulés', error);
      }
    };
    fetchBonsAnnules();
  }, []);

  const handleRowClick = (bon) => {
    navigate(`/intendant/bons-commande/${bon.idBonCommande}`);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Bons de Commande Annulés</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Fournisseur</th>
                      <th>Créé par</th>
                      <th>Date de modification</th>
                      <th>Motif</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonsAnnules.map(bon => (
                      <tr key={bon.idBonCommande} onClick={() => handleRowClick(bon)} style={{ cursor: 'pointer' }}>
                        <td>{bon.idBonCommande}</td>
                        <td>{new Date(bon.date).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{bon.fournisseur.nom}</td>
                        <td>{bon.createdBy ? `${bon.createdBy.nom} ${bon.createdBy.prenom}` : '-'}</td>
                        <td>
                          {bon.dateModification 
                            ? new Date(bon.dateModification).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) 
                            : '-'}
                        </td>
                        <td>{bon.motifAnnulation || '-'}</td>
                        <td><span className="badge bg-warning">Annulé</span></td>
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

export default IntendantBonsAnnules;