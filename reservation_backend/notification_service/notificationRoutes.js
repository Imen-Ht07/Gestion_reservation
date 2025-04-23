const express = require('express');
const { handleNotificationRequest, healthCheck } = require('./notificationController');
const router = express.Router();

// Route de statut du service
router.get('/', handleNotificationRequest);

// Route de santé
router.get('/health', healthCheck);

module.exports = router;