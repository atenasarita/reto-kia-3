const db = require("../database/db");

exports.createPendingWasteRecord = async (data) => {
  const {
    entry_date, type, amount, container, area,
    art71, reason_art71, aut_semarnat, aut_SCT,
    reason_destination, aut_destination, chemicals,
    responsible, user_id
  } = data;

  const amountSafe = amount === '' ? null : amount;

  const result = await db.query(`CALL create_waste_record_test($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [entry_date, type, amountSafe, container, area,
      art71, reason_art71, aut_semarnat, aut_SCT,
      reason_destination, aut_destination, chemicals,
      responsible, user_id
    ]
  );

  return result.rows[0];
};

// Obtener todos los registros pendientes de un usuario
exports.getPendingWasteRecordsByUser = async (user_id) => {
  const result = await db.query(
    `SELECT * FROM waste_records_test WHERE is_confirmed = FALSE AND user_id = $1 ORDER BY creation DESC`,
    [user_id]
  );
  return result.rows;
};

// Obtener un registro pendiente por id y user_id (para seguridad)
exports.getPendingWasteRecordById = async (id, user_id) => {
  const result = await db.query(
    `SELECT * FROM waste_records_test WHERE is_confirmed = FALSE AND id = $1 AND user_id = $2`,
    [id, user_id]
  );

  const record = result.rows[0];

  return record;
};

// Actualizar registro pendiente por id y mostrar por id USADO POR EDIT REGISTRY
exports.updatePendingWasteRecord = async (id, user_id, data) => {
  const {
    entry_date, type, amount, container, area,
    art71, reason_art71, aut_semarnat, aut_SCT,
    reason_destination, aut_destination, chemicals,
    responsible
  } = data;

  const amountSafe = amount === '' ? null : amount;
  
  await db.query(
    `CALL update_waste_record_test(
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )`,
    [
      id, entry_date, type, amountSafe, container, area,
      art71, reason_art71, aut_semarnat, aut_SCT,
      reason_destination, aut_destination, chemicals,
      responsible, user_id
    ]
  );

  return await exports.getPendingWasteRecordById(id, user_id);
};

// Eliminar registro pendiente por id y user_id
exports.deletePendingWasteRecord = async (id, user_id) => {
  await db.query(
    `DELETE FROM waste_records_test WHERE id = $1 AND user_id = $2`,
    [id, user_id]
  );
};

// Confirmar registro: copiar de pendiente a confirmado y borrar pendiente
exports.confirmWasteRecord = async (id, user_id) => {
  await db.query(`CALL confirm_record_test($1, $2)`, [id, user_id]);
  return true; 
};

exports.getHazardousWasteByReason = async (reason) => {
  const result = await db.query(`SELECT * FROM hazardous_waste_records WHERE reason_art71 = $1`, [reason])
  return result.rows;
};

exports.getAmountSumByReason = async (reason_art71) => {
  const result = await db.query(`select SUM(amount) AS total, type from waste_records_test where reason_art71 ILIKE $1 AND is_selected = true AND is_part_of_referral = FALSE
   GROUP BY type`,
  [`%${reason_art71}%`]
  );

  return result.rows;
};

// Obtener residuos confirmados
exports.getWasteForReferral = async (reason) => {
  const result = await db.query(
    `SELECT * FROM waste_records_test WHERE is_part_of_referral = FALSE AND is_confirmed = TRUE AND reason_art71 = $1`,
    [reason]
  );
  return result.rows;
};

// Marcar registro como seleccionado
exports.markWasteAsSelected = async (id) => {
  const result = await db.query(
    `UPDATE waste_records_test SET is_selected = TRUE WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rowCount > 0; // true si se actualizó algo
};

// Model
exports.clearSelected = async () => {
  await db.query(`UPDATE waste_records_test SET is_selected = false WHERE is_selected = true`);
};

exports.updateSelected = async (id, selected) => {
  await db.query(
    `UPDATE waste_records_test SET is_selected = $1 WHERE id = $2`,
    [selected, id]
  );
};

exports.getSelectedRecords = async () => {
  const result = await db.query(
    `SELECT * FROM waste_records_test WHERE is_selected = TRUE`,
  );
  return result.rows;
};







// Obtener registros confirmados con filtro opcional por mes y año
exports.getConfirmedWasteRecords = async ({ month, year }) => {
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
};

exports.getTotalConfirmedWasteAmount = async () => {
  const result = await db.query(
    `SELECT COALESCE(SUM(amount), 0) AS total_amount FROM hazardous_waste_records`
  );
  return result.rows[0].total_amount;
};

exports.getConfirmedWasteAmountByType = async () => {
  const result = await db.query(
    `SELECT type, SUM(amount) AS total_amount
     FROM hazardous_waste_records
     GROUP BY type
     ORDER BY total_amount DESC`
  );
  return result.rows;
};