const express = require('express');
require('dotenv').config();
const reservationRoutes = require('./reservationRoutes');
const helmet =require('helmet');

const app = express();
const PORT = process.env.PORT || 3002;
const { initKafkaProducer } = require('./producerKafka');
initKafkaProducer();
app.use(express.json());
app.use('/api/reservations', reservationRoutes);
app.use(helmet());
// Connexion à la base de données MongoDB
require('./database');
app.listen(PORT, () => console.log(`Reservation Service écoute sur le port ${PORT}`));
