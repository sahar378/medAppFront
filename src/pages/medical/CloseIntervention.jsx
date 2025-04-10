// src/pages/medical/CloseIntervention.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const CloseIntervention = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    reparation: '',
    dateReparation: '',
    lieuReparation: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reparation || !formData.dateReparation) {
      Swal.fire('Erreur', 'La réparation et la date de réparation sont obligatoires', 'error');
      return;
    }
    try {
      await authService.closeIntervention(
        id,
        formData.reparation,
        formData.dateReparation,
        formData.lieuReparation
      );
      Swal.fire('Succès', 'Intervention fermée avec succès', 'success');
      navigate('/medical/reclamations');
    } catch (error) {
      console.error(error);
      Swal.fire('Erreur', 'Erreur lors de la fermeture', 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Fermer l’Intervention #{id}</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Réparation :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="reparation"
                      value={formData.reparation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date Réparation :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateReparation"
                      value={formData.dateReparation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Lieu Réparation (optionnel) :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lieuReparation"
                      value={formData.lieuReparation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Fermer l’intervention</button>
                  <button type="button" className="btn btn-secondary ml-2" onClick={() => navigate('/medical/reclamations')}>
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

export default CloseIntervention;