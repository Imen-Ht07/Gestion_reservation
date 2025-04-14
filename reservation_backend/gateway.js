const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Définition des proxys pour chaque microservice
const services = {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    salle: process.env.SALLE_SERVICE_URL || 'http://localhost:3005',
    reservation: process.env.RESERVATION_SERVICE_URL || 'http://localhost:3004',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003',
    historique: process.env.HISTORIQUE_SERVICE_URL || 'http://localhost:3002',
};

// Middleware pour le logging des requêtes
app.use((req, res, next) => {
    console.log(`[Gateway] ${req.method} ${req.url}`);
    next();
});

// Définition des proxys
app.use('/users', createProxyMiddleware({ target: services.user, changeOrigin: true }));
app.use('/salles', createProxyMiddleware({ target: services.salle, changeOrigin: true }));
app.use('/reservations', createProxyMiddleware({ target: services.reservation, changeOrigin: true }));
app.use('/notifications', createProxyMiddleware({ target: services.notification, changeOrigin: true }));
app.use('/historique', createProxyMiddleware({ target: services.historique, changeOrigin: true }));

// Démarrage du serveur API Gateway
app.listen(PORT, () => {
    console.log(`API Gateway en écoute sur le port ${PORT}`);
});
