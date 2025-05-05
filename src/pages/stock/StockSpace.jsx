import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import stockBackground from '../../assets/images/stock-background.jpg';

const StockSpace = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div
        className="content-wrapper"
        style={{
          backgroundImage: `url(${stockBackground})`,
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
            <h1
              className="m-0 text-white"
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
              }}
            >
              Espace Responsable de Stock
            </h1>
          </div>
        </div>
        <section className="content" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <div className="row">
              {/* Ajouter un produit */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/add" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-success text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-plus-circle fa-3x mb-3"></i>
                      <h5 className="card-title">Ajouter un produit</h5>
                      <p className="card-text">Ajoutez de nouveaux produits au stock.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Liste des médicaments */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/medicaments" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-primary text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-pills fa-3x mb-3"></i>
                      <h5 className="card-title">Liste des médicaments</h5>
                      <p className="card-text">Consultez les médicaments en stock.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Liste des matériels */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/materiels" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-teal text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-tools fa-3x mb-3"></i>
                      <h5 className="card-title">Liste des matériels</h5>
                      <p className="card-text">Consultez les matériels disponibles.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Ajouter une livraison */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/ajouter-livraison" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-purple text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-shipping-fast fa-3x mb-3"></i>
                      <h5 className="card-title">Ajouter une livraison</h5>
                      <p className="card-text">Enregistrez une nouvelle livraison.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Liste des livraisons */}
              <div className="col-md-4 mb-4">
                <Link to="/liste-livraisons" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-dark text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-list fa-3x mb-3"></i>
                      <h5 className="card-title">Liste des livraisons</h5>
                      <p className="card-text">Voir toutes les livraisons enregistrées.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Gestion des fournisseurs */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/fournisseurs" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-warning text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-truck fa-3x mb-3"></i>
                      <h5 className="card-title">Gestion des fournisseurs</h5>
                      <p className="card-text">Liste, ajout et association de fournisseurs.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Créer un bon de commande */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/creer-bon-commande" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-danger text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-cart-plus fa-3x mb-3"></i>
                      <h5 className="card-title">Créer un bon de commande</h5>
                      <p className="card-text">Préparez une nouvelle commande.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Gérer les bons de commande */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/bons-commande" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-maroon text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-file-alt fa-3x mb-3"></i>
                      <h5 className="card-title">Gérer les bons de commande</h5>
                      <p className="card-text">Modifiez ou validez vos bons en attente.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Historique des bons */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/bons-historique" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-secondary text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-history fa-3x mb-3"></i>
                      <h5 className="card-title">Historique des bons</h5>
                      <p className="card-text">Consultez l’historique des commandes.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Produits & Prix */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/produits-prix" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-indigo text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-list-alt fa-3x mb-3"></i>
                      <h5 className="card-title">Produits & Prix</h5>
                      <p className="card-text">Gérez les prix des produits.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Historique des Inventaires */}
              <div className="col-md-4 mb-4">
                <Link to="/historique-inventaires" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-info text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-history fa-3x mb-3"></i>
                      <h5 className="card-title">Historique des Inventaires</h5>
                      <p className="card-text">Consultez l’historique des inventaires.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Notifications */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/notifications" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-warning text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-bell fa-3x mb-3"></i>
                      <h5 className="card-title">Notifications</h5>
                      <p className="card-text">Voir les signalements et alertes.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Produits Utilisés par Séance */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/produits-usage" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-info text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-boxes fa-3x mb-3"></i>
                      <h5 className="card-title">Produits Utilisés par Séance</h5>
                      <p className="card-text">Consultez les produits utilisés par séance.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Produits Standards des Patients */}
              <div className="col-md-4 mb-4">
                <Link to="/stock/produits-standards" style={{ textDecoration: 'none' }}>
                  <div
                    className="card bg-olive text-white"
                    style={{ height: '200px', width: '100%' }}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <i className="fas fa-user-md fa-3x mb-3"></i>
                      <h5 className="card-title">Produits Standards des Patients</h5>
                      <p className="card-text">Gérez les produits standards des patients.</p>
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

export default StockSpace;