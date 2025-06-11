const db = require('../database/db');



const updatePuntaje = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntaje } = req.body;

    const result = await db.query(
      'UPDATE juego SET puntaje = $1 WHERE user_id = $2 RETURNING *',
      [puntaje, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Puntaje actualizado correctamente', juego: result.rows[0] });
  } catch (error) {
    console.error('Error en updatePuntaje:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};
const checkIfMaxScore = async (req, res) => {
  try {
    const { id } = req.params; // user_id

    // Obtener el puntaje del usuario
    const userResult = await db.query(
      'SELECT puntaje FROM juego WHERE user_id = $1',
      [id]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userPuntaje = userResult.rows[0].puntaje;

    // Obtener el puntaje máximo entre todos
    const maxResult = await db.query(
      'SELECT MAX(puntaje) as max_puntaje FROM juego'
    );

    const maxPuntaje = maxResult.rows[0].max_puntaje;

    const isMax = userPuntaje === maxPuntaje;

    res.json({ isMax });
  } catch (error) {
    console.error('Error en checkIfMaxScore:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = {
  updatePuntaje,
  checkIfMaxScore
};



