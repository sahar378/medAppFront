// src/pages/medical/AjoutTechnicien.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AjoutTechnicien = () => {
  const [formData, setFormData] = useState({ nom: '', telephone: '', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom) {
      Swal.fire('Erreur', 'Le nom est obligatoire', 'error');
      return;
    }
    try {
      await authService.addTechnicien(formData);
      Swal.fire('Succès', 'Technicien ajouté', 'success');
      setFormData({ nom: '', telephone: '', email: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Ajouter un Technicien</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom :</label>
                    <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Téléphone (optionnel) :</label>
                    <input type="text" className="form-control" name="telephone" value={formData.telephone} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Email (optionnel) :</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <button type="submit" className="btn btn-primary">Ajouter</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AjoutTechnicien;