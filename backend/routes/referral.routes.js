const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const referralController = require("../controllers/referral.controller");

router.post("/", auth, referralController.createReferral);

module.exports = router;
