// src/pages/medical/EditTechnicien.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const EditTechnicien = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ nom: '', telephone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechnicien = async () => {
      try {
        const data = await authService.getTechnicienById(id);
        setFormData({ nom: data.nom, telephone: data.telephone || '', email: data.email || '' });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire('Erreur', 'Impossible de charger le technicien', 'error');
      }
    };
    fetchTechnicien();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{8}$/; // Accepte exactement 8 chiffres
    return phone === '' || phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format email standard
    return email === '' || emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation du nom (obligatoire)
    if (!formData.nom) {
      Swal.fire('Erreur', 'Le nom est obligatoire', 'error');
      return;
    }

    // Validation du téléphone (optionnel, mais 8 chiffres si rempli)
    if (!validatePhone(formData.telephone)) {
      Swal.fire('Erreur', 'Le téléphone doit contenir exactement 8 chiffres', 'error');
      return;
    }

    // Validation de l’email (optionnel, mais format valide si rempli)
    if (!validateEmail(formData.email)) {
      Swal.fire('Erreur', 'L’email doit être dans un format valide', 'error');
      return;
    }

    try {
      await authService.updateTechnicien(id, formData);
      Swal.fire('Succès', 'Technicien mis à jour', 'success');
      navigate('/medical/techniciens/list');
    } catch (error) {
      console.error(error);
      Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
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
                    <label>Email (optionnel) :</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ex: exemple@domaine.com"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Mettre à jour</button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => navigate('/medical/techniciens/list')}
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