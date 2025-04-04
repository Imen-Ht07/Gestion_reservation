const mongoose = require('mongoose');
const UtilisateurSchema = new mongoose.Schema({
  googleId: String,
  nom: String,
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['utilisateur', 'manager', 'admin'], default: 'utilisateur' },
});

module.exports.Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);
