// src/pages/medical/DetailsInventaire.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import authService from '../services/authService';
import Swal from 'sweetalert2';

const DetailsInventaire = () => {
    const { id } = useParams();
    const [inventaire, setInventaire] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventaire = async () => {
            try {
                const response = await authService.getInventaireById(id);
                setInventaire(response);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails', error);
                Swal.fire('Erreur', 'Impossible de charger les détails de l’inventaire', 'error');
            }
        };
        fetchInventaire();
    }, [id]);

    const hasDifference = (observation) => {
        return observation && observation.includes("Différence détectée");
    };

    if (!inventaire) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper" style={{ marginLeft: '250px', padding: '20px' }}>
                <div className="content-header">
                    <h1>Détails de l'Inventaire #{inventaire.idInv}</h1>
                    <button 
                        className="btn btn-secondary mb-3" 
                        onClick={() => navigate('/historique-inventaires')}
                    >
                        Retour
                    </button>
                </div>
                <div className="card">
                    <div className="card-body">
                        <p><strong>Date et Heure :</strong> {new Date(inventaire.date).toLocaleString()}</p>
                        <p><strong>Utilisateur :</strong> {inventaire.user.nom} {inventaire.user.prenom}</p>
                        <p><strong>État :</strong> {inventaire.etat ? 'Correct' : 'Différences'}</p>
                        <p 
                            style={{ 
                                color: inventaire.etat ? '#28a745' : '#dc3545', 
                                fontWeight: 'bold' 
                            }}
                        >
                            <strong>Observation :</strong> {inventaire.observationInventaire}
                        </p>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Quantité Saisie</th>
                                    <th>Observation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventaire.lignesInventaire.map((ligne) => (
                                    <tr 
                                        key={ligne.idLigne} 
                                        style={{ backgroundColor: hasDifference(ligne.observationProduit) ? '#ffcccc' : 'inherit' }}
                                    >
                                        <td>{ligne.produit.nom}</td>
                                        <td>{ligne.qteSaisie}</td>
                                        <td>{ligne.observationProduit}</td>
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

export default DetailsInventaire;