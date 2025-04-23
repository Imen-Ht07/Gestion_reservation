const passport = require('passport');
const generateJWT = require('./config/generateJWT');
const { Utilisateur } = require('./user');

// Middleware pour l'authentification Google
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Callback de l'authentification Google

const googleAuthCallback = async (req, res, next) => {
  try {
    const profile = req.user;
    const existingUser = await Utilisateur.findOne({ googleId: profile.googleId });

    if (existingUser) {
      const token = generateJWT(existingUser);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 1 jour
      });
      return res.redirect('/home');
    } else {
      const newUser = new Utilisateur({
        googleId: profile.id,
        nom: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
      });

      await newUser.save();
      const token = generateJWT(newUser);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.redirect('/home');
    }
  } catch (error) {
    console.error('Erreur lors du callback Google :', error);
    return res.redirect('/home?error=google_callback_failed');
  }
};
   
// Fonction de déconnexion
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }

    // Supprimer le cookie JWT
    res.clearCookie('jwt');
    res.redirect('/');
  });
};

// Exporter les routes du contrôleur
module.exports = { googleAuth, googleAuthCallback, logout };
