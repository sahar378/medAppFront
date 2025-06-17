import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const AjoutTechnicien = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    nom: '', 
    prenom: '', 
    societe: '', 
    telephone: '', 
    email: '' 
  });
  
  const [errors, setErrors] = useState({ 
    nom: '', 
    prenom: '',
    telephone: '', 
    email: '' 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validation en temps réel pour le nom et prénom
    if (name === 'nom' || name === 'prenom') {
      const nameRegex = /^[A-Za-zÀ-ÿ\s-]+$/;
      if (value && !nameRegex.test(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: `Le ${name === 'nom' ? 'nom' : 'prénom'} doit contenir uniquement des lettres, espaces ou tirets` 
        }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
    
    // Validation en temps réel pour l'email
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrors(prev => ({ 
          ...prev, 
          email: 'Veuillez entrer un email valide (ex: exemple@domaine.com)' 
        }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }
    
    // Validation en temps réel pour le téléphone
    if (name === 'telephone') {
      const phoneRegex = /^\d{0,8}$/;
      if (value && !phoneRegex.test(value)) {
        setErrors(prev => ({ 
          ...prev, 
          telephone: 'Le numéro doit contenir uniquement des chiffres' 
        }));
      } else if (value && value.length !== 8) {
        setErrors(prev => ({ 
          ...prev, 
          telephone: 'Le numéro doit contenir exactement 8 chiffres' 
        }));
      } else {
        setErrors(prev => ({ ...prev, telephone: '' }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
      isValid = false;
    } else if (!/^[A-Za-zÀ-ÿ\s-]+$/.test(formData.nom)) {
      newErrors.nom = 'Le nom contient des caractères invalides';
      isValid = false;
    }

    // Validation du prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
      isValid = false;
    } else if (!/^[A-Za-zÀ-ÿ\s-]+$/.test(formData.prenom)) {
      newErrors.prenom = 'Le prénom contient des caractères invalides';
      isValid = false;
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }

    // Validation du téléphone
    if (formData.telephone && !/^\d{8}$/.test(formData.telephone)) {
      newErrors.telephone = 'Le numéro doit contenir exactement 8 chiffres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.addTechnicien(formData);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Technicien ajouté avec succès',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/gestion-techniciens'); // Redirection après succès
      });
    } catch (error) {
      let errorMessage = "Erreur lors de l'ajout du technicien";
      
      if (error.response) {
        // Gestion des erreurs structurées du backend
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } 
        // Gestion des erreurs textuelles
        else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }

      // Gestion spécifique des conflits d'email
      if (errorMessage.toLowerCase().includes('existe déjà')) {
        Swal.fire({
          icon: 'warning',
          title: 'Technicien existant',
          html: `Un technicien avec l'email <b>${formData.email}</b> existe déjà dans le système`,
          confirmButtonText: 'OK'
        });
      } 
      // Gestion des autres erreurs
      else {
        Swal.fire('Erreur', errorMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = 
    !formData.nom || 
    !formData.prenom || 
    !formData.email || 
    errors.nom || 
    errors.prenom || 
    errors.email || 
    errors.telephone || 
    isSubmitting;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Ajouter un Technicien</h1>
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                    />
                    {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>Société (optionnel)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="societe"
                      value={formData.societe}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Téléphone (optionnel)</label>
                    <input
                      type="text"
                      className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      maxLength={8}
                    />
                    {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      type="button" 
                      className="btn btn-secondary mr-2" 
                      onClick={() => navigate('/techniciens')}
                      disabled={isSubmitting}
                    >
                      Annuler
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isDisabled}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span> Ajout en cours...</span>
                        </>
                      ) : 'Ajouter'}
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

export default AjoutTechnicien;