const sendEmail = require('./utils/email');

const handleReservationEvent = async (eventData) => {
    try {
        const reservation = JSON.parse(eventData);

        console.log('Nouvelle réservation reçue depuis Kafka :', reservation);

        if (!reservation.utilisateur_id || !reservation.utilisateur_id.email) {
            console.error('Email utilisateur manquant dans l\'événement Kafka');
            return;
        }

        const mailData = {
            to: reservation.utilisateur_id.email,
            subject: 'Nouvelle Réservation Confirmée',
            text: `
Bonjour ${reservation.utilisateur_id.nom || 'Utilisateur'},\n\n
Votre réservation pour la salle ${reservation.salle_id.nom || 'inconnue'} est confirmée.\n
Début : ${new Date(reservation.date_heure_debut).toLocaleString()}
Fin : ${new Date(reservation.date_heure_fin).toLocaleString()}\n\n
Merci d'utiliser notre service de réservation !
            `
        };

        await sendEmail(mailData);
        console.log(`Email envoyé avec succès à ${reservation.utilisateur_id.email}`);
    } catch (error) {
        console.error('Erreur lors du traitement de la notification Kafka :', error.message);
    }
};

module.exports = { handleReservationEvent };
