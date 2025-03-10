// src/pages/intendant/AddAgent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AddAgent = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    numeroTelephone: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.addAgent(formData);
      Swal.fire('Succès', `Agent ajouté avec matricule ${response.userId}`, 'success');
      navigate('/intendant/habilitation'); // Redirection vers la liste des produits
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de l’ajout de l’agent', 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Ajouter un agent</h1>
          </div>
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
                    <label>Prénom :</label>
                    <input type="text" className="form-control" name="prenom" value={formData.prenom} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email :</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Date de naissance :</label>
                    <input type="date" className="form-control" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Numéro de téléphone :</label>
                    <input type="text" className="form-control" name="numeroTelephone" value={formData.numeroTelephone} onChange={handleInputChange} required />
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

export default AddAgent;