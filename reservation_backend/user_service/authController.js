const passport = require('passport');

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/login',
  successRedirect: 'http://localhost:4200/dashboard', // Redirige vers le frontend Angular
  failureFlash: true,  // Affiche un message d'erreur en cas d'échec
  successFlash: 'Connexion réussie !' // Affiche un message de succès en cas de réussite

});

const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    res.redirect('/');
  });
};

module.exports = { googleAuth, googleAuthCallback, logout };
