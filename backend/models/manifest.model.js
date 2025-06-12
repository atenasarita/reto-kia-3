const db = require("../database/db");

exports.getDistinctWasteTypes = async (referralId) => {
  const result = await db.query(`
    SELECT DISTINCT type AS tipo_residuo
    FROM waste_records_test
    WHERE part_of_referral = $1
  `, [referralId]);
  return result.rows;
};

exports.insertReferralManifest = async (referralId, tipoResiduos) => {
  const result = await db.query(`
    INSERT INTO referral_manifest (referral_id, tipo_residuo)
    VALUES ($1, $2) RETURNING id
  `, [referralId, tipoResiduos]);
  return result.rows[0].id;
};

exports.getGroupedContainers = async (referralId, tipoResiduos) => {
  const result = await db.query(`
    SELECT
      container AS contenedor_tipo,
      container_capacity AS contenedor_capacidad,
      COUNT(*) AS cantidad_contenedores,
      SUM(amount) * 1000 AS total_kg,
      type_description AS descripcion
    FROM waste_records_test
    WHERE part_of_referral = $1 AND type = $2
    GROUP BY container, container_capacity, type_description
  `, [referralId, tipoResiduos]);
  return result.rows;
};

exports.insertManifestContainer = async (manifestId, c) => {
  await db.query(`
    INSERT INTO referral_manifest_containers (
      manifest_id,
      contenedor_tipo,
      contenedor_capacidad,
      cantidad_contenedores,
      total_kg,
      descripcion
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `, [
    manifestId,
    c.contenedor_tipo,
    c.contenedor_capacidad,
    c.cantidad_contenedores,
    c.total_kg,
    c.descripcion
  ]);
};
