const { Reservation} = require('./reservation');

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
        const { salle_id, date_heure_debut, date_heure_fin } = req.body;
        
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
        
        const nouvelleReservation = new Reservation(req.body);
        await nouvelleReservation.save();
        res.status(201).json(nouvelleReservation);
    } catch (error) {
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