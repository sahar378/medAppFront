// src/pages/medical/infirmier/EditIntervention.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const EditIntervention = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    machineId: '',
    technicienId: '',
    date: '',
    nature: 0,
    datePanne: '',
    panne: '',
    reparation: '',
    dateReparation: '',
    lieuReparation: '',
    estFermee: false,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIntervention = async () => {
      try {
        const data = await authService.getInterventionById(id);
        setFormData({
          machineId: data.machine.idMachine,
          technicienId: data.technicien.idTechnicien,
          date: new Date(data.date).toISOString().split('T')[0],
          nature: data.nature,
          datePanne: data.datePanne ? new Date(data.datePanne).toISOString().split('T')[0] : '',
          panne: data.panne || '',
          reparation: data.reparation || '',
          dateReparation: data.dateReparation ? new Date(data.dateReparation).toISOString().split('T')[0] : '',
          lieuReparation: data.lieuReparation || '',
          estFermee: data.estFermee,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire('Erreur', 'Impossible de charger l’intervention', 'error');
      }
    };
    fetchIntervention();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.updateIntervention(id, formData);
      Swal.fire('Succès', 'Intervention mise à jour', 'success');
      navigate('/medical/infirmier/interventions/list');
    } catch (error) {
      console.error(error);
      Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Modifier l’Intervention #{id}</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>ID Machine :</label>
                    <input type="number" className="form-control" name="machineId" value={formData.machineId} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>ID Technicien :</label>
                    <input type="number" className="form-control" name="technicienId" value={formData.technicienId} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Date :</label>
                    <input type="date" className="form-control" name="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Nature :</label>
                    <select className="form-control" name="nature" value={formData.nature} onChange={handleInputChange}>
                      <option value={0}>Préventif</option>
                      <option value={1}>Réparation</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date Panne :</label>
                    <input type="date" className="form-control" name="datePanne" value={formData.datePanne} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Panne :</label>
                    <input type="text" className="form-control" name="panne" value={formData.panne} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Réparation :</label>
                    <input type="text" className="form-control" name="reparation" value={formData.reparation} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Date Réparation :</label>
                    <input type="date" className="form-control" name="dateReparation" value={formData.dateReparation} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Lieu Réparation :</label>
                    <input type="text" className="form-control" name="lieuReparation" value={formData.lieuReparation} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Statut :</label>
                    <input type="checkbox" name="estFermee" checked={formData.estFermee} onChange={handleInputChange} /> Fermée
                  </div>
                  <button type="submit" className="btn btn-primary">Mettre à jour</button>
                  <button type="button" className="btn btn-secondary ml-2" onClick={() => navigate('/medical/infirmier/interventions/list')}>
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

export default EditIntervention;