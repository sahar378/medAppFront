// src/pages/MachineDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import authService from '../services/authService';

const MachineDetails = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Récupérer l'état passé via navigate

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const data = await authService.getMachineById(id);
        setMachine(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchMachine();
  }, [id]);

  const handleReturn = () => {
    const { from, activeTab } = location.state || {};
    if (from === 'intendant') {
      // Retourner vers l'onglet actif de l'intendant
      navigate('/intendant/machines', { state: { activeTab: activeTab || 'non-archive' } });
    } else if (from === 'medical') {
      // Retourner vers la liste des machines non archivées pour le médical
      navigate('/medical/machines/list');
    } else {
      // Par défaut, retour à une page générique (ou précédent)
      navigate(-1);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!machine) return <div>Machine non trouvée</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Détails de la Machine #{machine.idMachine}</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Informations</h3>
              </div>
              <div className="card-body">
                <p><strong>ID :</strong> {machine.idMachine}</p>
                <p><strong>Date Mise en Service :</strong> {new Date(machine.dateMiseEnService).toLocaleDateString('fr-FR')}</p>
                <p>
                  <strong>Disponibilité :</strong>{' '}
                  {machine.disponibilite === 0
                    ? 'Disponible'
                    : machine.disponibilite === 1
                    ? 'En intervention'
                    : 'Réformé'}
                </p>
                <p><strong>Type :</strong> {machine.type || '-'}</p>
                <p><strong>Constructeur :</strong> {machine.constructeur || '-'}</p>
                <p><strong>Fournisseur :</strong> {machine.fournisseur || '-'}</p>
                <p><strong>Caractéristiques :</strong> {machine.caracteristique || '-'}</p>
                <p><strong>Voltage :</strong> {machine.voltage || '-'}</p>
                <button className="btn btn-primary" onClick={handleReturn}>
                  Retour
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MachineDetails;