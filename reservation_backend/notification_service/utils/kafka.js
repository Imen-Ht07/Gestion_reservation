const { Kafka } = require('kafkajs');
const { handleReservationEvent } = require('../notificationController');

const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
    connectionTimeout: 5000,
    retry: {
        initialRetryTime: 3000,
        retries: 10,
    },
});

const consumer = kafka.consumer({ groupId: 'notification-group' });
const admin = kafka.admin();

const initKafkaConsumer = async () => {
    try {
        console.log('Connexion à l\'admin Kafka pour vérifier/créer le topic...');
        await admin.connect();

        await admin.createTopics({
            topics: [{ topic: 'reservation-events', numPartitions: 1, replicationFactor: 1 }],
            waitForLeaders: true
        });

        console.log('Vérification/création du topic terminée.');
        await admin.disconnect();

        console.log('Tentative de connexion au broker Kafka...');
        await consumer.connect();
        console.log('Connecté à Kafka');

        await consumer.subscribe({ topic: 'reservation-events', fromBeginning: true });
        console.log('Abonné au topic reservation-events');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    console.log(`Message reçu sur ${topic}: ${message.value.toString()}`);
                    await handleReservationEvent(message.value.toString());
                } catch (err) {
                    console.error('Erreur en traitant un message Kafka :', err.message);
                }
            }
        });

        console.log('Kafka consumer prêt et en écoute...');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Kafka Consumer:', error.message);
        process.exit(1);
    }
};

module.exports = { initKafkaConsumer };
