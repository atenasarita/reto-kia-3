const db = require("../database/db");

// Buscar usuario por username o email
exports.findByUsernameOrEmail = async (username, email) => {
  const result = await db.query(
    `SELECT * FROM users_test WHERE username = $1 OR email = $2`,
    [username, email]
  );
  return result.rows[0];
};

// aprobar usuario
exports.createUser = async ({ username }) => {
  const result = await db.query(
    `CALL approve_user($1, TRUE)`,
    [username]
  );
  
  return result.rows[0];
};

// Buscar por username
exports.findByUsername = async (username) => {
  const result = await db.query(
    `SELECT * FROM users_test WHERE username = $1`,
    [username]
  );
  return result.rows[0];
};

// Buscar por email
exports.findByEmail = async (email) => {
  const result = await db.query(
    `SELECT * FROM users_test WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

// Guardar token de recuperación
exports.saveResetToken = async (userId, token, expiration) => {
  await db.query(
    `UPDATE users_test SET reset_token = $1, reset_token_expiration = $2 WHERE id = $3`,
    [token, expiration, userId]
  );
};

// Buscar usuario por token
exports.findByResetToken = async (token) => {
  const result = await db.query(
    `SELECT * FROM users_test WHERE reset_token = $1`,
    [token]
  );
  return result.rows[0];
};

// Actualizar contraseña
exports.updatePassword = async (userId, hashedPassword) => {
  await db.query(
    `UPDATE users_test SET password = $1 WHERE id = $2`,
    [hashedPassword, userId]
  );
};

// Limpiar token de recuperación
exports.clearResetToken = async (userId) => {
  await db.query(
    `UPDATE users_test SET reset_token = NULL, reset_token_expiration = NULL WHERE id = $1`,
    [userId]
  );
};

//////////////////////////////////////////////////
// USUARIOS PENDIENTES
//////////////////////////////////////////////////

// Crear usuario pendiente
exports.createPendingUser = async ({ name, firstSurname, secondSurname, username, email, password }) => {
  const result = await db.query(
    `INSERT INTO users_test (name, first_surname, second_surname, username, email, password)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, firstSurname, secondSurname, username, email, password]
  );
  return result.rows[0];
};

// Obtener todos los usuarios pendientes
exports.getAllPendingUsers = async () => {
  const result = await db.query(
    `SELECT * FROM users_test WHERE approved = 'false' ORDER BY created_at DESC`
  );
  return result.rows;
};

// Obtener usuario pendiente por ID
exports.getPendingUserById = async (id) => {
  const result = await db.query(
    `SELECT * FROM users_test WHERE approved = 'false' AND id = $1`,
    [id]
  );
  return result.rows[0];
};

// Eliminar usuario pendiente (por ID)
exports.deletePendingUser = async (id) => {
  await db.query(
    `DELETE FROM users_test WHERE id = $1`,
    [id]
  );
};

exports.getPendingUserByUsername = async (username) => {
  const result = await db.query("SELECT * FROM users_test WHERE approved = 'false' AND username = $1", [username]);
  return result.rows[0];
};

exports.getPendingUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users_test WHERE approved = 'false' AND email = $1`, [email]);
  return result.rows[0];
};