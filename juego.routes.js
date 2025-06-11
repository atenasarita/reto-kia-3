const express = require('express');
const router = express.Router();
const { updatePuntaje } = require('../controllers/juegoController');
const { checkIfMaxScore } = require('../controllers/juegoController');

router.put('/update/:id', updatePuntaje);
router.get('/check-max/:id', checkIfMaxScore);


module.exports = router;


