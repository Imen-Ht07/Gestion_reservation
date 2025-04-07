//importation
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");
const app = express();
require('dotenv').config();
require('./config/authSetup'); //configuration de passport
//importation des routes
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour parser les données d'un formulaire
app.use(cors());
 //USE express
app.use(express.json());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());



// Optionnel : Middleware pour accéder à l'utilisateur connecté
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
//other use routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

 //pour les images BFR(Backend et Frontend Relation)
//app.use('/uploads', express.static('uploads'));

//appel a database.js 
require('./database');

//port d'ecoute du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 