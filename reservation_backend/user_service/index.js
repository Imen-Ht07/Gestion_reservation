const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();
const helmet =require('helmet');



require('dotenv').config();
require('./config/authSetup'); // configuration de passport

// Importation des routes
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const homeRoutes = require('./homeRoutes');

// Middleware
app.use(cookieParser());
app.use(express.json()); // Pour parser les données JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les données des formulaires
app.use(cors());
app.use(helmet());
// Configuration de session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour accéder à l'utilisateur connecté (optionnel)
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/home', homeRoutes);
// Redirection racine (facultatif)
app.get('/', (req, res) => {
  res.send('<h1>Bienvenue</h1><a href="api/auth/google">Connexion Google</a>');
});
app.use(express.static('public'));

// Appel à database.js
require('./database');

// Port d'écoute du serveur
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
