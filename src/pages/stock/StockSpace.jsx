// src/pages/stock/StockSpace.jsx
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
              {/* Gestion de Stock */}
              <div className="col-md-4">
                <Link to="/stock/add" style={{ textDecoration: 'none' }}>
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-plus-circle fa-3x mb-3"></i>
                      <h5>Ajouter un produit</h5>
                      <p>Ajoutez de nouveaux produits au stock.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/stock/medicaments" style={{ textDecoration: 'none' }}>
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-pills fa-3x mb-3"></i>
                      <h5>Liste des médicaments</h5>
                      <p>Consultez les médicaments en stock.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/stock/materiels" style={{ textDecoration: 'none' }}>
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-tools fa-3x mb-3"></i>
                      <h5>Liste des matériels</h5>
                      <p>Consultez les matériels disponibles.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Gestion des Livraisons */}
              <div className="col-md-4 mt-4">
                <Link to="/stock/ajouter-livraison" style={{ textDecoration: 'none' }}>
                  <div className="card bg-secondary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-shipping-fast fa-3x mb-3"></i>
                      <h5>Ajouter une livraison</h5>
                      <p>Enregistrez une nouvelle livraison.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mt-4">
                <Link to="/liste-livraisons" style={{ textDecoration: 'none' }}>
                  <div className="card bg-dark text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-3x mb-3"></i>
                      <h5>Liste des livraisons</h5>
                      <p>Voir toutes les livraisons enregistrées.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Gestion des Fournisseurs */}
              <div className="col-md-4 mt-4">
                <Link to="/stock/fournisseurs" style={{ textDecoration: 'none' }}>
                  <div className="card bg-teal text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-truck fa-3x mb-3"></i>
                      <h5>Gestion des fournisseurs</h5>
                      <p>Liste, ajout et association de fournisseurs.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Gestion des Bons de Commande */}
              <div className="col-md-4 mt-4">
                <Link to="/stock/creer-bon-commande" style={{ textDecoration: 'none' }}>
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-cart-plus fa-3x mb-3"></i>
                      <h5>Créer un bon de commande</h5>
                      <p>Préparez une nouvelle commande.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mt-4">
                <Link to="/stock/bons-commande" style={{ textDecoration: 'none' }}>
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-file-alt fa-3x mb-3"></i>
                      <h5>Gérer les bons de commande</h5>
                      <p>Modifiez ou validez vos bons en attente.</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mt-4">
                <Link to="/stock/bons-historique" style={{ textDecoration: 'none' }}>
                  <div className="card bg-light text-dark">
                    <div className="card-body text-center">
                      <i className="fas fa-history fa-3x mb-3"></i>
                      <h5>Historique des bons</h5>
                      <p>Consultez l’historique des commandes.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Gestion des Prix */}
              <div className="col-md-4 mt-4">
                <Link to="/stock/produits-prix" style={{ textDecoration: 'none' }}>
                  <div className="card bg-purple text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-list-alt fa-3x mb-3"></i>
                      <h5>Produits & Prix</h5>
                      <p>Gérez les prix des produits.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Historique des Inventaires */}
              <div className="col-md-4 mt-4">
                <Link to="/historique-inventaires" style={{ textDecoration: 'none' }}>
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-history fa-3x mb-3"></i>
                      <h5>Historique des Inventaires</h5>
                      <p>Consultez l’historique des inventaires.</p>
                    </div>
                  </div>
                </Link>
              </div>
<div className="col-md-4 mt-4">
  <Link to="/stock/notifications" style={{ textDecoration: 'none' }}>
    <div className="card bg-primary text-white">
      <div className="card-body text-center">
        <i className="fas fa-bell fa-3x mb-3" />
        <h5>Notifications</h5>
        <p>Voir les signalements et alertes</p>
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