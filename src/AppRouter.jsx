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
import AddProduit from './pages/stock/AddProduit';
import MedicamentList from './pages/stock/MedicamentList';
import MaterielList from './pages/stock/MaterielList';
import EditProduit from './pages/stock/EditProduit';
import RoleSelection from './pages/RoleSelection';
import IntendantStockLog from './pages/intendant/IntendantStockLog';
import FournisseurList from './pages/stock/FournisseurList';
import AddFournisseur from './pages/stock/AddFournisseur';
import FournisseurDetails from './pages/stock/FournisseurDetails';
import AssocierProduitFournisseur from './pages/stock/AssocierProduitFournisseur';
import FournisseurOverview from './pages/intendant/FournisseurOverview';
import CommandeForm from './pages/stock/CommandeForm';
import ActiveMedicaments from './pages/intendant/ActiveMedicaments';
import ActiveMateriels from './pages/intendant/ActiveMateriels';
import ArchivedMedicaments from './pages/intendant/ArchivedMedicaments';
import ArchivedMateriels from './pages/intendant/ArchivedMateriels';
import BonCommandeList from './pages/stock/BonCommandeList';
import IntendantBonCommandeList from './pages/intendant/IntendantBonCommandeList';
import BonCommandeDetails from './pages/intendant/BonCommandeDetails';
import ListeProduitsPrix from './pages/stock/ListeProduitsPrix';
import ControlePrix from './pages/intendant/ControlePrix';
import ListeLivraisons from './pages/ListeLivraisons';
import AjouterLivraison from './pages/stock/AjouterLivraison';
import GestionPrixProduit from './pages/stock/GestionPrixProduit';
import CreerBonCommande from './pages/stock/CreerBonCommande';
import BonsHistorique from './pages/stock/BonsHistorique';
import IntendantBonsAnnules from './pages/intendant/IntendantBonsAnnules';
import FaireInventaire from './pages/medical/infirmier/FaireInventaire';
import HistoriqueInventaires from './pages/HistoriqueInventaires';
import DetailsInventaire from './pages/DetailsInventaire';
import Notifications from './pages/stock/Notifications';
import CreerNotification from './pages/intendant/CreerNotification';
import FournisseurDetailsReadOnly from './pages/intendant/FournisseurDetailsReadOnly';
import SuperAdminSpace from './pages/super-admin/SuperAdminSpace';
import IntendantManagement from './pages/super-admin/IntendantManagement';
import GestionReclamations from './pages/medical/infirmier/GestionReclamations';
import ListeReclamationsIntendant from './pages/intendant/ListeReclamationsIntendant';
import ListeMachinesIntendant from './pages/intendant/ListeMachinesIntendant';
import ListeTechniciensIntendant from './pages/intendant/ListeTechniciensIntendant';
import AjoutMachine from './pages/medical/infirmier/AjoutMachine';
import AjoutTechnicien from './pages/medical/infirmier/AjoutTechnicien';
import EditTechnicien from './pages/medical/infirmier/EditTechnicien';
import EditMachine from './pages/medical/infirmier/EditMachine';
import EditIntervention from './pages/medical/infirmier/EditIntervention';
import ListeTechniciensMedical from './pages/medical/infirmier/ListeTechniciensMedical';
import ListeMachinesMedical from './pages/medical/infirmier/ListeMachinesMedical';
import ListeReclamationsMedical from './pages/medical/infirmier/ListeReclamationsMedical';
import CloseIntervention from './pages/medical/infirmier/CloseIntervention';
import MachineDetails from './pages/MachineDetails';
import InfirmierSpace from './pages/medical/infirmier/InfirmierSpace';
import MedecinSpace from './pages/medical/medecin/MedecinSpace';
import GererSeances from './pages/medical/GererSeances';
import CreateSeance from './pages/medical/CreateSeance';
import SeanceDetails from './pages/medical/SeanceDetails';
import EditSeance from './pages/medical/EditSeance';
import AllProduitsStandardsList from './pages/medical/AllProduitsStandardsList';
import DetailSeance from './pages/medical/DetailSeance';
import SeanceProduitsUsage from './pages/medical/SeanceProduitsUsage';
import PatientsList from './pages/medical/medecin/PatientsList';
import PatientDetails from './pages/medical/medecin/PatientDetails';
import CreatePatient from './pages/medical/medecin/CreatePatient';
import EditPatient from './pages/medical/medecin/EditPatient';
import IntendantPatientsList from './pages/intendant/IntendantPatientsList';
import IntendantPatientDialysisHistory from './pages/intendant/IntendantPatientDialysisHistory';
import MedicalPatientsList from './pages/medical/MedicalPatientsList';
import MedicalPatientDialysisHistory from './pages/medical/MedicalPatientDialysisHistory';
import EditSeanceProduits from './pages/medical/EditSeanceProduits';
import SeanceProduitsDetails from './pages/medical/SeanceProduitsDetails';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/role-selection" element={<RoleSelection />} />
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
        <Route path="/intendant/fournisseurs" element={<FournisseurOverview />} />
        <Route path="/intendant/fournisseurs/details/:id" element={<FournisseurDetailsReadOnly />} />
        <Route path="/intendant/bons-commande" element={<IntendantBonCommandeList />} />
        <Route path="/intendant/bons-annules" element={<IntendantBonsAnnules />} />
        <Route path="/intendant/bons-commande/:idBonCommande" element={<BonCommandeDetails />} />
        <Route path="/intendant/prix" element={<ControlePrix />} />
        <Route path="/intendant/notifications/creer" element={<CreerNotification />} />
        <Route path="/intendant/prix/:produitId" element={<ControlePrix />} />
        <Route path="/intendant/notifications" element={<Notifications />} />
        <Route path="/intendant/reclamations" element={<ListeReclamationsIntendant />} />
        <Route path="/intendant/machines" element={<ListeMachinesIntendant />} />
        <Route path="/intendant/techniciens" element={<ListeTechniciensIntendant />} />
        <Route path="/stock/produits-usage" element={<SeanceProduitsUsage />} />
        <Route path="/stock/produits-standards" element={<AllProduitsStandardsList />} />
        <Route path="/intendant/patients" element={<IntendantPatientsList />} />
        <Route path="/intendant/patients/:patientId/dialysis-history" element={<IntendantPatientDialysisHistory />} />
        <Route path="/medical/seances" element={<GererSeances />} />
        <Route path="/medical/seances/:seanceId/produits/details" element={<SeanceProduitsDetails />} />
        <Route path="/intendant/seances/details/:id" element={<DetailSeance />} />
        <Route path="/medical/seances/:seanceId/produits/edit" element={<EditSeanceProduits />} />
      </Route>
      <Route element={<PrivateRoute requiredRole="RESPONSABLE_STOCK" />}>
        <Route path="/stock" element={<StockSpace />} />
        <Route path="/stock/add" element={<AddProduit />} />
        <Route path="/stock/medicaments" element={<MedicamentList />} />
        <Route path="/stock/materiels" element={<MaterielList />} />
        <Route path="/stock/edit/:produitId" element={<EditProduit />} />
        <Route path="/stock/fournisseurs" element={<FournisseurList />} />
        <Route path="/stock/fournisseurs/add" element={<AddFournisseur />} />
        <Route path="/stock/fournisseurs/:id" element={<FournisseurDetails />} />
        <Route path="/stock/fournisseurs/associer" element={<AssocierProduitFournisseur />} />
        <Route path="/stock/commande/:type" element={<CommandeForm />} />
        <Route path="/stock/bons-commande" element={<BonCommandeList />} />
        <Route path="/stock/produits-prix" element={<ListeProduitsPrix />} />
        <Route path="/stock/ajouter-livraison" element={<AjouterLivraison />} />
        <Route path="/stock/prix/produit/:produitId" element={<GestionPrixProduit />} />
        <Route path="/stock/creer-bon-commande" element={<CreerBonCommande />} />
        <Route path="/stock/bons-historique" element={<BonsHistorique />} />
        <Route path="/stock/bons-historique/:idBonCommande" element={<BonCommandeDetails readOnly={true} />} />
        <Route path="/stock/notifications" element={<Notifications />} />
        <Route path="/stock/produits-usage" element={<SeanceProduitsUsage />} />
        <Route path="/stock/produits-standards" element={<AllProduitsStandardsList />} />
        <Route path="/medical/seances/:seanceId/produits/details" element={<SeanceProduitsDetails />} />
        <Route path="/stock/seances/details/:id" element={<DetailSeance />} />
      </Route>
      <Route element={<PrivateRoute requiredRole="PERSONNEL_MEDICAL" />}>
        <Route path="/medical" element={<MedicalSpace />} />
        <Route path="/medical/seances" element={<GererSeances />} />
        <Route path="/medical/seances/create" element={<CreateSeance />} />
        <Route path="/medical/seances/:id" element={<SeanceDetails />} />
        <Route path="/medical/seances/edit/:id" element={<EditSeance />} />
        <Route path="/medical/produits-standards" element={<AllProduitsStandardsList />} />
        <Route path="/medical/seances/details/:id" element={<DetailSeance />} />
        <Route path="/medical/produits-usage" element={<SeanceProduitsUsage />} />
        <Route path="/medical/medecin/patients" element={<PatientsList />} />
        <Route path="/medical/patients" element={<MedicalPatientsList />} />
        <Route path="/medical/patients/:patientId/dialysis-history" element={<MedicalPatientDialysisHistory />} />
        <Route path="/medical/seances/:seanceId/produits/details" element={<SeanceProduitsDetails />} />
      </Route>
      <Route element={<PrivateRoute requiredRole="INFIRMIER" />}>
        <Route path="/medical/infirmier" element={<InfirmierSpace />} />
        <Route path="/medical/infirmier/faire-inventaire" element={<FaireInventaire />} />
        <Route path="/medical/infirmier/interventions" element={<GestionReclamations />} />
        <Route path="/medical/infirmier/machines" element={<AjoutMachine />} />
        <Route path="/medical/infirmier/techniciens" element={<AjoutTechnicien />} />
        <Route path="/medical/infirmier/machines/edit/:id" element={<EditMachine />} />
        <Route path="/medical/infirmier/techniciens/edit/:id" element={<EditTechnicien />} />
        <Route path="/medical/infirmier/interventions/edit/:id" element={<EditIntervention />} />
        <Route path="/medical/infirmier/interventions/list" element={<ListeReclamationsMedical />} />
        <Route path="/medical/infirmier/machines/list" element={<ListeMachinesMedical />} />
        <Route path="/medical/infirmier/techniciens/list" element={<ListeTechniciensMedical />} />
        <Route path="/medical/infirmier/interventions/close/:id" element={<CloseIntervention />} />
      </Route>
      <Route element={<PrivateRoute requiredRole="MEDECIN" />}>
        <Route path="/medical/medecin" element={<MedecinSpace />} />
        <Route path="/medical/medecin/patients/:id" element={<PatientDetails />} />
        <Route path="/medical/medecin/patients/create" element={<CreatePatient />} />
        <Route path="/medical/medecin/patients/edit/:id" element={<EditPatient />} />
      </Route>
      <Route element={<PrivateRoute requiredRoles={["INTENDANT", "RESPONSABLE_STOCK"]} />}>
        <Route path="/liste-livraisons" element={<ListeLivraisons />} />
        <Route path="/historique-inventaires" element={<HistoriqueInventaires />} />
        <Route path="/details-inventaire/:id" element={<DetailsInventaire />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route element={<PrivateRoute requiredRole="SUPER_ADMIN" />}>
        <Route path="/super-admin" element={<SuperAdminSpace />} />
        <Route path="/super-admin/intendants" element={<IntendantManagement />} />
      </Route>
      <Route path="/" element={<Home />} />
      <Route path="/machines/details/:id" element={<MachineDetails />} />
    </Routes>
  );
};

export default AppRouter;