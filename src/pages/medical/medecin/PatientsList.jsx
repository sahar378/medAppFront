import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('actifs');
  const { activeRole } = useAuth();
  const isMounted = useRef(true);

  // Cleanup on unmount to prevent state updates
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoize fetchPatients to prevent unnecessary re-renders
  const fetchPatients = useCallback(async () => {
    if (isMounted.current) {
      setLoading(true);
    }
    try {
      let patientsData;
      if (activeRole === 'PERSONNEL_MEDICAL' || activeRole === 'INFIRMIER') {
        if (activeTab === 'actifs') {
          patientsData = await authService.getActivePatients();
        } else if (activeTab === 'inactifs') {
          patientsData = await authService.getInactiveNonArchivedPatients();
        }
      } else if (activeRole === 'MEDECIN') {
        if (activeTab === 'actifs') {
          patientsData = await authService.getActivePatients();
        } else if (activeTab === 'inactifs') {
          patientsData = await authService.getInactiveNonArchivedPatients();
        } else if (activeTab === 'archived') {
          patientsData = await authService.getArchivedPatients();
        }
      }
      const validPatients = patientsData || [];
      if (isMounted.current) {
        setPatients(validPatients);
        setFilteredPatients(validPatients);
        setSuggestions(validPatients);
        // Reapply selection if a patient is selected
        if (selectedPatient.length > 0) {
          // Skip backend search; use selectedPatient directly
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
  }, [activeTab, activeRole, selectedPatient]);

  // Fetch patients when activeTab, activeRole, or fetchPatients changes
  useEffect(() => {
    fetchPatients();
  }, [activeTab, activeRole, fetchPatients]);

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
          // Preserve selectedPatient if search returns no results
          setFilteredPatients(
            searchResults && searchResults.length > 0 ? searchResults : selectedPatient.length > 0 ? selectedPatient : []
          );
        }
      } catch (error) {
        console.error('Erreur lors de la recherche des patients:', error);
        if (isMounted.current) {
          Swal.fire('Erreur', 'Impossible de rechercher les patients', 'error');
          setSuggestions([]);
          // Preserve selectedPatient on error
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
        setFilteredPatients(selected); // Show only the selected patient
      } else {
        setFilteredPatients(patients); // Reset to all patients if cleared
      }
    }
  };

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedPatient([]);
  };

  // Handle toggle active/inactive status
  const handleToggleActif = async (patientId) => {
    try {
      await authService.togglePatientActif(patientId);
      Swal.fire('Succès', 'Statut du patient mis à jour', 'success');
      await fetchPatients(); // Reload the patient list
      setSelectedPatient([]); // Clear search
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
      Swal.fire('Erreur', 'Impossible de modifier le statut', 'error');
    }
  };

  // Handle archive/unarchive action
  const handleArchive = async (patientId, isArchived) => {
    try {
      const action = isArchived ? 'unarchivePatient' : 'archivePatient';
      await authService[action](patientId);
      Swal.fire('Succès', `Patient ${isArchived ? 'désarchivé' : 'archivé'}`, 'success');
      await fetchPatients(); // Reload the patient list
      setSelectedPatient([]); // Clear search
    } catch (error) {
      console.error(`Erreur lors de ${isArchived ? 'désarchivage' : 'archivage'}:`, error);
      Swal.fire('Erreur', `Impossible de ${isArchived ? 'désarchiver' : 'archiver'} le patient`, 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Gérer les Patients</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Liste des Patients</h3>
                {activeRole === 'MEDECIN' && (
                  <div className="card-tools">
                    <Link to="/medical/medecin/patients/create" className="btn btn-primary btn-sm">
                      <i className="fas fa-plus"></i> Créer un Patient
                    </Link>
                  </div>
                )}
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
                  {activeRole === 'MEDECIN' && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'archived' ? 'active' : ''}`}
                        onClick={() => handleTabChange('archived')}
                      >
                        Patients Archivés
                      </button>
                    </li>
                  )}
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
                        <th>Date de Naissance</th>
                        <th>Statut</th>
                        <th>Archivé</th>
                        {activeRole === 'MEDECIN' && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <tr key={patient.idPatient}>
                          <td>{patient.nom}</td>
                          <td>{patient.prenom}</td>
                          <td>{patient.dateNaissance || 'Non spécifiée'}</td>
                          <td>{patient.actif ? 'Actif' : 'Inactif'}</td>
                          <td>{patient.archive ? 'Oui' : 'Non'}</td>
                          {activeRole === 'MEDECIN' && (
                            <td>
                              <Link
                                to={`/medical/medecin/patients/${patient.idPatient}`}
                                className="btn btn-info btn-sm mr-1"
                                title="Voir les détails"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link
                                to={`/medical/medecin/patients/edit/${patient.idPatient}`}
                                className="btn btn-primary btn-sm mr-1"
                                title="Modifier"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button
                                className="btn btn-warning btn-sm mr-1"
                                onClick={() => handleToggleActif(patient.idPatient)}
                                title="Activer/Désactiver"
                              >
                                <i className="fas fa-toggle-on"></i>
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleArchive(patient.idPatient, patient.archive)}
                                title={patient.archive ? 'Désarchiver' : 'Archiver'}
                              >
                                <i className={patient.archive ? 'fas fa-undo' : 'fas fa-archive'}></i>
                              </button>
                            </td>
                          )}
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

export default PatientsList;