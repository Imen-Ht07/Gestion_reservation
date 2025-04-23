const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'reservation-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  connectionTimeout: 5000,
  retry: {
    initialRetryTime: 3000,
    retries: 10,
  },
});

const producer = kafka.producer();

const initKafkaProducer = async () => {
  try {
    await producer.connect();
    console.log('Producteur Kafka connecté depuis reservation-service');
  } catch (error) {
    console.error('Erreur de connexion producteur Kafka :', error.message);
  }
};

const publishReservationEvent = async (reservationData) => {
  try {
    await producer.send({
      topic: 'reservation-events',
      messages: [
        {
          value: JSON.stringify(reservationData),
        },
      ],
    });
    console.log('Événement réservation publié sur Kafka');
  } catch (error) {
    console.error('Erreur lors de la publication sur Kafka :', error.message);
  }
};

module.exports = { initKafkaProducer, publishReservationEvent };
