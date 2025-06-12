const referralModel = require("../models/referrals.model");
const wasteModel = require("../models/waste.model");
const pool = require("../database/db");

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


exports.createManifest = async (req, res) => {
  try {
    const { referralId } = req.params;
    await referralModel.generateManifestData(referralId);
    res.status(200).json({ message: "Manifiesto generado con éxito." });
  } catch (err) {
    console.error("Error al generar manifiesto:", err);
    res.status(500).json({ error: "Error al generar manifiesto." });
  }
};

exports.getAllReferrals = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM referrals");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener remisiones" });
  }
};