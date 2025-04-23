const sendEmail = require('./utils/email');

const handleReservationEvent = async (eventData) => {
  try {
    // S'assurer que eventData est une chaîne avant de parser
    let reservation;
    try {
      reservation = typeof eventData === 'string' ? JSON.parse(eventData) : eventData;
    } catch (error) {
      console.error('Erreur de parsing JSON:', error);
      return;
    }
    
    console.log('Nouvelle réservation reçue depuis Kafka :', reservation);
    
    // Vérification plus robuste de la structure de données
    if (!reservation || !reservation.utilisateur_id || !reservation.utilisateur_id.email) {
      console.error('Email utilisateur manquant dans l\'événement Kafka:', reservation);
      return;
    }
    
    const salleName = reservation.salle_id && reservation.salle_id.nom ? reservation.salle_id.nom : 'inconnue';
    const userName = reservation.utilisateur_id.nom || 'Utilisateur';
    
    // Formatter les dates correctement ou gérer le cas où elles seraient invalides
    let dateDebut, dateFin;
    try {
      dateDebut = new Date(reservation.date_heure_debut).toLocaleString();
      dateFin = new Date(reservation.date_heure_fin).toLocaleString();
    } catch (error) {
      console.error('Erreur lors du formatage des dates:', error);
      dateDebut = reservation.date_heure_debut || 'non spécifiée';
      dateFin = reservation.date_heure_fin || 'non spécifiée';
    }
    
    const mailData = {
      to: reservation.utilisateur_id.email,
      subject: 'Nouvelle Réservation Confirmée',
      text: `
Bonjour ${userName},

Votre réservation pour la salle ${salleName} est confirmée.
Début : ${dateDebut}
Fin : ${dateFin}

Merci d'utiliser notre service de réservation !
      `
    };
    
    await sendEmail(mailData);
    console.log(`Email envoyé avec succès à ${reservation.utilisateur_id.email}`);
  } catch (error) {
    console.error('Erreur lors du traitement de la notification Kafka :', error);
  }
};

// Fonction pour gérer les requêtes HTTP
const handleNotificationRequest = async (req, res) => {
  try {
    res.status(200).send({ status: 'Service de notification opérationnel' });
  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).send({ error: 'Erreur lors du traitement de la requête' });
  }
};

// Endpoint de santé spécifique au notificationController
const healthCheck = async (req, res) => {
  res.status(200).json({
    status: 'UP',
    details: {
      kafka: 'connected',
      email: process.env.SMTP_HOST ? 'configured' : 'not_configured'
    }
  });
};

module.exports = { 
  handleReservationEvent,
  handleNotificationRequest,
  healthCheck
};