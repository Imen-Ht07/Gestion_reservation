const express = require('express');
const { Kafka } = require('kafkajs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Initialisation Kafka
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'reservations', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Notification reçue : ${message.value.toString()}`);
      // Envoyer une notification ici (email/SMS)
    }
  });
};

startKafkaConsumer().catch(console.error);

app.listen(PORT, () => console.log(`Notification Service écoute sur le port ${PORT}`));
