import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const EditTechnicien = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ nom: '', prenom: '', societe: '', telephone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechnicien = async () => {
      try {
        const data = await authService.getTechnicienById(id);
        setFormData({
          nom: data.nom,
          prenom: data.prenom || '',
          societe: data.societe || '',
          telephone: data.telephone || '',
          email: data.email,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || error.message || 'Impossible de charger le technicien';
        Swal.fire('Erreur', errorMessage, 'error');
      }
    };
    fetchTechnicien();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{8}$/;
    return phone === '' || phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-zÀ-ÿ\s-]+$/;
    return nameRegex.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!formData.nom) {
      Swal.fire('Erreur', 'Le nom est obligatoire', 'error');
      return;
    }

    if (!formData.prenom) {
      Swal.fire('Erreur', 'Le prénom est obligatoire', 'error');
      return;
    }

    if (!validateName(formData.nom)) {
      Swal.fire('Erreur', 'Le nom doit contenir uniquement des lettres, espaces ou tirets', 'error');
      return;
    }
    if (!validateName(formData.prenom)) {
      Swal.fire('Erreur', 'Le prénom doit contenir uniquement des lettres, espaces ou tirets', 'error');
      return;
    }

    if (!formData.email) {
      Swal.fire('Erreur', 'L’email est obligatoire', 'error');
      return;
    }
    if (!validateEmail(formData.email)) {
      Swal.fire('Erreur', 'L’email doit être dans un format valide', 'error');
      return;
    }

    if (!validatePhone(formData.telephone)) {
      Swal.fire('Erreur', 'Le numéro de téléphone doit contenir exactement 8 chiffres', 'error');
      return;
    }

    try {
      await authService.updateTechnicien(id, formData);
      Swal.fire('Succès', 'Technicien mis à jour avec succès', 'success');
      navigate('/medical/infirmier/techniciens/list');
    } catch (error) {
      // Extraire le message d'erreur du backend
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      if (errorMessage.toLowerCase().includes('un technicien avec cet email existe déjà')) {
        Swal.fire(
          'Erreur',
          `L’email "${formData.email}" est déjà associé à un autre technicien. Veuillez utiliser un email différent.`,
          'error'
        );
      } else if (errorMessage.toLowerCase().includes('email est obligatoire')) {
        Swal.fire('Erreur', 'L’email est obligatoire', 'error');
      } else if (errorMessage.toLowerCase().includes('plusieurs techniciens ont le même email')) {
        Swal.fire(
          'Erreur',
          'Problème dans la base de données : plusieurs techniciens ont le même email. Veuillez contacter l’administrateur pour corriger cela.',
          'error'
        );
      } else {
        Swal.fire('Erreur', errorMessage, 'error');
      }
      console.error(error);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Modifier le Technicien #{id}</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Prénom :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Société (optionnel) :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="societe"
                      value={formData.societe}
                      onChange={handleInputChange}
                      placeholder="Ex: Nom de la société"
                    />
                  </div>
                  <div className="form-group">
                    <label>Téléphone (optionnel) :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="Ex: 12345678"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email :</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Mettre à jour</button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => navigate('/medical/infirmier/techniciens/list')}
                  >
                    Annuler
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditTechnicien;