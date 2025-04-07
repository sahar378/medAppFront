//src/AppRouter.jsx
//Définit les routes de l’application et leurs protections.
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import ChangePassword from './pages/auth/ChangePassword';
import IntendantSpace from './pages/intendant/IntendantSpace';
import Habilitation from './pages/intendant/Habilitation';
import Profile from './pages/Profile';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import AddAgent from './pages/intendant/AddAgent';
import AgentDetails from './pages/intendant/AgentDetails';
import StockSpace from './pages/stock/StockSpace';
import MedicalSpace from './pages/medical/MedicalSpace';
import AddProduit from './pages/stock/AddProduit'; // Nouvelle page
import MedicamentList from './pages/stock/MedicamentList'; // Nouvelle importation
import MaterielList from './pages/stock/MaterielList'; // Nouvelle importation
import EditProduit from './pages/stock/EditProduit'; // Nouvelle importation
import RoleSelection from './pages/RoleSelection'; // Nouvelle importation
import IntendantStockLog from './pages/intendant/IntendantStockLog';
import FournisseurList from './pages/stock/FournisseurList';
import AddFournisseur from './pages/stock/AddFournisseur';
import FournisseurDetails from './pages/stock/FournisseurDetails';
import AssocierProduitFournisseur from './pages/stock/AssocierProduitFournisseur';
import FournisseurOverview from './pages/intendant/FournisseurOverview'; // Nouvelle page pour INTENDANT
import CommandeForm from './pages/stock/CommandeForm'; // Nouvelle importation
import ActiveMedicaments from './pages/intendant/ActiveMedicaments';
import ActiveMateriels from './pages/intendant/ActiveMateriels';
import ArchivedMedicaments from './pages/intendant/ArchivedMedicaments';
import ArchivedMateriels from './pages/intendant/ArchivedMateriels';
import BonCommandeList from './pages/stock/BonCommandeList'; // Nouvelle page
import IntendantBonCommandeList from './pages/intendant/IntendantBonCommandeList'; // Nouvelle page
import BonCommandeDetails from './pages/intendant/BonCommandeDetails'; // Nouvelle importation
import BonsApprouves from './pages/stock/BonsApprouves';
import ListeProduitsPrix from './pages/stock/ListeProduitsPrix';
import ControlePrix from './pages/intendant/ControlePrix';
import ListeLivraisons from './pages/ListeLivraisons';
import AjouterLivraison from './pages/stock/AjouterLivraison';
import GestionPrixProduit from './pages/stock/GestionPrixProduit';
import CreerBonCommande from './pages/stock/CreerBonCommande'; // Nouvelle importation
import BonsHistorique from './pages/stock/BonsHistorique';
import IntendantBonsAnnules from './pages/intendant/IntendantBonsAnnules';

import FaireInventaire from './pages/medical/FaireInventaire'; // Nouvelle importation
import HistoriqueInventaires from './pages/HistoriqueInventaires'; // Nouvelle importation
import DetailsInventaire from './pages/DetailsInventaire';

import Notifications from './pages/stock/Notifications';
import CreerNotification from './pages/intendant/CreerNotification';
import FournisseurDetailsReadOnly from './pages/intendant/FournisseurDetailsReadOnly';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/role-selection" element={<RoleSelection />} /> {/* Nouvelle route */}
      <Route element={<PrivateRoute requiredRole="INTENDANT" />}>
        <Route path="/intendant" element={<IntendantSpace />} />
        <Route path="/intendant/habilitation" element={<Habilitation />} />
        <Route path="/intendant/agents/add" element={<AddAgent />} />
        <Route path="/intendant/agents/:userId" element={<AgentDetails />} />
        <Route path="/intendant/stock/active/medicaments" element={<ActiveMedicaments />} />
        <Route path="/intendant/stock/active/materiels" element={<ActiveMateriels />} />
        <Route path="/intendant/stock/archived/medicaments" element={<ArchivedMedicaments />} />
        <Route path="/intendant/stock/archived/materiels" element={<ArchivedMateriels />} />
        <Route path="/intendant/logs/:produitId" element={<IntendantStockLog />} />
        <Route path="/intendant/fournisseurs" element={<FournisseurOverview />} /> {/* Lecture seule */}
        <Route path="/intendant/fournisseurs/details/:id" element={<FournisseurDetailsReadOnly />} />
        <Route path="/intendant/bons-commande" element={<IntendantBonCommandeList />} /> {/* Nouvelle route */}
        <Route path="/intendant/bons-annules" element={< IntendantBonsAnnules/>} />
        <Route path="/intendant/bons-commande/:idBonCommande" element={<BonCommandeDetails />} /> {/* Nouvelle route */}
        <Route path="/intendant/prix" element={<ControlePrix />} />
        <Route path="/intendant/notifications/creer" element={<CreerNotification />} />


      </Route>
      <Route element={<PrivateRoute requiredRole="RESPONSABLE_STOCK" />}>
        <Route path="/stock" element={<StockSpace />} />
        <Route path="/stock/add" element={<AddProduit />} />
        <Route path="/stock/medicaments" element={<MedicamentList />} /> {/* Nouvelle route */}
        <Route path="/stock/materiels" element={<MaterielList />} /> {/* Nouvelle route */}
        <Route path="/stock/edit/:produitId" element={<EditProduit />} /> {/* Nouvelle route */}
        <Route path="/stock/fournisseurs" element={<FournisseurList />} />
        <Route path="/stock/fournisseurs/add" element={<AddFournisseur />} />
        <Route path="/stock/fournisseurs/:id" element={<FournisseurDetails />} />
        <Route path="/stock/fournisseurs/associer" element={<AssocierProduitFournisseur />} />
        <Route path="/stock/commande/:type" element={<CommandeForm />} /> {/* Nouvelle route */}
        <Route path="/stock/bons-commande" element={<BonCommandeList />} /> {/* Nouvelle route */}
        <Route path="/stock/bons-approuves" element={<BonsApprouves />} /> {/* Nouvelle route */}
        <Route path="/stock/produits-prix" element={<ListeProduitsPrix />} />
        <Route path="/stock/ajouter-livraison" element={<AjouterLivraison />} />
        <Route path="/stock/prix/produit/:produitId" element={<GestionPrixProduit />} />
        <Route path="/stock/creer-bon-commande" element={<CreerBonCommande />} /> {/* Nouvelle route */}
        <Route path="/stock/bons-historique" element={<BonsHistorique />} />
        <Route path="/stock/bons-historique/:idBonCommande" element={<BonCommandeDetails readOnly={true} />} />
        <Route path="/stock/notifications" element={<Notifications />} />
        {/* Autres routes pour RESPONSABLE_STOCK */}
      </Route>

      <Route element={<PrivateRoute requiredRole="PERSONNEL_MEDICAL" />}>
        <Route path="/medical" element={<MedicalSpace />} />
        <Route path="/medical/faire-inventaire" element={<FaireInventaire />} /> {/* Nouvelle route */}
      </Route>

      {/* Routes pour INTENDANT et RESPONSABLE_STOCK */}
      <Route element={<PrivateRoute requiredRoles={["INTENDANT", "RESPONSABLE_STOCK"]} />}>
        <Route path="/liste-livraisons" element={<ListeLivraisons />} />
        <Route path="/historique-inventaires" element={<HistoriqueInventaires />} />
        <Route path="/details-inventaire/:id" element={<DetailsInventaire />} />
      </Route>

      {/* Route pour ListeLivraisons avec rôles multiples */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRouter;