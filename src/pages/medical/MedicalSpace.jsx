// src/pages/medical/MedicalSpace.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import medicalBackground from '../../assets/images/image.png'; // Chemin de l'image

const MedicalSpace = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div
        className="content-wrapper"
        style={{
          backgroundImage: `url(${medicalBackground})`,
          backgroundSize: 'cover', // Ajuste l'image pour couvrir tout l'espace
          backgroundPosition: 'center', // Centre l'image
          backgroundRepeat: 'no-repeat', // Évite la répétition
          minHeight: '100vh', // Assure que l'arrière-plan couvre toute la hauteur
          position: 'relative', // Nécessaire pour la superposition
        }}
      >
        {/* Superposition semi-transparente pour améliorer la lisibilité */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couche sombre semi-transparente
            zIndex: 1, // Place la superposition au-dessus de l'image
          }}
        />
        {/* Contenu principal */}
        <div className="content-header" style={{ position: 'relative', zIndex: 2 }}>
          <div className="container-fluid">
            <h1
              className="m-0 text-white"
              style={{
                fontSize: '2.5rem', // Taille plus grande
                fontWeight: 'bold', // Texte en gras
              }}
            >
              Espace Personnel Medical
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalSpace;