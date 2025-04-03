const mongoose = require('mongoose');
const SalleSchema = new mongoose.Schema({
    nom: String,
    capacite: Number,
    equipements: [String],
    disponibilite: [Date],
});
module.exports = mongoose.model('Salle', SalleSchema);