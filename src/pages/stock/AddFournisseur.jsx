import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AddFournisseur = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    adresse: '',
    telephone: '',
    fax: '',
    matriculeFiscale: '',
    rib: '',
    rc: '',
    codeTva: ''
  });
  const [errors, setErrors] = useState({ 
    nom: '', 
    prenom: '',
    email: '', 
    telephone: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation pour le nom et prénom (lettres, accents, espaces, tirets, apostrophes)
    if (name === 'nom' || name === 'prenom') {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
      if (value !== '' && !nameRegex.test(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: `Le ${name === 'nom' ? 'nom' : 'prénom'} ne doit contenir que des lettres, espaces, tirets ou apostrophes` 
        }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }

    // Validation pour l'email
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value) && value !== '') {
        setErrors(prev => ({ 
          ...prev, 
          email: 'Veuillez entrer un email valide (ex: exemple@domaine.com)' 
        }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }

    // Validation pour le téléphone
    if (name === 'telephone') {
      const phoneRegex = /^\d{0,8}$/;
      if (!phoneRegex.test(value)) {
        setErrors(prev => ({ 
          ...prev, 
          telephone: 'Le numéro doit contenir uniquement des chiffres' 
        }));
      } else if (value.length > 0 && value.length < 8) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Vérification des champs obligatoires
    if (!formData.nom || !formData.prenom || !formData.email || !formData.adresse || !formData.telephone) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      setIsSubmitting(false);
      return;
    }

    // Validation finale du nom
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!nameRegex.test(formData.nom)) {
      Swal.fire('Erreur', 'Le nom contient des caractères invalides', 'error');
      setIsSubmitting(false);
      return;
    }

    // Validation finale du prénom
    if (!nameRegex.test(formData.prenom)) {
      Swal.fire('Erreur', 'Le prénom contient des caractères invalides', 'error');
      setIsSubmitting(false);
      return;
    }

    // Validation finale de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire('Erreur', 'Veuillez entrer une adresse email valide', 'error');
      setIsSubmitting(false);
      return;
    }

    // Validation finale du téléphone
    if (!/^\d{8}$/.test(formData.telephone)) {
      Swal.fire('Erreur', 'Le numéro de téléphone doit contenir exactement 8 chiffres', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.createFournisseur(formData);
      Swal.fire('Succès', 'Fournisseur ajouté avec succès', 'success');
      navigate('/stock/fournisseurs');
    } catch (error) {
      let errorMessage = "Erreur lors de l'ajout du fournisseur";
      
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }

      if (errorMessage.includes('existe déjà')) {
        Swal.fire({
          icon: 'warning',
          title: 'Fournisseur existant',
          text: 'Un fournisseur avec cet email existe déjà dans le système',
        });
      } else {
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
    !formData.adresse || 
    !formData.telephone || 
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
          <div className="container-fluid">
            <h1 className="m-0">Ajouter un Fournisseur</h1>
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label>Adresse *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Téléphone *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      maxLength={8}
                      required
                    />
                    {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                  </div>
                  <div className="form-group">
                    <label>Fax</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fax"
                      value={formData.fax}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Matricule Fiscale</label>
                    <input
                      type="text"
                      className="form-control"
                      name="matriculeFiscale"
                      value={formData.matriculeFiscale}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>RIB</label>
                    <input
                      type="text"
                      className="form-control"
                      name="rib"
                      value={formData.rib}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>RC</label>
                    <input
                      type="text"
                      className="form-control"
                      name="rc"
                      value={formData.rc}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Code TVA</label>
                    <input
                      type="text"
                      className="form-control"
                      name="codeTva"
                      value={formData.codeTva}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      type="button" 
                      className="btn btn-secondary mr-2" 
                      onClick={() => navigate('/stock/fournisseurs')}
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
                          <span className="sr-only">Ajout en cours...</span>
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

export default AddFournisseur;