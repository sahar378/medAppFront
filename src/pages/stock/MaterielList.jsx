import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const MaterielList = () => {
  const navigate = useNavigate();
  const [materiels, setMateriels] = useState([]);
  const [filteredMateriels, setFilteredMateriels] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les matériels et alertes
        const materielsData = await authService.getActiveMateriels();
        const alertesData = await authService.verifierAlertesMateriels();
        setMateriels(materielsData);
        setFilteredMateriels(materielsData);
        setAlertes(alertesData);

        // Définir automatiquement les seuils pour la catégorie matériel (idCategorie: 1)
        await authService.definirSeuilsCategorieAutomatique(1);
        // Recharger les matériels et alertes après mise à jour des seuils
        const updatedMateriels = await authService.getActiveMateriels();
        const updatedAlertes = await authService.verifierAlertesMateriels();
        setMateriels(updatedMateriels);
        setFilteredMateriels(updatedMateriels); // Ne pas filtrer ici, laisser le second useEffect gérer
        setAlertes(updatedAlertes);
      } catch (error) {
        console.error('Erreur lors du chargement des données ou de la mise à jour des seuils', error);
        Swal.fire('Erreur', 'Erreur lors du chargement ou de la mise à jour des seuils', 'error');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = materiels.filter(produit =>
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMateriels(filtered);
  }, [searchTerm, materiels]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (produitId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce matériel ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authService.deleteProduit(produitId);
          const updatedMateriels = await authService.getActiveMateriels();
          const updatedAlertes = await authService.verifierAlertesMateriels();
          setMateriels(updatedMateriels);
          setFilteredMateriels(updatedMateriels.filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase())));
          setAlertes(updatedAlertes);
          Swal.fire('Succès', 'Matériel supprimé', 'success');
        } catch (error) {
          console.error('Erreur lors de l’archivage', error);
          Swal.fire('Erreur', 'Erreur lors de l’archivage', 'error');
        }
      }
    });
  };

  const handleCommander = () => {
    navigate('/stock/commande/materiel');
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Liste des matériels</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            {alertes.length > 0 && (
              <div className="card mb-3" style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>
                <div className="card-body" style={{ color: '#721c24' }}>
                  <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    <i className="fas fa-exclamation-triangle mr-2" /> Alertes de Stock
                  </h5>
                  <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
                    {alertes.map(dto => (
                      <li key={dto.produit.idProduit} style={{ marginBottom: '5px' }}>
                        <span
                          style={{ fontWeight: 'bold' }}
                          dangerouslySetInnerHTML={{
                            __html: dto.messages.join('<br />'),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="form-group mb-0" style={{ maxWidth: '300px' }}>
                    <label>Rechercher par nom :</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entrez le nom du matériel"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div>
                    <button className="btn btn-success" onClick={handleCommander}>
                      Commander
                    </button>
                  </div>
                </div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Description</th>
                      <th>Quantité</th>
                      <th>Seuil</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMateriels.map(produit => (
                      <tr key={produit.idProduit}>
                        <td>{produit.nom}</td>
                        <td>{produit.description}</td>
                        <td>{produit.qteDisponible}</td>
                        <td>{produit.seuilAlerte}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm mr-2"
                            onClick={() => navigate(`/stock/edit/${produit.idProduit}`)}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(produit.idProduit)}
                          >
                            Supprimer
                          </button>
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

export default MaterielList;