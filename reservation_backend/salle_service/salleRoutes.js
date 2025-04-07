const authorize = require('./middleware/authorize');
const express = require('express');
const { getAllSalles, createSalle, updateSalle, deleteSalle } = require('./salleController');
const router = express.Router();

router.get('/', authorize(['admin', 'manager']), getAllSalles);
router.post('/', authorize(['admin', 'manager']),createSalle);
router.put('/:id', authorize(['admin', 'manager']),updateSalle);
router.delete('/:id', authorize(['admin', 'manager']),deleteSalle);

module.exports = router;
