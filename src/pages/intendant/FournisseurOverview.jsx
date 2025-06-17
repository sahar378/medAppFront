import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import FournisseurDetailsReadOnly from './FournisseurDetailsReadOnly';
import authService from '../../services/authService';

const FournisseurOverview = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('actif');
  const [selectedFournisseurId, setSelectedFournisseurId] = useState(null);

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const statut = activeTab === 'actif' ? 0 : activeTab === 'inactif' ? 1 : 2;
        const data = await authService.getFournisseursByStatut(statut);
        setFournisseurs(data);
        setFilteredFournisseurs(data);
      } catch (error) {
        console.error('Erreur lors du chargement des fournisseurs', error);
        setFournisseurs([]);
        setFilteredFournisseurs([]);
      }
    };
    fetchFournisseurs();
  }, [activeTab]);

  useEffect(() => {
    const filtered = fournisseurs.filter(f =>
      `${f.nom} ${f.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFournisseurs(filtered);
  }, [searchTerm, fournisseurs]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleFournisseurClick = (id) => {
    setSelectedFournisseurId(id);
  };

  const handleBack = () => {
    setSelectedFournisseurId(null);
  };

  return (
    <div className="wrapper">
      {selectedFournisseurId ? (
        <FournisseurDetailsReadOnly fournisseurId={selectedFournisseurId} onBack={handleBack} />
      ) : (
        <>
          <Navbar />
          <Sidebar />
          <div className="content-wrapper">
            <div className="content-header">
              <h1 className="m-0">Consultation des Fournisseurs</h1>
            </div>
            <section className="content">
              <div className="container-fluid">
                <div className="card">
                  <div className="card-header">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === 'actif' ? 'active' : ''}`}
                          onClick={() => setActiveTab('actif')}
                        >
                          Actifs
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === 'inactif' ? 'active' : ''}`}
                          onClick={() => setActiveTab('inactif')}
                        >
                          Inactifs
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === 'erased' ? 'active' : ''}`}
                          onClick={() => setActiveTab('erased')}
                        >
                          Supprimés
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <div className="mb-3 position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher par nom ou prénom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          className="btn btn-link position-absolute"
                          style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', padding: 0 }}
                          onClick={handleClearSearch}
                        >
                          <i className="fas fa-times" style={{ color: '#6c757d' }} />
                        </button>
                      )}
                    </div>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nom</th>
                          <th>Prénom</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFournisseurs.length > 0 ? (
                          filteredFournisseurs.map(f => (
                            <tr
                              key={f.idFournisseur}
                              onClick={() => handleFournisseurClick(f.idFournisseur)}
                              style={{ cursor: 'pointer' }}
                              className={selectedFournisseurId === f.idFournisseur ? 'table-active' : ''}
                            >
                              <td>{f.idFournisseur}</td>
                              <td>{f.nom}</td>
                              <td>{f.prenom}</td>
                              <td>{f.email}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4">Aucun fournisseur disponible</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default FournisseurOverview;