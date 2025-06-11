const userModel = require("../models/user.model");
const pool = require('../database/db');


const getDashboard = async (req, res) => {
  try {
    const username = req.user?.username; // asumiendo que usas middleware de autenticación

    const user = await userModel.findByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Resumen general", user });    // <-- este `user` es el que recibe el frontend
  } catch (err) {
    console.error("Error en /dashboard:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const getResiduosPorArea = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT area, SUM(amount) as cantidad
      FROM waste_records_test
      GROUP BY area
      LIMIT 5;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener residuos por área:", error);
    res.status(500).json({ error: error.message });
  }
};
const getResiduosPorMes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(entry_date, 'Mon YYYY') AS mes,
        COUNT(*) AS cantidad
      FROM waste_records_test
      GROUP BY mes
      ORDER BY MIN(entry_date) ASC
      LIMIT 6;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener residuos por mes:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getDashboard,
  getResiduosPorArea,
  getResiduosPorMes,
};