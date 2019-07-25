const db = require('../db.js');
const bcrypt = require('bcrypt');

module.exports = {
  async create ({ name, email, password }) {
    const passwordHash = await hashPassword(password);

    await db.query(`
      INSERT INTO "user" (name, email, password)
      VALUES ($name, $email, $passwordHash)`, {
      name,
      email,
      passwordHash,
    });
  },

  async get (id) {
    const result = await db.query(`
      SELECT name FROM "user" WHERE id = $id`, {
      id,
    });

    return result.rows[0];
  },

  async login ({ email, password }) {
    const result = await db.query(`
      SELECT id, password FROM "user" WHERE email = $email`, {
      email,
    });

    if (result.rowCount !== 1) {
      return null;
    }
    const row = result.rows[0];
    const hash = row.password;

    if (await comparePassword(password, hash)) {
      return row.id;
    }
    return null;
  },
};

function hashPassword (password) {
  return bcrypt.hash(password, 10);
}

function comparePassword (password, hash) {
  return bcrypt.compare(password, hash);
}
