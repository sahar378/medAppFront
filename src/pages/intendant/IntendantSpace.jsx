//src/pages/intendant/IntendantSpace.jsx
//Page principale de l’intendant avec un lien vers la gestion des habilitations.
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const IntendantSpace = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Espace Intendant</h1>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <p>Bienvenue dans votre espace intendant.</p>
                <Link to="/intendant/habilitation" className="btn btn-primary mr-2">Habilitation des agents</Link>
                <Link to="/agent/profile" className="btn btn-info mr-2">Voir mon profil</Link>
                <Link to="/intendant/agents/add" className="btn btn-success mr-2">Ajouter un personnel</Link>
                <Link to="/intendant/agents" className="btn btn-info">Liste de personnels</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntendantSpace;