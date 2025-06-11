const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboard.controller');

// Aquí solo /dashboard, porque en index.js tienes /api
router.get('/dashboard', auth, dashboardController.getDashboard);

router.get('/residuos-por-area', auth, dashboardController.getResiduosPorArea);

router.get('/residuos-por-mes', auth, dashboardController.getResiduosPorMes);

module.exports = router;

module.exports = router;