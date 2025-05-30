import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const EditSeance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [mesures, setMesures] = useState([]);
  const [newMesure, setNewMesure] = useState({
    heure: '',
    ta: '',
    pouls: null,
    debitMlMn: null,
    hep: '',
    pv: null,
    ptm: null,
    conduc: null,
    ufMlH: null,
    ufTotalAffiche: null,
    observation: '',
  });
  const [patients, setPatients] = useState([]);
  const [machines, setMachines] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [seanceData, mesuresData, patientsData, machinesData, personnelData] = await Promise.all([
          authService.getSeanceById(id),
          authService.getMesuresBySeance(id),
          authService.getActivePatients(),
          authService.getAvailableMachines(),
          authService.getMedicalPersonnel(),
        ]);

        console.log('Seance Data:', seanceData);
        console.log('Personnel Data:', personnelData);
        console.log('Sample Profil:', personnelData[0]?.profils);

        // Transformation des rôles
        const personnelWithRoles = (personnelData || []).map(person => ({
          ...person,
          roles: Array.isArray(person.profils) ? person.profils.map(profil => profil.libelleProfil || '') : []
        }));

        setSeance({
          ...seanceData,
          date: seanceData.date ? new Date(seanceData.date).toISOString().slice(0, 16) : '',
          debutDialyse: seanceData.debutDialyse ? new Date(seanceData.debutDialyse).toISOString().slice(0, 16) : '',
          finDialyse: seanceData.finDialyse ? new Date(seanceData.finDialyse).toISOString().slice(0, 16) : '',
          infirmier: seanceData.infirmier || null,
          medecin: seanceData.medecin || null,
        });
        setMesures(mesuresData || []);
        setPatients(patientsData || []);
        setMachines(machinesData || []);
        setPersonnel(personnelWithRoles.filter(p => p.roles.length > 0));

        console.log('Personnel with Roles:', personnelWithRoles);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setError('Impossible de charger les données pour la modification.');
        Swal.fire('Erreur', 'Impossible de charger les données pour la modification.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeance((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (value === '') {
      setSeance((prev) => ({ ...prev, [name]: null }));
      return;
    }
    if (name === 'patient') {
      const selectedPatient = patients.find((p) => p.idPatient === parseInt(value));
      setSeance((prev) => ({ ...prev, patient: selectedPatient || null }));
    } else if (name === 'machine') {
      const selectedMachine = machines.find((m) => m.idMachine === parseInt(value));
      setSeance((prev) => ({ ...prev, machine: selectedMachine || null }));
    } else if (name === 'infirmier') {
      const selectedInfirmier = personnel.find((p) => p.userId === parseInt(value));
      setSeance((prev) => ({ ...prev, infirmier: selectedInfirmier || null }));
    } else if (name === 'medecin') {
      const selectedMedecin = personnel.find((p) => p.userId === parseInt(value));
      setSeance((prev) => ({ ...prev, medecin: selectedMedecin || null }));
    }
  };

  const handleMesureChange = (index, field, value) => {
    const updatedMesures = [...mesures];
    updatedMesures[index] = {
      ...updatedMesures[index],
      [field]: value === '' ? null : value,
    };
    if (field === 'heure' && value) {
      updatedMesures[index][field] = new Date(value).toISOString();
    }
    setMesures(updatedMesures);
  };

  const handleNewMesureChange = (e) => {
    const { name, value } = e.target;
    setNewMesure((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const addMesure = async () => {
    if (!newMesure.heure) {
      Swal.fire('Erreur', 'L’heure de la mesure est requise', 'error');
      return;
    }
    const heureISO = new Date(newMesure.heure).toISOString();
    const mesureToAdd = {
      ...newMesure,
      heure: heureISO,
      seance: { idSeance: parseInt(id) },
    };

    try {
      const savedMesure = await authService.addMesure(id, mesureToAdd);
      setMesures((prev) => [...prev, savedMesure]);
      setNewMesure({
        heure: '',
        ta: '',
        pouls: null,
        debitMlMn: null,
        hep: '',
        pv: null,
        ptm: null,
        conduc: null,
        ufMlH: null,
        ufTotalAffiche: null,
        observation: '',
      });
      Swal.fire('Succès', 'Mesure ajoutée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de l’ajout de la mesure:', error);
      Swal.fire('Erreur', 'Erreur lors de l’ajout de la mesure.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirmer la modification',
      text: 'Êtes-vous sûr de vouloir mettre à jour les informations de cette séance ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, mettre à jour',
      cancelButtonText: 'Annuler',
    });

    // Proceed only if the user confirms
    if (result.isConfirmed) {
      // Validation for date range
      if (seance.debutDialyse && seance.finDialyse) {
        const debut = new Date(seance.debutDialyse);
        const fin = new Date(seance.finDialyse);
        if (debut >= fin) {
          Swal.fire('Erreur', 'La date de début doit être antérieure à la date de fin.', 'error');
          return;
        }
      }

      // Validation for numeric fields
      const numericFields = ['caBain', 'ppid', 'ps', 'poidsEntree', 'poidsSortie', 'temperatureDebut', 'temperatureFin'];
      for (const field of numericFields) {
        if (seance[field] !== null && (isNaN(seance[field]) || seance[field] < 0)) {
          Swal.fire('Erreur', `Le champ ${field} doit être un nombre positif.`, 'error');
          return;
        }
      }

      try {
        await authService.updateSeance(id, seance);

        for (const mesure of mesures) {
          if (mesure.idDetailMesure) {
            await authService.updateMesure(mesure.idDetailMesure, {
              ...mesure,
              seance: { idSeance: parseInt(id) },
            });
          }
        }

        Swal.fire('Succès', 'Séance et mesures mises à jour avec succès', 'success');
        navigate(`/medical/seances/details/${id}`);
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        Swal.fire('Erreur', 'Erreur lors de la mise à jour de la séance ou des mesures.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Modifier une Séance</h1>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <p>Chargement...</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error || !seance) {
    return (
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Modifier une Séance</h1>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <p>{error || 'Séance non trouvée.'}</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Modifier la Séance #{seance.idSeance}</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Informations Générales</h3>
                <div className="card-tools">
                  <Link to={`/medical/seances/details/${id}`} className="btn btn-tool btn-sm">
                    <i className="fas fa-arrow-left"></i> Retour aux détails
                  </Link>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label>Patient:</label>
                    <select
                      className="form-control"
                      name="patient"
                      value={seance.patient?.idPatient || ''}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="">Sélectionner un patient</option>
                      {patients.map((patient) => (
                        <option key={patient.idPatient} value={patient.idPatient}>
                          {patient.prenom} {patient.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label>Machine:</label>
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
                          {machine.nom || `ID #${machine.idMachine}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label>Infirmier:</label>
                    <select
                      className="form-control"
                      name="infirmier"
                      value={seance.infirmier?.userId || ''}
                      onChange={handleSelectChange}
                    >
                      <option value="">Sélectionner un infirmier</option>
                      {personnel
                        .filter(p => p.roles && p.roles.includes('INFIRMIER'))
                        .map((person) => (
                          <option key={person.userId} value={person.userId}>
                            {person.prenom} {person.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label>Médecin:</label>
                    <select
                      className="form-control"
                      name="medecin"
                      value={seance.medecin?.userId || ''}
                      onChange={handleSelectChange}
                    >
                      <option value="">Sélectionner un médecin</option>
                      {personnel
                        .filter(p => p.roles && p.roles.includes('MEDECIN'))
                        .map((person) => (
                          <option key={person.userId} value={person.userId}>
                            {person.prenom} {person.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label>Date et Heure:</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="date"
                      value={seance.date || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label>Dialyseur:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="dialyseur"
                      value={seance.dialyseur || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label>Ca++ Bain (mmol/L):</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="caBain"
                      value={seance.caBain || 1.5}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label>PPID (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="ppid"
                      value={seance.ppid || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label>Poids Sec (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="ps"
                      value={seance.ps || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-outline card-info mb-4">
              <div className="card-header">
                <h4 className="card-title">Paramètres de la Séance</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <h5>Début de Dialyse</h5>
                    <div className="form-group">
                      <label>Heure Début:</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="debutDialyse"
                        value={seance.debutDialyse || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Poids à l’entrée (kg):</label>
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
                      <label>T.A Debout:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="taDebutDebout"
                        value={seance.taDebutDebout || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>T.A Couché:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="taDebutCouche"
                        value={seance.taDebutCouche || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Température (°C):</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        name="temperatureDebut"
                        value={seance.temperatureDebut || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h5>Fin de Dialyse</h5>
                    <div className="form-group">
                      <label>Heure Fin:</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="finDialyse"
                        value={seance.finDialyse || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Poids à la sortie (kg):</label>
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
                      <label>T.A Debout:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="taFinDebout"
                        value={seance.taFinDebout || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>T.A Couché:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="taFinCouche"
                        value={seance.taFinCouche || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Température (°C):</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        name="temperatureFin"
                        value={seance.temperatureFin || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h5>Résultats</h5>
                    <div className="form-group">
                      <label>Restitution:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="restitution"
                        value={seance.restitution || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Circuit/Filtre:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="circuitFiltre"
                        value={seance.circuitFiltre || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-outline card-info mb-4">
              <div className="card-header">
                <h4 className="card-title">Détails des Mesures</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Heure</th>
                        <th>T.A</th>
                        <th>Pouls</th>
                        <th>Débit (ml/min)</th>
                        <th>Héparine</th>
                        <th>Pv</th>
                        <th>PTM</th>
                        <th>Conduc</th>
                        <th>UF (ml/h)</th>
                        <th>UF Total Affiché</th>
                        <th>Observation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Ligne pour ajouter une nouvelle mesure */}
                      <tr>
                        <td>
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="heure"
                            value={newMesure.heure}
                            onChange={handleNewMesureChange}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name="ta"
                            value={newMesure.ta || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="pouls"
                            value={newMesure.pouls || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="debitMlMn"
                            value={newMesure.debitMlMn || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name="hep"
                            value={newMesure.hep || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="pv"
                            value={newMesure.pv || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="ptm"
                            value={newMesure.ptm || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="conduc"
                            value={newMesure.conduc || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="ufMlH"
                            value={newMesure.ufMlH || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="ufTotalAffiche"
                            value={newMesure.ufTotalAffiche || ''}
                            onChange={handleNewMesureChange}
                          />
                        </td>
                        <td>
                          <textarea
                            className="form-control"
                            name="observation"
                            value={newMesure.observation || ''}
                            onChange={handleNewMesureChange}
                            rows="1"
                          />
                        </td>
                      </tr>
                      {mesures.length > 0 ? (
                        mesures.map((mesure, index) => (
                          <tr key={mesure.idDetailMesure || index}>
                            <td>
                              <input
                                type="datetime-local"
                                className="form-control"
                                value={mesure.heure ? new Date(mesure.heure).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleMesureChange(index, 'heure', e.target.value)}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={mesure.ta || ''}
                                onChange={(e) => handleMesureChange(index, 'ta', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={mesure.pouls || ''}
                                onChange={(e) => handleMesureChange(index, 'pouls', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={mesure.debitMlMn || ''}
                                onChange={(e) => handleMesureChange(index, 'debitMlMn', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={mesure.hep || ''}
                                onChange={(e) => handleMesureChange(index, 'hep', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={mesure.pv || ''}
                                onChange={(e) => handleMesureChange(index, 'pv', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={mesure.ptm || ''}
                                onChange={(e) => handleMesureChange(index, 'ptm', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={mesure.conduc || ''}
                                onChange={(e) => handleMesureChange(index, 'conduc', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={mesure.ufMlH || ''}
                                onChange={(e) => handleMesureChange(index, 'ufMlH', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={mesure.ufTotalAffiche || ''}
                                onChange={(e) => handleMesureChange(index, 'ufTotalAffiche', e.target.value)}
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                value={mesure.observation || ''}
                                onChange={(e) => handleMesureChange(index, 'observation', e.target.value)}
                                rows="1"
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11">Aucune mesure enregistrée</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    className="btn btn-info mt-2"
                    onClick={addMesure}
                  >
                    Ajouter Mesure
                  </button>
                </div>
              </div>
            </div>

            <div className="card card-outline card-info mb-4">
              <div className="card-header">
                <h4 className="card-title">Traitement</h4>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label>Prescription:</label>
                  <textarea
                    className="form-control"
                    name="traitement"
                    value={seance.traitement || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <button type="submit" className="btn btn-primary mr-2" onClick={handleSubmit}>
                  <i className="fas fa-save mr-1"></i> Mettre à jour
                </button>
                <Link to={`/medical/seances/details/${id}`} className="btn btn-default">
                  <i className="fas fa-arrow-left mr-1"></i> Retour
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditSeance;