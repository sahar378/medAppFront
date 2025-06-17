import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const CreatePatient = () => {
  const [patient, setPatient] = useState({
    codePatient: '',
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
  
  const [errors, setErrors] = useState({
    codePatient: '',
    nom: '',
    prenom: '',
    numeroTelephone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Traitement spécial pour le numéro de téléphone
    // Dans handleChange pour le téléphone
if (name === 'numeroTelephone') {
  // Vérifier si la valeur contient des caractères non numériques
  const hasNonNumeric = /[^0-9]/.test(value);
  
  // N'autorise que les chiffres
  const numericValue = value.replace(/\D/g, '');
  setPatient(prev => ({ ...prev, [name]: numericValue }));
  
  // Gestion des erreurs
  if (hasNonNumeric) {
    setErrors(prev => ({ 
      ...prev, 
      numeroTelephone: 'Seuls les chiffres sont autorisés' 
    }));
  } 
  else if (numericValue.length > 0 && numericValue.length < 8) {
    setErrors(prev => ({ 
      ...prev, 
      numeroTelephone: 'Le numéro doit contenir au moins 8 chiffres' 
    }));
  } 
  else {
    setErrors(prev => ({ ...prev, numeroTelephone: '' }));
  }
  return;
}
    
    // Validation pour le nom et prénom
    if (name === 'nom' || name === 'prenom') {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
      if (value !== '' && !nameRegex.test(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: `Le ${name === 'nom' ? 'nom' : 'prénom'} doit contenir uniquement des lettres` 
        }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
    
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation des champs obligatoires
    if (!patient.codePatient || !patient.nom || !patient.prenom) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      setIsSubmitting(false);
      return;
    }
    
    // Validation du nom et prénom
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!nameRegex.test(patient.nom)) {
      Swal.fire('Erreur', 'Le nom contient des caractères invalides', 'error');
      setIsSubmitting(false);
      return;
    }
    
    if (!nameRegex.test(patient.prenom)) {
      Swal.fire('Erreur', 'Le prénom contient des caractères invalides', 'error');
      setIsSubmitting(false);
      return;
    }
    
    // Validation du téléphone
    if (patient.numeroTelephone && patient.numeroTelephone.length < 8) {
      Swal.fire('Erreur', 'Le numéro de téléphone doit contenir au moins 8 chiffres', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.createPatient(patient);
      Swal.fire('Succès', 'Patient créé avec succès', 'success');
      navigate('/medical/medecin/patients');
    } catch (error) {
      let errorMessage = "Erreur lors de la création du patient";
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "Un patient avec ce code existe déjà dans le système";
          Swal.fire({
            icon: 'warning',
            title: 'Code patient existant',
            text: errorMessage,
          });
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      if (error.response?.status !== 409) {
        Swal.fire('Erreur', errorMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vérifier si le formulaire peut être soumis
  const isDisabled = 
    !patient.codePatient || 
    !patient.nom || 
    !patient.prenom || 
    errors.nom || 
    errors.prenom || 
    errors.numeroTelephone || 
    isSubmitting;

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
                  {/* Champ Code Patient */}
                  <div className="form-group">
                    <label>Code Patient *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.codePatient ? 'is-invalid' : ''}`}
                      name="codePatient"
                      value={patient.codePatient}
                      onChange={handleChange}
                      required
                    />
                    {errors.codePatient && <div className="invalid-feedback">{errors.codePatient}</div>}
                  </div>
                  
                  {/* Champ Nom */}
                  <div className="form-group">
                    <label>Nom *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                      name="nom"
                      value={patient.nom}
                      onChange={handleChange}
                      required
                    />
                    {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                  </div>
                  
                  {/* Champ Prénom */}
                  <div className="form-group">
                    <label>Prénom *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                      name="prenom"
                      value={patient.prenom}
                      onChange={handleChange}
                      required
                    />
                    {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                  </div>
                  
                  {/* Autres champs... */}
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
                      type="tel"  // Utilisation de type tel pour les appareils mobiles
                      className={`form-control ${errors.numeroTelephone ? 'is-invalid' : ''}`}
                      name="numeroTelephone"
                      value={patient.numeroTelephone}
                      onChange={handleChange}
                      maxLength={15} // Suffisamment long pour les numéros internationaux
                    />
                    {errors.numeroTelephone && <div className="invalid-feedback">{errors.numeroTelephone}</div>}
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
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isDisabled || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span> Création en cours...</span>
                      </>
                    ) : 'Créer'}
                  </button>
                  
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