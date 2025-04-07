const express = require('express');
require('dotenv').config();
const salleRoutes = require('./salleRoutes');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use('/api/salles', salleRoutes);
//appel a database.js 
require('./database');
app.listen(PORT, () => console.log(`🚀 Salle Service écoute sur le port ${PORT}`));
