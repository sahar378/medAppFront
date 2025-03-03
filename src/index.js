//src/index.js
//Initialise React Router et fournit AuthContext à l’ensemble de l’application.
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { AuthProvider } from './context/AuthContext';
import './App.css';

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
//ReactDOM.render : Rend l'application React dans le DOM.