// src/pages/stock/BonsApprouves.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const BonsApprouves = () => {
  const [bonsApprouves, setBonsApprouves] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBonsApprouves = async () => {
      try {
        const data = await authService.getBonsDeCommandeByEtat('approuvé');
        // Log temporaire pour inspecter les données brutes
        console.log('Données brutes des bons approuvés :', data.map(bon => ({ id: bon.idBonCommande, date: bon.date })));
        setBonsApprouves(data);
      } catch (error) {
        console.error('Erreur lors du chargement des bons approuvés', error);
      }
    };
    fetchBonsApprouves();
  }, []);

  const handleRowClick = (bon) => {
    navigate(`/stock/bons-approuves/${bon.idBonCommande}`);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Bons de Commande Approuvés (Lecture seule)</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date de création</th>
                      <th>Fournisseur</th>
                      <th>Créé par</th>
                      <th>Modifié par</th>
                      <th>Date de modification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonsApprouves.map(bon => (
                      <tr
                        key={bon.idBonCommande}
                        onClick={() => handleRowClick(bon)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{bon.idBonCommande}</td>
                        <td>{new Date(bon.date).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{bon.fournisseur.nom}</td>
                        <td>{bon.createdBy ? `${bon.createdBy.nom} ${bon.createdBy.prenom}` : '-'}</td>
                        <td>{bon.modifiedBy ? `${bon.modifiedBy.nom} ${bon.modifiedBy.prenom}` : '-'}</td>
                        <td>
                          {bon.dateModification 
                            ? new Date(bon.dateModification).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) 
                            : '-'}
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

export default BonsApprouves;