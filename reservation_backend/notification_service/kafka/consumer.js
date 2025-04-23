const { Kafka } = require('kafkajs');
const { handleReservationEvent } = require('../notificationController');
require('dotenv').config();

// Utiliser la configuration kafka commune
const kafkaConfig = require('../utils/kafka');

const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: kafkaConfig.brokers
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const initKafkaConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Notification-service connecté à Kafka');
    
    await consumer.subscribe({ topic: 'reservation-topic', fromBeginning: true });
    console.log('Inscrit au topic "reservation-topic"');
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const eventData = message.value.toString();
          console.log(`Message reçu sur ${topic} :`, eventData);
          await handleReservationEvent(eventData);
        } catch (error) {
          console.error('Erreur lors du traitement du message:', error);
        }
      },
    });
  } catch (error) {
    console.error('Erreur de connexion Kafka:', error.message);
    // Ne pas quitter le processus immédiatement, permettre les reconnexions
    setTimeout(initKafkaConsumer, 5000); // Réessayer après 5 secondes
  }
};

module.exports = { initKafkaConsumer };