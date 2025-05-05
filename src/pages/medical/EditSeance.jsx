//modification de la séance
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const EditSeance = () => {
  const { id } = useParams();
  const [seance, setSeance] = useState({
    patient: null,
    machine: null,
    infirmier: null,
    medecin: null,
    date: '',
    observation: '',
    dialyseur: '',
    caBain: 1.5,
    ppid: null,
    ps: null,
    debutDialyse: '',
    finDialyse: '',
    poidsEntree: null,
    poidsSortie: null,
    restitution: '',
    circuitFiltre: '',
    taDebutDebout: '',
    taDebutCouche: '',
    temperatureDebut: null,
    taFinDebout: '',
    taFinCouche: '',
    temperatureFin: null,
    traitement: '',
  });
  const [patients, setPatients] = useState([]);
  const [machines, setMachines] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seanceData = await authService.getSeanceById(id);
        setSeance({
          ...seanceData,
          date: seanceData.date ? new Date(seanceData.date).toISOString().slice(0, 16) : '',
          debutDialyse: seanceData.debutDialyse ? new Date(seanceData.debutDialyse).toISOString().slice(0, 16) : '',
          finDialyse: seanceData.finDialyse ? new Date(seanceData.finDialyse).toISOString().slice(0, 16) : '',
        });
        const patientsData = await authService.getActivePatients();
        const machinesData = await authService.getAvailableMachines();
        const personnelData = await authService.getMedicalPersonnel();
        setPatients(patientsData);
        setMachines(machinesData);
        setPersonnel(personnelData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeance({ ...seance, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === 'patient') {
      const selectedPatient = patients.find((p) => p.id === parseInt(value));
      setSeance({ ...seance, patient: selectedPatient });
    } else if (name === 'machine') {
      const selectedMachine = machines.find((m) => m.idMachine === parseInt(value));
      setSeance({ ...seance, machine: selectedMachine });
    } else if (name === 'infirmier') {
      const selectedInfirmier = personnel.find((p) => p.id === parseInt(value));
      setSeance({ ...seance, infirmier: selectedInfirmier });
    } else if (name === 'medecin') {
      const selectedMedecin = personnel.find((p) => p.id === parseInt(value));
      setSeance({ ...seance, medecin: selectedMedecin });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.updateSeance(id, seance);
      Swal.fire('Succès', 'Séance mise à jour avec succès', 'success');
      navigate('/medical/seances');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la séance', error);
      Swal.fire('Erreur', 'Erreur lors de la mise à jour de la séance', 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Modifier une Séance</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Modifier la Séance</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Patient</label>
                    <select
                      className="form-control"
                      name="patient"
                      value={seance.patient?.id || ''}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="">Sélectionner un patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.prenom} {patient.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Machine</label>
                    <select
                      className="form-control"
                      name="machine"
                      value={seance.machine?.idMachine || ''}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="">Sélectionner une machine</option>
                      {machines.map((machine) => (
                        <option key={machine.idMachine} value={machine.idMachine}>
                          {machine.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Infirmier</label>
                    <select
                      className="form-control"
                      name="infirmier"
                      value={seance.infirmier?.id || ''}
                      onChange={handleSelectChange}
                    >
                      <option value="">Sélectionner un infirmier</option>
                      {personnel
                        .filter((p) => p.roles.includes('INFIRMIER'))
                        .map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.prenom} {person.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Médecin</label>
                    <select
                      className="form-control"
                      name="medecin"
                      value={seance.medecin?.id || ''}
                      onChange={handleSelectChange}
                    >
                      <option value="">Sélectionner un médecin</option>
                      {personnel
                        .filter((p) => p.roles.includes('MEDECIN'))
                        .map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.prenom} {person.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date et Heure</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="date"
                      value={seance.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Observation</label>
                    <textarea
                      className="form-control"
                      name="observation"
                      value={seance.observation || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dialyseur</label>
                    <input
                      type="text"
                      className="form-control"
                      name="dialyseur"
                      value={seance.dialyseur || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Concentration Bain (Ca)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="caBain"
                      value={seance.caBain || 1.5}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Prise de Poids Interdialytique (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="ppid"
                      value={seance.ppid || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Poids Sec (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="ps"
                      value={seance.ps || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Début Dialyse</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="debutDialyse"
                      value={seance.debutDialyse}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fin Dialyse</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="finDialyse"
                      value={seance.finDialyse}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Poids Entrée (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="poidsEntree"
                      value={seance.poidsEntree || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Poids Sortie (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="poidsSortie"
                      value={seance.poidsSortie || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Restitution</label>
                    <input
                      type="text"
                      className="form-control"
                      name="restitution"
                      value={seance.restitution || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Circuit/Filtre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="circuitFiltre"
                      value={seance.circuitFiltre || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>TA Début Debout</label>
                    <input
                      type="text"
                      className="form-control"
                      name="taDebutDebout"
                      value={seance.taDebutDebout || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>TA Début Couché</label>
                    <input
                      type="text"
                      className="form-control"
                      name="taDebutCouche"
                      value={seance.taDebutCouche || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Température Début (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="temperatureDebut"
                      value={seance.temperatureDebut || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>TA Fin Debout</label>
                    <input
                      type="text"
                      className="form-control"
                      name="taFinDebout"
                      value={seance.taFinDebout || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>TA Fin Couché</label>
                    <input
                      type="text"
                      className="form-control"
                      name="taFinCouche"
                      value={seance.taFinCouche || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Température Fin (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="temperatureFin"
                      value={seance.temperatureFin || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Traitement</label>
                    <textarea
                      className="form-control"
                      name="traitement"
                      value={seance.traitement || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Mettre à jour</button>
                  <Link to="/medical/seances" className="btn btn-secondary ml-2">
                    Annuler
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditSeance;