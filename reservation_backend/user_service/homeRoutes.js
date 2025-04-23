const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware pour vérifier le token JWT
const verifyJWT = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.redirect('/api/auth/google'); // Pas de token → redirige vers login
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attache les infos de l'utilisateur à la requête
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.redirect('/api/auth/google?token_invalid=1');
  }
};

// Route GET /home protégée
router.get('/', verifyJWT, (req, res) => {
  const { email, role, userId } = req.user;

  res.send(`
    <h1>Bienvenue !</h1>
    <p>Email : ${email}</p>
    <p>ID utilisateur : ${userId}</p>
    ${role ? `<p>Rôle : ${role}</p>` : ''}
    <a href="/api/auth/logout">Se déconnecter</a>
    <a href="/api/auth/google">Connexion Google</a>
  `);
});

module.exports = router;
