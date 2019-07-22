const db = require('../db.js');
const bcrypt = require('bcrypt');

module.exports = {
  async create ({ name, email, password }) {
    const passwordHash = await hashPassword(password);

    await db.query(`
      INSERT INTO "user" ("name", "email", "password")
      VALUES ($name, $email, $passwordHash)`, {
      name,
      email,
      passwordHash,
    });
  },
  async login ({ email, password }) {
    const result = await db.query(`
      SELECT "password" FROM "user" WHERE "email" = $email`, {
      email,
    });

    if (result.rowCount !== 1) {
      return false;
    }

    const hash = result.rows[0].password;

    return comparePassword(password, hash);
  },
};

function hashPassword (password) {
  return bcrypt.hash(password, 10);
}

function comparePassword (password, hash) {
  return bcrypt.compare(password, hash);
}
