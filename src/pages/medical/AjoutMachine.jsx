// src/pages/medical/AjoutMachine.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AjoutMachine = () => {
  const [formData, setFormData] = useState({
    dateMiseEnService: '',
    type: '',
    constructeur: '',
    fournisseur: '',
    caracteristique: '',
    voltage: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dateMiseEnService) {
      Swal.fire('Erreur', 'La date de mise en service est obligatoire', 'error');
      return;
    }
    try {
      await authService.addMachine(formData);
      Swal.fire('Succès', 'Machine ajoutée', 'success');
      setFormData({ dateMiseEnService: '', type: '', constructeur: '', fournisseur: '', caracteristique: '', voltage: '' });
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
          <h1 className="m-0">Ajouter une Machine</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Date Mise en Service :</label>
                    <input type="date" className="form-control" name="dateMiseEnService" value={formData.dateMiseEnService} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Type (optionnel) :</label>
                    <input type="text" className="form-control" name="type" value={formData.type} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Constructeur (optionnel) :</label>
                    <input type="text" className="form-control" name="constructeur" value={formData.constructeur} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Fournisseur (optionnel) :</label>
                    <input type="text" className="form-control" name="fournisseur" value={formData.fournisseur} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Caractéristiques (optionnel) :</label>
                    <textarea className="form-control" name="caracteristique" value={formData.caracteristique} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Voltage (optionnel) :</label>
                    <input type="text" className="form-control" name="voltage" value={formData.voltage} onChange={handleInputChange} />
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

export default AjoutMachine;