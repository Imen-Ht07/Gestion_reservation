const express = require('express');
require('dotenv').config();
const historiqueRoutes = require('./historiqueRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api/historiques', historiqueRoutes);

//appel a database.js 
require('./../database');
app.listen(PORT, () => console.log(`Historique Service écoute sur le port ${PORT}`));
