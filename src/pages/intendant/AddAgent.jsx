import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AddAgent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    numeroTelephone: ''
  });
  const [errors, setErrors] = useState({
    nom: '',
    prenom: '',
    email: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (value, field) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (value && !nameRegex.test(value)) {
      return `Le ${field} ne doit contenir que des lettres, espaces, tirets ou apostrophes`;
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validation pour le nom et prénom
    if (name === 'nom' || name === 'prenom') {
      setErrors(prev => ({
        ...prev,
        [name]: validateName(value, name === 'nom' ? 'nom' : 'prénom')
      }));
    }

    // Validation pour l'email
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) || !value ? '' : 'Veuillez entrer un email valide (ex: exemple@domaine.com)'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (!formData.nom || !formData.prenom || !formData.email || !formData.dateNaissance || !formData.numeroTelephone) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    // Validation finale du nom
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!nameRegex.test(formData.nom)) {
      Swal.fire('Erreur', 'Le nom contient des caractères invalides', 'error');
      return;
    }

    // Validation finale du prénom
    if (!nameRegex.test(formData.prenom)) {
      Swal.fire('Erreur', 'Le prénom contient des caractères invalides', 'error');
      return;
    }

    // Validation finale de l'email
    if (!validateEmail(formData.email)) {
      Swal.fire('Erreur', 'Veuillez entrer une adresse email valide', 'error');
      return;
    }

    try {
      await authService.addAgent(formData);
      Swal.fire('Succès', 'Agent ajouté avec succès', 'success');
      navigate('/intendant/habilitation');
    } catch (error) {
      let errorMessage = 'Erreur lors de l’ajout de l’agent';
      
      if (error.response) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      if (errorMessage.includes('Un agent avec cet email existe déjà')) {
        Swal.fire({
          icon: 'warning',
          title: 'Agent existant',
          text: 'Un agent avec cet email existe déjà dans le système. Veuillez utiliser un autre email.',
        });
      } else if (errorMessage.includes('Un agent avec ce matricule existe déjà')) {
        Swal.fire({
          icon: 'warning',
          title: 'Matricule existant',
          text: 'Un agent avec ce matricule existe déjà. Veuillez réessayer ou contacter l\'administrateur.',
        });
      } else {
        Swal.fire('Erreur', errorMessage, 'error');
      }
      
      console.error('Erreur détaillée:', {
        error,
        response: error.response,
        message: errorMessage
      });
    }
  };

  const isDisabled = 
    !formData.nom ||
    !formData.prenom ||
    !formData.email ||
    !formData.dateNaissance ||
    !formData.numeroTelephone ||
    errors.nom ||
    errors.prenom ||
    errors.email;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Ajouter un nouveau membre au personnel</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                  </div>
                  <div className="form-group">
                    <label>Prénom *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label>Date de naissance *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Numéro de téléphone *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="numeroTelephone"
                      value={formData.numeroTelephone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      type="button" 
                      className="btn btn-secondary mr-2" 
                      onClick={() => navigate('/intendant/habilitation')}
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isDisabled}
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddAgent;