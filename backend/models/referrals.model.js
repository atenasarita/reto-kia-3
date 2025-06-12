const db = require("../database/db");

exports.createReferral = async (data) => {
  const {
    fecha,
    nombre_chofer,
    hora_salida,
    compañia,
    destino,
    tara,
    peso_bruto,
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

  await db.query(`UPDATE waste_records_test SET part_of_referral = $1 WHERE is_selected = TRUE`, [result.rows[0].id]);
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

exports.generateManifestData = async (referralId) => {
  // Primero obtenemos la lista de tipos de residuo
  const tiposResiduos = await db.query(
    `SELECT DISTINCT type AS tipo_residuo
     FROM waste_records_test
     WHERE part_of_referral = $1`,
    [referralId]
  );

  for (const tipo of tiposResiduos.rows) {
    // Insertamos una entrada base por tipo de residuo
    const manifestResult = await db.query(
      `INSERT INTO referral_manifest (referral_id, tipo_residuo)
       VALUES ($1, $2) RETURNING id`,
      [referralId, tipo.tipo_residuo]
    );
    const manifestId = manifestResult.rows[0].id;

    // Para ese tipo de residuo, obtenemos los datos por contenedor
    const containerData = await db.query(
      `SELECT
         container AS contenedor,
         COUNT(*) AS registro_count,
         SUM(amount) * 1000 AS total_kg,
         ARRAY_AGG(DISTINCT unnest(chemicals)) AS chemicals
       FROM waste_records_test
       WHERE part_of_referral = $1 AND type = $2
       GROUP BY container`,
      [referralId, tipo.tipo_residuo]
    );

    // Insertamos cada contenedor asociado
    for (const container of containerData.rows) {
      await db.query(
        `INSERT INTO referral_manifest_containers (
          manifest_id, contenedor, total_kg, registro_count, chemicals
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          manifestId,
          container.contenedor,
          container.total_kg,
          container.registro_count,
          container.chemicals,
        ]
      );
    }
  }
};
