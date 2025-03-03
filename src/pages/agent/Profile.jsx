// src/pages/agent/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const Profile = () => {
  const { userId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    numeroTelephone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile(userId);
        setProfile(response.data);
        setFormData({
            nom: response.data.nom || '',
            prenom: response.data.prenom || '',
            email: response.data.email || '',
            dateNaissance: response.data.dateNaissance ? response.data.dateNaissance.split('T')[0] : '',
            numeroTelephone: response.data.numeroTelephone || ''
          });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil', error);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await authService.updateProfile({ userId, ...formData });
      setProfile({ ...profile, ...formData });
      setEditMode(false);
      Swal.fire('Succès', 'Profil mis à jour', 'success');
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Profil Utilisateur</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Informations personnelles</h3>
                <div className="card-tools">
                  <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Annuler' : 'Modifier'}
                  </button>
                </div>
              </div>
              <div className="card-body">
                {profile ? (
                  editMode ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                      <div className="form-group">
                        <label>Nom :</label>
                        <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label>Prénom :</label>
                        <input type="text" className="form-control" name="prenom" value={formData.prenom} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label>Email :</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label>Date de naissance :</label>
                        <input type="date" className="form-control" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label>Numéro de téléphone :</label>
                        <input type="text" className="form-control" name="numeroTelephone" value={formData.numeroTelephone} onChange={handleInputChange} />
                      </div>
                      <button type="submit" className="btn btn-success">Enregistrer</button>
                    </form>
                  ) : (
                    <div>
                      <p><strong>Nom :</strong> {profile.nom}</p>
                      <p><strong>Prénom :</strong> {profile.prenom}</p>
                      <p><strong>Email :</strong> {profile.email}</p>
                      <p><strong>Date de naissance :</strong> {profile.dateNaissance ? new Date(profile.dateNaissance).toLocaleDateString() : 'Non défini'}</p>
                      <p><strong>Numéro de téléphone :</strong> {profile.numeroTelephone || 'Non défini'}</p>
                    </div>
                  )
                ) : (
                  <p>Chargement du profil...</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;