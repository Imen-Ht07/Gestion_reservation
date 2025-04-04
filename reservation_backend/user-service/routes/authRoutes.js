const express = require('express');
const { googleAuth, googleAuthCallback, logout } = require('../controllers/authController');

const router = express.Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/logout', logout);

module.exports = router;
