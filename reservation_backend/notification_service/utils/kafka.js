require('dotenv').config();

// Configuration plus robuste avec valeurs par défaut
const kafkaConfig = {
  clientId: 'notification-service',
  // Utiliser une valeur par défaut si KAFKA_BROKER n'est pas défini
  brokers: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : ['localhost:9092'],
  // Ajouter des options de connexion pour plus de fiabilité
  connectionTimeout: 3000,
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
};

// Validation de la configuration
if (!kafkaConfig.brokers[0]) {
  console.warn('WARNING: KAFKA_BROKER n\'est pas défini. Utilisation de la valeur par défaut localhost:9092');
}

module.exports = kafkaConfig;