// src/pages/intendant/AgentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AgentDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    numeroTelephone: ''
  });

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const selectedAgent = await authService.getAgentById(userId); // Nouvelle API
        setAgent(selectedAgent);
        setFormData({
          nom: selectedAgent.nom || '',
          prenom: selectedAgent.prenom || '',
          email: selectedAgent.email || '',
          dateNaissance: selectedAgent.dateNaissance ? new Date(selectedAgent.dateNaissance).toISOString().split('T')[0] : '',
          numeroTelephone: selectedAgent.numeroTelephone || ''
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l’agent', error);
      }
    };
    fetchAgent();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await authService.updateAgent(userId, formData);
      setAgent({ ...agent, ...formData });
      setEditMode(false);
      Swal.fire('Succès', 'Informations mises à jour', 'success');
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer ${agent.prenom} ${agent.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authService.deleteAgent(userId);
          Swal.fire('Succès', 'Agent supprimé', 'success');
          navigate('/intendant/agents');
        } catch (error) {
          Swal.fire('Erreur', 'Erreur lors de la suppression', 'error');
        }
      }
    });
  };

  const handleBack = () => {
    navigate('/intendant/agents');
  };

  if (!agent) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Détails de {agent.prenom} {agent.nom}</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Informations du personnel</h3>
                <div className="card-tools">
                  <button className="btn btn-primary mr-2" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Annuler' : 'Modifier'}
                  </button>
                  <button className="btn btn-danger mr-2" onClick={handleDelete}>
                    Supprimer
                  </button>
                  <button className="btn btn-secondary" onClick={handleBack}>
                    Retour
                  </button>
                </div>
              </div>
              <div className="card-body">
                {editMode ? (
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
                    <p><strong>Nom :</strong> {agent.nom}</p>
                    <p><strong>Prénom :</strong> {agent.prenom}</p>
                    <p><strong>Matricule :</strong> {agent.userId}</p>
                    <p><strong>Email :</strong> {agent.email || 'Non défini'}</p>
                    <p><strong>Date de naissance :</strong> {agent.dateNaissance ? new Date(agent.dateNaissance).toLocaleDateString() : 'Non défini'}</p>
                    <p><strong>Numéro de téléphone :</strong> {agent.numeroTelephone || 'Non défini'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgentDetails;