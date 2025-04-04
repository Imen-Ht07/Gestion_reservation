const express = require('express');
const { getAllHistorique } = require('../controllers/historiqueController');
const router = express.Router();

router.get('/', getAllHistorique);

module.exports = router;