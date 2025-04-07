// src/pages/stock/AssocierProduitFournisseur.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const AssocierProduitFournisseur = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedFournisseurId, setSelectedFournisseurId] = useState('');
  const [produitsToAssocier, setProduitsToAssocier] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fournisseursData = await authService.getFournisseursByStatut(0); // Actifs uniquement
        const fournisseursInactifs = await authService.getFournisseursByStatut(1); // Inactifs
        const produitsData = await authService.getProduitsByUser();
        setFournisseurs([...fournisseursData, ...fournisseursInactifs]);
        setProduits(Array.isArray(produitsData) ? produitsData : []);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProduit = (produitId) => {
    const produit = produits.find(p => p.idProduit === parseInt(produitId));
    if (produit && !produitsToAssocier.some(p => p.idProduit === produit.idProduit)) {
      setProduitsToAssocier([...produitsToAssocier, { idProduit: produit.idProduit, nom: produit.nom }]);
      setSearchTerm('');
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveProduit = (index) => {
    setProduitsToAssocier(produitsToAssocier.filter((_, i) => i !== index));
  };

  const handleAssocier = async () => {
    if (!selectedFournisseurId || produitsToAssocier.length === 0) {
      Swal.fire('Erreur', 'Veuillez sélectionner un fournisseur et au moins un produit', 'error');
      return;
    }
    try {
      const produitIds = produitsToAssocier.map(produit => produit.idProduit);
      await authService.associerProduitsFournisseur(selectedFournisseurId, produitIds);
      Swal.fire('Succès', 'Produits associés au fournisseur', 'success');
      setProduitsToAssocier([]);
      navigate('/stock/produits-prix');
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de l’association', 'error');
    }
  };

  const filteredProduits = produits.filter(p =>
    !fournisseurs.find(f => f.idFournisseur === parseInt(selectedFournisseurId))?.produits?.some(fp => fp.idProduit === p.idProduit) &&
    p.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Associer des Produits à un Fournisseur</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <label>Fournisseur :</label>
                  <select
                    className="form-control"
                    value={selectedFournisseurId}
                    onChange={(e) => setSelectedFournisseurId(e.target.value)}
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {fournisseurs.map(f => (
                      <option key={f.idFournisseur} value={f.idFournisseur}>
                        {f.nom} ({f.statut === 0 ? 'Actif' : 'Inactif'})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ajouter un produit :</label>
                  <div className="position-relative" ref={dropdownRef}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                    {isDropdownOpen && filteredProduits.length > 0 && (
                      <ul
                        className="list-group position-absolute"
                        style={{
                          zIndex: 1000,
                          width: '100%',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        {filteredProduits.map(p => (
                          <li
                            key={p.idProduit}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAddProduit(p.idProduit)}
                          >
                            {p.nom}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {produitsToAssocier.length > 0 && (
                  <div className="mt-3">
                    <h6>Produits à associer :</h6>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produitsToAssocier.map((produit, index) => (
                          <tr key={index}>
                            <td>{produit.nom}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveProduit(index)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button className="btn btn-success" onClick={handleAssocier}>
                      Associer
                    </button>
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

export default AssocierProduitFournisseur;