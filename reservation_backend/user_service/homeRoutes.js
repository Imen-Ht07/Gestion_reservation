const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware pour vérifier le token JWT
const verifyJWT = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/login');  // Pas de token → redirige
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attache les infos de l'utilisateur à la requête
    next();
  } catch (err) {
    return res.redirect('/login?token_invalid=1');  // Token invalide
  }
};

// Route GET /home protégée
router.get('/', verifyJWT, (req, res) => {
  res.send(`
    <h1>Bienvenue ${req.user.nom || req.user.name || req.user.displayName}</h1>
    <p>Email : ${req.user.email}</p>
    <a href="/auth/logout">Se déconnecter</a>
  `);
});

module.exports = router;
