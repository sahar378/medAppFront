// src/pages/intendant/CreerNotification.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreerNotification = () => {
    const [formData, setFormData] = useState({ message: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.creerNotification({ message: formData.message });
            Swal.fire('Succès', 'Notification envoyée avec succès', 'success');
            navigate('/intendant');
        } catch (error) {
            console.error('Erreur lors de la création de la notification', error);
        }
    };

    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper">
                <div className="content-header">
                    <h1 className="m-0">Créer une Notification</h1>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea
                                            className="form-control"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ex: Produit X indisponible chez Fournisseur Y, acheter chez Z plus cher."
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Envoyer
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CreerNotification;