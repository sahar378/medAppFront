import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ListeTechniciensMedical = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        let data;
        if (searchTerm.trim()) {
          data = await authService.searchTechniciens(searchTerm, false); // Force archived = false
        } else {
          data = await authService.getTechniciensByArchiveStatus('/techniciens/non-archived');
        }
        setTechniciens(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire('Erreur', 'Impossible de récupérer les techniciens', 'error');
      }
    };
    fetchTechniciens();
  }, [searchTerm]);

  const handleEdit = (id) => {
    navigate(`/medical/infirmier/techniciens/edit/${id}`);
  };

  const handleArchive = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment archiver ce technicien ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, archiver',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authService.archiveTechnicien(id);
          setTechniciens(techniciens.filter((t) => t.idTechnicien !== id));
          Swal.fire('Succès', 'Technicien archivé avec succès', 'success');
        } catch (error) {
          console.error(error);
          Swal.fire('Erreur', 'Erreur lors de l’archivage', 'error');
        }
      }
    });
  };

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
                <div className="input-group mb-3" style={{ maxWidth: '300px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un technicien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchTerm('')}>
                      Effacer
                    </button>
                  </div>
                </div>
                <h3 className="card-title">Techniciens Non Archivés</h3>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Société</th>
                      <th>Téléphone</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techniciens.map((technicien) => (
                      <tr key={technicien.idTechnicien}>
                        <td>{technicien.idTechnicien}</td>
                        <td>{technicien.nom}</td>
                        <td>{technicien.prenom || '-'}</td>
                        <td>{technicien.societe || '-'}</td>
                        <td>{technicien.telephone || '-'}</td>
                        <td>{technicien.email || '-'}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(technicien.idTechnicien)}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn btn-danger btn-sm ml-2"
                            onClick={() => handleArchive(technicien.idTechnicien)}
                          >
                            Archiver
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

export default ListeTechniciensMedical;