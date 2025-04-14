const passport = require('passport');
const generateJWT = require('./config/generateJWT');
const { Utilisateur } = require('./user');

// Middleware pour l'authentification Google
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Callback de l'authentification Google
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      return res.redirect('/login?error=1');
    }

    try {
      const role = 'utilisateur';
      // vérifier si l'utilisateur est déjà dans la BDD
      let existingUser = await Utilisateur.findOne({ googleId: user.googleId });

      if (!existingUser) {
        existingUser = new Utilisateur({
          googleId: user.googleId,
          nom: user.nom || user.name || user.displayName,
          email: user.email,
          role: role, 
          profilePicture: user.profilePicture,
        });

        await existingUser.save();
        console.log('Nouvel utilisateur sauvegardé :', existingUser);
      } else {
        console.log('Utilisateur déjà existant :', existingUser);
      }

      // Génération du token
      const token = generateJWT(existingUser);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.redirect('/home');
    } catch (err) {
      console.error('Erreur lors du callback Google :', err);
      return res.status(500).json({ message: 'Erreur interne', error: err });
    }
  })(req, res, next);
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
