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
              <div className="col-md-4 mb-4">
                <Link to="/intendant/habilitation" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-primary text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-users-cog fa-3x mb-3" />
                      <h5 className="card-title">Habilitation des agents</h5>
                      <p className="card-text">Gérez les habilitations du personnel.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/agents/add" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-purple text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-user-plus fa-3x mb-3" />
                      <h5 className="card-title">Ajouter un personnel</h5>
                      <p className="card-text">Ajoutez un nouveau membre au personnel.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/stock/active/medicaments" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-info text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-pills fa-3x mb-3" />
                      <h5 className="card-title">Consulter stock</h5>
                      <p className="card-text">Vérifiez les niveaux de stock actuels.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/bons-commande" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-warning text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-file-alt fa-3x mb-3" />
                      <h5 className="card-title">Gestion des bons de commande</h5>
                      <p className="card-text">Approuver ou gérer les bons de commande.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/liste-livraisons" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-secondary text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-truck fa-3x mb-3" />
                      <h5 className="card-title">Historique des livraisons</h5>
                      <p className="card-text">Consultez les livraisons effectuées.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/fournisseurs" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-indigo text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-truck fa-3x mb-3" />
                      <h5 className="card-title">Fournisseurs</h5>
                      <p className="card-text">Consultez la liste des fournisseurs.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/prix" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-teal text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-money-check-alt fa-3x mb-3" />
                      <h5 className="card-title">Contrôle des prix</h5>
                      <p className="card-text">Vérifiez et signalez les prix des produits.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/bons-annules" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-danger text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-times-circle fa-3x mb-3" />
                      <h5 className="card-title">Bons annulés</h5>
                      <p className="card-text">Consultez les bons de commande annulés.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/historique-inventaires" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-maroon text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-history fa-3x mb-3" />
                      <h5 className="card-title">Historique des Inventaires</h5>
                      <p className="card-text">Consultez l’historique des inventaires.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/reclamations" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-amber text-black"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-exclamation-triangle fa-3x mb-3" />
                      <h5 className="card-title">Liste des Réclamations</h5>
                      <p className="card-text">Consultez les interventions en cours.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/machines" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-olive text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-cogs fa-3x mb-3" />
                      <h5 className="card-title">Liste des Machines</h5>
                      <p className="card-text">Consultez les machines disponibles.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/techniciens" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-navy text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-user-cog fa-3x mb-3" />
                      <h5 className="card-title">Liste des Techniciens</h5>
                      <p className="card-text">Consultez les techniciens enregistrés.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/notifications/creer" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-yellow text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-plus-circle fa-3x mb-3" />
                      <h5 className="card-title">Créer une Notification</h5>
                      <p className="card-text">Envoyer un message aux responsables.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/stock/produits-usage" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-lime text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-clipboard-list fa-3x mb-3" />
                      <h5 className="card-title">Produits utilisés</h5>
                      <p className="card-text">Consultez les produits utilisés par le personnels médical .</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/stock/produits-standards" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-orange text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-exclamation-circle fa-3x mb-3" />
                      <h5 className="card-title">Produits standards</h5>
                      <p className="card-text">Vérifiez la quantités disponibles des produits standards.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/intendant/patients" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-cyan text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-users fa-3x mb-3" />
                      <h5 className="card-title">Liste des Patients</h5>
                      <p className="card-text">Consultez la liste des patients.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/medical/seances" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-pink text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-calendar-check fa-3x mb-3" />
                      <h5 className="card-title">Séances Effectuées</h5>
                      <p className="card-text">Consultez les séances effectuées.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-4">
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-dark text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-user fa-3x mb-3" />
                      <h5 className="card-title">Voir mon profil</h5>
                      <p className="card-text">Consultez ou modifiez vos informations.</p>
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