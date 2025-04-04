const sendEmail = require('../utils/email');


const handleReservationEvent = async (eventData) => {
    try {
        const reservation = JSON.parse(eventData);

        console.log('📬 Nouvelle réservation reçue depuis Kafka :', reservation);

        // Ex: envoyer un email
        await sendEmail({
            to: reservation.utilisateur_id.email,
            subject: 'Nouvelle Réservation Confirmée',
            text: `Votre réservation de la salle ${reservation.salle_id} est confirmée pour le ${reservation.date_heure_debut} - ${reservation.date_heure_fin}`
        });

    } catch (error) {
        console.error('Erreur lors du traitement de la notification Kafka :', error);
    }
};

module.exports = { handleReservationEvent };
