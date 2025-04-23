const kafka = require('./kafkaClient');

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000
});

let isConnected = false;

/**
 * Connecte le producteur Kafka s'il n'est pas déjà connecté
 * @returns {Promise<void>}
 */
const connectProducer = async () => {
  if (!isConnected) {
    try {
      await producer.connect();
      isConnected = true;
      console.log('Producteur Kafka connecté');
    } catch (error) {
      console.error('Erreur de connexion du producteur Kafka:', error);
      throw error;
    }
  }
};

/**
 * Envoie un message à un topic Kafka
 * @param {string} topic - Nom du topic
 * @param {Object} message - Message à envoyer
 * @returns {Promise<Object>} - Résultat de l'opération
 */
const sendNotification = async (topic, message) => {
  if (!topic || !message) {
    console.error('Topic ou message invalide');
    return { sent: false, error: 'Paramètres invalides' };
  }

  try {
    // S'assurer que le producteur est connecté
    if (!isConnected) {
      await connectProducer();
    }

    const result = await producer.send({
      topic,
      messages: [{ value: typeof message === 'string' ? message : JSON.stringify(message) }],
    });

    console.log(`Message envoyé sur le topic ${topic}`);
    return { sent: true, result };
  } catch (error) {
    console.error(`Erreur lors de l'envoi du message sur ${topic}:`, error);
    return { sent: false, error: error.message };
  }
};

/**
 * Déconnecte proprement le producteur Kafka
 */
const disconnectProducer = async () => {
  if (isConnected) {
    try {
      await producer.disconnect();
      isConnected = false;
      console.log('Producteur Kafka déconnecté');
    } catch (error) {
      console.error('Erreur lors de la déconnexion du producteur Kafka:', error);
    }
  }
};

// Gérer la déconnexion propre avant la fermeture du processus
process.on('SIGTERM', disconnectProducer);
process.on('SIGINT', disconnectProducer);

module.exports = {
  connectProducer,
  sendNotification,
  disconnectProducer,
};