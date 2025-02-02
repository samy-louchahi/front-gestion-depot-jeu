// src/services/api.ts

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Remplace par l'URL de ton backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ajouter un intercepteur pour inclure le token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Ou depuis les cookies
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Ajouter un intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Rediriger vers la page de login ou afficher un message d'erreur
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


const apiCsv = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Intercepteur pour inclure le token et définir le Content-Type
apiCsv.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Définir le Content-Type pour le multipart/form-data
        config.headers['Content-Type'] = 'multipart/form-data';
        return config;
    },
    (error) => Promise.reject(error)
);

apiCsv.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export { apiCsv, api };