const Reservation = require('./reservation');
const { publishReservationEvent } = require('./producerKafka');
const axios = require('axios');
const SALLE_SERVICE_URL = process.env.SALLE_SERVICE_URL || 'http://localhost:3004';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('utilisateur_id salle_id');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createReservation = async (req, res) => {
    try {
        const { utilisateur_id, salle_id, date_heure_debut, date_heure_fin } = req.body;

        // Vérification des conflits de réservation
        const conflit = await Reservation.findOne({
            salle_id,
            $or: [
                { date_heure_debut: { $lt: date_heure_fin }, date_heure_fin: { $gt: date_heure_debut } }
            ]
        });

        if (conflit) {
            return res.status(400).json({ message: 'Salle déjà réservée pour ce créneau' });
        }

        // Création de la réservation
        const nouvelleReservation = new Reservation({
            utilisateur_id,
            salle_id,
            date_heure_debut,
            date_heure_fin
        });

        await nouvelleReservation.save();

        //  Récupérer les détails utilisateur et salle pour l'event Kafka
        const salleResponse = await axios.get(`${SALLE_SERVICE_URL}/api/salles/${salle_id}`);
        const salle = salleResponse.data;
        const utilisateurResponse = await axios.get(`${USER_SERVICE_URL}/api/users/${utilisateur_id}`);
        const utilisateur = utilisateurResponse.data;

        if (utilisateur && salle) {
            await publishReservationEvent({
                utilisateur_id: {
                    email: utilisateur.email,
                    nom: utilisateur.nom
                },
                salle_id: {
                    nom: salle.nom
                },
                date_heure_debut: nouvelleReservation.date_heure_debut,
                date_heure_fin: nouvelleReservation.date_heure_fin
            });
        }

        res.status(201).json(nouvelleReservation);
    } catch (error) {
        console.error('Erreur lors de la création de la réservation :', error.message);
        res.status(400).json({ message: error.message });
    }
};

const updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteReservation = async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Réservation annulée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllReservations, createReservation, updateReservation, deleteReservation };