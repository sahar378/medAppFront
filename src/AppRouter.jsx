//src/AppRouter.jsx
//Définit les routes de l’application et leurs protections.
// src/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import ChangePassword from './pages/auth/ChangePassword';
import IntendantSpace from './pages/intendant/IntendantSpace';
import Habilitation from './pages/intendant/Habilitation';
import AgentSpace from './pages/agent/AgentSpace';
import Profile from './pages/agent/Profile'; 
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route element={<PrivateRoute requiredRole="INTENDANT" />}>
        <Route path="/intendant" element={<IntendantSpace />} />
        <Route path="/intendant/habilitation" element={<Habilitation />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/agent" element={<AgentSpace />} />
        <Route path="/agent/profile" element={<Profile />} /> {/* Nouvelle route */}
      </Route>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRouter;