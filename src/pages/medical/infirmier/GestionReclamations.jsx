// src/pages/medical/infirmier/GestionReclamations.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const GestionReclamations = () => {
  const [machines, setMachines] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [formData, setFormData] = useState({
    idMachine: '',
    idTechnicien: '',
    date: '',
    nature: '0', // Par défaut : préventif
    datePanne: '',
    panne: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const machinesData = await authService.getMachinesByArchiveStatus('/machines/non-archived');
        setMachines(machinesData);
        const techniciensData = await authService.getTechniciensByArchiveStatus('/techniciens/non-archived');
        setTechniciens(techniciensData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idMachine || !formData.idTechnicien || !formData.date) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    if (formData.nature === '1' && (!formData.panne || !formData.datePanne)) {
      Swal.fire('Erreur', 'Les champs panne et date de la panne sont obligatoires pour une réparation', 'error');
      return;
    }

    const interventionData = {
      machine: { idMachine: parseInt(formData.idMachine) },
      technicien: { idTechnicien: parseInt(formData.idTechnicien) },
      date: formData.date,
      nature: parseInt(formData.nature),
      ...(formData.nature === '1' && {
        datePanne: formData.datePanne,
        panne: formData.panne,
      }),
    };

    try {
      await authService.createIntervention(interventionData);
      Swal.fire('Succès', 'Intervention créée avec succès', 'success');
      setFormData({ idMachine: '', idTechnicien: '', date: '', nature: '0', datePanne: '', panne: '' });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Créer une Nouvelle Intervention</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Signaler une intervention</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Machine :</label>
                    <select
                      className="form-control"
                      name="idMachine"
                      value={formData.idMachine}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez une machine</option>
                      {machines.map((machine) => (
                        <option
                          key={machine.idMachine}
                          value={machine.idMachine}
                          style={{ color: machine.disponibilite === 1 ? 'red' : 'black' }}
                        >
                          Machine #{machine.idMachine} - {machine.disponibilite === 0 ? 'Disponible' : 'En intervention'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Technicien :</label>
                    <select
                      className="form-control"
                      name="idTechnicien"
                      value={formData.idTechnicien}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez un technicien</option>
                      {techniciens.map((technicien) => (
                        <option key={technicien.idTechnicien} value={technicien.idTechnicien}>
                          {technicien.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nature :</label>
                    <select
                      className="form-control"
                      name="nature"
                      value={formData.nature}
                      onChange={handleInputChange}
                    >
                      <option value="0">Préventif</option>
                      <option value="1">Réparation</option>
                    </select>
                  </div>
                  {formData.nature === '1' && (
                    <>
                      <div className="form-group">
                        <label>Date de la panne :</label>
                        <input
                          type="date"
                          className="form-control"
                          name="datePanne"
                          value={formData.datePanne}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description de la panne :</label>
                        <textarea
                          className="form-control"
                          name="panne"
                          value={formData.panne}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  )}
                  <button type="submit" className="btn btn-primary">
                    Créer l’intervention
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

export default GestionReclamations;