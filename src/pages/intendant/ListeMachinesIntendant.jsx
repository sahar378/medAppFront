// src/pages/intendant/ListeMachinesIntendant.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const ListeMachinesIntendant = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'non-archive'); // Restaurer l'onglet actif
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const endpoint = activeTab === 'non-archive' ? '/machines/non-archived' : '/machines/archived';
        const data = await authService.getMachinesByArchiveStatus(endpoint);
        setMachines(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchMachines();
  }, [activeTab]);

  const handleRowClick = (id) => {
    navigate(`/machines/details/${id}`, { state: { from: 'intendant', activeTab } });
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Liste des Machines</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'non-archive' ? 'active' : ''}`}
                      onClick={() => setActiveTab('non-archive')}
                    >
                      Machines Non Archivées
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'archive' ? 'active' : ''}`}
                      onClick={() => setActiveTab('archive')}
                    >
                      Machines Archivées
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date Mise en Service</th>
                      <th>Disponibilité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machines.map((machine) => (
                      <tr
                        key={machine.idMachine}
                        onClick={() => handleRowClick(machine.idMachine)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{machine.idMachine}</td>
                        <td>{new Date(machine.dateMiseEnService).toLocaleDateString('fr-FR')}</td>
                        <td>
                          {machine.disponibilite === 0 ? (
                            <span className="badge bg-success">Disponible</span>
                          ) : machine.disponibilite === 1 ? (
                            <span className="badge bg-danger">En intervention</span>
                          ) : (
                            <span className="badge bg-secondary">Réformé</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListeMachinesIntendant;