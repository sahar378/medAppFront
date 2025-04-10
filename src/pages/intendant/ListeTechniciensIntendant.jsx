// src/pages/intendant/ListeTechniciensIntendant.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const ListeTechniciensIntendant = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('non-archive');

  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const endpoint = activeTab === 'non-archive' ? '/techniciens/non-archived' : '/techniciens/archived';
        const data = await authService.getTechniciensByArchiveStatus(endpoint);
        setTechniciens(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchTechniciens();
  }, [activeTab]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Liste des Techniciens</h1>
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
                      Techniciens Non Archivés
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'archive' ? 'active' : ''}`}
                      onClick={() => setActiveTab('archive')}
                    >
                      Techniciens Archivés
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Téléphone</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techniciens.map((technicien) => (
                      <tr key={technicien.idTechnicien}>
                        <td>{technicien.idTechnicien}</td>
                        <td>{technicien.nom}</td>
                        <td>{technicien.telephone || '-'}</td>
                        <td>{technicien.email || '-'}</td>
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

export default ListeTechniciensIntendant;