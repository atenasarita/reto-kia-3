const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const WasteController = require("../controllers/waste.controller");

router.post("/", auth, WasteController.createPendingWaste);
router.get("/", auth, WasteController.getPendingWasteRecords);

router.post("/confirm/:id", auth, WasteController.confirmWasteRecord);
router.get('/confirmed', auth, WasteController.getConfirmedWaste);
router.get('/eligible', auth, WasteController.getWasteForReferral);

router.put("/select/:id", auth, WasteController.updateSelected);
router.put("/clear-selected", auth, WasteController.clearSelected);

router.get('/amount-sum/:reason', auth, WasteController.getAmountSumByReason);

router.get("/waste-registry/:id", auth, WasteController.getPendingWasteRecordById);
router.put("/:id", auth, WasteController.updatePendingWasteRecord);
router.delete("/:id", auth, WasteController.deletePendingWasteRecord);

router.get("/by-referral/:referralId", WasteController.getWasteByReferral);
router.get("/summary/by-referral/:referralId", WasteController.getGroupedSummaryByReferral);


router.get('/count-pending', async (req, res) => {
    try {
      const result = await client.query('SELECT count_pending_records();');
      const pendingCount = result.rows[0].count_pending_records; // El resultado de la función
  
      res.json({ pendingCount });
    } catch (error) {
      console.error('Error al contar los registros pendientes:', error);
      res.status(500).json({ error: 'Ocurrió un error al contar los registros pendientes' });
    }
});

module.exports = router;
