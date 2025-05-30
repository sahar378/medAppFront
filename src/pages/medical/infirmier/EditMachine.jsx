import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import authService from '../../../services/authService';
import Swal from 'sweetalert2';

const EditMachine = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    dateMiseEnService: '',
    type: '',
    constructeur: '',
    fournisseur: '',
    caracteristique: '',
    voltage: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const data = await authService.getMachineById(id);
        setFormData({
          dateMiseEnService: new Date(data.dateMiseEnService).toISOString().split('T')[0],
          type: data.type || '',
          constructeur: data.constructeur || '',
          fournisseur: data.fournisseur || '',
          caracteristique: data.caracteristique || '',
          voltage: data.voltage || '',
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire('Erreur', 'Impossible de charger la machine', 'error');
      }
    };
    fetchMachine();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required field
    if (!formData.dateMiseEnService) {
      Swal.fire('Erreur', 'La date de mise en service est obligatoire', 'error');
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirmer la modification',
      text: 'Êtes-vous sûr de vouloir mettre à jour les informations de cette machine ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, mettre à jour',
      cancelButtonText: 'Annuler',
    });

    // Proceed only if the user confirms
    if (result.isConfirmed) {
      try {
        await authService.updateMachine(id, formData);
        Swal.fire('Succès', 'Machine mise à jour', 'success');
        navigate('/medical/infirmier/machines/list');
      } catch (error) {
        console.error(error);
        Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <h1 className="m-0">Modifier la Machine #{id}</h1>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Date Mise en Service :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateMiseEnService"
                      value={formData.dateMiseEnService}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type (optionnel) :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Constructeur (optionnel) :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="constructeur"
                      value={formData.constructeur}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fournisseur (optionnel) :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fournisseur"
                      value={formData.fournisseur}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Caractéristiques (optionnel) :</label>
                    <textarea
                      className="form-control"
                      name="caracteristique"
                      value={formData.caracteristique}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Voltage (optionnel) :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="voltage"
                      value={formData.voltage}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Mettre à jour</button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => navigate('/medical/infirmier/machines/list')}
                  >
                    Annuler
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditMachine;