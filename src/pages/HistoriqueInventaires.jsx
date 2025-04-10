// src/pages/medical/HistoriqueInventaires.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import authService from '../services/authService';

const HistoriqueInventaires = () => {
    const [inventaires, setInventaires] = useState([]);
    const [showLastFour, setShowLastFour] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistorique = async () => {
            try {
                const response = showLastFour 
                    ? await authService.getLastFourInventaires() 
                    : await authService.getHistoriqueInventaires();
                setInventaires(response);
            } catch (error) {
                console.error('Erreur lors de la récupération de l’historique', error);
            }
        };
        fetchHistorique();
    }, [showLastFour]);

    const handleRowClick = (id) => {
        navigate(`/details-inventaire/${id}`);
    };

    const toggleFilter = () => {
        setShowLastFour(!showLastFour);
    };

    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper" style={{ marginLeft: '250px', padding: '20px' }}>
                <div className="content-header">
                    <h1>Historique des Inventaires</h1>
                    <button 
                        className="btn btn-info mb-3" 
                        onClick={toggleFilter}
                    >
                        {showLastFour ? 'Afficher tous' : 'Afficher les 4 derniers'}
                    </button>
                </div>
                <div className="card">
                    <div className="card-body">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date et Heure</th>
                                    <th>Utilisateur</th>
                                    <th>État</th>
                                    <th>Observation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventaires.map((inv) => (
                                    <tr 
                                        key={inv.idInv} 
                                        onClick={() => handleRowClick(inv.idInv)} 
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{inv.idInv}</td>
                                        <td>{new Date(inv.date).toLocaleString()}</td>
                                        <td>{inv.user.nom} {inv.user.prenom}</td>
                                        <td>{inv.etat ? 'Correct' : 'Différences'}</td>
                                        <td 
                                            style={{ 
                                                color: inv.etat ? '#28a745' : '#dc3545', 
                                                fontWeight: 'bold' 
                                            }}
                                        >
                                            {inv.observationInventaire}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoriqueInventaires;