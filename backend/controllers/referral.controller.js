const referralModel = require("../models/referrals.model");
const wasteModel = require("../models/waste.model");

exports.createReferral = async (req, res) => {
  console.log(req.body);

  try {
    const data = req.body;

    const newReferral = await referralModel.createReferral(data);
    const referralId = newReferral.id;

    const selectedRecords = await wasteModel.getSelectedRecords();

    for (const record of selectedRecords) {
      await referralModel.insertTipoReferral(referralId, record.type);
      await referralModel.insertCantidadTipoReferral(referralId, record.type, record.amount);
    }   

    res.status(201).json(newReferral);
  } catch (err) {
    console.error("Error al crear la referral:", err);
    res.status(500).json({ error: "Error al insertar la referral" });
  }
};
