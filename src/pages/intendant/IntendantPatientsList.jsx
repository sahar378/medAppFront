import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const IntendantPatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('actifs');
  const isMounted = useRef(true);

  // Cleanup on unmount to prevent state updates
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch patients based on active tab
  const fetchPatients = useCallback(async () => {
    if (isMounted.current) {
      setLoading(true);
    }
    try {
      let patientsData;
      if (activeTab === 'actifs') {
        patientsData = await authService.getActivePatients();
      } else if (activeTab === 'inactifs') {
        patientsData = await authService.getInactiveNonArchivedPatients();
      } else if (activeTab === 'archived') {
        patientsData = await authService.getArchivedPatients();
      }
      const validPatients = patientsData || [];
      if (isMounted.current) {
        setPatients(validPatients);
        setFilteredPatients(validPatients);
        setSuggestions(validPatients);
        if (selectedPatient.length > 0) {
          setFilteredPatients(selectedPatient);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
      if (isMounted.current) {
        Swal.fire('Erreur', 'Impossible de charger les patients', 'error');
        setPatients([]);
        setFilteredPatients([]);
        setSuggestions([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [activeTab, selectedPatient]);

  // Fetch patients when activeTab or fetchPatients changes
  useEffect(() => {
    fetchPatients();
  }, [activeTab, fetchPatients]);

  // Handle search input for autocompletion
  const handleSearchChange = useCallback(
    async (query) => {
      if (query.length < 2) {
        if (isMounted.current) {
          setSuggestions(patients);
          setFilteredPatients(selectedPatient.length > 0 ? selectedPatient : patients);
          if (!selectedPatient.length) {
            setSelectedPatient([]);
          }
        }
        return;
      }
      try {
        let searchResults;
        if (activeTab === 'actifs') {
          searchResults = await authService.searchActiveNonArchivedPatientsByNom(query);
        } else if (activeTab === 'inactifs') {
          searchResults = await authService.searchInactiveNonArchivedPatientsByNom(query);
        } else if (activeTab === 'archived') {
          searchResults = await authService.searchArchivedPatientsByNom(query);
        }
        if (isMounted.current) {
          setSuggestions(searchResults || []);
          setFilteredPatients(
            searchResults && searchResults.length > 0 ? searchResults : selectedPatient.length > 0 ? selectedPatient : []
          );
        }
      } catch (error) {
        console.error('Erreur lors de la recherche des patients:', error);
        if (isMounted.current) {
          Swal.fire('Erreur', 'Impossible de rechercher les patients', 'error');
          setSuggestions([]);
          setFilteredPatients(selectedPatient.length > 0 ? selectedPatient : []);
        }
      }
    },
    [activeTab, patients, selectedPatient]
  );

  // Handle patient selection from Typeahead
  const handlePatientSelect = (selected) => {
    setSelectedPatient(selected);
    if (isMounted.current) {
      if (selected.length > 0) {
        setFilteredPatients(selected);
      } else {
        setFilteredPatients(patients);
      }
    }
  };

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedPatient([]);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Liste des Patients</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Patients</h3>
                <div className="card-tools">
                  <Link to="/intendant" className="btn btn-secondary btn-sm">
                    Retour à l'espace intendant
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'actifs' ? 'active' : ''}`}
                      onClick={() => handleTabChange('actifs')}
                    >
                      Patients Actifs
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'inactifs' ? 'active' : ''}`}
                      onClick={() => handleTabChange('inactifs')}
                    >
                      Patients Inactifs
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'archived' ? 'active' : ''}`}
                      onClick={() => handleTabChange('archived')}
                    >
                      Patients Archivés
                    </button>
                  </li>
                </ul>
                <div className="form-group mb-3">
                  <Typeahead
                    id="patient-search"
                    labelKey={(option) => `${option.prenom} ${option.nom}`}
                    options={suggestions}
                    placeholder="Rechercher par nom..."
                    onInputChange={handleSearchChange}
                    onChange={handlePatientSelect}
                    selected={selectedPatient}
                    minLength={2}
                    emptyLabel="Aucun patient trouvé"
                  />
                </div>
                {loading ? (
                  <p>Chargement...</p>
                ) : filteredPatients.length > 0 ? (
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <tr key={patient.idPatient}>
                          <td>{patient.nom}</td>
                          <td>{patient.prenom}</td>
                          <td>
                            <Link
                              to={`/intendant/patients/${patient.idPatient}/dialysis-history`}
                              className="btn btn-info btn-sm"
                              title="Voir l'historique de dialyse"
                            >
                              <i className="fas fa-eye"></i> Historique
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucun patient trouvé pour les critères de recherche.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntendantPatientsList;