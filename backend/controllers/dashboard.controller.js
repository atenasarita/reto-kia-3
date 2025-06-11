const pool = require('../database/db');

const getDashboard = async (req, res) => {
  try {
    const user = req.user; 
    res.json({ message: "Resumen general", user });
  } catch (error) {
    res.status(500).json({ error: "Error en getDashboard" });
  }
};

const getResiduosPorArea = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT area, SUM(amount) as cantidad
      FROM hazardous_waste_records
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
      FROM hazardous_waste_records
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
