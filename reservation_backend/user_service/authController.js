const passport = require('passport');
const generateJWT = require('./config/generateJWT');

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// ici on utilise une fonction intermédiaire pour gérer la réponse
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect('http://localhost:4200/login?error=1');
    }

    const token = generateJWT(user);

    // Soit tu rediriges avec le token
    return res.redirect(`http://localhost:4200/home?token=${token}`);
  
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    res.redirect('/');
  });
};

module.exports = { googleAuth, googleAuthCallback, logout };
