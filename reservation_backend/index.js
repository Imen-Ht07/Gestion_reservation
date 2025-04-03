//importation
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
require('dotenv').config();
require('./config/authSetup'); //configuration de passport

//Routes 
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const historiqueRoutes = require('./routes/historiqueRoutes');
const salleRoutes = require('./routes/salleRoutes');
//middleware
app.use(express.json());
//aide les ports de back et front a s'adapter 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
   "Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
   res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
   return res.status(200).json({});
  }
  next();
 });
 //pour les images BFR(Backend et Frontend Relation)
app.use('/uploads', express.static('uploads'));
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

app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

// Optionnel : Middleware pour accéder à l'utilisateur connecté
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
//other use routes
app.use('/api/reservations', reservationRoutes);
app.use('/api/historiques', historiqueRoutes);
app.use('/api/salles', salleRoutes);
//appel a database.js 
require('./database');

//port d'ecoute du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 