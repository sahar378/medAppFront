//src/axiosConfig.js
//Configure Axios pour les requêtes API avec un intercepteur qui ajoute le token sauf pour /api/auth/login.
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Ne pas ajouter le token pour /api/auth/login
    if (token && config.url !== '/auth/login') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data === 'Token expired') {
      localStorage.removeItem('token');
      localStorage.removeItem('authorities');
      localStorage.removeItem('userId');
      window.location.href = '/login'; // Redirection forcée
    }
    return Promise.reject(error);
  }
);

export default api;
/*config.url !== '/auth/login' : Cela empêche l’intercepteur d’ajouter un token pour la requête de connexion,
 laissant /api/auth/login fonctionner comme un endpoint public.*/