const { Kafka } = require('kafkajs');
const { handleReservationEvent } = require('../controllers/notificationController');

const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const initKafkaConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'reservation-events', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            await handleReservationEvent(message.value.toString());
        }
    });

    console.log('📥 Kafka consumer (notification-service) prêt et abonné au topic reservation-events');
};

module.exports = { initKafkaConsumer };
