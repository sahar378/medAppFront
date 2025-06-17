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
        nom: '', prenom: '', email: '', adresse: '', telephone: '', fax: '',
        matriculeFiscale: '', rib: '', rc: '', codeTva: ''
    });
    const [errors, setErrors] = useState({ 
        nom: '', prenom: '', email: '', telephone: '' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchFournisseur = async () => {
            try {
                const data = await authService.getFournisseurById(id);
                setFournisseur(data);
                setFormData({
                    nom: data.nom || '',
                    prenom: data.prenom || '',
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

    const validateField = (name, value) => {
        let error = '';
        if (name === 'nom' || name === 'prenom') {
            const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
            if (value !== '' && !nameRegex.test(value)) {
                error = `Le ${name === 'nom' ? 'nom' : 'prénom'} ne doit contenir que des lettres, espaces, tirets ou apostrophes`;
            }
        } else if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value !== '' && !emailRegex.test(value)) {
                error = 'Veuillez entrer un email valide (ex: exemple@domaine.com)';
            }
        } else if (name === 'telephone') {
            if (!/^\d{0,8}$/.test(value)) {
                error = 'Le numéro doit contenir uniquement des chiffres';
            } else if (value.length > 0 && value.length < 8) {
                error = 'Le numéro doit contenir exactement 8 chiffres';
            }
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Validation en temps réel
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const handleUpdate = async () => {
        setIsSubmitting(true);
        
        // Vérification des champs obligatoires
        if (!formData.nom || !formData.prenom || !formData.email || !formData.adresse || !formData.telephone) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
            setIsSubmitting(false);
            return;
        }

        // Validation finale avant soumission
        let hasErrors = false;
        const newErrors = { ...errors };

        const fieldsToValidate = ['nom', 'prenom', 'email', 'telephone'];
        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field]);
            newErrors[field] = error;
            if (error) hasErrors = true;
        });

        setErrors(newErrors);

        if (hasErrors) {
            Swal.fire('Erreur', 'Veuillez corriger les erreurs dans le formulaire', 'error');
            setIsSubmitting(false);
            return;
        }

        try {
            await authService.updateFournisseur(id, formData);
            setFournisseur({ ...fournisseur, ...formData });
            setIsEditing(false);
            Swal.fire('Succès', 'Fournisseur mis à jour', 'success');
        } catch (error) {
            let errorMessage = 'Erreur lors de la mise à jour';
            if (error.response) {
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
            }

            if (errorMessage.includes('existe déjà')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email existant',
                    text: 'Un fournisseur avec cet email existe déjà dans le système',
                });
            } else {
                Swal.fire('Erreur', errorMessage, 'error');
            }
        } finally {
            setIsSubmitting(false);
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
                                            <label>Nom *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                                                name="nom"
                                                value={formData.nom}
                                                onChange={handleChange}
                                            />
                                            {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Prénom *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                                                name="prenom"
                                                value={formData.prenom}
                                                onChange={handleChange}
                                            />
                                            {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Email *</label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Adresse *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="adresse"
                                                value={formData.adresse}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Téléphone *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                                                name="telephone"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                                maxLength={8}
                                            />
                                            {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Fax (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="fax"
                                                value={formData.fax}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Matricule Fiscale (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="matriculeFiscale"
                                                value={formData.matriculeFiscale}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>RIB (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="rib"
                                                value={formData.rib}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>RC (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="rc"
                                                value={formData.rc}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Code TVA (optionnel) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="codeTva"
                                                value={formData.codeTva}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button 
                                            className="btn btn-success mr-2" 
                                            onClick={handleUpdate}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="sr-only">Mise à jour...</span>
                                                </>
                                            ) : 'Sauvegarder'}
                                        </button>
                                        <button 
                                            className="btn btn-secondary" 
                                            onClick={() => setIsEditing(false)}
                                            disabled={isSubmitting}
                                        >
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Nom :</strong> {fournisseur.nom}</p>
                                        <p><strong>Prénom :</strong> {fournisseur.prenom}</p>
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