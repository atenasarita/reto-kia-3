const wasteModel = require("../models/waste.model");

// POST /api/waste
exports.createPendingWaste = async (req, res) => {
    try {
      const user_id = req.user.userId;
      
      const data = { ...req.body, user_id };
      const record = await wasteModel.createPendingWasteRecord(data);
  
      res.status(201).json({
        message: "Waste record submitted successfully.",
        record
      });
    } catch (error) {
      console.error("Error creating waste record:", error);
      res.status(500).json({ message: "Error creating waste record" });
    }
};
  

exports.getPendingWasteRecords = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const records = await wasteModel.getPendingWasteRecordsByUser(user_id);
    res.json(records);
  } catch (error) {
    console.error("Error fetching pending waste records:", error);
    res.status(500).json({ message: "Error fetching waste records" });
  }
};

exports.getPendingWasteRecordById = async (req, res) => {

  try {
    const user_id = req.user.userId;
    const id = req.params.id;

    const record = await wasteModel.getPendingWasteRecordById(id, user_id);
    if (!record) return res.status(404).json({ message: "Registro no encontrado" });

    res.json(record);
  } catch (err) {
    console.error("Error al obtener registro:", err);
    res.status(500).json({ message: "Error al obtener registro" });
  }
};

exports.updatePendingWasteRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.user.userId;
    const data = req.body;

    await wasteModel.updatePendingWasteRecord(id, user_id, data);
    res.json({ message: "Registro actualizado" });
  } catch (error) {
    console.error("Error actualizando:", error);
    res.status(500).json({ message: "Error actualizando" });
  }
};


exports.confirmWasteRecord = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const id = req.params.id;

    await wasteModel.confirmWasteRecord(id, user_id);

    res.status(200).json({ message: "Registro confirmado exitosamente" });
  } catch (error) {
    console.error("Error al confirmar el registro:", error);

    if (error.code === 'P2001') {
      return res.status(400).json({ error: 'Debes llenar todos los campos antes de confirmar. Solo la fecha de salida puede quedar vacía.' });
    }

    res.status(500).json({ message: "Error al confirmar el registro" });
  }
};



exports.deletePendingWasteRecord = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const id = req.params.id;
    await wasteModel.deletePendingWasteRecord(id, user_id);
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting waste record:", error);
    res.status(500).json({ message: "Error deleting waste record" });
  }
};


exports.getHazardousWasteByReason = async (req, res) => {
  const { reason } = req.query;

  try {
    const results = await wasteModel.getHazardousWasteByReason(reason);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener los registros confirmados:", error);
    res.status(500).json({ message: "Error al obtener registros confirmados" });
  }
};

// Obtener residuos confirmados 
exports.getConfirmedWaste = async (req, res) => {
  const { reason } = req.query;
  try {
    const records = await wasteModel.getConfirmedWaste(reason);
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching confirmed waste:", error);
    res.status(500).json({ message: "Error fetching confirmed waste" });
  }
};

exports.getWasteForReferral = async (req, res) => {
  const { reason } = req.query;
  try {
    const records = await wasteModel.getWasteForReferral(reason);
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching confirmed waste:", error);
    res.status(500).json({ message: "Error fetching confirmed waste" });
  }
};

// Marcar un registro como seleccionado
exports.selectWasteRecord = async (req, res) => {
  const id = req.params.id;
  try {
    const updated = await wasteModel.markWasteAsSelected(id);
    if (!updated) {
      return res.status(404).json({ message: "Waste record not found" });
    }
    res.status(200).json({ message: "Waste record marked as selected" });
  } catch (error) {
    console.error("Error selecting waste record:", error);
    res.status(500).json({ message: "Error selecting waste record" });
  }
};


exports.getAmountSumByReason = async (req, res) => {
  try {
    const { reason } = req.params;
    const result = await wasteModel.getAmountSumByReason(reason);

    res.json(result);
  } catch (err) {
    console.error("Error al calcular la suma:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.clearSelected = async (req, res) => {
  try {
    await wasteModel.clearSelected();
    res.status(200).json({ message: "Seleccionados limpiados" });
  } catch (error) {
    console.error("Error al limpiar seleccionados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.updateSelected = async (req, res) => {

  const { id } = req.params;
  const { selected } = req.body;

  try {
    await wasteModel.updateSelected(id, selected);
    res.status(200).json({ message: "is_selected actualizado" });
  } catch (error) {
    console.error("Error al actualizar is_selected:", error);
    res.status(500).json({ error: "Error interno" });
  }
};


exports.getSelectedRecords = async (req, res) => {
  try {
    const records = await wasteModel.getSelectedRecords();
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching selected waste:", error);
    res.status(500).json({ message: "Error fetching confirmed waste" });
  }
};


const db = require("../database/db");

exports.getWasteByReferral = async (req, res) => {
  const { referralId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM waste_records_test WHERE part_of_referral = $1`,
      [referralId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener residuos:", err);
    res.status(500).json({ error: "Error al obtener residuos" });
  }
};


exports.getGroupedSummaryByReferral = async (req, res) => {
  const { referralId } = req.params;

  try {
    const result = await db.query(
      `SELECT
         type,
         container,
         COUNT(*) AS count,
         SUM(amount) * 1000 AS total_amount
       FROM waste_records_test
       WHERE part_of_referral = $1
       GROUP BY type, container`,
      [referralId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener resumen:", err);
    res.status(500).json({ error: "Error al obtener resumen" });
  }
};






exports.getConfirmedWasteRecords = async (req, res) => {
  try {
    const username = req.user.username;

    // Validar que sea admin
    if (username !== "01234644") {
      return res.status(403).json({ message: "Access denied: Admin only." });
    }

    const { month, year } = req.query; // vienen como strings, opcionales

    // Convertir a números si existen
    const monthNum = month ? parseInt(month) : null;
    const yearNum = year ? parseInt(year) : null;

    const records = await wasteModel.getConfirmedWasteRecords({ month: monthNum, year: yearNum });
    res.json(records);
  } catch (error) {
    console.error("Error fetching confirmed waste records:", error);
    res.status(500).json({ message: "Error fetching confirmed waste records" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const username = req.user.username;

    // Validar si es admin para dar acceso o no
    // Si quieres que todos los usuarios puedan ver, elimina esta validación
    if (username !== "01234644") {
      return res.status(403).json({ message: "Access denied: Admin only." });
    }

    // Obtenemos datos de KPIs desde modelo
    const totalConfirmed = await wasteModel.getTotalConfirmedWasteAmount();
    const amountByType = await wasteModel.getConfirmedWasteAmountByType();

    res.json({
      totalConfirmed,
      amountByType,
      message: "Dashboard KPIs fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};