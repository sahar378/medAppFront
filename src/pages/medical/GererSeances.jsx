import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

// Custom debounce hook
const useDebounce = (callback, delay) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
        callback(...args);
      }, delay);
      setTimeoutId(id);
    },
    [callback, delay, timeoutId]
  );

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
};

const GererSeances = () => {
  const [seances, setSeances] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(true);
  const { activeRole } = useAuth();

  // Fetch patients for autocomplete
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let patientsData;
        if (activeRole === 'INTENDANT') {
          patientsData = await authService.getAllPatients();
        } else {
          patientsData = await authService.getActivePatients();
        }
        const validPatients = Array.isArray(patientsData)
          ? patientsData.filter((patient) => patient && patient.idPatient)
          : [];
        setPatients(validPatients);
        if (validPatients.length === 0) {
          Swal.fire('Information', 'Aucun patient trouvé.', 'info');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des patients:', error);
        Swal.fire(
          'Erreur',
          'Impossible de charger les patients: ' + (error.message || 'Erreur inconnue'),
          'error'
        );
      }
    };
    fetchPatients();
  }, [activeRole]);

  // Fetch sessions based on filters
  useEffect(() => {
    if (!triggerFetch) return;

    const fetchSeances = async () => {
      setLoading(true);
      try {
        let seancesData;
        const patientId = selectedPatient.length > 0 ? selectedPatient[0].idPatient : null;
        const startDate = dateRange.startDate || null;
        const endDate = dateRange.endDate || null;

        console.log('Fetching sessions with params:', { patientId, startDate, endDate });

        if (startDate && endDate) {
          seancesData = await authService.getSeancesByDateRange(patientId, startDate, endDate);
        } else if (patientId && !startDate && !endDate) {
          seancesData = await authService.getSeancesByPatient(patientId, null, null);
        } else if (!patientId && !startDate && !endDate) {
          seancesData = await authService.getSeancesByPatient(null, null, null);
        } else {
          Swal.fire('Erreur', 'Veuillez fournir une plage de dates complète ou un patient', 'error');
          setLoading(false);
          setTriggerFetch(false);
          return;
        }

        if (!startDate && !endDate) {
          seancesData.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        setSeances(seancesData || []);
        if (seancesData.length === 0) {
          Swal.fire('Information', 'Aucune séance trouvée pour les critères sélectionnés.', 'info');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des séances:', error);
        Swal.fire(
          'Erreur',
          'Impossible de charger les séances: ' + (error.message || 'Erreur inconnue'),
          'error'
        );
      } finally {
        setLoading(false);
        setTriggerFetch(false);
      }
    };

    fetchSeances();
  }, [triggerFetch, selectedPatient, dateRange]);

  // Patient search logic
  const searchPatients = useCallback(
    async (query) => {
      if (query.length < 2) {
        try {
          let patientsData;
          if (activeRole === 'INTENDANT') {
            patientsData = await authService.getAllPatients();
          } else {
            patientsData = await authService.getActivePatients();
          }
          const validPatients = Array.isArray(patientsData)
            ? patientsData.filter((patient) => patient && patient.idPatient)
            : [];
          setPatients(validPatients);
        } catch (error) {
          console.error('Erreur lors de la récupération des patients:', error);
          Swal.fire('Erreur', 'Impossible de charger les patients', 'error');
        }
        return;
      }
      try {
        let response;
        if (activeRole === 'INTENDANT') {
          response = await authService.getAllPatients();
          response = response.filter((patient) =>
            `${patient.prenom} ${patient.nom}`.toLowerCase().includes(query.toLowerCase())
          );
        } else {
          response = await authService.searchActiveNonArchivedPatientsByNom(query);
        }
        const validPatients = Array.isArray(response)
          ? response.filter((patient) => patient && patient.idPatient)
          : [];
        setPatients(validPatients);
      } catch (error) {
        console.error('Erreur lors de la recherche des patients:', error);
        Swal.fire('Erreur', 'Impossible de rechercher les patients', 'error');
      }
    },
    [activeRole]
  );

  // Debounced search
  const debouncedSearch = useDebounce(searchPatients, 500);

  // Handle patient search for autocomplete
  const handlePatientSearch = (query) => {
    debouncedSearch(query);
  };

  // Handle patient selection
  const handlePatientSelect = (selected) => {
    setSelectedPatient(selected);
    setTriggerFetch(true);
    if (selected.length === 0 && patients.length === 0) {
      Swal.fire('Information', 'Aucun patient trouvé pour cette recherche.', 'info');
    }
  };

  // Handle date range changes with validation
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'endDate' && dateRange.startDate && value < dateRange.startDate) {
      Swal.fire('Erreur', 'La date de fin doit être après la date de début', 'error');
      return;
    }
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle filter button click
  const handleFilter = () => {
    if (dateRange.startDate && !dateRange.endDate) {
      Swal.fire('Erreur', 'Veuillez sélectionner une date de fin', 'error');
      return;
    }
    if (!dateRange.startDate && dateRange.endDate) {
      Swal.fire('Erreur', 'Veuillez sélectionner une date de début', 'error');
      return;
    }
    setTriggerFetch(true);
  };

  // Determine the details path based on role
  const getDetailsPath = (seanceId) => {
    switch (activeRole) {
      case 'INTENDANT':
        return `/intendant/seances/details/${seanceId}`;
      case 'RESPONSABLE_STOCK':
        return `/stock/seances/details/${seanceId}`;
      default:
        return `/medical/seances/details/${seanceId}`;
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Gérer les Séances</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Liste des Séances</h3>
                <div className="card-tools">
                  {activeRole === 'PERSONNEL_MEDICAL' && (
                    <Link to="/medical/seances/create" className="btn btn-primary btn-sm">
                      <i className="fas fa-plus"></i> Créer une Séance
                    </Link>
                  )}
                  {activeRole === 'INTENDANT' && (
                    <Link to="/intendant" className="btn btn-secondary btn-sm">
                      Retour à l'espace intendant
                    </Link>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6 form-group">
                    <label>Filtrer par Patient</label>
                    <Typeahead
                      id="patient-search"
                      labelKey={(option) => `${option.prenom} ${option.nom}`}
                      options={patients}
                      placeholder="Rechercher un patient..."
                      onInputChange={handlePatientSearch}
                      onChange={handlePatientSelect}
                      selected={selectedPatient}
                      minLength={2}
                      emptyLabel="Aucun patient trouvé"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <div className="row">
                      <div className="col-md-6">
                        <label>Date de Début</label>
                        <input
                          type="date"
                          className="form-control"
                          name="startDate"
                          value={dateRange.startDate}
                          onChange={handleDateRangeChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Date de Fin</label>
                        <input
                          type="date"
                          className="form-control"
                          name="endDate"
                          value={dateRange.endDate}
                          onChange={handleDateRangeChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 form-group mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={handleFilter}
                      disabled={loading}
                    >
                      <i className="fas fa-filter mr-1"></i> Filtrer
                    </button>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Chargement...</span>
                    </div>
                  </div>
                ) : seances.length > 0 ? (
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Machine</th>
                        <th>Infirmier</th>
                        <th>Médecin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seances.map((seance) => (
                        <tr key={seance.idSeance}>
                          <td>{seance.patient?.prenom} {seance.patient?.nom}</td>
                          <td>{new Date(seance.date).toLocaleString()}</td>
                          <td>ID #{seance.machine?.idMachine || '-'}</td>
                          <td>{seance.infirmier?.prenom} {seance.infirmier?.nom || '-'}</td>
                          <td>{seance.medecin?.prenom} {seance.medecin?.nom || '-'}</td>
                          <td>
                            <Link
                              to={getDetailsPath(seance.idSeance)}
                              className="btn btn-info btn-sm"
                              title="Voir les détails"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucune séance trouvée.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GererSeances;