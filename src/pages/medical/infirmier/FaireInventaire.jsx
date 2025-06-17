import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const FaireInventaire = () => {
    const [produits, setProduits] = useState([]);
    const [quantitesSaisies, setQuantitesSaisies] = useState({});
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
        // Allow only integer input or empty string
        if (value === '' || /^[0-9]*$/.test(value)) {
            setQuantitesSaisies((prev) => ({
                ...prev,
                [produitId]: value,
            }));
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Saisie invalide',
                text: 'Seuls les chiffres sont autorisés pour les quantités.',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const isValidInput = () => {
        return produits.every((produit) => {
            const quantite = quantitesSaisies[produit.idProduit];
            return quantite !== undefined && quantite !== '' && /^[0-9]+$/.test(quantite);
        });
    };

    const checkEmptyFields = () => {
        return produits.some((produit) => {
            const quantite = quantitesSaisies[produit.idProduit];
            return quantite === undefined || quantite === '';
        });
    };

    const handleEnregistrer = async () => {
        if (!isValidInput()) {
            const message = checkEmptyFields()
                ? 'Veuillez remplir tous les champs avec des nombres entiers.'
                : 'Veuillez saisir uniquement des nombres entiers pour toutes les quantités.';
            Swal.fire('Erreur', message, 'error');
            return;
        }

        const lignes = produits.map((produit) => ({
            produit: { idProduit: produit.idProduit },
            qteSaisie: parseInt(quantitesSaisies[produit.idProduit], 10),
            observationProduit: '',
        }));

        try {
            await authService.faireInventaire(lignes);
            Swal.fire('Succès', 'Inventaire enregistré avec succès', 'success');
            navigate('/medical/infirmier');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de l\'enregistrement', 'error');
        }
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
                                </tr>
                            </thead>
                            <tbody>
                                {produits.map((produit) => (
                                    <tr key={produit.idProduit}>
                                        <td>{produit.nom}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={quantitesSaisies[produit.idProduit] || ''}
                                                onChange={(e) => handleQuantiteChange(produit.idProduit, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3">
                            <button
                                className="btn btn-success"
                                onClick={handleEnregistrer}
                                disabled={!isValidInput()}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaireInventaire;