const mongoose = require('mongoose');
const ReservationSchema = new mongoose.Schema({
    utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    salle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Salle', required: true },
    date_heure_debut: { type: Date, required: true },
    date_heure_fin: { type: Date, required: true },
});
module.exports = mongoose.model('Reservation', ReservationSchema);