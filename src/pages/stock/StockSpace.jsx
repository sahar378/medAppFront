// src/pages/stock/StockSpace.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

// Import de l'image (à placer dans src/assets/images/)
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
        {/* Superposition pour améliorer la lisibilité du texte */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Superposition sombre semi-transparente
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
              {/* Carte 1 : Ajouter un produit */}
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
              {/* Carte 2 : Liste des médicaments */}
              <div className="col-md-4">
                <Link to="/stock/medicaments" style={{ textDecoration: 'none' }}>
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-pills fa-3x mb-3"></i>
                      <h5>Liste des médicaments</h5>
                      <p>Consultez la liste des médicaments en stock.</p>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Carte 3 : Liste des matériels */}
              <div className="col-md-4">
                <Link to="/stock/materiels" style={{ textDecoration: 'none' }}>
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-tools fa-3x mb-3"></i>
                      <h5>Liste des matériels</h5>
                      <p>Consultez la liste des matériels disponibles.</p>
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