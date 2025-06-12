const db = require("../database/db");

exports.createPendingWasteRecord = async (data) => {
  try {
    const {
      entry_date, type, amount, container, area,
      art71, reason_art71, aut_semarnat, aut_sct,
      reason_destination, aut_destination, chemicals,
      responsible, user_id
    } = data;

    const amountSafe = (amount === '' || amount == null || isNaN(Number(amount))) ? null : Number(amount);

    const result = await db.query(`CALL create_waste_record_test($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [entry_date, type, amountSafe, container, area,
        art71, reason_art71, aut_semarnat, aut_sct,
        reason_destination, aut_destination, chemicals,
        responsible, user_id
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating pending waste record:", error);
    throw error;
  }
};

// Obtener todos los registros pendientes de un usuario
exports.getPendingWasteRecordsByUser = async (user_id) => {
  try {
    const result = await db.query(
      `SELECT * FROM waste_records_test WHERE is_confirmed = FALSE AND user_id = $1 ORDER BY creation DESC`,
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting pending waste records by user:", error);
    throw error;
  }
};

// Obtener un registro pendiente por id y user_id (para seguridad)
exports.getPendingWasteRecordById = async (id, user_id) => {
  try {
    const result = await db.query(
      `SELECT * FROM waste_records_test WHERE is_confirmed = FALSE AND id = $1 AND user_id = $2`,
      [id, user_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error getting pending waste record by id:", error);
    throw error;
  }
};

// Actualizar registro pendiente por id y mostrar por id (usado por Edit Registry)
exports.updatePendingWasteRecord = async (id, user_id, data) => {
  try {
    const {
      entry_date, type, amount, container, area,
      art71, reason_art71, aut_semarnat, aut_sct,
      reason_destination, aut_destination, chemicals,
      responsible
    } = data;

    const amountSafe = (amount === '' || amount == null || isNaN(Number(amount))) ? null : Number(amount);

    await db.query(
      `CALL update_waste_record_test(
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )`,
      [
        id, entry_date, type, amountSafe, container, area,
        art71, reason_art71, aut_semarnat, aut_sct,
        reason_destination, aut_destination, chemicals,
        responsible, user_id
      ]
    );

    return await exports.getPendingWasteRecordById(id, user_id);
  } catch (error) {
    console.error("Error updating pending waste record:", error);
    throw error;
  }
};

// Eliminar registro pendiente por id y user_id
exports.deletePendingWasteRecord = async (id, user_id) => {
  try {
    await db.query(
      `DELETE FROM waste_records_test WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );
  } catch (error) {
    console.error("Error deleting pending waste record:", error);
    throw error;
  }
};

// Confirmar registro: copiar de pendiente a confirmado y borrar pendiente
exports.confirmWasteRecord = async (id, user_id) => {
  try {
    await db.query(`CALL confirm_record_test($1, $2)`, [id, user_id]);
    return true;
  } catch (error) {
    console.error("Error confirming waste record:", error);
    throw error;
  }
};

exports.getHazardousWasteByReason = async (reason) => {
  try {
    const result = await db.query(`SELECT * FROM hazardous_waste_records WHERE reason_art71 = $1`, [reason]);
    return result.rows;
  } catch (error) {
    console.error("Error getting hazardous waste by reason:", error);
    throw error;
  }
};

exports.getAmountSumByReason = async (reason_art71) => {
  try {
    const result = await db.query(
      `SELECT SUM(amount) AS total, type FROM waste_records_test 
       WHERE reason_art71 ILIKE $1 AND is_selected = TRUE AND part_of_referral IS NULL
       GROUP BY type`,
      [`%${reason_art71}%`]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting amount sum by reason:", error);
    throw error;
  }
};

// Obtener residuos confirmados
exports.getWasteForReferral = async (reason) => {
  try {
    const result = await db.query(
      `SELECT * FROM waste_records_test WHERE part_of_referral IS NULL AND is_confirmed = TRUE AND reason_art71 = $1`,
      [reason]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting waste for referral:", error);
    throw error;
  }
};

// Marcar registro como seleccionado (usa updateSelected)
exports.markWasteAsSelected = async (id) => {
  try {
    return await exports.updateSelected(id, true);
  } catch (error) {
    console.error("Error marking waste as selected:", error);
    throw error;
  }
};

exports.clearSelected = async () => {
  try {
    await db.query(`UPDATE waste_records_test SET is_selected = false WHERE is_selected = true`);
  } catch (error) {
    console.error("Error clearing selected waste records:", error);
    throw error;
  }
};

exports.updateSelected = async (id, selected) => {
  try {
    await db.query(
      `UPDATE waste_records_test SET is_selected = $1 WHERE id = $2`,
      [selected, id]
    );
    return true;
  } catch (error) {
    console.error("Error updating selected waste record:", error);
    throw error;
  }
};

exports.getSelectedRecords = async () => {
  try {
    const result = await db.query(
      `SELECT * FROM waste_records_test WHERE is_selected = TRUE`
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting selected records:", error);
    throw error;
  }
};

// Obtener registros confirmados con filtro opcional por mes y año
exports.getConfirmedWasteRecords = async ({ month, year }) => {
  try {
    let query = `SELECT * FROM hazardous_waste_records`;
    const params = [];
    if (month && year) {
      query += ` WHERE EXTRACT(MONTH FROM entry_date) = $1 AND EXTRACT(YEAR FROM entry_date) = $2`;
      params.push(month, year);
    } else if (month) {
      query += ` WHERE EXTRACT(MONTH FROM entry_date) = $1`;
      params.push(month);
    } else if (year) {
      query += ` WHERE EXTRACT(YEAR FROM entry_date) = $1`;
      params.push(year);
    }
    query += ` ORDER BY creation DESC`;

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error getting confirmed waste records:", error);
    throw error;
  }
};

exports.getTotalConfirmedWasteAmount = async () => {
  try {
    const result = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_amount FROM hazardous_waste_records`
    );
    return result.rows[0].total_amount;
  } catch (error) {
    console.error("Error getting total confirmed waste amount:", error);
    throw error;
  }
};

exports.getConfirmedWasteAmountByType = async () => {
  try {
    const result = await db.query(
      `SELECT type, SUM(amount) AS total_amount
       FROM hazardous_waste_records
       GROUP BY type
       ORDER BY total_amount DESC`
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting confirmed waste amount by type:", error);
    throw error;
  }
};
