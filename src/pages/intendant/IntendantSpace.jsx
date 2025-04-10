// src/pages/intendant/IntendantSpace.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import intendantBackground from '../../assets/images/intendant-background.jpg';

const IntendantSpace = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div
        className="content-wrapper"
        style={{
          backgroundImage: `url(${intendantBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
        <div className="content-header" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <h1 className="m-0 text-white" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              Espace Intendant
            </h1>
          </div>
        </div>
        <section className="content" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                <Link to="/intendant/habilitation" style={{ textDecoration: 'none' }}>
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user-check fa-3x mb-3" />
                      <h5>Habilitation des agents</h5>
                      <p>Gérez les habilitations du personnel.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/intendant/agents/add" style={{ textDecoration: 'none' }}>
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user-plus fa-3x mb-3" />
                      <h5>Ajouter un personnel</h5>
                      <p>Ajoutez un nouveau membre au personnel.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/intendant/stock/active/medicaments" style={{ textDecoration: 'none' }}>
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-warehouse fa-3x mb-3" />
                      <h5>Consulter stock</h5>
                      <p>Vérifiez les niveaux de stock actuels.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/intendant/bons-commande" style={{ textDecoration: 'none' }}>
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-file-alt fa-3x mb-3" />
                      <h5>Gestion des bons de commande</h5>
                      <p>Approuver ou gérer les bons de commande.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/liste-livraisons" style={{ textDecoration: 'none' }}>
                  <div className="card bg-dark text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-truck fa-3x mb-3" />
                      <h5>Historique des livraisons</h5>
                      <p>Consultez les livraisons effectuées.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/intendant/fournisseurs" style={{ textDecoration: 'none' }}>
                  <div className="card bg-purple text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-truck-loading fa-3x mb-3" />
                      <h5>Fournisseurs</h5>
                      <p>Consultez la liste des fournisseurs.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/intendant/prix" style={{ textDecoration: 'none' }}>
                  <div className="card bg-teal text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-money-check-alt fa-3x mb-3" />
                      <h5>Contrôle des prix</h5>
                      <p>Vérifiez et signalez les prix des produits.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/intendant/bons-annules" style={{ textDecoration: 'none' }}>
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-times-circle fa-3x mb-3" />
                      <h5>Bons annulés</h5>
                      <p>Consultez les bons de commande annulés.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/historique-inventaires" style={{ textDecoration: 'none' }}>
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-history fa-3x mb-3" />
                      <h5>Historique des Inventaires</h5>
                      <p>Consultez l’historique des inventaires.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/intendant/reclamations" style={{ textDecoration: 'none' }}>
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-tools fa-3x mb-3" />
                      <h5>Liste des Réclamations</h5>
                      <p>Consultez les interventions en cours.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/intendant/machines" style={{ textDecoration: 'none' }}>
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-cogs fa-3x mb-3" />
                      <h5>Liste des Machines</h5>
                      <p>Consultez les machines disponibles.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/intendant/techniciens" style={{ textDecoration: 'none' }}>
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user-cog fa-3x mb-3" />
                      <h5>Liste des Techniciens</h5>
                      <p>Consultez les techniciens enregistrés.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/intendant/notifications/creer" style={{ textDecoration: 'none' }}>
                  <div className="card bg-secondary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-bell fa-3x mb-3" />
                      <h5>Créer une Notification</h5>
                      <p>Envoyer un message aux responsables.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mt-4">
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div className="card bg-dark text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user fa-3x mb-3" />
                      <h5>Voir mon profil</h5>
                      <p>Consultez ou modifiez vos informations.</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntendantSpace;