// src/pages/stock/FournisseurDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const FournisseurDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fournisseur, setFournisseur] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: '', email: '', adresse: '', telephone: '', fax: '',
        matriculeFiscale: '', rib: '', rc: '', codeTva: ''
    });

    useEffect(() => {
        const fetchFournisseur = async () => {
            try {
                const data = await authService.getFournisseurById(id);
                setFournisseur(data);
                setFormData({
                    nom: data.nom || '',
                    email: data.email || '',
                    adresse: data.adresse || '',
                    telephone: data.telephone || '',
                    fax: data.fax || '',
                    matriculeFiscale: data.matriculeFiscale || '',
                    rib: data.rib || '',
                    rc: data.rc || '',
                    codeTva: data.codeTva || ''
                });
            } catch (error) {
                Swal.fire('Erreur', 'Fournisseur introuvable', 'error');
                navigate('/stock/fournisseurs');
            }
        };
        fetchFournisseur();
    }, [id, navigate]);

    const handleUpdate = async () => {
        if (!formData.nom || !formData.email || !formData.adresse || !formData.telephone) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        try {
            await authService.updateFournisseur(id, formData);
            setFournisseur({ ...fournisseur, ...formData });
            setIsEditing(false);
            Swal.fire('Succès', 'Fournisseur mis à jour', 'success');
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
        }
    };

    const handleChangerStatut = async (nouveauStatut) => {
        let causeSuppression = null;
        if (nouveauStatut === 2) {
            const { value: cause } = await Swal.fire({
                title: 'Cause de suppression',
                input: 'text',
                inputLabel: 'Veuillez indiquer la raison de la suppression',
                inputPlaceholder: 'Ex. Non fiable',
                showCancelButton: true,
                confirmButtonText: 'Confirmer',
                cancelButtonText: 'Annuler',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Vous devez entrer une cause !';
                    }
                }
            });
            if (!cause) return;
            causeSuppression = cause;
        }

        try {
            await authService.changerStatutFournisseur(id, nouveauStatut, causeSuppression);
            setFournisseur({ ...fournisseur, statut: nouveauStatut, causeSuppression });
            Swal.fire('Succès', `Statut modifié avec succès`, 'success');
            navigate('/stock/fournisseurs');
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors du changement de statut', 'error');
        }
    };

    const handleDissocierProduit = async (produitId, produitNom) => {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment dissocier le produit "${produitNom}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, dissocier',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const updatedFournisseur = await authService.dissocierProduitFournisseur(id, produitId);
                    setFournisseur(updatedFournisseur);
                    Swal.fire('Succès', 'Produit dissocié avec succès', 'success');
                } catch (error) {
                    Swal.fire('Erreur', 'Erreur lors de la dissociation', 'error');
                }
            }
        });
    };

    if (!fournisseur) return <div>Chargement...</div>;

    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper">
                <div className="content-header">
                    <h1 className="m-0">Détails du Fournisseur #{id}</h1>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-body">
                                {isEditing ? (
                                    <>
                                        <div className="form-group">
                                            <label>Nom :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email :</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Adresse :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.adresse}
                                                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Téléphone :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.telephone}
                                                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Fax (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.fax}
                                                onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Matricule Fiscale (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.matriculeFiscale}
                                                onChange={(e) => setFormData({ ...formData, matriculeFiscale: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>RIB (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.rib}
                                                onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>RC (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.rc}
                                                onChange={(e) => setFormData({ ...formData, rc: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Code TVA (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.codeTva}
                                                onChange={(e) => setFormData({ ...formData, codeTva: e.target.value })}
                                            />
                                        </div>
                                        <button className="btn btn-success mr-2" onClick={handleUpdate}>
                                            Sauvegarder
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Nom :</strong> {fournisseur.nom}</p>
                                        <p><strong>Email :</strong> {fournisseur.email}</p>
                                        <p><strong>Adresse :</strong> {fournisseur.adresse}</p>
                                        <p><strong>Téléphone :</strong> {fournisseur.telephone}</p>
                                        <p><strong>Fax :</strong> {fournisseur.fax || '-'}</p>
                                        <p><strong>Matricule Fiscale :</strong> {fournisseur.matriculeFiscale || '-'}</p>
                                        <p><strong>RIB :</strong> {fournisseur.rib || '-'}</p>
                                        <p><strong>RC :</strong> {fournisseur.rc || '-'}</p>
                                        <p><strong>Code TVA :</strong> {fournisseur.codeTva || '-'}</p>
                                        <p><strong>Statut :</strong> 
                                            {fournisseur.statut === 0 ? 'Actif' : 
                                             fournisseur.statut === 1 ? 'Inactif' : 
                                             `Supprimé (Cause: ${fournisseur.causeSuppression || '-'})`}
                                        </p>
                                        <p><strong>Produits associés :</strong></p>
                                        {fournisseur.produits && fournisseur.produits.length > 0 ? (
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Nom du produit</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {fournisseur.produits.map(p => (
                                                        <tr key={p.idProduit}>
                                                            <td>{p.nom}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleDissocierProduit(p.idProduit, p.nom)}
                                                                >
                                                                    Dissocier
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>Aucun produit associé</p>
                                        )}
                                        {fournisseur.statut !== 2 && (
                                            <>
                                                <button className="btn btn-warning mr-2" onClick={() => setIsEditing(true)}>
                                                    Modifier
                                                </button>
                                                {fournisseur.statut === 0 && (
                                                    <button
                                                        className="btn btn-secondary mr-2"
                                                        onClick={() => handleChangerStatut(1)}
                                                    >
                                                        Rendre Inactif
                                                    </button>
                                                )}
                                                {fournisseur.statut === 1 && (
                                                    <button
                                                        className="btn btn-success mr-2"
                                                        onClick={() => handleChangerStatut(0)}
                                                    >
                                                        Rendre Actif
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-danger mr-2"
                                                    onClick={() => handleChangerStatut(2)}
                                                >
                                                    Supprimer
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                                <button
                                    className="btn btn-secondary mt-2"
                                    onClick={() => navigate('/stock/fournisseurs')}
                                >
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

export default FournisseurDetails;