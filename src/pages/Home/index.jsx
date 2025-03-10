// src/pages/Home/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

// Import des images (à placer dans src/assets/images/)
import dialysisRoom1 from '../../assets/images/dialysis-room-1.jpg'; // Première image
import dialysisRoom2 from '../../assets/images/dialysis-room-2.jpg'; // Deuxième image
import dialysisRoom3 from '../../assets/images/dialysis-room-3.jpg'; // Troisième image

const Home = () => {
  const { isAuthenticated, userRoles, activeRole } = useAuth();
  const navigate = useNavigate();

  // État pour gérer l'image actuelle du diaporama
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [dialysisRoom1, dialysisRoom2, dialysisRoom3];

  // Changer l'image toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 secondes
    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, [images.length]);

  // Si plusieurs rôles et aucun activeRole défini, rediriger vers RoleSelection
  useEffect(() => {
    if (isAuthenticated && userRoles.length > 1 && !activeRole) {
      navigate('/role-selection');
    }
  }, [isAuthenticated, userRoles, activeRole, navigate]);

  return (
    <div className={`wrapper ${!isAuthenticated ? 'no-sidebar' : ''}`}>
      <Navbar />
      {isAuthenticated && <Sidebar />} {/* Sidebar uniquement si authentifié */}
      <div className="content-wrapper">
        {/* Section 1 : Diaporama */}
        <div
          className="slideshow-container"
          style={{
            position: 'relative',
            width: '100%',
            height: '500px', // Hauteur du diaporama (ajustable)
            overflow: 'hidden',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`slideshow-image ${index === currentImageIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out', // Animation de transition
              }}
            />
          ))}
          {/* Superposition pour améliorer la lisibilité du texte */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)', // Superposition sombre
              zIndex: 1,
            }}
          />
          {/* Titre centré sur le diaporama */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem', fontWeight: '400' }}>
              Bienvenue au Clinique d'Hémodialyse AlRimmel à Kebili
            </h1>
            <p
              style={{
                fontSize: '2rem',
                fontWeight: '400',
                whiteSpace: 'nowrap', // Pas de retour à la ligne
                overflow: 'hidden',
                textOverflow: 'ellipsis', // Si le texte dépasse, ajouter des points de suspension
                maxWidth: '100%', // Limite la largeur pour éviter le débordement
              }}
            >
              Votre partenaire de confiance pour des soins d'hémodialyse de qualité à Kebili
            </p>
          </div>
        </div>

        {/* Section 2 : Contenu principal */}
        <section className="content">
          <div className="container-fluid">
            {/* À propos de nous */}
            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title custom-title">
                  <i className="fas fa-info-circle"></i> À propos de nous
                </h5>
                <br /> {/* Ajout d'un retour à la ligne après le titre */}
                <br /> {/* Ajout d'un retour à la ligne après le titre */}
                <br /> 
                <p>
                  Le Centre AlRimel Hémodialyse est dédié à offrir des soins de haute qualité aux patients souffrant d'insuffisance rénale chronique. <br />
                  Que vous soyez un patient local ou en vacances, notre équipe de professionnels expérimentés est là pour vous accompagner avec un service personnalisé, dans un environnement moderne et confortable.
                </p>
                <p>
                  Nous mettons un point d’honneur à garantir votre bien-être grâce à des équipements de pointe <br />
                  et un suivi médical rigoureux.
                </p>
              </div>
            </div>

            {/* Informations pratiques */}
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title custom-title">
                  <i className="fas fa-address-book"></i> Informations pratiques
                </h5>
                <br /> {/* Ajout d'un retour à la ligne après le titre */}
                <br /> {/* Ajout d'un retour à la ligne après le titre */}

                <ul className="list-unstyled">
                  <li>
                    <strong>Horaires :</strong> Lundi au Samedi, 24h
                  </li>
                  <li>
                    <strong>Contact :</strong>{' '}
                    <a href="tel:+21695739163" className="text-primary">
                      +216 95 739 163
                    </a>
                  </li>
                  <li>
                    <strong>Adresse :</strong> Kebili
                  </li>
                </ul>
                <p>
                  Pour planifier votre séance d'hémodialyse ou obtenir plus d'informations,
                  n'hésitez pas à nous contacter.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Ajout de styles CSS pour éliminer l'espace de la Sidebar et styliser les titres
const styles = `
  .wrapper.no-sidebar .main-sidebar {
    display: none;
  }
  .wrapper.no-sidebar .content-wrapper {
    margin-left: 0 !important; /* Supprime la marge gauche réservée à la Sidebar */
  }
  .custom-title {
    font-size: 1.75rem; /* Taille plus grande */
    color: #007bff; /* Bleu médical */
    text-align: center; /* Centré */
    padding-bottom: 10px; /* Espacement sous le titre */
    border-bottom: 2px solid #007bff; /* Bordure inférieure décorative */
    margin-bottom: 0; /* Supprime la marge par défaut pour laisser place au <br /> */
  }
  .custom-title i {
    color: #007bff; /* Couleur de l'icône */
    margin-right: 8px; /* Espacement entre l'icône et le texte */
  }
`;

// Injecter les styles dans le document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Home;