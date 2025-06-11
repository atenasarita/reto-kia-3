const db = require("../database/db");

exports.createReferral = async (data) => {
  const {
    fecha,
    nombre_chofer,
    hora_salida,
    compañia,
    destino,
    contenedor,
    placas,
    num_econ,
    firma
  } = data;

  const peso_neto = peso_bruto - tara;

  const result = await db.query(
    `INSERT INTO referrals (
      fecha,
      nombre_chofer,
      hora_salida,
      compañia,
      destino,
      tara,
      peso_bruto,
      peso_neto,
      contenedor,
      placas,
      num_econ,
      firma
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10, $11, $12) RETURNING *`,
    [fecha, nombre_chofer, hora_salida, compañia, destino, tara, peso_bruto, peso_neto, contenedor, placas, num_econ, firma]
  );

  await db.query(`UPDATE waste_records_test SET is_part_of_referral = TRUE WHERE is_selected = TRUE`);
  await db.query(`UPDATE waste_records_test SET exit_date = $1 WHERE is_selected = TRUE`, [fecha]);

 
  return result.rows[0];
};

exports.insertTipoReferral = async (referralId, tipo) => {
  await db.query(
    `INSERT INTO tipos_referral (id_referral, tipo) VALUES ($1, $2) 
     ON CONFLICT DO NOTHING`,  //  evita duplicados
    [referralId, tipo]
  );
};

exports.insertCantidadTipoReferral = async (referralId, tipo, cantidad) => {
  await db.query(
    `INSERT INTO cantidad_tipo_referral (id_referral, tipo, cantidad) VALUES ($1, $2, $3)`,
    [referralId, tipo, cantidad]
  );
};
