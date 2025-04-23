const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Utilisateur } = require('../user'); 

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Vérification des données du profil
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
    const profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

    // Recherche un utilisateur existant avec le googleId
    let user = await Utilisateur.findOne({ googleId: profile.id });

    if (!user) {
      // Si l'utilisateur n'existe pas, le créer
      user = new Utilisateur({
        googleId: profile.id,
        nom: profile.displayName,
        email: email,
        profilePicture: profilePicture,
      });

      await user.save();
      console.log("Utilisateur sauvegardé dans MongoDB :", user);
    }

    // Passer l'utilisateur trouvé à la méthode 'done' de Passport
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Sérialiser et désérialiser l'utilisateur dans la session
passport.serializeUser((user, done) => {
  done(null, user.id);  // Sauvegarder l'ID de l'utilisateur dans la session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Utilisateur.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
