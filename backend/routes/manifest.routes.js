const express = require('express');
const router = express.Router();
const manifestController = require('../controllers/manifest.controller');

router.post("/generate-manifest/:referralId", manifestController.generateManifestData);
router.post("/manifiestos/export-excel", manifestController.exportManifestExcel);


module.exports = router;
