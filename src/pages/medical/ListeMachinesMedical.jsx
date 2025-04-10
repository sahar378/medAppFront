// src/pages/medical/ListeMachinesMedical.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import Swal from 'sweetalert2';

const ListeMachinesMedical = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await authService.getMachinesByArchiveStatus('/machines/non-archived');
        setMachines(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchMachines();
  }, []);

  const handleEdit = (id) => {
    navigate(`/medical/machines/edit/${id}`);
  };

  const handleArchive = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment archiver cette machine ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, archiver',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authService.archiveMachine(id);
          setMachines(machines.filter((m) => m.idMachine !== id));
          Swal.fire('Succès', 'Machine archivée avec succès', 'success');
        } catch (error) {
          console.error(error);
          Swal.fire('Erreur', 'Erreur lors de l’archivage', 'error');
        }
      }
    });
  };

  const handleRowClick = (id) => {
    // Passer le rôle dans l'état de navigation
    navigate(`/machines/details/${id}`, { state: { from: 'medical' } });
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
                <h3 className="card-title">Machines Non Archivées</h3>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date Mise en Service</th>
                      <th>Disponibilité</th>
                      <th>Actions</th>
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
                          ) : (
                            <span className="badge bg-danger">En intervention</span>
                          )}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(machine.idMachine)}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn btn-danger btn-sm ml-2"
                            onClick={() => handleArchive(machine.idMachine)}
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

export default ListeMachinesMedical;