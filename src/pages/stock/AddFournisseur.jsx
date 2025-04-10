// src/pages/stock/AddFournisseur.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AddFournisseur = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    adresse: '',
    telephone: '',
    fax: '',
    matriculeFiscale: '',
    rib: '',
    rc: '',
    codeTva: ''
  });
  const [errors, setErrors] = useState({ email: '', telephone: '' }); // État pour les messages d'erreur

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation spécifique pour chaque champ
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simple pour email
      if (!emailRegex.test(value) && value !== '') {
        setErrors(prev => ({ ...prev, email: 'Veuillez entrer un email valide (ex: exemple@domaine.com)' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }

    if (name === 'telephone') {
      const phoneRegex = /^\d{0,8}$/; // Accepte jusqu'à 8 chiffres
      if (!phoneRegex.test(value)) {
        setErrors(prev => ({ ...prev, telephone: 'Le numéro doit contenir uniquement des chiffres (8 maximum)' }));
      } else if (value.length > 0 && value.length < 8) {
        setErrors(prev => ({ ...prev, telephone: 'Le numéro doit contenir exactement 8 chiffres' }));
      } else if (value.length === 8) {
        setErrors(prev => ({ ...prev, telephone: '' }));
      } else {
        setErrors(prev => ({ ...prev, telephone: '' }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (!formData.nom || !formData.email || !formData.adresse || !formData.telephone) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    // Validation finale avant soumission
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire('Erreur', 'L\'email n\'est pas valide', 'error');
      return;
    }

    if (!/^\d{8}$/.test(formData.telephone)) {
      Swal.fire('Erreur', 'Le numéro de téléphone doit contenir exactement 8 chiffres', 'error');
      return;
    }

    try {
      const response = await authService.createFournisseur(formData);
      if (response.exists) {
        const statutText = response.fournisseur.statut === 0 ? 'actif' :
                          response.fournisseur.statut === 1 ? 'inactif' : 'supprimé';
        Swal.fire({
          title: 'Information',
          text: `Le fournisseur "${response.fournisseur.nom}" existe déjà dans le système avec le statut "${statutText}".`,
          icon: 'info',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire('Succès', 'Fournisseur ajouté avec succès', 'success');
        navigate('/stock/fournisseurs');
      }
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de l’ajout du fournisseur', 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Ajouter un Fournisseur</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
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
                      required
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
                      required
                    />
                    {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                  </div>
                  <div className="form-group">
                    <label>Fax</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fax"
                      value={formData.fax}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Matricule Fiscale</label>
                    <input
                      type="text"
                      className="form-control"
                      name="matriculeFiscale"
                      value={formData.matriculeFiscale}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>RIB</label>
                    <input
                      type="text"
                      className="form-control"
                      name="rib"
                      value={formData.rib}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>RC</label>
                    <input
                      type="text"
                      className="form-control"
                      name="rc"
                      value={formData.rc}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Code TVA</label>
                    <input
                      type="text"
                      className="form-control"
                      name="codeTva"
                      value={formData.codeTva}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mr-2">Ajouter</button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/stock/fournisseurs')}>
                    Annuler
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

export default AddFournisseur;