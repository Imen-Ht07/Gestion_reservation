const mongoose = require('mongoose');
const HistoriqueSchema = new mongoose.Schema({
    action: String,
    utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    date: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Historique', HistoriqueSchema);
