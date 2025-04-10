// src/pages/super-admin/IntendantManagement.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const IntendantManagement = () => {
    const [intendants, setIntendants] = useState([]);
    const [newIntendant, setNewIntendant] = useState({
        nom: '', prenom: '', email: '', dateNaissance: '', numeroTelephone: ''
    });
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        fetchIntendants();
    }, []);

    const fetchIntendants = async () => {
        try {
            const response = await authService.getIntendants();
            setIntendants(response);
        } catch (error) {
            Swal.fire('Erreur', 'Impossible de charger les intendants', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'numeroTelephone') {
            const numericValue = value.replace(/[^0-9]/g, '').slice(0, 8);
            setNewIntendant(prev => ({ ...prev, [name]: numericValue }));
            if (numericValue.length !== 8) {
                setPhoneError('Le numéro de téléphone doit contenir exactement 8 chiffres.');
            } else {
                setPhoneError('');
            }
        } else if (name === 'email') {
            setNewIntendant(prev => ({ ...prev, [name]: value }));
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError('Veuillez entrer une adresse email valide.');
            } else {
                setEmailError('');
            }
        } else {
            setNewIntendant(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateIntendant = async (e) => {
        e.preventDefault();
        if (newIntendant.numeroTelephone.length !== 8) {
            Swal.fire('Erreur', 'Le numéro de téléphone doit contenir exactement 8 chiffres.', 'error');
            return;
        }
        if (emailError) {
            Swal.fire('Erreur', 'L’adresse email n’est pas valide.', 'error');
            return;
        }
        try {
            const response = await authService.createIntendant(newIntendant);
            Swal.fire('Succès', `Intendant créé avec matricule ${response.userId}. Attribuez un mot de passe temporaire via "Réinitialiser MDP".`, 'success');
            setNewIntendant({ nom: '', prenom: '', email: '', dateNaissance: '', numeroTelephone: '' });
            setPhoneError('');
            setEmailError('');
            fetchIntendants();
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de la création', 'error');
        }
    };

    const handleResetPassword = async (userId) => {
        const { value: tempPassword } = await Swal.fire({
            title: 'Nouveau mot de passe temporaire',
            input: 'text',
            inputPlaceholder: 'Entrez un mot de passe temporaire',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Vous devez entrer un mot de passe !';
                }
            }
        });
        if (tempPassword) {
            try {
                await authService.resetIntendantPassword(userId, tempPassword);
                Swal.fire('Succès', 'Mot de passe temporaire attribué. Un email avec les identifiants a été envoyé.', 'success');
            } catch (error) {
                Swal.fire('Erreur', "Erreur lors de l'attribution du mot de passe", 'error');
            }
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            await authService.toggleIntendantStatus(userId);
            Swal.fire('Succès', currentStatus 
                ? 'Compte désactivé. Un email a été envoyé.' 
                : 'Compte activé. Un email a été envoyé.', 
                'success');
            fetchIntendants();
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de la modification du statut', 'error');
        }
    };

    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper">
                <div className="content-header">
                    <h1 className="m-0">Gestion des intendants</h1>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="card mb-3">
                            <div className="card-header">Créer un nouvel intendant</div>
                            <div className="card-body">
                                <form onSubmit={handleCreateIntendant}>
                                    <div className="row">
                                        <div className="col-md-4 form-group">
                                            <input type="text" className="form-control" name="nom" placeholder="Nom" value={newIntendant.nom} onChange={handleInputChange} required />
                                        </div>
                                        <div className="col-md-4 form-group">
                                            <input type="text" className="form-control" name="prenom" placeholder="Prénom" value={newIntendant.prenom} onChange={handleInputChange} required />
                                        </div>
                                        <div className="col-md-4 form-group">
                                            <input type="email" className={`form-control ${emailError ? 'is-invalid' : ''}`} name="email" placeholder="Email" value={newIntendant.email} onChange={handleInputChange} required />
                                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <input type="date" className="form-control" name="dateNaissance" value={newIntendant.dateNaissance} onChange={handleInputChange} required />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <input type="text" className={`form-control ${phoneError ? 'is-invalid' : ''}`} name="numeroTelephone" placeholder="Numéro de téléphone (8 chiffres)" value={newIntendant.numeroTelephone} onChange={handleInputChange} required />
                                            {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={phoneError !== '' || emailError !== '' || !newIntendant.email}>
                                        Créer
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">Liste des intendants</div>
                            <div className="card-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Matricule</th>
                                            <th>Nom</th>
                                            <th>Prénom</th>
                                            <th>Email</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {intendants.map(intendant => (
                                            <tr key={intendant.userId}>
                                                <td>{intendant.userId}</td>
                                                <td>{intendant.nom}</td>
                                                <td>{intendant.prenom}</td>
                                                <td>{intendant.email}</td>
                                                <td>{intendant.statut ? 'Actif' : 'Inactif'}</td>
                                                <td>
                                                    <button className="btn btn-warning btn-sm mr-2" onClick={() => handleResetPassword(intendant.userId)}>
                                                        Réinitialiser MDP
                                                    </button>
                                                    <button className={`btn btn-sm ${intendant.statut ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggleStatus(intendant.userId, intendant.statut)}>
                                                        {intendant.statut ? 'Désactiver' : 'Activer'}
                                                    </button>
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

export default IntendantManagement;