import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const FournisseurList = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('actif'); // actif, inactif, erased
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const statut = activeTab === 'actif' ? 0 : activeTab === 'inactif' ? 1 : 2;
        const data = await authService.getFournisseursByStatut(statut);
        const fournisseursArray = Array.isArray(data) ? data : [];
        setFournisseurs(fournisseursArray);
        setFilteredFournisseurs(fournisseursArray);
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

  const handleChangerStatut = async (id, nouveauStatut, nomFournisseur) => {
    try {
      let confirmationTitle = '';
      let confirmationText = '';
      let causeSuppression = null;

      if (nouveauStatut === 1) {
        confirmationTitle = 'Rendre Inactif';
        confirmationText = `Êtes-vous sûr de vouloir rendre le fournisseur "${nomFournisseur}" inactif ?`;
      } else if (nouveauStatut === 0) {
        confirmationTitle = 'Rendre Actif';
        confirmationText = `Êtes-vous sûr de vouloir rendre le fournisseur "${nomFournisseur}" actif ?`;
      } else if (nouveauStatut === 2) {
        confirmationTitle = 'Supprimer le Fournisseur';
        confirmationText = `Êtes-vous sûr de vouloir supprimer le fournisseur "${nomFournisseur}" ?`;
      }

      const result = await Swal.fire({
        title: confirmationTitle,
        text: confirmationText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, confirmer',
        cancelButtonText: 'Annuler'
      });

      if (!result.isConfirmed) return;

      if (nouveauStatut === 2) {
        const { value: cause } = await Swal.fire({
          title: 'Cause de suppression',
          input: 'text',
          inputLabel: 'Veuillez indiquer la raison de la suppression',
          inputPlaceholder: 'Ex. Non fiable',
          showCancelButton: true,
          confirmButtonText: 'Confirmer',
          cancelButtonText: 'Annuler',
          inputValidator: (value) => {
            if (!value) {
              return 'Vous devez entrer une cause !';
            }
          }
        });
        if (!cause) return;
        causeSuppression = cause;
      }

      await authService.changerStatutFournisseur(id, nouveauStatut, causeSuppression);
      setFournisseurs(fournisseurs.filter(f => f.idFournisseur !== id));
      setFilteredFournisseurs(filteredFournisseurs.filter(f => f.idFournisseur !== id));
      Swal.fire('Succès', `Statut modifié avec succès`, 'success');
    } catch (error) {
      console.error('Erreur lors du changement de statut', error);
      Swal.fire('Erreur', 'Erreur lors du changement de statut', 'error');
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Liste des Fournisseurs</h1>
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
                {activeTab !== 'erased' && (
                  <Link to="/stock/fournisseurs/add" className="btn btn-primary mb-3">
                    Ajouter un Fournisseur
                  </Link>
                )}
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFournisseurs.length > 0 ? (
                      filteredFournisseurs.map(fournisseur => (
                        <tr
                          key={fournisseur.idFournisseur}
                          onClick={() => navigate(`/stock/fournisseurs/${fournisseur.idFournisseur}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{fournisseur.idFournisseur}</td>
                          <td>{fournisseur.nom}</td>
                          <td>{fournisseur.prenom}</td>
                          <td>{fournisseur.email}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            {activeTab === 'actif' && (
                              <>
                                <button
                                  className="btn btn-warning btn-sm mr-2"
                                  onClick={() => handleChangerStatut(fournisseur.idFournisseur, 1, `${fournisseur.nom} ${fournisseur.prenom}`)}
                                >
                                  Rendre Inactif
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleChangerStatut(fournisseur.idFournisseur, 2, `${fournisseur.nom} ${fournisseur.prenom}`)}
                                >
                                  Supprimer
                                </button>
                              </>
                            )}
                            {activeTab === 'inactif' && (
                              <>
                                <button
                                  className="btn btn-success btn-sm mr-2"
                                  onClick={() => handleChangerStatut(fournisseur.idFournisseur, 0, `${fournisseur.nom} ${fournisseur.prenom}`)}
                                >
                                  Rendre Actif
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleChangerStatut(fournisseur.idFournisseur, 2, `${fournisseur.nom} ${fournisseur.prenom}`)}
                                >
                                  Supprimer
                                </button>
                              </>
                            )}
                            {activeTab === 'erased' && (
                              <span>Archivé - {fournisseur.causeSuppression}</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5">Aucun fournisseur disponible</td></tr>
                    )}
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

export default FournisseurList;