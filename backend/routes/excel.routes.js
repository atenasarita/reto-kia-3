// server.js o routes/excelRoutes.js

const express = require('express');
const router = express.Router();
const { exportManifestExcel } = require('./controllers/excel.controllers');

router.post('/api/excel/export', exportManifestExcel);

module.exports = router;
