// src/pages/medical/FaireInventaire.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const FaireInventaire = () => {
    const [produits, setProduits] = useState([]);
    const [quantitesSaisies, setQuantitesSaisies] = useState({});
    const [observations, setObservations] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await authService.getProduitsForInventaire();
                setProduits(response);
            } catch (error) {
                console.error('Erreur lors de la récupération des produits', error);
            }
        };
        fetchProduits();
    }, []);

    const handleQuantiteChange = (produitId, value) => {
        setQuantitesSaisies((prev) => ({
            ...prev,
            [produitId]: value,
        }));
    };

    const allQuantitesSaisies = () => {
        return produits.every((produit) => quantitesSaisies[produit.idProduit] !== undefined && quantitesSaisies[produit.idProduit] !== '');
    };

    const hasDifference = (observation) => {
        return observation && observation.includes("Différence détectée");
    };

    const handleVerifier = async () => {
        if (!allQuantitesSaisies()) {
            Swal.fire('Erreur', 'Veuillez saisir toutes les quantités avant de vérifier.', 'error');
            return;
        }

        const lignes = produits.map((produit) => ({
            produit: { idProduit: produit.idProduit },
            qteSaisie: parseInt(quantitesSaisies[produit.idProduit], 10) || 0, // Conversion en entier
            observationProduit: '',
        }));

        try {
            const inventaire = await authService.faireInventaire(lignes);
            if (!inventaire || !inventaire.lignesInventaire) {
                throw new Error('Réponse invalide du serveur : lignesInventaire manquant');
            }
            setObservations(
                inventaire.lignesInventaire.reduce((acc, ligne) => ({
                    ...acc,
                    [ligne.produit.idProduit]: ligne.observationProduit,
                }), {})
            );
            setIsVerified(true);
            Swal.fire('Succès', 'Inventaire vérifié avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la vérification', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la vérification', 'error');
        }
    };

    const handleTerminer = async () => {
        Swal.fire({
            title: 'Confirmer la sauvegarde ?',
            text: 'Voulez-vous enregistrer cet inventaire ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire('Succès', 'Inventaire sauvegardé avec succès', 'success');
                navigate('/medical');
            }
        });
    };

    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper" style={{ marginLeft: '250px', padding: '20px' }}>
                <div className="content-header">
                    <h1>Faire un Inventaire</h1>
                </div>
                <div className="card">
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Nom du Produit</th>
                                    <th>Quantité à Saisir</th>
                                    <th>Observation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produits.map((produit) => (
                                    <tr 
                                        key={produit.idProduit} 
                                        style={{ backgroundColor: hasDifference(observations[produit.idProduit]) ? '#ffcccc' : 'inherit' }}
                                    >
                                        <td>{produit.nom}</td>
                                        <td>
                                            <input
                                                type="text" // Changement de number à text
                                                className="form-control"
                                                value={quantitesSaisies[produit.idProduit] || ''}
                                                onChange={(e) => handleQuantiteChange(produit.idProduit, e.target.value)}
                                                disabled={isVerified}
                                            />
                                        </td>
                                        <td>{observations[produit.idProduit] || ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={handleVerifier}
                                disabled={!allQuantitesSaisies() || isVerified}
                            >
                                Vérifier
                            </button>
                            {isVerified && (
                                <button className="btn btn-success ml-2" onClick={handleTerminer}>
                                    Terminer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaireInventaire;