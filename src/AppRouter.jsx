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
import StockOverview from './pages/intendant/StockOverview';
import IntendantStockLog from './pages/intendant/IntendantStockLog';

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
        <Route path="/intendant/stock" element={<StockOverview />} /> {/* Nouvelle route */}
        <Route path="/intendant/logs/:produitId" element={<IntendantStockLog />} />
      </Route>
      <Route element={<PrivateRoute requiredRole="RESPONSABLE_STOCK" />}>
        <Route path="/stock" element={<StockSpace />} />
        <Route path="/stock/add" element={<AddProduit />} />
        <Route path="/stock/medicaments" element={<MedicamentList />} /> {/* Nouvelle route */}
        <Route path="/stock/materiels" element={<MaterielList />} /> {/* Nouvelle route */}
        <Route path="/stock/edit/:produitId" element={<EditProduit />} /> {/* Nouvelle route */}
      </Route>
      <Route element={<PrivateRoute requiredRole="PERSONNEL_MEDICAL" />}>
        <Route path="/medical" element={<MedicalSpace />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRouter;