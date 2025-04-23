require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3003;

const notificationRoutes = require('./notificationRoutes');
const { initKafkaConsumer } = require('./kafka/consumer');

app.use(express.json());
app.use('/notify', notificationRoutes);

// Endpoint de santé pour Docker healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'notification-service' });
});

// Démarrer le consumer Kafka
initKafkaConsumer().catch(err => {
  console.error('Erreur lors de l\'initialisation de Kafka :', err);
});

// Gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).send({ error: 'Erreur interne au serveur' });
});

// Start server
app.listen(port, () => {
  console.log(`Notification service running on port ${port}`);
});

// Gérer la fermeture propre
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  console.log('Fermeture du service de notification...');
  // Fermer proprement le serveur et les connexions Kafka
  process.exit(0);
}