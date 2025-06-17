import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const EditPatient = () => {
  const { id } = useParams();
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

  const fetchPatient = useCallback(async () => {
    try {
      const response = await authService.getPatientById(id);
      setPatient({
        ...response,
        dateNaissance: response.dateNaissance ? response.dateNaissance.split('T')[0] : '',
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du patient', error);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Traitement spécial pour le numéro de téléphone
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

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirmer la modification',
      text: 'Êtes-vous sûr de vouloir mettre à jour les informations de ce patient ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, mettre à jour',
      cancelButtonText: 'Annuler',
    });

    // Proceed only if the user confirms
    if (result.isConfirmed) {
      try {
        await authService.updatePatient(id, patient);
        Swal.fire('Succès', 'Patient mis à jour avec succès', 'success');
        navigate(`/medical/medecin/patients/${id}`);
      } catch (error) {
        let errorMessage = "Erreur lors de la mise à jour du patient";
        
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
    } else {
      setIsSubmitting(false);
    }
  };

  // MODIFICATION PRINCIPALE ICI : 
  // Ne désactive le bouton que pendant la soumission
  const isDisabled = isSubmitting;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Modifier le Patient</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Modifier {patient.prenom} {patient.nom}</h3>
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
                      value={patient.domicile || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Carnet de Soin</label>
                    <select
                      className="form-control"
                      name="carnetSoin"
                      value={patient.carnetSoin || 'CNSS'}
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
                      value={patient.groupeSanguin || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Numéro de Téléphone</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.numeroTelephone ? 'is-invalid' : ''}`}
                      name="numeroTelephone"
                      value={patient.numeroTelephone || ''}
                      onChange={handleChange}
                      maxLength={15}
                    />
                    {errors.numeroTelephone && (
                      <div className="invalid-feedback" style={{ color: 'red' }}>
                        {errors.numeroTelephone}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Historique Médical</label>
                    <textarea
                      className="form-control"
                      name="historiqueMaladie"
                      value={patient.historiqueMaladie || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Antécédents</label>
                    <textarea
                      className="form-control"
                      name="antecedent"
                      value={patient.antecedent || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Évolution</label>
                    <textarea
                      className="form-control"
                      name="evolution"
                      value={patient.evolution || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Traitement</label>
                    <textarea
                      className="form-control"
                      name="traitement"
                      value={patient.traitement || ''}
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
                    disabled={isDisabled}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span> Mise à jour en cours...</span>
                      </>
                    ) : 'Mettre à jour'}
                  </button>
                  
                  <Link
                    to={`/medical/medecin/patients/${id}`}
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

export default EditPatient;