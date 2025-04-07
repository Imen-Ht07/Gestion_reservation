const express = require('express');
const { getAllHistorique } = require('./historiqueController');
const router = express.Router();

router.get('/', getAllHistorique);

module.exports = router;