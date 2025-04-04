const express = require('express');
const { getAllSalles, createSalle, updateSalle, deleteSalle } = require('./salleController');
const router = express.Router();

router.get('/', getAllSalles);
router.post('/', createSalle);
router.put('/:id', updateSalle);
router.delete('/:id', deleteSalle);

module.exports = router;
