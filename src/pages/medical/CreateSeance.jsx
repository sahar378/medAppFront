import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';

const CreateSeance = () => {
  // State for managing multiple sessions (tabs)
  const [sessions, setSessions] = useState([
    {
      id: Date.now(),
      data: {
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
      },
      mesures: [],
      newMesure: {
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
      },
      produitsNonStandards: {
        'Sérum salé 0.5L': '0',
        'Seringue 10cc': '0',
        'Seringue 5cc': '0',
        'Robinet': '0',
        'Transfuseur': '0',
        'Lame bistouri': '0',
        'Compress': '',
        'Gants': '0',
        'Masque O2': '0',
        'Lunette O2': '0',
        'Fils de suture': '0',
        'Bandelette': '0',
        'Filtre (dialyseur)': '0',
        'ligne artérielle': '0',
        'ligne veineuse': '0',
        '2 aiguilles': '0',
        'champ stérile': '0',
      },
      produitsSansStock: {
        'Héparine': '',
        'Ether': '',
        'Néofix': '',
      },
      produitsHorsStock: [{ nom: '', qte: '' }],
      produitsSpeciaux: {},
      selectedMateriel: [],
      serumSaleChoix: 'Sérum salé 1L',
    },
  ]);
  const [activeTab, setActiveTab] = useState(sessions[0].id);

  const [machines, setMachines] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [standardProducts, setStandardProducts] = useState([]);

  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machinesData, personnelData] = await Promise.all([
          authService.getAvailableMachines(),
          authService.getMedicalPersonnel(),
        ]);

        setMachines(Array.isArray(machinesData) ? machinesData : []);
        setPersonnel(Array.isArray(personnelData) ? personnelData : []);

        if (!machinesData?.length) {
          Swal.fire('Attention', 'Aucune machine disponible trouvée', 'warning');
        }
        if (!personnelData?.length) {
          Swal.fire('Attention', 'Aucun personnel médical trouvé', 'warning');
        }
      } catch (error) {
        console.error('Erreur dans fetchData:', error);
        Swal.fire('Erreur', 'Impossible de charger les données', 'error');
      }
    };
    fetchData();
  }, []);

  // Fetch standard products when patient is selected
  useEffect(() => {
    const fetchStandardProducts = async () => {
      const activeSession = sessions.find((s) => s.id === activeTab);
      if (activeSession?.data.patient?.id) {
        try {
          const products = await authService.getAllProduitsStandards();
          setStandardProducts(products || []);
        } catch (error) {
          console.error('Erreur lors de la récupération des produits standards:', error);
          Swal.fire('Erreur', 'Impossible de charger les produits standards', 'error');
        }
      } else {
        setStandardProducts([]);
      }
    };
    fetchStandardProducts();
  }, [sessions, activeTab]);

  useEffect(() => {
    if (standardProducts.length === 0 && sessions.find((s) => s.id === activeTab)?.data.patient?.id) {
      Swal.fire('Attention', 'Ce patient n\'a aucun produit standard associé', 'warning');
    }
  }, [standardProducts, sessions, activeTab]);

  // Autocomplete patient search
  const loadPatientOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 1) return [];
    try {
      const response = await authService.searchPatientsByNom(inputValue);
      return response.map((patient) => ({
        value: patient.id,
        label: `${patient.prenom} ${patient.nom}`,
        patient,
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche de patients:', error);
      return [];
    }
  };

  // Autocomplete material products search
  const loadMaterielOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 1) return [];
    try {
      const response = await authService.getActiveMateriels();
      const filtered = response.filter((produit) =>
        produit.nom.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filtered.map((produit) => ({
        value: produit.idProduit,
        label: produit.nom,
        produit,
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche de produits matériels:', error);
      return [];
    }
  };

  const handleChange = (e, sessionId) => {
    const { name, value } = e.target;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, data: { ...session.data, [name]: value } }
          : session
      )
    );
  };

  const handleSelectChange = (e, sessionId) => {
    const { name, value } = e.target;
    const findEntity = (list, id) =>
      list.find((item) => {
        const itemId = item.id || item.userId || item.idMachine;
        return itemId?.toString() === value;
      });

    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              data: {
                ...session.data,
                [name]:
                  name === 'machine'
                    ? findEntity(machines, value)
                    : findEntity(personnel, value),
              },
            }
          : session
      )
    );
  };

  const handlePatientSelect = (selectedOption, sessionId) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              data: {
                ...session.data,
                patient: selectedOption ? selectedOption.patient : null,
              },
            }
          : session
      )
    );
  };

  const handleMesureChange = (e, sessionId) => {
    const { name, value } = e.target;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, newMesure: { ...session.newMesure, [name]: value } }
          : session
      )
    );
  };

  const handleProduitNonStandardChange = (e, produit, sessionId) => {
    const { checked } = e.target;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              produitsNonStandards: {
                ...session.produitsNonStandards,
                [produit]: checked ? '1' : '0',
              },
            }
          : session
      )
    );
  };

  const handleCompressChange = (e, sessionId) => {
    const { value } = e.target;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              produitsNonStandards: {
                ...session.produitsNonStandards,
                Compress: value,
              },
            }
          : session
      )
    );
  };

  const handleProduitSansStockChange = (e, produit, sessionId) => {
    const { value } = e.target;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              produitsSansStock: {
                ...session.produitsSansStock,
                [produit]: value,
              },
            }
          : session
      )
    );
  };

  const handleProduitHorsStockChange = (e, index, field, sessionId) => {
    const { value } = e.target;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              produitsHorsStock: session.produitsHorsStock.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
              ),
            }
          : session
      )
    );
  };

  const handleMaterielSelect = (selectedOptions, sessionId) => {
    const selected = selectedOptions || [];
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              selectedMateriel: selected,
              produitsSpeciaux: selected.reduce(
                (acc, option) => ({
                  ...acc,
                  [option.produit.nom]:
                    session.produitsSpeciaux[option.produit.nom] || '1',
                }),
                {}
              ),
            }
          : session
      )
    );
  };

  const handleProduitSpecialQuantityChange = (e, produitNom, sessionId) => {
    const { value } = e.target;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              produitsSpeciaux: { ...session.produitsSpeciaux, [produitNom]: value },
            }
          : session
      )
    );
  };

  const addProduitHorsStock = (sessionId) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              produitsHorsStock: [...session.produitsHorsStock, { nom: '', qte: '' }],
            }
          : session
      )
    );
  };

  const removeProduitHorsStock = (index, sessionId) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              produitsHorsStock: session.produitsHorsStock.filter((_, i) => i !== index),
            }
          : session
      )
    );
  };

  const addMesure = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session.newMesure.heure) {
      Swal.fire('Erreur', 'L’heure de la mesure est requise', 'error');
      return;
    }
    const heureISO = new Date(session.newMesure.heure).toISOString();
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              mesures: [...session.mesures, { ...session.newMesure, heure: heureISO }],
              newMesure: {
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
              },
            }
          : session
      )
    );
  };

  const handleSubmit = async (e, sessionId) => {
    e.preventDefault();
    const session = sessions.find((s) => s.id === sessionId);
    try {
      const seanceResponse = await authService.createSeance(
        session.data,
        session.serumSaleChoix
      );
      const seanceId = seanceResponse.idSeance;

      for (const mesure of session.mesures) {
        try {
          await authService.addMesure(seanceId, mesure);
        } catch (error) {
          console.error('Erreur lors de l’ajout de la mesure:', error);
          Swal.fire('Erreur', `Erreur lors de l’ajout d’une mesure: ${error.message}`, 'error');
        }
      }

      const produitsNonStandardsFiltered = Object.fromEntries(
        Object.entries(session.produitsNonStandards).filter(([_, qte]) => qte && parseInt(qte) > 0)
      );
      const produitsSansStockFiltered = Object.fromEntries(
        Object.entries(session.produitsSansStock).filter(([_, qte]) => qte && parseInt(qte) > 0)
      );
      const produitsHorsStockFiltered = session.produitsHorsStock
        .filter((item) => item.nom && item.qte && parseInt(item.qte) > 0)
        .reduce((acc, item) => ({ ...acc, [item.nom]: item.qte }), {});
      const produitsSpeciauxFiltered = Object.fromEntries(
        Object.entries(session.produitsSpeciaux).filter(([_, qte]) => qte && parseInt(qte) > 0)
      );

      if (
        Object.keys(produitsNonStandardsFiltered).length ||
        Object.keys(produitsSansStockFiltered).length ||
        Object.keys(produitsHorsStockFiltered).length ||
        Object.keys(produitsSpeciauxFiltered).length
      ) {
        await authService.addProduitNonStandard(
          seanceId,
          produitsNonStandardsFiltered,
          produitsSansStockFiltered,
          produitsHorsStockFiltered,
          produitsSpeciauxFiltered
        );
      }

      Swal.fire('Succès', 'Séance créée avec succès', 'success');
      // Remove the submitted session
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== sessionId);
        if (updated.length === 0) {
          navigate('/medical/seances');
        } else {
          setActiveTab(updated[0].id);
        }
        return updated;
      });
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
      Swal.fire(
        'Erreur',
        error.response?.data?.message || 'Erreur lors de la création de la séance',
        'error'
      );
    }
  };

  const addNewSession = () => {
    const newSession = {
      id: Date.now(),
      data: {
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
      },
      mesures: [],
      newMesure: {
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
      },
      produitsNonStandards: {
        'Sérum salé 0.5L': '0',
        'Seringue 10cc': '0',
        'Seringue 5cc': '0',
        'Robinet': '0',
        'Transfuseur': '0',
        'Lame bistouri': '0',
        'Compress': '',
        'Gants': '0',
        'Masque O2': '0',
        'Lunette O2': '0',
        'Fils de suture': '0',
        'Bandelette': '0',
        'Filtre (dialyseur)': '0',
        'ligne artérielle': '0',
        'ligne veineuse': '0',
        '2 aiguilles': '0',
        'champ stérile': '0',
      },
      produitsSansStock: {
        'Héparine': '',
        'Ether': '',
        'Néofix': '',
      },
      produitsHorsStock: [{ nom: '', qte: '' }],
      produitsSpeciaux: {},
      selectedMateriel: [],
      serumSaleChoix: 'Sérum salé 1L',
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveTab(newSession.id);
  };

  const closeTab = (sessionId) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== sessionId);
      if (updated.length === 0) {
        navigate('/medical/seances');
        return updated;
      }
  
      if (activeTab === sessionId) {
        const closedTabIndex = prev.findIndex((s) => s.id === sessionId);
        let newActiveIndex;
  
        // Determine the new active index
        if (closedTabIndex === prev.length - 1) {
          newActiveIndex = closedTabIndex - 1; // Move to previous tab if last
        } else {
          newActiveIndex = closedTabIndex; // Move to next tab if available
        }
  
        // Ensure the new index is within the updated array bounds
        newActiveIndex = Math.min(newActiveIndex, updated.length - 1);
        newActiveIndex = Math.max(newActiveIndex, 0);
  
        if (newActiveIndex >= 0 && newActiveIndex < updated.length) {
          setActiveTab(updated[newActiveIndex].id);
        } else {
          setActiveTab(updated[0].id); // Fallback to first tab
        }
      }
  
      return updated;
    });
  };

  const generateKey = (prefix, id) => `${prefix}-${id}`;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Ajouter une Séance</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Nouvelle Séance</h3>
                <div className="card-tools">
                  <Link to="/medical/seances" className="btn btn-tool btn-sm">
                    <i className="fas fa-arrow-left"></i> Retour aux séances
                  </Link>
                </div>
              </div>

              <div className="card-body">
                {/* Tab Navigation */}
                <ul className="nav nav-tabs">
                  {sessions.map((session) => (
                    <li key={session.id} className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${activeTab === session.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(session.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '10px 15px',
                          cursor: 'pointer',
                          color: activeTab === session.id ? '#007bff' : '#495057',
                          borderBottom: activeTab === session.id ? '2px solid #007bff' : 'none',
                        }}
                      >
                        Séance {session.data.patient ? `${session.data.patient.prenom} ${session.data.patient.nom}` : 'Nouvelle'}
                        <span
                          className="text-danger ml-2"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the tab switch
                            closeTab(session.id);
                          }}
                          style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            lineHeight: 'normal',
                          }}
                        >
                          ×
                        </span>
                      </button>
                    </li>
                  ))}
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary mt-1"
                      onClick={addNewSession}
                    >
                      +
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    style={{ display: activeTab === session.id ? 'block' : 'none' }}
                  >
                    <form onSubmit={(e) => handleSubmit(e, session.id)}>
                      <div className="card card-outline card-info mb-4">
                        <div className="card-header">
                          <h4 className="card-title">Informations Générales</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-3 form-group mr-2">
                              <label>Patient *</label>
                              <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={loadPatientOptions}
                                onChange={(selected) => handlePatientSelect(selected, session.id)}
                                placeholder="Rechercher un patient..."
                                isClearable
                                required
                              />
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>Générateur n° (Machine) *</label>
                              <select
                                className="form-control"
                                name="machine"
                                onChange={(e) => handleSelectChange(e, session.id)}
                                required
                              >
                                <option value="">Sélectionner une machine</option>
                                {machines.map((machine) => (
                                  <option
                                    key={generateKey('machine', machine.idMachine)}
                                    value={machine.idMachine}
                                  >
                                    Machine {machine.idMachine} ({machine.type || 'Sans type'})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>Infirmier</label>
                              <select
                                className="form-control"
                                name="infirmier"
                                onChange={(e) => handleSelectChange(e, session.id)}
                              >
                                <option value="">Sélectionner un infirmier</option>
                                {personnel
                                  .filter((p) =>
                                    p.profils?.some((profil) => profil.libelleProfil === 'INFIRMIER')
                                  )
                                  .map((person) => (
                                    <option
                                      key={generateKey('infirmier', person.userId)}
                                      value={person.userId}
                                    >
                                      {person.prenom} {person.nom}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>Médecin</label>
                              <select
                                className="form-control"
                                name="medecin"
                                onChange={(e) => handleSelectChange(e, session.id)}
                              >
                                <option value="">Sélectionner un médecin</option>
                                {personnel
                                  .filter((p) =>
                                    p.profils?.some((profil) => profil.libelleProfil === 'MEDECIN')
                                  )
                                  .map((person) => (
                                    <option
                                      key={generateKey('medecin', person.userId)}
                                      value={person.userId}
                                    >
                                      {person.prenom} {person.nom}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>Date et Heure *</label>
                              <input
                                type="datetime-local"
                                className="form-control"
                                name="date"
                                value={session.data.date}
                                onChange={(e) => handleChange(e, session.id)}
                                required
                              />
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>Dialyseur</label>
                              <input
                                type="text"
                                className="form-control"
                                name="dialyseur"
                                value={session.data.dialyseur}
                                onChange={(e) => handleChange(e, session.id)}
                              />
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>Ca++ Bain n° (mmol/L)</label>
                              <input
                                type="number"
                                step="0.1"
                                className="form-control"
                                name="caBain"
                                value={session.data.caBain}
                                onChange={(e) => handleChange(e, session.id)}
                              />
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>PPID (kg)</label>
                              <input
                                type="number"
                                step="0.1"
                                className="form-control"
                                name="ppid"
                                value={session.data.ppid || ''}
                                onChange={(e) => handleChange(e, session.id)}
                              />
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>Poids Sec (kg)</label>
                              <input
                                type="number"
                                step="0.1"
                                className="form-control"
                                name="ps"
                                value={session.data.ps || ''}
                                onChange={(e) => handleChange(e, session.id)}
                              />
                            </div>
                            <div className="col-md-3 form-group mr-2">
                              <label>Sérum Salé *</label>
                              <select
                                className="form-control"
                                value={session.serumSaleChoix}
                                onChange={(e) =>
                                  setSessions((prev) =>
                                    prev.map((s) =>
                                      s.id === session.id
                                        ? { ...s, serumSaleChoix: e.target.value }
                                        : s
                                    )
                                  )
                                }
                              >
                                <option value="Sérum salé 1L">Sérum salé 1L</option>
                                <option value="Sérum salé 0.5L">Sérum salé 0.5L</option>
                              </select>
                            </div>
                          </div>
                          {standardProducts.length > 0 && (
                            <div className="mt-3">
                              <h5>Produits Standards Associés</h5>
                              <ul className="list-group">
                                {standardProducts.map((product) => (
                                  <li key={product.idProduit} className="list-group-item">
                                    {product.nom} (Quantité: 1)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="card card-outline card-info mb-4">
                        <div className="card-header">
                          <h4 className="card-title">Paramètres de la Séance</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4 form-group">
                              <h5>Début de Dialyse</h5>
                              <div className="form-group">
                                <label>Heure Début</label>
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  name="debutDialyse"
                                  value={session.data.debutDialyse}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>Poids à l’entrée (kg)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="form-control"
                                  name="poidsEntree"
                                  value={session.data.poidsEntree || ''}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>T.A Debout (mmHg)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="taDebutDebout"
                                  value={session.data.taDebutDebout}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>T.A Couché (mmHg)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="taDebutCouche"
                                  value={session.data.taDebutCouche}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>Température (°C)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="form-control"
                                  name="temperatureDebut"
                                  value={session.data.temperatureDebut || ''}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 form-group">
                              <h5>Fin de Dialyse</h5>
                              <div className="form-group">
                                <label>Heure Fin</label>
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  name="finDialyse"
                                  value={session.data.finDialyse}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>Poids à la sortie (kg)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="form-control"
                                  name="poidsSortie"
                                  value={session.data.poidsSortie || ''}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>T.A Debout (mmHg)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="taFinDebout"
                                  value={session.data.taFinDebout}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>T.A Couché (mmHg)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="taFinCouche"
                                  value={session.data.taFinCouche}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>Température (°C)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="form-control"
                                  name="temperatureFin"
                                  value={session.data.temperatureFin || ''}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 form-group">
                              <h5>Résultats</h5>
                              <div className="form-group">
                                <label>Durée de la séance (min)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="dureeSeance"
                                  value={
                                    session.data.debutDialyse && session.data.finDialyse
                                      ? Math.round(
                                          (new Date(session.data.finDialyse) -
                                            new Date(session.data.debutDialyse)) /
                                            60000
                                        )
                                      : ''
                                  }
                                  readOnly
                                />
                              </div>
                              <div className="form-group">
                                <label>Perte de poids (kg)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="form-control"
                                  name="pertePoids"
                                  value={
                                    session.data.poidsEntree && session.data.poidsSortie
                                      ? (session.data.poidsEntree - session.data.poidsSortie).toFixed(1)
                                      : ''
                                  }
                                  readOnly
                                />
                              </div>
                              <div className="form-group">
                                <label>UF Total (ml)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="ufTotal"
                                  value={session.data.ufTotal || ''}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>Restitution</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="restitution"
                                  value={session.data.restitution}
                                  onChange={(e) => handleChange(e, session.id)}
                                />
                              </div>
                              <div className="form-group">
                                <label>Circuit/Filtre</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="circuitFiltre"
                                  value={session.data.circuitFiltre}
                                  onChange={(e) => handleChange(e, session.id)}
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
                                <tr>
                                  <td>
                                    <input
                                      type="datetime-local"
                                      className="form-control"
                                      name="heure"
                                      value={session.newMesure.heure}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="ta"
                                      value={session.newMesure.ta}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="pouls"
                                      value={session.newMesure.pouls || ''}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="debitMlMn"
                                      value={session.newMesure.debitMlMn || ''}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="hep"
                                      value={session.newMesure.hep}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="pv"
                                      value={session.newMesure.pv || ''}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="ptm"
                                      value={session.newMesure.ptm || ''}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="conduc"
                                      value={session.newMesure.conduc || ''}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="ufMlH"
                                      value={session.newMesure.ufMlH || ''}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="ufTotalAffiche"
                                      value={session.newMesure.ufTotalAffiche || ''}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                    />
                                  </td>
                                  <td>
                                    <textarea
                                      className="form-control"
                                      name="observation"
                                      value={session.newMesure.observation}
                                      onChange={(e) => handleMesureChange(e, session.id)}
                                      rows="1"
                                    />
                                  </td>
                                </tr>
                                {session.mesures.map((mesure, index) => (
                                  <tr key={index}>
                                    <td>{mesure.heure ? new Date(mesure.heure).toLocaleString() : ''}</td>
                                    <td>{mesure.ta || ''}</td>
                                    <td>{mesure.pouls || ''}</td>
                                    <td>{mesure.debitMlMn || ''}</td>
                                    <td>{mesure.hep || ''}</td>
                                    <td>{mesure.pv || ''}</td>
                                    <td>{mesure.ptm || ''}</td>
                                    <td>{mesure.conduc || ''}</td>
                                    <td>{mesure.ufMlH || ''}</td>
                                    <td>{mesure.ufTotalAffiche || ''}</td>
                                    <td>{mesure.observation || ''}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <button
                              type="button"
                              className="btn btn-info mt-2"
                              onClick={() => addMesure(session.id)}
                            >
                              Ajouter Mesure
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="card card-outline card-info mb-4">
                        <div className="card-header">
                          <h4 className="card-title">Produits Non Standards</h4>
                        </div>
                        <div className="card-body">
                          <h5>Produits affectant le stock</h5>
                          <div className="row">
                            {Object.keys(session.produitsNonStandards)
                              .filter((produit) => produit !== 'Compress')
                              .map((produit) => (
                                <div key={produit} className="col-md-3 form-group">
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`${produit}-${session.id}`}
                                      checked={session.produitsNonStandards[produit] === '1'}
                                      onChange={(e) =>
                                        handleProduitNonStandardChange(e, produit, session.id)
                                      }
                                      style={{ marginRight: '10px', marginLeft: '20px' }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`${produit}-${session.id}`}
                                    >
                                      {produit}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            <div className="col-md-3 form-group">
                              <label>Compress</label>
                              <input
                                type="number"
                                className="form-control"
                                value={session.produitsNonStandards['Compress']}
                                onChange={(e) => handleCompressChange(e, session.id)}
                                min="0"
                              />
                            </div>
                          </div>

                          <h5 className="mt-4">Produits sans impact sur le stock</h5>
                          <div className="row">
                            {Object.keys(session.produitsSansStock).map((produit) => (
                              <div key={produit} className="col-md-3 form-group">
                                <label>{produit}</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={session.produitsSansStock[produit]}
                                  onChange={(e) =>
                                    handleProduitSansStockChange(e, produit, session.id)
                                  }
                                  min="0"
                                />
                              </div>
                            ))}
                          </div>

                          <h5 className="mt-4">Produits hors stock</h5>
                          {session.produitsHorsStock.map((item, index) => (
                            <div key={index} className="row mb-2 align-items-center">
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Nom du produit"
                                  value={item.nom}
                                  onChange={(e) =>
                                    handleProduitHorsStockChange(e, index, 'nom', session.id)
                                  }
                                />
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Quantité"
                                  value={item.qte}
                                  onChange={(e) =>
                                    handleProduitHorsStockChange(e, index, 'qte', session.id)
                                  }
                                  min="0"
                                />
                              </div>
                              <div className="col-md-2">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => removeProduitHorsStock(index, session.id)}
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-info mt-2"
                            onClick={() => addProduitHorsStock(session.id)}
                          >
                            Ajouter Produit Hors Stock
                          </button>

                          <h5 className="mt-4">Produits Spéciaux (Matériel)</h5>
                          <div className="form-group">
                            <label>Rechercher Matériel</label>
                            <AsyncSelect
                              isMulti
                              cacheOptions
                              defaultOptions
                              loadOptions={loadMaterielOptions}
                              onChange={(selected) => handleMaterielSelect(selected, session.id)}
                              placeholder="Rechercher un matériel..."
                            />
                          </div>
                          {session.selectedMateriel.map((materiel) => (
                            <div key={materiel.value} className="row mb-2 align-items-center">
                              <div className="col-md-4">
                                <label>{materiel.label}</label>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={session.produitsSpeciaux[materiel.label] || '1'}
                                  onChange={(e) =>
                                    handleProduitSpecialQuantityChange(e, materiel.label, session.id)
                                  }
                                  min="1"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card card-outline card-info mb-4">
                        <div className="card-header">
                          <h4 className="card-title">Observations</h4>
                        </div>
                        <div className="card-body">
                          <div className="form-group">
                            <label>Observation Générale</label>
                            <textarea
                              className="form-control"
                              name="observation"
                              value={session.data.observation}
                              onChange={(e) => handleChange(e, session.id)}
                              rows="4"
                            />
                          </div>
                          <div className="form-group">
                            <label>Traitement</label>
                            <textarea
                              className="form-control"
                              name="traitement"
                              value={session.data.traitement}
                              onChange={(e) => handleChange(e, session.id)}
                              rows="4"
                            />
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary">
                        Créer Séance
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateSeance;