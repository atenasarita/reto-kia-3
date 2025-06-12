const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const referralController = require("../controllers/referral.controller");

router.get("/", referralController.getAllReferrals);
router.post("/", auth, referralController.createReferral);


module.exports = router;
