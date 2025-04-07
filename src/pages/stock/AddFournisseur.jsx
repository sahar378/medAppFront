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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.email || !formData.adresse || !formData.telephone) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
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
                    <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Adresse *</label>
                    <input type="text" className="form-control" name="adresse" value={formData.adresse} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Téléphone *</label>
                    <input type="text" className="form-control" name="telephone" value={formData.telephone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Fax</label>
                    <input type="text" className="form-control" name="fax" value={formData.fax} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Matricule Fiscale</label>
                    <input type="text" className="form-control" name="matriculeFiscale" value={formData.matriculeFiscale} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>RIB</label>
                    <input type="text" className="form-control" name="rib" value={formData.rib} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>RC</label>
                    <input type="text" className="form-control" name="rc" value={formData.rc} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Code TVA</label>
                    <input type="text" className="form-control" name="codeTva" value={formData.codeTva} onChange={handleChange} />
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