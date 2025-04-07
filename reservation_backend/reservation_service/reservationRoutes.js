const express = require('express');
const { getAllReservations, createReservation, updateReservation, deleteReservation } = require('./reservationController');
const router = express.Router();

router.get('/', getAllReservations);
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

module.exports = router;
