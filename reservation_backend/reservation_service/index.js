const express = require('express');
require('dotenv').config();
const reservationRoutes = require('./reservationRoutes');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use('/api/reservations', reservationRoutes);

// Connexion à la base de données MongoDB
require('./database');
app.listen(PORT, () => console.log(`🚀 Reservation Service écoute sur le port ${PORT}`));
