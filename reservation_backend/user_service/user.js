const mongoose = require('mongoose');
const UtilisateurSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  nom: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['utilisateur', 'manager', 'admin'], default: 'utilisateur' },
  profilePicture: String, 
});

module.exports.Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);
