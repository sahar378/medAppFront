import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const CreatePatient = () => {
  const [patient, setPatient] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    domicile: '',
    carnetSoin: 'CNSS',
    groupeSanguin: '',
    numeroTelephone: '',
    historiqueMaladie: '',
    antecedent: '',
    evolution: '',
    traitement: '',
    actif: true,
    archive: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.createPatient(patient);
      Swal.fire('Succès', 'Patient créé avec succès', 'success');
      navigate('/medical/medecin/patients');
    } catch (error) {
      console.error('Erreur lors de la création du patient', error);
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Ajouter un Patient</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Nouveau Patient</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nom"
                      value={patient.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      name="prenom"
                      value={patient.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de Naissance</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateNaissance"
                      value={patient.dateNaissance}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Domicile</label>
                    <input
                      type="text"
                      className="form-control"
                      name="domicile"
                      value={patient.domicile}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Carnet de Soin</label>
                    <select
                      className="form-control"
                      name="carnetSoin"
                      value={patient.carnetSoin}
                      onChange={handleChange}
                    >
                      <option value="CNSS">CNSS</option>
                      <option value="CNRPS">CNRPS</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Groupe Sanguin</label>
                    <input
                      type="text"
                      className="form-control"
                      name="groupeSanguin"
                      value={patient.groupeSanguin}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Numéro de Téléphone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="numeroTelephone"
                      value={patient.numeroTelephone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Historique Médical</label>
                    <textarea
                      className="form-control"
                      name="historiqueMaladie"
                      value={patient.historiqueMaladie}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Antécédents</label>
                    <textarea
                      className="form-control"
                      name="antecedent"
                      value={patient.antecedent}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Évolution</label>
                    <textarea
                      className="form-control"
                      name="evolution"
                      value={patient.evolution}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Traitement</label>
                    <textarea
                      className="form-control"
                      name="traitement"
                      value={patient.traitement}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      className="form-control"
                      name="actif"
                      value={patient.actif}
                      onChange={(e) => setPatient({ ...patient, actif: e.target.value === 'true' })}
                    >
                      <option value={true}>Actif</option>
                      <option value={false}>Inactif</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Créer</button>
                  <Link
                    to="/medical/medecin/patients"
                    className="btn btn-secondary ml-2"
                  >
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

export default CreatePatient;