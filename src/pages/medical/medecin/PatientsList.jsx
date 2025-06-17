import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Restaurer l'onglet actif à partir de l'état de navigation si disponible
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      setSelectedPatient([]);
    }
  }, [location.state?.tab]);

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
  }, [activeTab, activeRole, selectedPatient]);

  useEffect(() => {
    fetchPatients();
  }, [activeTab, activeRole, fetchPatients]);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedPatient([]);
  };

  const handleToggleActif = async (patientId, isActive) => {
    const actionText = isActive ? 'désactiver' : 'activer';
    const result = await Swal.fire({
      title: `Êtes-vous sûr de vouloir ${actionText} ce patient ?`,
      text: `Cette action va ${actionText} le statut du patient.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Oui, ${actionText} !`,
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await authService.togglePatientActif(patientId);
        Swal.fire('Succès', 'Statut du patient mis à jour', 'success');
        await fetchPatients();
        setSelectedPatient([]);
      } catch (error) {
        console.error('Erreur lors de la modification du statut:', error);
        Swal.fire('Erreur', 'Impossible de modifier le statut', 'error');
      }
    }
  };

  const handleArchive = async (patientId, isArchived) => {
    const actionText = isArchived ? 'désarchiver' : 'archiver';
    const result = await Swal.fire({
      title: `Êtes-vous sûr de vouloir ${actionText} ce patient ?`,
      text: `Cette action va ${actionText} le patient.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Oui, ${actionText} !`,
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        const action = isArchived ? 'unarchivePatient' : 'archivePatient';
        await authService[action](patientId);
        Swal.fire('Succès', `Patient ${isArchived ? 'désarchivé' : 'archivé'}`, 'success');
        await fetchPatients();
        setSelectedPatient([]);
      } catch (error) {
        console.error(`Erreur lors de ${isArchived ? 'désarchivage' : 'archivage'}:`, error);
        Swal.fire('Erreur', `Impossible de ${isArchived ? 'désarchiver' : 'archiver'} le patient`, 'error');
      }
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
                              <div className="d-flex align-items-center">
                                <Link
                                  to={`/medical/medecin/patients/${patient.idPatient}`}
                                  className="btn btn-outline-primary btn-sm mr-2"
                                  title="Consulter les détails"
                                >
                                  Consulter
                                </Link>
                                  {activeTab !== 'archived' && (
                                    <>
                                      <button
                                        className="btn btn-outline-warning btn-sm mr-2"
                                        onClick={() => handleToggleActif(patient.idPatient, patient.actif)}
                                        title="Activer/Désactiver"
                                      >
                                        {activeTab === 'inactifs' && !patient.actif ? 'Activer' : patient.actif ? 'Désactiver' : 'Activer'}
                                      </button>
                                      <button
                                        className={`btn btn-outline-${patient.archive ? 'success' : 'danger'} btn-sm`}
                                        onClick={() => handleArchive(patient.idPatient, patient.archive)}
                                        title={patient.archive ? 'Désarchiver' : 'Archiver'}
                                      >
                                        {patient.archive ? 'Désarchiver' : 'Archiver'}
                                      </button>
                                    </>
                                  )}
                              </div>
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